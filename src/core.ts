import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import * as TOML from "@iarna/toml";

import { renderDocsIndex } from "./docs-index.js";
import { readTemplate, renderWaypointConfig, MANAGED_BLOCK_END, MANAGED_BLOCK_START, templatePath } from "./templates.js";
import type { AutomationSpec, Finding, SyncRecord, WaypointConfig } from "./types.js";

const DEFAULT_CONFIG_PATH = ".waypoint/config.toml";
const DEFAULT_DOCS_DIR = ".waypoint/docs";
const DEFAULT_DOCS_INDEX = "DOCS_INDEX.md";
const DEFAULT_WORKSPACE = "WORKSPACE.md";
const STATE_DIR = ".waypoint/state";
const SYNC_RECORDS_FILE = ".waypoint/state/sync-records.json";

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

function appendGitignoreSnippet(projectRoot: string): void {
  const gitignorePath = path.join(projectRoot, ".gitignore");
  const snippet = readTemplate(".gitignore.snippet").trim();
  if (!existsSync(gitignorePath)) {
    writeText(gitignorePath, `${snippet}\n`);
    return;
  }
  const content = readFileSync(gitignorePath, "utf8");
  if (content.includes(snippet)) {
    return;
  }
  writeText(gitignorePath, `${content.trimEnd()}\n\n${snippet}\n`);
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
  copyTemplateTree(templatePath(".waypoint/agents"), path.join(projectRoot, ".waypoint/agents"));
  copyTemplateTree(templatePath(".waypoint/automations"), path.join(projectRoot, ".waypoint/automations"));
  copyTemplateTree(templatePath(".waypoint/rules"), path.join(projectRoot, ".waypoint/rules"));
  copyTemplateTree(templatePath(".waypoint/scripts"), path.join(projectRoot, ".waypoint/scripts"));
}

function scaffoldOptionalCodex(projectRoot: string): void {
  copyTemplateTree(templatePath(".codex"), path.join(projectRoot, ".codex"));
}

export function initRepository(
  projectRoot: string,
  options: {
    profile: "universal" | "app-friendly";
    withRoles: boolean;
    withRules: boolean;
    withAutomations: boolean;
  },
): string[] {
  ensureDir(projectRoot);
  for (const deprecatedPath of [
    "docs/README.md",
    "docs/code-guide.md",
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
    ".codex/agents/explorer.toml",
    ".codex/agents/reviewer.toml",
    ".codex/agents/architect.toml",
    ".codex/agents/implementer.toml",
  ]) {
    removePathIfExists(path.join(projectRoot, deprecatedPath));
  }
  ensureDir(path.join(projectRoot, ".waypoint/automations"));
  ensureDir(path.join(projectRoot, ".waypoint/rules"));
  ensureDir(path.join(projectRoot, STATE_DIR));

  writeText(path.join(projectRoot, ".waypoint/README.md"), readTemplate(".waypoint/README.md"));
  writeText(path.join(projectRoot, ".waypoint/SOUL.md"), readTemplate(".waypoint/SOUL.md"));
  writeText(
    path.join(projectRoot, ".waypoint/agent-operating-manual.md"),
    readTemplate(".waypoint/agent-operating-manual.md"),
  );
  scaffoldWaypointOptionalTemplates(projectRoot);

  writeText(
    path.join(projectRoot, DEFAULT_CONFIG_PATH),
    renderWaypointConfig({
      profile: options.profile,
      roles: options.withRoles,
      rules: options.withRules,
      automations: options.withAutomations,
    }),
  );
  writeIfMissing(path.join(projectRoot, DEFAULT_WORKSPACE), readTemplate("WORKSPACE.md"));
  ensureDir(path.join(projectRoot, DEFAULT_DOCS_DIR));
  writeIfMissing(path.join(projectRoot, ".waypoint/docs/README.md"), readTemplate(".waypoint/docs/README.md"));
  writeIfMissing(path.join(projectRoot, ".waypoint/docs/code-guide.md"), readTemplate(".waypoint/docs/code-guide.md"));
  upsertManagedBlock(path.join(projectRoot, "AGENTS.md"), readTemplate("managed-agents-block.md"));
  scaffoldSkills(projectRoot);
  if (options.withRoles) {
    scaffoldOptionalCodex(projectRoot);
  }
  appendGitignoreSnippet(projectRoot);
  const docsIndex = renderDocsIndex(projectRoot, path.join(projectRoot, DEFAULT_DOCS_DIR));
  writeText(path.join(projectRoot, DEFAULT_DOCS_INDEX), `${docsIndex.content}\n`);

  return [
    "Initialized Waypoint scaffold",
    "Installed managed AGENTS block",
    "Created WORKSPACE.md and .waypoint/docs/ scaffold",
    "Installed repo-local Waypoint skills",
    "Generated DOCS_INDEX.md",
  ];
}

