import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import * as TOML from "@iarna/toml";

import { renderDocsIndex } from "./docs-index.js";
import {
  defaultWaypointConfig,
  readTemplate,
  renderWaypointConfig,
  MANAGED_BLOCK_END,
  MANAGED_BLOCK_START,
  templatePath,
} from "./templates.js";
import type { Finding, WaypointConfig } from "./types.js";

const DEFAULT_CONFIG_PATH = ".waypoint/config.toml";
const DEFAULT_DOCS_DIR = ".waypoint/docs";
const DEFAULT_DOCS_INDEX = ".waypoint/DOCS_INDEX.md";
const DEFAULT_PLANS_DIR = ".waypoint/plans";
const DEFAULT_WORKSPACE = ".waypoint/WORKSPACE.md";
const DEFAULT_ACTIVE_PLANS = ".waypoint/ACTIVE_PLANS.md";
const GITIGNORE_WAYPOINT_START = "# Waypoint state";
const GITIGNORE_WAYPOINT_END = "# End Waypoint state";
const GITIGNORE_SKILLS_PLACEHOLDER = "__WAYPOINT_SKILL_IGNORES__";
const LEGACY_WAYPOINT_GITIGNORE_RULES = new Set([
  ".codex/",
  ".codex/config.toml",
  ".codex/agents/",
  ".codex/agents/coding-agent.toml",
  ".codex/agents/code-reviewer.toml",
  ".codex/agents/code-health-reviewer.toml",
  ".codex/agents/plan-reviewer.toml",
  ".agents/",
  ".agents/skills/",
  ".agents/skills/planning/",
  ".agents/skills/foundational-redesign/",
  ".agents/skills/verify-completeness/",
  ".agents/skills/code-guide-audit/",
  ".agents/skills/adversarial-review/",
  ".agents/skills/visual-explanations/",
  ".agents/skills/frontend-context-interview/",
  ".agents/skills/backend-context-interview/",
  ".agents/skills/frontend-ship-audit/",
  ".agents/skills/backend-ship-audit/",
  ".agents/skills/pr-review/",
  ".agents/skills/agi-help/",
  ".waypoint/config.toml",
  ".waypoint/README.md",
  ".waypoint/WORKSPACE.md",
  ".waypoint/ACTIVE_PLANS.md",
  ".waypoint/",
  ".waypoint/DOCS_INDEX.md",
  ".waypoint/state/",
  ".waypoint/context/",
  ".waypoint/scripts/",
  ".waypoint/plans/",
  ".waypoint/*",
  "!.waypoint/docs/",
  "!.waypoint/docs/**",
  ".waypoint/docs/README.md",
  ".waypoint/docs/code-guide.md",
]);
const SHIPPED_SKILL_NAMES = [
  "planning",
  "foundational-redesign",
  "verify-completeness",
  "code-guide-audit",
  "adversarial-review",
  "pr-review",
  "agi-help",
  "frontend-context-interview",
  "backend-context-interview",
  "frontend-ship-audit",
  "backend-ship-audit",
];
const TIMESTAMPED_WORKSPACE_SECTIONS = new Set([
  "## Active Plans",
  "## Current State",
  "## In Progress",
  "## Next",
  "## Parked",
  "## Done Recently",
]);
const TIMESTAMPED_ENTRY_PATTERN = /^(?:[-*]|\d+\.)\s+\[\d{4}-\d{2}-\d{2} \d{2}:\d{2} [A-Z]{2,5}\]/;

function configuredRootDirs(
  projectRoot: string,
  roots: string[] | undefined,
  legacyRoot: string | undefined,
  fallbackRoot: string,
): string[] {
  const configuredRoots = roots && roots.length > 0
    ? roots
    : legacyRoot
      ? [legacyRoot]
      : [fallbackRoot];
  const normalizedRoots: string[] = [];
  const seen = new Set<string>();

  for (const root of configuredRoots) {
    const trimmedRoot = root.trim();
    if (trimmedRoot.length === 0) {
      continue;
    }

    const resolvedRoot = path.resolve(projectRoot, trimmedRoot);
    let dedupeKey = path.normalize(resolvedRoot);
    if (existsSync(resolvedRoot)) {
      try {
        dedupeKey = realpathSync(resolvedRoot);
      } catch {
        dedupeKey = path.normalize(resolvedRoot);
      }
    }

    if (seen.has(dedupeKey)) {
      continue;
    }

    seen.add(dedupeKey);
    normalizedRoots.push(resolvedRoot);
  }

  return normalizedRoots.length > 0 ? normalizedRoots : [path.resolve(projectRoot, fallbackRoot)];
}

