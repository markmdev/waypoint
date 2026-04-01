#!/usr/bin/env node

import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, statSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { findProjectRoot, writeDocsIndex } from "./build-docs-index.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CODEX_SESSION_DIR_NAMES = ["sessions", "archived_sessions"];
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

function codexHome() {
  return process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
}

function piAgentHome() {
  return process.env.PI_AGENT_HOME || path.join(os.homedir(), ".pi", "agent");
}

function loadCodingAgent(projectRoot) {
  const configPath = path.join(projectRoot, ".waypoint", "config.toml");
  if (!existsSync(configPath)) {
    return "codex";
  }

  const configText = readFileSync(configPath, "utf8");
  const match = configText.match(/^\s*coding_agent\s*=\s*"(codex|pi)"\s*$/m);
  return match?.[1] || "codex";
}

function codingAgentLabel(codingAgent) {
  return codingAgent === "pi" ? "Pi" : "Codex";
}

function codingAgentHome(codingAgent) {
  return codingAgent === "pi" ? piAgentHome() : codexHome();
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
  const visitedDirs = new Set();

  function walk(currentDir) {
    if (!existsSync(currentDir)) {
      return;
    }
    const resolvedCurrentDir = safeRealpath(currentDir);
    if (!resolvedCurrentDir || visitedDirs.has(resolvedCurrentDir)) {
      return;
    }
    visitedDirs.add(resolvedCurrentDir);

    for (const entry of readdirSync(currentDir)) {
      const fullPath = path.join(currentDir, entry);
      let stats;
      try {
        stats = lstatSync(fullPath);
      } catch {
        continue;
      }
      if (stats.isSymbolicLink()) {
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

function extractCodexMessageText(content) {
  if (!Array.isArray(content)) {
    return "";
  }
  return content
    .filter((block) => block?.type === "input_text" || block?.type === "output_text")
    .map((block) => (typeof block?.text === "string" ? block.text : ""))
    .join("")
    .trim();
}

function extractPiMessageText(content) {
  if (!Array.isArray(content)) {
    return "";
  }
  return content
    .filter((block) => block?.type === "text")
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

function finalizeParsedSession(sessionFile, projectRoot, sessionId, sessionCwd, sessionStartedAt, rawTurns, compactionBoundaries) {
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
    compactionCount: compactionBoundaries.length,
    selectedFromPreCompaction,
    sessionStartedAt,
  };
}

function parseCodexSession(sessionFile, projectRoot) {
  let sessionId = null;
  let sessionCwd = null;
  let sessionStartedAt = null;
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

    const text = redactSecrets(extractCodexMessageText(parsed.payload?.content));
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

  return finalizeParsedSession(sessionFile, projectRoot, sessionId, sessionCwd, sessionStartedAt, rawTurns, compactionBoundaries);
}

function parsePiSession(sessionFile, projectRoot) {
  let sessionId = null;
  let sessionCwd = null;
  let sessionStartedAt = null;
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

    if (parsed.type === "session") {
      if (typeof parsed.id === "string") {
        sessionId = parsed.id;
      }
      if (typeof parsed.cwd === "string") {
        sessionCwd = parsed.cwd;
      }
      if (typeof parsed.timestamp === "string") {
        sessionStartedAt = parsed.timestamp;
      }
      continue;
    }

    if (parsed.type === "compaction") {
      compactionBoundaries.push(rawTurns.length);
      continue;
    }

    if (parsed.type !== "message") {
      continue;
    }

    const role = parsed.message?.role;
    if (role !== "user" && role !== "assistant") {
      continue;
    }

    const text = redactSecrets(extractPiMessageText(parsed.message?.content));
    if (!text || isBootstrapNoise(role, text)) {
      continue;
    }

    rawTurns.push({
      role,
      text,
      timestamp: parsed.timestamp || parsed.message?.timestamp || null,
      messageCount: 1,
    });
  }

  return finalizeParsedSession(sessionFile, projectRoot, sessionId, sessionCwd, sessionStartedAt, rawTurns, compactionBoundaries);
}

function latestMatchingSession(projectRoot, codingAgent, threadIdOverride = null) {
  const matches = [];

  if (codingAgent === "pi") {
    for (const sessionFile of collectSessionFiles(path.join(piAgentHome(), "sessions"))) {
      const parsed = parsePiSession(sessionFile, projectRoot);
      if (parsed) {
        matches.push(parsed);
      }
    }
  } else {
    for (const dirName of CODEX_SESSION_DIR_NAMES) {
      for (const sessionFile of collectSessionFiles(path.join(codexHome(), dirName))) {
        const parsed = parseCodexSession(sessionFile, projectRoot);
        if (parsed) {
          matches.push(parsed);
        }
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
  const codingAgent = loadCodingAgent(projectRoot);
  const agentLabel = codingAgentLabel(codingAgent);
  const agentHome = codingAgentHome(codingAgent);
  const snapshot = latestMatchingSession(projectRoot, codingAgent, threadIdOverride);
  const generatedAt = new Date().toString();

  if (!snapshot) {
    writeFileSync(
      filePath,
      [
        "# Recent Thread",
        "",
        `Generated by \`${path.relative(projectRoot, fileURLToPath(import.meta.url))}\` on ${generatedAt}.`,
        "",
        `No matching local ${agentLabel} session was found for this repo yet.`,
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
        `- Source session: \`${path.relative(agentHome, snapshot.path)}\``,
        `- Session cwd: \`${snapshot.sessionCwd}\``,
        `- Compactions in source session: ${snapshot.compactionCount}`,
        `- No compaction was found in the latest matching local ${agentLabel} session, so there is nothing to restore into startup context yet.`,
        "",
      ].join("\n"),
      "utf8"
    );
    return filePath;
  }

  const selectedTurns = snapshot.turns.slice(-MAX_RECENT_TURNS);
  const relSessionPath = path.relative(agentHome, snapshot.path);
  const lines = [
    "# Recent Thread",
    "",
    `Generated by \`${path.relative(projectRoot, fileURLToPath(import.meta.url))}\` on ${generatedAt}.`,
    "",
    `- Source session: \`${relSessionPath}\``,
    `- Session cwd: \`${snapshot.sessionCwd}\``,
    `- Included turns: ${selectedTurns.length} of ${snapshot.turns.length} meaningful turns`,
    `- Compactions in source session: ${snapshot.compactionCount}`,
    "- Selection rule: take the 25 meaningful turns immediately before the last compaction.",
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

function writeSnapshot(contextDir, projectRoot) {
  const filePath = path.join(contextDir, "SNAPSHOT.md");
  const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentLocalDatetime = new Date().toString();

  const status = runCommand(["git", "status", "--short", "--branch"], projectRoot);
  const unstaged = runCommand(["git", "diff", "--stat"], projectRoot);
  const staged = runCommand(["git", "diff", "--stat", "--cached"], projectRoot);

  const authorFilter = currentAuthorFilter(projectRoot);
  const recentCommitsResult = authorFilter
    ? runCommand(["git", "log", `--author=${authorFilter.pattern}`, "--format=%h%d %s (%cr)", "-20", "--all"], projectRoot)
    : {
        ok: false,
        stdout: "",
        stderr: "Could not determine current git author from local git config.",
      };

  const prContext = githubPullRequestContext(projectRoot);
  const openPrs = prContext.ok
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
  const mergedPrs = prContext.ok
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

  writeFileSync(
    filePath,
    [
      "# Snapshot",
      "",
      "Generated volatile context for the current repo state.",
      "",
      "## Context Snapshot",
      "",
      `- Local timezone: ${currentTimezone}`,
      `- Current local datetime: ${currentLocalDatetime}`,
      "",
      "## Git Status",
      "",
      "```",
      renderCommandBlock(status, "No uncommitted changes."),
      "```",
      "",
      "## Unstaged Diff Stat",
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
      "",
      "## Recent Commits",
      "",
      authorFilter ? `Author filter: ${authorFilter.label}` : "Author filter: unavailable",
      "",
      "```",
      renderCommandBlock(recentCommitsResult, "No recent commits found for the current author."),
      "```",
      "",
      "## Pull Requests",
      "",
      prContext.ok ? `GitHub viewer: ${prContext.viewer}` : `GitHub context: ${prContext.error}`,
      prContext.ok ? `GitHub repo: ${prContext.repo}` : "",
      "",
      "### Open PRs",
      "",
      "```",
      renderPullRequestBlock(openPrs, "No open PRs found for the current GitHub user."),
      "```",
      "",
      "### Recently Merged PRs",
      "",
      "```",
      renderPullRequestBlock(mergedPrs, "No recently merged PRs found for the current GitHub user."),
      "```",
      "",
    ].join("\n"),
    "utf8"
  );

  return filePath;
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

  writeDocsIndex(projectRoot);
  writeSnapshot(contextDir, projectRoot);
  writeRecentThread(contextDir, projectRoot, threadIdOverride);

  console.log(`Prepared Waypoint context in ${contextDir}`);
}

main();
