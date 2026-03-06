#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
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