function docsRootDirs(projectRoot: string, config?: WaypointConfig): string[] {
  return configuredRootDirs(projectRoot, config?.docs_dirs, config?.docs_dir, DEFAULT_DOCS_DIR);
}

function docsSectionHeading(projectRoot: string, dir: string): string {
  const relativePath = path.relative(projectRoot, dir).split(path.sep).join("/");
  const normalizedPath = relativePath.length === 0 ? "." : relativePath;
  return normalizedPath.endsWith("/") ? normalizedPath : `${normalizedPath}/`;
}

function docsIndexSections(projectRoot: string, config?: WaypointConfig): { heading: string; dir: string }[] {
  return docsRootDirs(projectRoot, config).map((dir) => ({
    heading: docsSectionHeading(projectRoot, dir),
    dir,
  }));
}

function buildWaypointConfig(
  projectRoot: string,
  existingConfig: WaypointConfig | undefined,
  options: {
    profile: "universal" | "app-friendly";
  },
): WaypointConfig {
  const defaults = defaultWaypointConfig({ profile: options.profile });

  return {
    version: existingConfig?.version ?? defaults.version,
    profile: options.profile,
    coding_agent: existingConfig?.coding_agent ?? defaults.coding_agent,
    workspace_file: existingConfig?.workspace_file ?? defaults.workspace_file,
    docs_dirs: configuredRootDirs(projectRoot, existingConfig?.docs_dirs, existingConfig?.docs_dir, DEFAULT_DOCS_DIR).map((dir) =>
      path.relative(projectRoot, dir).split(path.sep).join("/")
    ),
    docs_index_file: existingConfig?.docs_index_file ?? defaults.docs_index_file,
  };
}

function ensureDir(dirPath: string): void {
  mkdirSync(dirPath, { recursive: true });
}

function writeIfMissing(filePath: string, content: string): void {
  if (!existsSync(filePath)) {
    ensureDir(path.dirname(filePath));
    writeFileSync(filePath, content, "utf8");
  }
}

function writeText(filePath: string, content: string): void {
  ensureDir(path.dirname(filePath));
  writeFileSync(filePath, content, "utf8");
}

function removePathIfExists(targetPath: string): void {
  if (existsSync(targetPath)) {
    rmSync(targetPath, { recursive: true, force: true });
  }
}

function migrateLegacyRootFiles(projectRoot: string): void {
  const legacyWorkspace = path.join(projectRoot, "WORKSPACE.md");
  const newWorkspace = path.join(projectRoot, DEFAULT_WORKSPACE);
  if (existsSync(legacyWorkspace) && !existsSync(newWorkspace)) {
    writeText(newWorkspace, readFileSync(legacyWorkspace, "utf8"));
  }
  removePathIfExists(legacyWorkspace);
  removePathIfExists(path.join(projectRoot, "MEMORY.md"));
  removePathIfExists(path.join(projectRoot, "DOCS_INDEX.md"));
}

function templateSkillIgnoreLines(): string[] {
  const skillsRoot = templatePath(".agents/skills");
  if (!existsSync(skillsRoot)) {
    return [];
  }

  return readdirSync(skillsRoot)
    .filter((entry) => statSync(path.join(skillsRoot, entry)).isDirectory())
    .sort((left, right) => left.localeCompare(right))
    .map((skillName) => `.agents/skills/${skillName}/`);
}

function renderGitignoreSnippet(): string {
  const snippet = readTemplate(".gitignore.snippet").trim();
  const renderedLines: string[] = [];
  for (const line of snippet.split("\n")) {
    if (line === GITIGNORE_SKILLS_PLACEHOLDER) {
      renderedLines.push(...templateSkillIgnoreLines());
      continue;
    }
    renderedLines.push(line);
  }

  return renderedLines.join("\n");
}

