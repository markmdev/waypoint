#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, statSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { findProjectRoot, writeDocsIndex } from "./build-docs-index.mjs";

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

function safeExec(command, cwd) {
  try {
    return execSync(command, {
      cwd,
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();
  } catch {
    return "";
  }
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

function isWithinPath(childPath, parentPath) {
  const rel = path.relative(realpathSync(parentPath), realpathSync(childPath));
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
  let sessionCwd = null;
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
      const cwd = parsed.payload?.cwd;
      if (typeof cwd === "string") {
        sessionCwd = cwd;
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
    sessionCwd,
    turns,
    compactionCount,
    selectedFromPreCompaction,
  };
}

function latestMatchingSession(projectRoot) {
  const matches = [];
  for (const dirName of SESSION_DIR_NAMES) {
    for (const sessionFile of collectSessionFiles(path.join(codexHome(), dirName))) {
      const parsed = parseSession(sessionFile, projectRoot);
      if (parsed) {
        matches.push(parsed);
      }
    }
  }

  matches.sort((a, b) => statSync(b.path).mtimeMs - statSync(a.path).mtimeMs);
  return matches[0] || null;
}

function writeRecentThread(contextDir, projectRoot) {
  const filePath = path.join(contextDir, "RECENT_THREAD.md");
  const snapshot = latestMatchingSession(projectRoot);
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

function main() {
  const projectRoot = detectProjectRoot();
  const contextDir = path.join(projectRoot, ".waypoint", "context");
  ensureDir(contextDir);

  const docsIndexPath = writeDocsIndex(projectRoot);

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
    `\`\`\`\n${safeExec("git diff --stat", projectRoot) || "No uncommitted changes."}\n\`\`\``
  );

  const recentCommitsPath = writeContextFile(
    contextDir,
    "RECENT_COMMITS.md",
    "Recent Commits",
    `\`\`\`\n${safeExec("git log --format=%h%d %s (%cr) -20 --all", projectRoot) || "No recent commits found."}\n\`\`\``
  );

  const nestedRepos = collectNestedGitRepos(projectRoot);
  const nestedRepoSections = nestedRepos.map((repoPath) => {
    const rel = path.relative(projectRoot, repoPath) || ".";
    const branch = safeExec("git branch --show-current", repoPath) || "unknown";
    const commits = safeExec("git log --format=%h %s (%cr) -10", repoPath) || "No recent commits found.";
    return `## ${rel}\n\nBranch: ${branch}\n\n\`\`\`\n${commits}\n\`\`\``;
  });
  const nestedReposPath = writeContextFile(
    contextDir,
    "NESTED_REPOS.md",
    "Nested Repositories",
    nestedRepoSections.join("\n\n") || "No nested repositories found."
  );

  const openPrs = safeExec(
    "gh pr list --state open --author @me --limit 5 --json number,title,author,headRefName --template '{{range .}}#{{.number}} {{.title}} ({{.author.login}}) [{{.headRefName}}]\\n{{end}}'",
    projectRoot
  );
  const mergedPrs = safeExec(
    "gh pr list --state merged --author @me --limit 5 --json number,title,author,mergedAt --template '{{range .}}#{{.number}} {{.title}} ({{.author.login}}) merged {{timeago .mergedAt}}\\n{{end}}'",
    projectRoot
  );
  const prsPath = writeContextFile(
    contextDir,
    "PULL_REQUESTS.md",
    "Pull Requests",
    [
      "## Open PRs",
      "",
      "```",
      openPrs || "No open PRs found.",
      "```",
      "",
      "## Recently Merged PRs",
      "",
      "```",
      mergedPrs || "No recently merged PRs found.",
      "```",
    ].join("\n")
  );
  const recentThreadPath = writeRecentThread(contextDir, projectRoot);

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
    "",
    "## Stable source-of-truth files to read before this manifest",
    "",
    "- `.waypoint/SOUL.md`",
    "- `.waypoint/agent-operating-manual.md`",
    "- `WORKSPACE.md`",
    "",
    `Generated by: \`${path.relative(projectRoot, fileURLToPath(import.meta.url))}\``,
    "",
  ];
  writeFileSync(manifestPath, `${manifestLines.join("\n")}`, "utf8");

  console.log(`Prepared Waypoint context in ${contextDir}`);
}

main();
