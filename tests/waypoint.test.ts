import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import assert from "node:assert/strict";

import { doctorRepository, importLegacyRepo, initRepository, syncRepository } from "../src/core.js";

let originalCodexHome: string | undefined;

beforeEach(() => {
  originalCodexHome = process.env.CODEX_HOME;
});

afterEach(() => {
  if (originalCodexHome === undefined) {
    delete process.env.CODEX_HOME;
  } else {
    process.env.CODEX_HOME = originalCodexHome;
  }
});

test("init scaffolds core files", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-init-"));
  initRepository(root, {
    profile: "universal",
    withRoles: false,
    withRules: false,
    withAutomations: false
  });

  assert.ok(readFileSync(path.join(root, "AGENTS.md"), "utf8").includes("<!-- waypoint:start -->"));
  assert.ok(readFileSync(path.join(root, "WORKSPACE.md"), "utf8").includes("## Active Goal"));
  assert.ok(readFileSync(path.join(root, "DOCS_INDEX.md"), "utf8").includes("## .waypoint/docs/"));
  assert.ok(readFileSync(path.join(root, ".waypoint/SOUL.md"), "utf8").includes("Waypoint Soul"));
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes("Session start")
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/scripts/prepare-context.mjs"), "utf8").includes("Prepared Waypoint context")
  );
  assert.ok(readFileSync(path.join(root, ".agents/skills/planning/SKILL.md"), "utf8").includes("# Planning"));
  assert.ok(readFileSync(path.join(root, ".agents/skills/error-audit/SKILL.md"), "utf8").includes("# Error Audit"));
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/observability-audit/SKILL.md"), "utf8").includes("# Observability Audit")
  );
  assert.ok(readFileSync(path.join(root, ".agents/skills/ux-states-audit/SKILL.md"), "utf8").includes("# UX States Audit"));
  assert.ok(readFileSync(path.join(root, ".waypoint/docs/README.md"), "utf8").includes("Waypoint-managed project memory"));
  assert.ok(
    readFileSync(path.join(root, ".waypoint/docs/code-guide.md"), "utf8").includes(
      "Compatibility is opt-in, not ambient"
    )
  );
});

test("doctor is clean after init", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-doctor-"));
  initRepository(root, {
    profile: "universal",
    withRoles: false,
    withRules: false,
    withAutomations: false
  });

  const findings = doctorRepository(root);
  assert.equal(findings.length, 0);
});

test("sync installs automation into CODEX_HOME", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-sync-"));
  const codexHome = mkdtempSync(path.join(os.tmpdir(), "waypoint-codex-home-"));
  process.env.CODEX_HOME = codexHome;

  initRepository(root, {
    profile: "universal",
    withRoles: false,
    withRules: false,
    withAutomations: true
  });

  writeFileSync(
    path.join(root, ".waypoint/automations/daily-brief.toml"),
    [
      'id = "daily-brief"',
      'name = "Daily brief"',
      'prompt = "Summarize recent project movement."',
      'rrule = "RRULE:FREQ=WEEKLY;BYHOUR=9;BYMINUTE=0;BYDAY=FR"',
      'execution_environment = "worktree"',
      "enabled = true"
    ].join("\n") + "\n",
    "utf8"
  );

  const result = syncRepository(root);
  assert.ok(result.some((item) => item.includes("daily-brief")));
  const installed = readFileSync(path.join(codexHome, "automations/daily-brief/automation.toml"), "utf8");
  assert.ok(installed.includes('id = "daily-brief"'));
  assert.ok(installed.includes('execution_environment = "worktree"'));
});

test("init with roles scaffolds optional codex role pack", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-roles-"));
  initRepository(root, {
    profile: "universal",
    withRoles: true,
    withRules: false,
    withAutomations: false
  });

  const codexConfig = readFileSync(path.join(root, ".codex/config.toml"), "utf8");
  assert.ok(codexConfig.includes('[agents."code-health-reviewer"]'));
  assert.ok(codexConfig.includes('[agents."code-reviewer"]'));
  assert.ok(codexConfig.includes('[agents."docs-researcher"]'));
  assert.ok(codexConfig.includes('[agents."plan-reviewer"]'));
  assert.ok(
    readFileSync(path.join(root, ".codex/agents/code-reviewer.toml"), "utf8").includes(".waypoint/agents/code-reviewer.md")
  );
  assert.ok(
    readFileSync(path.join(root, ".codex/agents/plan-reviewer.toml"), "utf8").includes(".waypoint/agents/plan-reviewer.md")
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agents/code-reviewer.md"), "utf8").includes("You are a code reviewer")
  );
});

test("import-legacy writes report and imported docs", () => {
  const source = mkdtempSync(path.join(os.tmpdir(), "waypoint-legacy-source-"));
  const target = mkdtempSync(path.join(os.tmpdir(), "waypoint-legacy-target-"));

  initRepository(target, {
    profile: "universal",
    withRoles: false,
    withRules: false,
    withAutomations: false
  });

  const sourceDocsDir = path.join(source, ".meridian/docs");
  const sourceSkillsDir = path.join(source, "skills/planning");
  const sourceHooksDir = path.join(source, "hooks");
  const sourceScriptsDir = path.join(source, "scripts");
  const sourceAgentsDir = path.join(source, "agents");

  mkdirp(sourceDocsDir);
  mkdirp(sourceSkillsDir);
  mkdirp(sourceHooksDir);
  mkdirp(sourceScriptsDir);
  mkdirp(sourceAgentsDir);

  writeFileSync(
    path.join(sourceDocsDir, "example.md"),
    "---\nsummary: Example doc\nread_when:\n  - example\n---\n\n# Example\n",
    "utf8"
  );
  writeFileSync(path.join(sourceSkillsDir, "SKILL.md"), "---\nname: planning\ndescription: test\n---\n", "utf8");
  writeFileSync(path.join(sourceHooksDir, "hooks.json"), "{}", "utf8");
  writeFileSync(path.join(sourceScriptsDir, "context.py"), "print('x')\n", "utf8");
  writeFileSync(path.join(sourceAgentsDir, "reviewer.md"), "---\nname: reviewer\n---\n", "utf8");

  const result = importLegacyRepo(source, target, { initTarget: false });
  writeFileSync(path.join(target, "WAYPOINT_MIGRATION.md"), result.report, "utf8");
  assert.ok(result.report.includes("Legacy Repository Adoption Report"));
});

function mkdirp(dirPath: string): void {
  mkdirSync(dirPath, { recursive: true });
}