export function loadWaypointConfig(projectRoot: string): WaypointConfig {
  const configPath = path.join(projectRoot, DEFAULT_CONFIG_PATH);
  if (!existsSync(configPath)) {
    return {};
  }
  return TOML.parse(readFileSync(configPath, "utf8")) as unknown as WaypointConfig;
}

function loadSyncRecords(projectRoot: string): Record<string, SyncRecord> {
  const syncPath = path.join(projectRoot, SYNC_RECORDS_FILE);
  if (!existsSync(syncPath)) {
    return {};
  }
  try {
    return JSON.parse(readFileSync(syncPath, "utf8")) as Record<string, SyncRecord>;
  } catch {
    return {};
  }
}

function saveSyncRecords(projectRoot: string, records: Record<string, SyncRecord>): void {
  writeText(path.join(projectRoot, SYNC_RECORDS_FILE), `${JSON.stringify(records, null, 2)}\n`);
}

function hashFile(filePath: string): string {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function codexHome(): string {
  return process.env.CODEX_HOME ?? path.join(os.homedir(), ".codex");
}

function renderCodexAutomation(spec: AutomationSpec, cwd: string): string {
  const now = Date.now();
  const rrule = spec.rrule?.startsWith("RRULE:") ? spec.rrule : `RRULE:${spec.rrule}`;
  return [
    "version = 1",
    `id = ${JSON.stringify(spec.id)}`,
    `name = ${JSON.stringify(spec.name)}`,
    `prompt = ${JSON.stringify(spec.prompt)}`,
    `status = ${JSON.stringify(spec.status ?? "ACTIVE")}`,
    `rrule = ${JSON.stringify(rrule)}`,
    `execution_environment = ${JSON.stringify(spec.execution_environment ?? "worktree")}`,
    `cwds = ${JSON.stringify(spec.cwds ?? [cwd])}`,
    `created_at = ${now}`,
    `updated_at = ${now}`,
  ].join("\n") + "\n";
}

function isKebabCase(value: string): boolean {
  return /^[a-z0-9-]+$/.test(value);
}

function validateAutomationSpecFile(filePath: string): string[] {
  const errors: string[] = [];
  let parsed: AutomationSpec;
  try {
    parsed = TOML.parse(readFileSync(filePath, "utf8")) as unknown as AutomationSpec;
  } catch (error) {
    return [`invalid TOML: ${error instanceof Error ? error.message : String(error)}`];
  }

  for (const key of ["id", "name", "prompt", "rrule"] as const) {
    if (!parsed[key]) {
      errors.push(`missing required key \`${key}\``);
    }
  }

  if (parsed.id && !isKebabCase(parsed.id)) {
    errors.push("automation id must use lowercase kebab-case");
  }

  return errors;
}

function syncAutomations(projectRoot: string): string[] {
  const sourceDir = path.join(projectRoot, ".waypoint/automations");
  if (!existsSync(sourceDir)) {
    return [];
  }

  const targetRoot = path.join(codexHome(), "automations");
  ensureDir(targetRoot);
  const records = loadSyncRecords(projectRoot);
  const results: string[] = [];

  for (const entry of readdirSync(sourceDir)) {
    if (!entry.endsWith(".toml")) {
      continue;
    }
    const sourcePath = path.join(sourceDir, entry);
    const errors = validateAutomationSpecFile(sourcePath);
    if (errors.length > 0) {
      results.push(`Skipped ${entry}: ${errors.join("; ")}`);
      continue;
    }
    const spec = TOML.parse(readFileSync(sourcePath, "utf8")) as unknown as AutomationSpec;
    if (spec.enabled === false) {
      continue;
    }
    const targetDir = path.join(targetRoot, spec.id!);
    const targetPath = path.join(targetDir, "automation.toml");
    ensureDir(targetDir);
    writeText(targetPath, renderCodexAutomation(spec, projectRoot));
    records[sourcePath] = {
      artifact_type: "automation",
      source_path: sourcePath,
      target_path: targetPath,
      source_hash: hashFile(sourcePath),
      target_hash: hashFile(targetPath),
    };
    results.push(`Synced automation \`${spec.id}\``);
  }

  saveSyncRecords(projectRoot, records);
  return results;
}

function syncRules(projectRoot: string): string[] {
  const sourceDir = path.join(projectRoot, ".waypoint/rules");
  if (!existsSync(sourceDir)) {
    return [];
  }

  const targetRoot = path.join(codexHome(), "rules");
  ensureDir(targetRoot);
  const records = loadSyncRecords(projectRoot);
  const results: string[] = [];

  for (const entry of readdirSync(sourceDir)) {
    if (!entry.endsWith(".rules")) {
      continue;
    }
    const sourcePath = path.join(sourceDir, entry);
    const targetPath = path.join(targetRoot, `waypoint-${entry}`);
    copyFileSync(sourcePath, targetPath);
    records[sourcePath] = {
      artifact_type: "rules",
      source_path: sourcePath,
      target_path: targetPath,
      source_hash: hashFile(sourcePath),
      target_hash: hashFile(targetPath),
    };
    results.push(`Synced rules \`${entry}\``);
  }

  saveSyncRecords(projectRoot, records);
  return results;
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
      message: "WORKSPACE.md is missing.",
      remediation: "Run `waypoint init` to scaffold the workspace file.",
      paths: [workspacePath],
    });
  } else {
    const workspaceText = readFileSync(workspacePath, "utf8");
    for (const section of [
      "## Active Goal",
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
  }

  for (const requiredFile of [
    path.join(projectRoot, ".waypoint", "SOUL.md"),
    path.join(projectRoot, ".waypoint", "agent-operating-manual.md"),
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

  const docsDir = path.join(projectRoot, config.docs_dir ?? DEFAULT_DOCS_DIR);
  const docsIndexPath = path.join(projectRoot, config.docs_index_file ?? DEFAULT_DOCS_INDEX);
  const docsIndex = renderDocsIndex(projectRoot, docsDir);
  if (!existsSync(docsDir)) {
    findings.push({
      severity: "error",
      category: "docs",
      message: "docs/ directory is missing.",
      remediation: "Run `waypoint init` to scaffold docs.",
      paths: [docsDir],
    });
  }
  for (const relPath of docsIndex.invalidDocs) {
    findings.push({
      severity: "warn",
      category: "docs",
      message: `Doc is missing valid frontmatter: ${relPath}`,
      remediation: "Add `summary` and `read_when` frontmatter.",
      paths: [path.join(projectRoot, relPath)],
    });
  }
  if (!existsSync(docsIndexPath)) {
    findings.push({
      severity: "warn",
      category: "docs",
      message: "DOCS_INDEX.md is missing.",
      remediation: "Run `waypoint sync` to generate the docs index.",
      paths: [docsIndexPath],
    });
  } else if (readFileSync(docsIndexPath, "utf8").trimEnd() !== docsIndex.content.trimEnd()) {
    findings.push({
      severity: "warn",
      category: "docs",
      message: "DOCS_INDEX.md is stale.",
      remediation: "Run `waypoint sync` to rebuild the docs index.",
      paths: [docsIndexPath],
    });
  }

  for (const skillName of [
    "planning",
    "error-audit",
    "observability-audit",
    "ux-states-audit",
  ]) {
    const skillPath = path.join(projectRoot, ".agents/skills", skillName, "SKILL.md");
    if (!existsSync(skillPath)) {
      findings.push({
        severity: "error",
        category: "skills",
        message: `Repo skill \`${skillName}\` is missing.`,
        remediation: "Run `waypoint init` to restore repo-local skills.",
        paths: [skillPath],
      });
    }
  }

  const featureMap = config.features ?? {};
  if (featureMap.automations) {
    const records = loadSyncRecords(projectRoot);
    const automationDir = path.join(projectRoot, ".waypoint/automations");
    if (existsSync(automationDir)) {
      for (const entry of readdirSync(automationDir)) {
        if (!entry.endsWith(".toml")) {
          continue;
        }
        const filePath = path.join(automationDir, entry);
        const errors = validateAutomationSpecFile(filePath);
        for (const error of errors) {
          findings.push({
            severity: "error",
            category: "automations",
            message: `${path.relative(projectRoot, filePath)}: ${error}`,
            remediation: "Fix the automation spec and rerun `waypoint sync`.",
            paths: [filePath],
          });
        }
        if (errors.length === 0) {
          const spec = TOML.parse(readFileSync(filePath, "utf8")) as unknown as AutomationSpec;
          if (spec.enabled === false) {
            continue;
          }
        }
        if (errors.length === 0 && !records[filePath]) {
          findings.push({
            severity: "info",
            category: "automations",
            message: `Automation \`${path.basename(entry, ".toml")}\` has not been synced.`,
            remediation: "Run `waypoint sync` to install it into Codex home.",
            paths: [filePath],
          });
        }
      }
    }
  }

  if (featureMap.roles) {
    const codexConfigPath = path.join(projectRoot, ".codex/config.toml");
    if (!existsSync(codexConfigPath)) {
      findings.push({
        severity: "warn",
        category: "roles",
        message: "Role support is enabled but .codex/config.toml is missing.",
        remediation: "Run `waypoint init --with-roles` or create the project Codex config files.",
        paths: [codexConfigPath],
      });
    }
  }

  return findings;
}

export function syncRepository(projectRoot: string): string[] {
  const config = loadWaypointConfig(projectRoot);
  const docsDir = path.join(projectRoot, config.docs_dir ?? DEFAULT_DOCS_DIR);
  const docsIndexPath = path.join(projectRoot, config.docs_index_file ?? DEFAULT_DOCS_INDEX);
  const docsIndex = renderDocsIndex(projectRoot, docsDir);
  writeText(docsIndexPath, `${docsIndex.content}\n`);

  const results = ["Rebuilt DOCS_INDEX.md"];
  const featureMap = config.features ?? {};
  if (featureMap.rules) {
    results.push(...syncRules(projectRoot));
  }
  if (featureMap.automations) {
    results.push(...syncAutomations(projectRoot));
  }
  return results;
}

export function importLegacyRepo(
  sourceRepo: string,
  targetRepo?: string,
  options: { initTarget?: boolean } = {},
): { report: string; actions: string[] } {
  const sourceDocsDir = path.join(sourceRepo, ".meridian/docs");
  const sourceSkillsDir = path.join(sourceRepo, "skills");
  const sourceCommandsDir = path.join(sourceRepo, "commands");
  const sourceAgentsDir = path.join(sourceRepo, "agents");
  const sourceHooksPath = path.join(sourceRepo, "hooks/hooks.json");
  const sourceScriptsDir = path.join(sourceRepo, "scripts");

  const portableDocs = existsSync(sourceDocsDir)
    ? readdirSync(sourceDocsDir).filter((entry) => entry.endsWith(".md")).sort()
    : [];
  const portableSkills = existsSync(sourceSkillsDir)
    ? readdirSync(sourceSkillsDir)
        .map((entry) => path.join("skills", entry, "SKILL.md"))
        .filter((relPath) => existsSync(path.join(sourceRepo, relPath)))
        .sort()
    : [];
  const portableCommands = existsSync(sourceCommandsDir)
    ? readdirSync(sourceCommandsDir)
        .filter((entry) => entry.endsWith(".md"))
        .map((entry) => path.join("commands", entry))
        .sort()
    : [];
  const agentFiles = existsSync(sourceAgentsDir)
    ? readdirSync(sourceAgentsDir)
        .filter((entry) => entry.endsWith(".md"))
        .map((entry) => path.join("agents", entry))
        .sort()
    : [];
  const hookFiles = existsSync(sourceHooksPath) ? [path.join("hooks", "hooks.json")] : [];
  const scriptFiles = existsSync(sourceScriptsDir)
    ? collectFiles(sourceScriptsDir)
        .filter((filePath) => filePath.endsWith(".py"))
        .map((filePath) => path.relative(sourceRepo, filePath))
        .sort()
    : [];

  const actions: string[] = [];
  if (targetRepo && options.initTarget) {
    actions.push(...initRepository(targetRepo, {
      profile: "universal",
      withRoles: false,
      withRules: false,
      withAutomations: false,
    }));
  }

  if (targetRepo) {
    const importDir = path.join(targetRepo, "docs/legacy-import");
    ensureDir(importDir);
    for (const docName of portableDocs) {
      copyFileSync(path.join(sourceDocsDir, docName), path.join(importDir, docName));
    }
    if (portableDocs.length > 0) {
      actions.push(`Copied ${portableDocs.length} legacy docs into ${importDir}`);
    }
    const docsIndex = renderDocsIndex(targetRepo, path.join(targetRepo, DEFAULT_DOCS_DIR));
    writeText(path.join(targetRepo, DEFAULT_DOCS_INDEX), `${docsIndex.content}\n`);
  }

  const report = [
    "# Legacy Repository Adoption Report",
    "",
    `Source: \`${sourceRepo}\``,
    "",
    "## Portable as-is or with light rewriting",
    "",
    `- Docs: ${portableDocs.length}`,
    `- Skills: ${portableSkills.length}`,
    `- Commands/prompts worth reviewing for skill conversion: ${portableCommands.length}`,
    "",
    "### Docs",
    ...(portableDocs.length > 0
      ? portableDocs.map((entry) => `- \`.meridian/docs/${entry}\``)
      : ["- None"]),
    "",
    "### Skills",
    ...(portableSkills.length > 0 ? portableSkills.map((entry) => `- \`${entry}\``) : ["- None"]),
    "",
    "## Replace with explicit Waypoint patterns",
    "",
    "- hook-based session injection -> AGENTS routing, context generation, repo-local skills, doctor/sync",
    "- hidden stop-hook policing -> advisory workflow skills and visible repo state",
    "- transcript learners -> maintenance skills and optional app automations",
    "- opaque reviewer plumbing -> optional Codex roles where actually useful",
    "",
    "## Legacy machinery to drop",
    "",
    `- Hook registration files: ${hookFiles.length}`,
    `- Hook/runtime scripts: ${scriptFiles.length}`,
    "",
    "### Hook/runtime files",
    ...((hookFiles.length + scriptFiles.length) > 0
      ? [...hookFiles, ...scriptFiles].map((entry) => `- \`${entry}\``)
      : ["- None"]),
    "",
    "## Agent files to reinterpret, not port literally",
    "",
    ...(agentFiles.length > 0 ? agentFiles.map((entry) => `- \`${entry}\``) : ["- None"]),
    "",
    "## Notes",
    "",
    "- The strongest reusable assets are methodology, docs patterns, and review/planning discipline.",
    "- The weakest portability surface is hook-dependent session machinery and transcript-coupled automation.",
    "",
  ].join("\n");

  if (targetRepo) {
    const reportPath = path.join(targetRepo, "WAYPOINT_MIGRATION.md");
    writeText(reportPath, report);
    actions.push(`Wrote migration report to ${reportPath}`);
  }

  return { report, actions };
}

function collectFiles(rootDir: string): string[] {
  const output: string[] = [];
  for (const entry of readdirSync(rootDir)) {
    const fullPath = path.join(rootDir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      output.push(...collectFiles(fullPath));
    } else {
      output.push(fullPath);
    }
  }
  return output;
}