function appendGitignoreSnippet(projectRoot: string): void {
  const gitignorePath = path.join(projectRoot, ".gitignore");
  const snippet = renderGitignoreSnippet();
  const snippetLines = snippet.split("\n");
  if (!existsSync(gitignorePath)) {
    writeText(gitignorePath, `${snippet}\n`);
    return;
  }
  const content = readFileSync(gitignorePath, "utf8");
  const normalizedLines = content.split(/\r?\n/);
  const normalizedContent = normalizedLines.join("\n");
  const headerCount = normalizedLines.filter((line) => line === GITIGNORE_WAYPOINT_START).length;
  if (normalizedContent.includes(snippet) && headerCount <= 1) {
    return;
  }
  const startIndex = normalizedLines.findIndex((line) => line === snippetLines[0]);
  if (startIndex === -1) {
    writeText(gitignorePath, `${content.trimEnd()}\n\n${snippet}\n`);
    return;
  }
  const managedLineSet = new Set(snippetLines);
  const endIndex = findWaypointGitignoreBlockEnd(normalizedLines, startIndex);
  if (endIndex === -1) {
    writeText(gitignorePath, `${content.trimEnd()}\n\n${snippet}\n`);
    return;
  }
  const hasForeignLineInsideBlock = normalizedLines
    .slice(startIndex + 1, endIndex)
    .some((line) => line.length > 0 && !isManagedWaypointGitignoreLine(line, managedLineSet));
  const trailingLines = stripSubsequentWaypointGitignoreBlocks(normalizedLines.slice(endIndex + 1), managedLineSet);
  if (hasForeignLineInsideBlock) {
    const foreignLines = normalizedLines
      .slice(startIndex + 1, endIndex)
      .filter((line) => line.length > 0 && !isManagedWaypointGitignoreLine(line, managedLineSet))
      .join("\n");
    const before = normalizedLines.slice(0, startIndex).join("\n").trimEnd();
    const after = trailingLines.join("\n").trimStart();
    const merged = [before, snippet, foreignLines, after].filter((piece) => piece.length > 0).join("\n\n");
    writeText(gitignorePath, `${merged}\n`);
    return;
  }
  const before = normalizedLines.slice(0, startIndex).join("\n").trimEnd();
  const after = trailingLines.join("\n").trimStart();
  const merged = [before, snippet, after].filter((piece) => piece.length > 0).join("\n\n");
  writeText(gitignorePath, `${merged}\n`);
}

function findWaypointGitignoreBlockEnd(lines: string[], startIndex: number): number {
  const explicitEndIndex = lines.findIndex((line, index) => index > startIndex && line === GITIGNORE_WAYPOINT_END);
  if (explicitEndIndex !== -1) {
    return explicitEndIndex;
  }
  return findLegacyWaypointGitignoreBlockEnd(lines, startIndex);
}

function findLegacyWaypointGitignoreBlockEnd(lines: string[], startIndex: number): number {
  let scanEndExclusive = lines.length;
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.length === 0) {
      scanEndExclusive = index;
      break;
    }
    if (line.startsWith("#") && line !== GITIGNORE_WAYPOINT_START) {
      scanEndExclusive = index;
      break;
    }
  }

  let endIndex = -1;
  for (let index = startIndex + 1; index < scanEndExclusive; index += 1) {
    if (isLegacyWaypointGitignoreRule(lines[index])) {
      endIndex = index;
    }
  }
  return endIndex;
}

function isLegacyWaypointGitignoreRule(line: string): boolean {
  const normalizedLine = line.startsWith("/") ? line.slice(1) : line;
  return LEGACY_WAYPOINT_GITIGNORE_RULES.has(normalizedLine)
    || /^\.agents\/skills\/[^/]+\/$/.test(normalizedLine);
}

function isManagedWaypointGitignoreLine(line: string, managedLineSet: Set<string>): boolean {
  return managedLineSet.has(line) || isLegacyWaypointGitignoreRule(line);
}

