#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, statSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { findProjectRoot, writeDocsIndex } from "./build-docs-index.mjs";
import { writeTracksIndex } from "./build-track-index.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function detectProjectRoot() {
  const scriptBasedRoot = findProjectRoot(path.resolve(__dirname, "../.."));
  if (existsSync(path.join(scriptBasedRoot, ".waypoint", "config.toml"))) {
    return scriptBasedRoot;
  }
  return findProjectRoot(process.cwd());
}

function ensureDir(dirPath) {
  mkdirSync(dirPath, { recursive: true });
}

function runCommand(command, cwd) {
  try {
    return {
      ok: true,
      stdout: execFileSync(command[0], command.slice(1), {
        cwd,
        stdio: ["ignore", "pipe", "pipe"],
        encoding: "utf8",
      }).trim(),
      stderr: "",
    };
  } catch (error) {
    return {
      ok: false,
      stdout: typeof error?.stdout === "string" ? error.stdout.trim() : "",
      stderr:
        typeof error?.stderr === "string" && error.stderr.trim().length > 0
          ? error.stderr.trim()
          : error instanceof Error
            ? error.message
            : "Unknown command failure",
    };
  }
}

function safeExec(command, cwd) {
  const result = runCommand(command, cwd);
  return result.ok ? result.stdout : "";
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function currentAuthorFilter(projectRoot) {
  const email = runCommand(["git", "config", "user.email"], projectRoot);
  if (email.ok && email.stdout) {
    return {
      label: email.stdout,
      pattern: escapeRegex(email.stdout),
    };
  }

  const name = runCommand(["git", "config", "user.name"], projectRoot);
  if (name.ok && name.stdout) {
    return {
      label: name.stdout,
      pattern: `^${escapeRegex(name.stdout)}\\s<`,
    };
  }

  return null;
}

function githubPullRequestContext(projectRoot) {
  const repo = runCommand(["gh", "repo", "view", "--json", "nameWithOwner", "--jq", ".nameWithOwner"], projectRoot);
  if (!repo.ok || !repo.stdout) {
    return {
      ok: false,
      error: repo.stderr || "Could not resolve GitHub repository from this checkout.",
    };
  }

  const viewer = runCommand(["gh", "api", "user", "--jq", ".login"], projectRoot);
  if (!viewer.ok || !viewer.stdout) {
    return {
      ok: false,
      error: viewer.stderr || "Could not resolve active GitHub user.",
    };
  }

  return {
    ok: true,
    repo: repo.stdout,
    viewer: viewer.stdout,
  };
}

function renderCommandBlock(result, emptyMessage) {
  if (!result.ok) {
    return `Command failed: ${result.stderr}`;
  }
  return result.stdout || emptyMessage;
}

function renderPullRequestBlock(result, emptyMessage) {
  if (!result.ok) {
    return `Command failed: ${result.error || result.stderr}`;
  }
  return result.stdout || emptyMessage;
}

const SESSION_DIR_NAMES = ["sessions", "archived_sessions"];
const SECRET_PATTERNS = [
  /npm_[A-Za-z0-9]+/g,
  /github_pat_[A-Za-z0-9_]+/g,
  /gh[pousr]_[A-Za-z0-9]+/g,
  /sk-[A-Za-z0-9]+/g,
  /sk_[A-Za-z0-9]+/g,
  /fc-[A-Za-z0-9]+/g,
  /AIza[0-9A-Za-z\-_]{20,}/g,
];
const MAX_RECENT_TURNS = 25;

function codexHome() {
  return process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
}

function redactSecrets(text) {
  return SECRET_PATTERNS.reduce((current, pattern) => current.replace(pattern, "[REDACTED]"), text);
}

function safeRealpath(targetPath) {
  try {
    return realpathSync(targetPath);
  } catch {
    return null;
  }
}

function isWithinPath(childPath, parentPath) {
  const resolvedParent = safeRealpath(parentPath);
  const resolvedChild = safeRealpath(childPath);
  if (!resolvedParent || !resolvedChild) {
    return false;
  }
  const rel = path.relative(resolvedParent, resolvedChild);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}

function collectSessionFiles(rootDir) {
  const files = [];

  function walk(currentDir) {
    if (!existsSync(currentDir)) {
      return;
    }
    for (const entry of readdirSync(currentDir)) {
      const fullPath = path.join(currentDir, entry);
      let stats;
      try {
        stats = statSync(fullPath);
      } catch {
        continue;
      }
      if (stats.isDirectory()) {
        walk(fullPath);
      } else if (entry.endsWith(".jsonl")) {
        files.push(fullPath);
      }
    }
  }

  walk(rootDir);
  return files;
}

function extractMessageText(content) {
  if (!Array.isArray(content)) {
    return "";
  }
  return content
    .filter((block) => block?.type === "input_text" || block?.type === "output_text")
    .map((block) => (typeof block?.text === "string" ? block.text : ""))
    .join("")
    .trim();
}

function isBootstrapNoise(role, text) {
  return role === "user" && text.startsWith("# AGENTS.md instructions for ");
}

function mergeConsecutiveTurns(turns) {
  const merged = [];
  for (const turn of turns) {
    const previous = merged.at(-1);
    if (previous && previous.role === turn.role) {
      if (previous.text !== turn.text) {
        previous.text = `${previous.text}\n\n${turn.text}`;
      }
      previous.timestamp = turn.timestamp || previous.timestamp;
      previous.messageCount += 1;
      continue;
    }
    merged.push({ ...turn });
  }
  return merged;
}

function parseSession(sessionFile, projectRoot) {
  let sessionId = null;
  let sessionCwd = null;
  let sessionStartedAt = null;
  let compactionCount = 0;
  const rawTurns = [];
  const compactionBoundaries = [];

  for (const line of readFileSync(sessionFile, "utf8").split("\n")) {
    if (!line.trim()) {
      continue;
    }

    let parsed;
    try {
      parsed = JSON.parse(line);
    } catch {
      continue;
    }

    if (parsed.type === "session_meta") {
      const sessionMetaId = parsed.payload?.id;
      if (typeof sessionMetaId === "string") {
        sessionId = sessionMetaId;
      }
      const cwd = parsed.payload?.cwd;
      if (typeof cwd === "string") {
        sessionCwd = cwd;
      }
      const timestamp = parsed.payload?.timestamp;
      if (typeof timestamp === "string") {
        sessionStartedAt = timestamp;
      }
      continue;
    }

    if (parsed.type === "compacted") {
      compactionCount += 1;
      compactionBoundaries.push(rawTurns.length);
      continue;
    }

    if (parsed.type !== "response_item" || parsed.payload?.type !== "message") {
      continue;
    }

    const role = parsed.payload?.role;
    if (role !== "user" && role !== "assistant") {
      continue;
    }

    const text = redactSecrets(extractMessageText(parsed.payload?.content));
    if (!text || isBootstrapNoise(role, text)) {
      continue;
    }

    rawTurns.push({
      role,
      text,
      timestamp: parsed.timestamp || null,
      messageCount: 1,
    });
  }

  if (!sessionCwd || !isWithinPath(sessionCwd, projectRoot)) {
    return null;
  }

  const selectedFromPreCompaction = compactionBoundaries.length > 0;
  const relevantTurns = selectedFromPreCompaction ? rawTurns.slice(0, compactionBoundaries.at(-1)) : rawTurns;
  const turns = mergeConsecutiveTurns(relevantTurns);
  if (turns.length === 0) {
    return null;
  }

  return {
    path: sessionFile,
    sessionId,
    sessionCwd,
    turns,
    compactionCount,
    selectedFromPreCompaction,
    sessionStartedAt,
  };
}

function latestMatchingSession(projectRoot, threadIdOverride = null) {
  const matches = [];
  for (const dirName of SESSION_DIR_NAMES) {
    for (const sessionFile of collectSessionFiles(path.join(codexHome(), dirName))) {
      const parsed = parseSession(sessionFile, projectRoot);
      if (parsed) {
        matches.push(parsed);
      }
    }
  }

  const requestedThreadId = threadIdOverride || process.env.CODEX_THREAD_ID || null;
  if (requestedThreadId) {
    const exact = matches.find((item) => item.sessionId === requestedThreadId);
    if (exact) {
      return exact;
    }
  }

  matches.sort((a, b) => {
    const left = a.sessionStartedAt || "";
    const right = b.sessionStartedAt || "";
    if (left === right) {
      return b.path.localeCompare(a.path);
    }
    return right.localeCompare(left);
  });
  return matches[0] || null;
}

function writeRecentThread(contextDir, projectRoot, threadIdOverride = null) {
  const filePath = path.join(contextDir, "RECENT_THREAD.md");
  const snapshot = latestMatchingSession(projectRoot, threadIdOverride);
  const generatedAt = new Date().toString();

  if (!snapshot) {
    writeFileSync(
      filePath,
      [
        "# Recent Thread",
        "",
        `Generated by \`${path.relative(projectRoot, fileURLToPath(import.meta.url))}\` on ${generatedAt}.`,
        "",
        "No matching local Codex session was found for this repo yet.",
        "",
      ].join("\n"),
      "utf8"
    );
    return filePath;
  }

  if (!snapshot.selectedFromPreCompaction) {
    writeFileSync(
      filePath,
      [
        "# Recent Thread",
        "",
        `Generated by \`${path.relative(projectRoot, fileURLToPath(import.meta.url))}\` on ${generatedAt}.`,
        "",
        `- Source session: \`${path.relative(codexHome(), snapshot.path)}\``,
        `- Session cwd: \`${snapshot.sessionCwd}\``,
        `- Compactions in source session: ${snapshot.compactionCount}`,
        "- No compaction was found in the latest matching local Codex session, so there is nothing to restore into startup context yet.",
        "",
      ].join("\n"),
      "utf8"
    );
    return filePath;
  }

  const selectedTurns = snapshot.turns.slice(-MAX_RECENT_TURNS);
  const relSessionPath = path.relative(codexHome(), snapshot.path);
  const lines = [
    "# Recent Thread",
    "",
    `Generated by \`${path.relative(projectRoot, fileURLToPath(import.meta.url))}\` on ${generatedAt}.`,
    "",
    `- Source session: \`${relSessionPath}\``,
    `- Session cwd: \`${snapshot.sessionCwd}\``,
    `- Included turns: ${selectedTurns.length} of ${snapshot.turns.length} meaningful turns`,
    `- Compactions in source session: ${snapshot.compactionCount}`,
    snapshot.selectedFromPreCompaction
      ? "- Selection rule: take the 25 meaningful turns immediately before the last compaction."
      : "- Selection rule: no compaction found, so take the latest meaningful turns from the local transcript.",
    "- Noise filter: bootstrap AGENTS payloads are excluded.",
    "- Secret handling: obvious token formats are redacted before writing this file.",
    "",
  ];

  selectedTurns.forEach((turn, index) => {
    const mergedSuffix = turn.messageCount > 1 ? ` (merged ${turn.messageCount} messages)` : "";
    const timestamp = turn.timestamp ? ` - ${turn.timestamp}` : "";
    lines.push(`## ${index + 1}. ${turn.role[0].toUpperCase()}${turn.role.slice(1)}${mergedSuffix}${timestamp}`);
    lines.push("");
    lines.push(turn.text);
    lines.push("");
  });

  writeFileSync(filePath, `${lines.join("\n").trimEnd()}\n`, "utf8");
  return filePath;
}

function collectNestedGitRepos(projectRoot) {
  const repos = [];

  function walk(currentDir) {
    for (const entry of readdirSync(currentDir)) {
      const fullPath = path.join(currentDir, entry);
      let stats;
      try {
        stats = statSync(fullPath);
      } catch {
        continue;
      }
      if (!stats.isDirectory()) {
        continue;
      }
      if (entry === ".git") {
        repos.push(path.dirname(fullPath));
        continue;
      }
      if (["node_modules", ".next", "dist", "build", "__pycache__", ".waypoint"].includes(entry)) {
        continue;
      }
      walk(fullPath);
    }
  }

  walk(projectRoot);
  return repos.filter((repoPath) => path.resolve(repoPath) !== path.resolve(projectRoot));
}

function writeContextFile(contextDir, name, title, body) {
  const filePath = path.join(contextDir, name);
  const content = `# ${title}\n\n${body && body.trim().length > 0 ? body.trim() : "None."}\n`;
  writeFileSync(filePath, content, "utf8");
  return filePath;
}

function writeActiveTrackers(contextDir, projectRoot, activeTracks) {
  return writeContextFile(
    contextDir,
    "ACTIVE_TRACKERS.md",
    "Active Trackers",
    activeTracks.length === 0
      ? "No active tracker files found."
      : [
          "These trackers should be read when resuming long-running work:",
          "",
          ...activeTracks.map((trackPath) => `- \`${trackPath}\``),
        ].join("\n"),
  );
}

function main() {
  const projectRoot = detectProjectRoot();
  const contextDir = path.join(projectRoot, ".waypoint", "context");
  ensureDir(contextDir);
  const threadIdFlagIndex = process.argv.indexOf("--thread-id");
  const threadIdOverride =
    threadIdFlagIndex >= 0 && threadIdFlagIndex + 1 < process.argv.length
      ? process.argv[threadIdFlagIndex + 1]
      : null;

  const docsIndexPath = writeDocsIndex(projectRoot);
  const { outputPath: tracksIndexPath, activeTracks } = writeTracksIndex(projectRoot);

  const currentDatetimePath = writeContextFile(
    contextDir,
    "CURRENT_DATETIME.md",
    "Current Datetime",
    `Local timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}\n\nCurrent local datetime: ${new Date().toString()}`
  );

  const uncommittedChangesPath = writeContextFile(
    contextDir,
    "UNCOMMITTED_CHANGES.md",
    "Uncommitted Changes",
    (() => {
      const status = runCommand(["git", "status", "--short", "--branch"], projectRoot);
      const unstaged = runCommand(["git", "diff", "--stat"], projectRoot);
      const staged = runCommand(["git", "diff", "--stat", "--cached"], projectRoot);
      return [
        "## Status",
        "",
        "```",
        renderCommandBlock(status, "No uncommitted changes."),
        "```",
        "",
        "## Diff Stat",
        "",
        "```",
        renderCommandBlock(unstaged, "No unstaged tracked diff."),
        "```",
        "",
        "## Staged Diff Stat",
        "",
        "```",
        renderCommandBlock(staged, "No staged diff."),
        "```",
      ].join("\n");
    })()
  );

  const authorFilter = currentAuthorFilter(projectRoot);
  const recentCommitsResult = authorFilter
    ? runCommand(["git", "log", `--author=${authorFilter.pattern}`, "--format=%h%d %s (%cr)", "-20", "--all"], projectRoot)
    : {
        ok: false,
        stdout: "",
        stderr: "Could not determine current git author from local git config.",
      };
  const recentCommitsPath = writeContextFile(
    contextDir,
    "RECENT_COMMITS.md",
    "Recent Commits",
    [
      authorFilter ? `Author filter: ${authorFilter.label}` : "Author filter: unavailable",
      "",
      "```",
      renderCommandBlock(recentCommitsResult, "No recent commits found for the current author."),
      "```",
    ].join("\n")
  );

  const nestedRepos = collectNestedGitRepos(projectRoot);
  const nestedRepoSections = nestedRepos.map((repoPath) => {
    const rel = path.relative(projectRoot, repoPath) || ".";
    const branch = safeExec(["git", "branch", "--show-current"], repoPath) || "unknown";
    const commits = safeExec(["git", "log", "--format=%h %s (%cr)", "-10"], repoPath) || "No recent commits found.";
    return `## ${rel}\n\nBranch: ${branch}\n\n\`\`\`\n${commits}\n\`\`\``;
  });
  const nestedReposPath = writeContextFile(
    contextDir,
    "NESTED_REPOS.md",
    "Nested Repositories",
    nestedRepoSections.join("\n\n") || "No nested repositories found."
  );

  const prContext = githubPullRequestContext(projectRoot);
  const openPrs =
    prContext.ok
      ? runCommand(
          [
            "gh",
            "pr",
            "list",
            "--repo",
            prContext.repo,
            "--state",
            "open",
            "--author",
            prContext.viewer,
            "--limit",
            "5",
            "--json",
            "number,title,author,headRefName",
            "--template",
            "{{range .}}#{{.number}} {{.title}} ({{.author.login}}) [{{.headRefName}}]\n{{end}}",
          ],
          projectRoot
        )
      : prContext;
  const mergedPrs =
    prContext.ok
      ? runCommand(
          [
            "gh",
            "pr",
            "list",
            "--repo",
            prContext.repo,
            "--state",
            "merged",
            "--author",
            prContext.viewer,
            "--limit",
            "5",
            "--json",
            "number,title,author,mergedAt",
            "--template",
            "{{range .}}#{{.number}} {{.title}} ({{.author.login}}) merged {{timeago .mergedAt}}\n{{end}}",
          ],
          projectRoot
        )
      : prContext;
  const prsPath = writeContextFile(
    contextDir,
    "PULL_REQUESTS.md",
    "Pull Requests",
    [
      prContext.ok ? `GitHub viewer: ${prContext.viewer}` : `GitHub context: ${prContext.error}`,
      prContext.ok ? `GitHub repo: ${prContext.repo}` : "",
      "",
      "## Open PRs",
      "",
      "```",
      renderPullRequestBlock(openPrs, "No open PRs found for the current GitHub user."),
      "```",
      "",
      "## Recently Merged PRs",
      "",
      "```",
      renderPullRequestBlock(mergedPrs, "No recently merged PRs found for the current GitHub user."),
      "```",
    ].join("\n")
  );
  const recentThreadPath = writeRecentThread(contextDir, projectRoot, threadIdOverride);
  const activeTrackersPath = writeActiveTrackers(contextDir, projectRoot, activeTracks);

  const manifestPath = path.join(contextDir, "MANIFEST.md");
  const manifestLines = [
    "# Waypoint Context Manifest",
    "",
    "Read every file listed below. This manifest is a required session-start context bundle.",
    "",
    "## Required generated files",
    "",
    `- \`${path.relative(projectRoot, currentDatetimePath)}\` — local datetime and timezone`,
    `- \`${path.relative(projectRoot, uncommittedChangesPath)}\` — uncommitted change summary`,
    `- \`${path.relative(projectRoot, recentCommitsPath)}\` — recent commits`,
    `- \`${path.relative(projectRoot, nestedReposPath)}\` — recent commits in nested repositories`,
    `- \`${path.relative(projectRoot, prsPath)}\` — open and recently merged pull requests`,
    `- \`${path.relative(projectRoot, recentThreadPath)}\` — latest meaningful turns from the local Codex session for this repo`,
    `- \`${path.relative(projectRoot, docsIndexPath)}\` — current docs index`,
    `- \`${path.relative(projectRoot, tracksIndexPath)}\` — current tracker index`,
    `- \`${path.relative(projectRoot, activeTrackersPath)}\` — active tracker summary`,
    "",
    "## Stable source-of-truth files to read before this manifest",
    "",
    "- `.waypoint/SOUL.md`",
    "- `.waypoint/agent-operating-manual.md`",
    "- `.waypoint/WORKSPACE.md`",
    "",
    "## Active tracker files to read after this manifest",
    "",
    ...(activeTracks.length > 0 ? activeTracks.map((trackPath) => `- \`${trackPath}\``) : ["- None."]),
    "",
    `Generated by: \`${path.relative(projectRoot, fileURLToPath(import.meta.url))}\``,
    "",
  ];
  writeFileSync(manifestPath, `${manifestLines.join("\n")}`, "utf8");

  console.log(`Prepared Waypoint context in ${contextDir}`);
}

main();