function stripSubsequentWaypointGitignoreBlocks(lines: string[], managedLineSet: Set<string>): string[] {
  const keptLines: string[] = [];
  let index = 0;

  while (index < lines.length) {
    if (lines[index] !== GITIGNORE_WAYPOINT_START) {
      keptLines.push(lines[index]);
      index += 1;
      continue;
    }

    const endIndex = findWaypointGitignoreBlockEnd(lines, index);
    if (endIndex === -1) {
      keptLines.push(lines[index]);
      index += 1;
      continue;
    }

    const foreignLines = lines
      .slice(index + 1, endIndex)
      .filter((line) => line.length > 0 && !isManagedWaypointGitignoreLine(line, managedLineSet));
    if (foreignLines.length > 0) {
      if (keptLines.length > 0 && keptLines[keptLines.length - 1] !== "") {
        keptLines.push("");
      }
      keptLines.push(...foreignLines);
      if (endIndex + 1 < lines.length && lines[endIndex + 1] !== "") {
        keptLines.push("");
      }
    }

    index = endIndex + 1;
  }

  return keptLines;
}

function upsertManagedBlock(filePath: string, block: string): void {
  if (!existsSync(filePath)) {
    writeText(filePath, `${block.trim()}\n`);
    return;
  }
  const existing = readFileSync(filePath, "utf8");
  const startIndex = existing.indexOf(MANAGED_BLOCK_START);
  const endIndex = existing.indexOf(MANAGED_BLOCK_END);
  if (startIndex !== -1 && endIndex !== -1 && endIndex >= startIndex) {
    const afterEnd = endIndex + MANAGED_BLOCK_END.length;
    const before = existing.slice(0, startIndex).trimEnd();
    const after = existing.slice(afterEnd).trimStart();
    const pieces = [before, block.trim(), after].filter((piece) => piece.length > 0);
    writeText(filePath, `${pieces.join("\n\n")}\n`);
    return;
  }
  const merged = existing.trimEnd();
  writeText(filePath, `${merged.length > 0 ? `${merged}\n\n` : ""}${block.trim()}\n`);
}

function copyTemplateTree(sourceDir: string, targetDir: string): void {
  for (const entry of readdirSync(sourceDir)) {
    const sourcePath = path.join(sourceDir, entry);
    const targetPath = path.join(targetDir, entry);
    const stat = statSync(sourcePath);
    if (stat.isDirectory()) {
      ensureDir(targetPath);
      copyTemplateTree(sourcePath, targetPath);
    } else {
      writeText(targetPath, readFileSync(sourcePath, "utf8"));
    }
  }
}

function scaffoldSkills(projectRoot: string): void {
  const targetRoot = path.join(projectRoot, ".agents/skills");
  copyTemplateTree(templatePath(".agents/skills"), targetRoot);
}

function scaffoldWaypointOptionalTemplates(projectRoot: string): void {
  copyTemplateTree(templatePath(".waypoint/scripts"), path.join(projectRoot, ".waypoint/scripts"));
}

function scaffoldOptionalCodex(projectRoot: string): void {
  copyTemplateTree(templatePath(".codex"), path.join(projectRoot, ".codex"));
}

export function initRepository(
  projectRoot: string,
  options: {
    profile: "universal" | "app-friendly";
  },
): string[] {
  ensureDir(projectRoot);
  migrateLegacyRootFiles(projectRoot);
  const config = buildWaypointConfig(projectRoot, loadWaypointConfig(projectRoot), options);
  // Any Waypoint-owned path removed from the scaffold should be added here
  // so `waypoint init` / `waypoint upgrade` can actively prune stale copies.
  for (const deprecatedPath of [
    "docs/README.md",
    "docs/code-guide.md",
    "docs/legacy-import",
    ".codex/agents/coding-agent.toml",
    ".agents/skills/error-audit",
    ".agents/skills/observability-audit",
    ".agents/skills/ux-states-audit",
    "WAYPOINT_MIGRATION.md",
    ".agents/skills/waypoint-planning",
    ".agents/skills/waypoint-docs",
    ".agents/skills/waypoint-review",
    ".agents/skills/waypoint-maintain",
    ".agents/skills/waypoint-error-audit",
    ".agents/skills/waypoint-observability-audit",
    ".agents/skills/waypoint-ux-states-audit",
    ".agents/skills/waypoint-frontmatter",
    ".agents/skills/waypoint-explore",
    ".agents/skills/waypoint-research",
    ".agents/skills/visual-explanations",
    ".agents/skills/work-tracker",
    ".agents/skills/docs-sync",
    ".agents/skills/break-it-qa",
    ".agents/skills/conversation-retrospective",
    ".agents/skills/merge-ready-owner",
    ".agents/skills/workspace-compress",
    ".agents/skills/pre-pr-hygiene",
    ".codex/agents/explorer.toml",
    ".codex/agents/reviewer.toml",
    ".codex/agents/architect.toml",
    ".codex/agents/implementer.toml",
    ".waypoint/agents",
    ".waypoint/automations",
    ".waypoint/MEMORY.md",
    ".waypoint/rules",
    ".waypoint/state",
    ".waypoint/SOUL.md",
    ".waypoint/agent-operating-manual.md",
    ".waypoint/TRACKS_INDEX.md",
    ".waypoint/track",
    ".waypoint/context/MANIFEST.md",
    ".waypoint/context/ACTIVE_PLANS.md",
    ".waypoint/context/ACTIVE_TRACKERS.md",
    ".waypoint/context/PULL_REQUESTS.md",
    ".waypoint/context/RECENT_COMMITS.md",
    ".waypoint/context/UNCOMMITTED_CHANGES.md",
    ".waypoint/scripts/build-track-index.mjs",
  ]) {
    removePathIfExists(path.join(projectRoot, deprecatedPath));
  }

  writeText(path.join(projectRoot, ".waypoint/README.md"), readTemplate(".waypoint/README.md"));
  scaffoldWaypointOptionalTemplates(projectRoot);

  writeText(
    path.join(projectRoot, DEFAULT_CONFIG_PATH),
    renderWaypointConfig(config),
  );
  writeIfMissing(path.join(projectRoot, DEFAULT_WORKSPACE), readTemplate("WORKSPACE.md"));
  writeIfMissing(path.join(projectRoot, DEFAULT_ACTIVE_PLANS), readTemplate(".waypoint/ACTIVE_PLANS.md"));
  ensureDir(path.join(projectRoot, DEFAULT_DOCS_DIR));
  ensureDir(path.join(projectRoot, DEFAULT_PLANS_DIR));
  writeIfMissing(path.join(projectRoot, ".waypoint/docs/README.md"), readTemplate(".waypoint/docs/README.md"));
  writeIfMissing(path.join(projectRoot, ".waypoint/docs/code-guide.md"), readTemplate(".waypoint/docs/code-guide.md"));
  writeIfMissing(path.join(projectRoot, ".waypoint/plans/README.md"), readTemplate(".waypoint/plans/README.md"));
  upsertManagedBlock(path.join(projectRoot, "AGENTS.md"), readTemplate("managed-agents-block.md"));
  scaffoldSkills(projectRoot);
  scaffoldOptionalCodex(projectRoot);
  appendGitignoreSnippet(projectRoot);
  const docsIndexPath = path.join(projectRoot, config.docs_index_file ?? DEFAULT_DOCS_INDEX);
  const docsIndex = renderDocsIndex(projectRoot, docsIndexSections(projectRoot, config));
  writeText(docsIndexPath, `${docsIndex.content}\n`);

  return [
    "Initialized Waypoint scaffold",
    "Installed managed AGENTS block",
    "Created .waypoint/WORKSPACE.md, .waypoint/ACTIVE_PLANS.md, .waypoint/docs/, and .waypoint/plans/ scaffold",
    "Installed repo-local Waypoint skills",
    "Installed coding/reviewer agents and project Codex config",
    "Generated .waypoint/DOCS_INDEX.md",
  ];
}

export function loadWaypointConfig(projectRoot: string): WaypointConfig {
  const configPath = path.join(projectRoot, DEFAULT_CONFIG_PATH);
  if (!existsSync(configPath)) {
    return {};
  }
  return TOML.parse(readFileSync(configPath, "utf8")) as unknown as WaypointConfig;
}

function findWorkspaceTimestampViolations(workspaceText: string): string[] {
  let currentSection = "";
  const violations = new Set<string>();

  for (const rawLine of workspaceText.split("\n")) {
    const line = rawLine.trim();
    if (line.startsWith("## ")) {
      currentSection = line;
      continue;
    }
    if (!TIMESTAMPED_WORKSPACE_SECTIONS.has(currentSection) || line.length === 0) {
      continue;
    }
    if (!/^(?:[-*]|\d+\.)\s+/.test(line)) {
      continue;
    }
    if (!TIMESTAMPED_ENTRY_PATTERN.test(line)) {
      violations.add(currentSection);
    }
  }

  return [...violations];
}

export function doctorRepository(projectRoot: string): Finding[] {
  const findings: Finding[] = [];
  const config = loadWaypointConfig(projectRoot);
  if (Object.keys(config).length === 0) {
    findings.push({
      severity: "error",
      category: "install",
      message: "Waypoint config is missing.",
      remediation: "Run `waypoint init` in the repository.",
      paths: [path.join(projectRoot, DEFAULT_CONFIG_PATH)],
    });
    return findings;
  }

  const agentsPath = path.join(projectRoot, "AGENTS.md");
  if (!existsSync(agentsPath)) {
    findings.push({
      severity: "error",
      category: "install",
      message: "AGENTS.md is missing.",
      remediation: "Run `waypoint init` or restore AGENTS.md.",
      paths: [agentsPath],
    });
  } else {
    const agentsContent = readFileSync(agentsPath, "utf8");
    if (!agentsContent.includes(MANAGED_BLOCK_START) || !agentsContent.includes(MANAGED_BLOCK_END)) {
      findings.push({
        severity: "error",
        category: "install",
        message: "Waypoint managed block is missing from AGENTS.md.",
        remediation: "Run `waypoint init` to repair the managed block.",
        paths: [agentsPath],
      });
    }
  }

  const workspacePath = path.join(projectRoot, config.workspace_file ?? DEFAULT_WORKSPACE);
  if (!existsSync(workspacePath)) {
    findings.push({
      severity: "error",
      category: "workspace",
      message: ".waypoint/WORKSPACE.md is missing.",
      remediation: "Run `waypoint init` to scaffold the workspace file.",
      paths: [workspacePath],
    });
  } else {
    const workspaceText = readFileSync(workspacePath, "utf8");
    for (const section of [
      "## Active Goal",
      "## Active Plans",
      "## Current State",
      "## In Progress",
      "## Next",
      "## Parked",
      "## Done Recently",
    ]) {
      if (!workspaceText.includes(section)) {
        findings.push({
          severity: "warn",
          category: "workspace",
          message: `Workspace file is missing section \`${section}\`.`,
          remediation: "Restore the standard Waypoint workspace sections.",
          paths: [workspacePath],
        });
      }
    }
    const timestampViolations = findWorkspaceTimestampViolations(workspaceText);
    if (timestampViolations.length > 0) {
      findings.push({
        severity: "warn",
        category: "workspace",
        message: `Workspace has untimestamped entries in ${timestampViolations.join(", ")}.`,
        remediation: "Prefix new or materially revised workspace bullets with `[YYYY-MM-DD HH:MM TZ]`.",
        paths: [workspacePath],
      });
    }
  }

  for (const requiredFile of [
    path.join(projectRoot, ".waypoint", "scripts", "prepare-context.mjs"),
    path.join(projectRoot, ".waypoint", "scripts", "build-docs-index.mjs"),
  ]) {
    if (!existsSync(requiredFile)) {
      findings.push({
        severity: "error",
        category: "install",
        message: `Required Waypoint file is missing: ${path.relative(projectRoot, requiredFile)}`,
        remediation: "Run `waypoint init` to restore the missing file.",
        paths: [requiredFile],
      });
    }
  }

  const docsIndexPath = path.join(projectRoot, config.docs_index_file ?? DEFAULT_DOCS_INDEX);
  const configuredDocsDirs = docsRootDirs(projectRoot, config);
  const docsIndex = renderDocsIndex(projectRoot, docsIndexSections(projectRoot, config));
  for (const docsDir of configuredDocsDirs) {
    if (existsSync(docsDir)) {
      continue;
    }

    findings.push({
      severity: "error",
      category: "docs",
      message: `${docsSectionHeading(projectRoot, docsDir)} directory is missing.`,
      remediation: "Create the configured docs directory or update `.waypoint/config.toml`.",
      paths: [docsDir],
    });
  }
  const plansDir = path.join(projectRoot, DEFAULT_PLANS_DIR);
  if (!existsSync(plansDir)) {
    findings.push({
      severity: "error",
      category: "docs",
      message: ".waypoint/plans/ directory is missing.",
      remediation: "Run `waypoint init` to restore the plans directory.",
      paths: [plansDir],
    });
  }
  for (const relPath of docsIndex.invalidDocs) {
    findings.push({
      severity: "warn",
      category: "docs",
      message: `Doc is missing valid frontmatter: ${relPath}`,
      remediation: "Add `summary`, `last_updated`, and `read_when` frontmatter.",
      paths: [path.join(projectRoot, relPath)],
    });
  }
  if (!existsSync(docsIndexPath)) {
    findings.push({
      severity: "warn",
      category: "docs",
      message: ".waypoint/DOCS_INDEX.md is missing.",
      remediation: "Run `waypoint sync` to generate the docs index.",
      paths: [docsIndexPath],
    });
  } else if (readFileSync(docsIndexPath, "utf8").trimEnd() !== docsIndex.content.trimEnd()) {
    findings.push({
      severity: "warn",
      category: "docs",
      message: ".waypoint/DOCS_INDEX.md is stale.",
      remediation: "Run `waypoint sync` to rebuild the docs index.",
      paths: [docsIndexPath],
    });
  }
  const activePlansPath = path.join(projectRoot, DEFAULT_ACTIVE_PLANS);
  if (!existsSync(activePlansPath)) {
    findings.push({
      severity: "error",
      category: "workspace",
      message: ".waypoint/ACTIVE_PLANS.md is missing.",
      remediation: "Run `waypoint init` to scaffold the active plans file.",
      paths: [activePlansPath],
    });
  } else if (existsSync(workspacePath) && !readFileSync(workspacePath, "utf8").includes(DEFAULT_ACTIVE_PLANS)) {
    findings.push({
      severity: "warn",
      category: "workspace",
      message: "Workspace does not reference .waypoint/ACTIVE_PLANS.md under `## Active Plans`.",
      remediation: "Point `## Active Plans` at `.waypoint/ACTIVE_PLANS.md` and summarize the current active phase.",
      paths: [workspacePath, activePlansPath],
    });
  }

  for (const skillName of SHIPPED_SKILL_NAMES) {
    const skillPath = path.join(projectRoot, ".agents/skills", skillName, "SKILL.md");
    if (!existsSync(skillPath)) {
      findings.push({
        severity: "error",
        category: "skills",
        message: `Repo skill \`${skillName}\` is missing.`,
        remediation: "Run `waypoint init` to restore repo-local skills.",
        paths: [skillPath],
      });
      continue;
    }
    const metadataPath = path.join(projectRoot, ".agents/skills", skillName, "agents", "openai.yaml");
    if (!existsSync(metadataPath)) {
      findings.push({
        severity: "error",
        category: "skills",
        message: `Repo skill \`${skillName}\` metadata is missing.`,
        remediation: "Run `waypoint init` to restore repo-local skill metadata.",
        paths: [metadataPath],
      });
    }
  }

  const codexConfigPath = path.join(projectRoot, ".codex/config.toml");
  if (!existsSync(codexConfigPath)) {
    findings.push({
      severity: "warn",
      category: "roles",
      message: "Codex agent config is missing from .codex/config.toml.",
      remediation: "Run `waypoint init` or create the project Codex config files.",
      paths: [codexConfigPath],
    });
  }

  return findings;
}

export function syncRepository(projectRoot: string): string[] {
  const config = loadWaypointConfig(projectRoot);
  const docsIndexPath = path.join(projectRoot, config.docs_index_file ?? DEFAULT_DOCS_INDEX);
  const docsIndex = renderDocsIndex(projectRoot, docsIndexSections(projectRoot, config));
  writeText(docsIndexPath, `${docsIndex.content}\n`);

  return ["Rebuilt .waypoint/DOCS_INDEX.md"];
}
