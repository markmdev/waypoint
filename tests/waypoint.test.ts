import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
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
  assert.ok(readFileSync(path.join(root, ".waypoint/WORKSPACE.md"), "utf8").includes("## Active Goal"));
  assert.ok(readFileSync(path.join(root, ".waypoint/DOCS_INDEX.md"), "utf8").includes("## .waypoint/docs/"));
  assert.equal(existsSync(path.join(root, "WORKSPACE.md")), false);
  assert.equal(existsSync(path.join(root, "DOCS_INDEX.md")), false);
  assert.ok(readFileSync(path.join(root, ".waypoint/SOUL.md"), "utf8").includes("Waypoint Soul"));
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes("Session start")
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/scripts/prepare-context.mjs"), "utf8").includes("RECENT_THREAD.md")
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

test("prepare-context writes merged recent thread with redaction", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-context-"));
  const codexHome = mkdtempSync(path.join(os.tmpdir(), "waypoint-codex-home-"));
  process.env.CODEX_HOME = codexHome;

  initRepository(root, {
    profile: "universal",
    withRoles: false,
    withRules: false,
    withAutomations: false
  });

  const sessionDir = path.join(codexHome, "sessions/2026/03/06");
  mkdirp(sessionDir);
  const sessionPath = path.join(sessionDir, "waypoint-test-session.jsonl");
  const sessionLines = [
    {
      type: "session_meta",
      payload: { cwd: root }
    },
    {
      type: "response_item",
      payload: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text: `# AGENTS.md instructions for ${root}\n` }]
      }
    },
    {
      type: "response_item",
      timestamp: "2026-03-06T05:00:00.000Z",
      payload: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text: "Please release Waypoint.\n" }]
      }
    },
    {
      type: "response_item",
      timestamp: "2026-03-06T05:00:01.000Z",
      payload: {
        type: "message",
        role: "assistant",
        phase: "commentary",
        content: [{ type: "output_text", text: "I’m validating the package first.\n" }]
      }
    },
    {
      type: "response_item",
      timestamp: "2026-03-06T05:00:02.000Z",
      payload: {
        type: "message",
        role: "assistant",
        phase: "final_answer",
        content: [{ type: "output_text", text: "Published successfully.\n" }]
      }
    },
    {
      type: "response_item",
      timestamp: "2026-03-06T05:00:03.000Z",
      payload: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text: "Here is a token: npm_ABC123SECRET\n" }]
      }
    }
  ];
  writeFileSync(sessionPath, `${sessionLines.map((line) => JSON.stringify(line)).join("\n")}\n`, "utf8");

  execFileSync("node", [path.join(root, ".waypoint/scripts/prepare-context.mjs")], {
    cwd: root,
    env: { ...process.env, CODEX_HOME: codexHome },
    stdio: "pipe"
  });

  const recentThread = readFileSync(path.join(root, ".waypoint/context/RECENT_THREAD.md"), "utf8");
  const manifest = readFileSync(path.join(root, ".waypoint/context/MANIFEST.md"), "utf8");

  assert.ok(recentThread.includes("Assistant (merged 2 messages)"));
  assert.ok(recentThread.includes("I’m validating the package first."));
  assert.ok(recentThread.includes("Published successfully."));
  assert.ok(recentThread.includes("[REDACTED]"));
  assert.ok(!recentThread.includes("npm_ABC123SECRET"));
  assert.ok(manifest.includes(".waypoint/context/RECENT_THREAD.md"));
  assert.ok(manifest.includes("latest meaningful turns"));
});

test("prepare-context prefers turns before the last compaction", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-compaction-"));
  const codexHome = mkdtempSync(path.join(os.tmpdir(), "waypoint-codex-home-"));
  process.env.CODEX_HOME = codexHome;

  initRepository(root, {
    profile: "universal",
    withRoles: false,
    withRules: false,
    withAutomations: false
  });

  const sessionDir = path.join(codexHome, "sessions/2026/03/06");
  mkdirp(sessionDir);
  const sessionPath = path.join(sessionDir, "waypoint-compacted-session.jsonl");
  const sessionLines = [
    {
      type: "session_meta",
      payload: { cwd: root }
    },
    {
      type: "response_item",
      timestamp: "2026-03-06T04:59:58.000Z",
      payload: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text: "Discuss the release.\n" }]
      }
    },
    {
      type: "response_item",
      timestamp: "2026-03-06T04:59:59.000Z",
      payload: {
        type: "message",
        role: "assistant",
        phase: "commentary",
        content: [{ type: "output_text", text: "I’m preparing the release.\n" }]
      }
    },
    {
      type: "response_item",
      timestamp: "2026-03-06T05:00:00.000Z",
      payload: {
        type: "message",
        role: "assistant",
        phase: "final_answer",
        content: [{ type: "output_text", text: "Release plan is ready.\n" }]
      }
    },
    {
      type: "compacted",
      payload: { message: "", replacement_history: [] }
    },
    {
      type: "response_item",
      timestamp: "2026-03-06T05:00:01.000Z",
      payload: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text: "This is after compaction.\n" }]
      }
    },
    {
      type: "response_item",
      timestamp: "2026-03-06T05:00:02.000Z",
      payload: {
        type: "message",
        role: "assistant",
        phase: "final_answer",
        content: [{ type: "output_text", text: "This should not be in recent thread.\n" }]
      }
    }
  ];
  writeFileSync(sessionPath, `${sessionLines.map((line) => JSON.stringify(line)).join("\n")}\n`, "utf8");

  execFileSync("node", [path.join(root, ".waypoint/scripts/prepare-context.mjs")], {
    cwd: root,
    env: { ...process.env, CODEX_HOME: codexHome },
    stdio: "pipe"
  });

  const recentThread = readFileSync(path.join(root, ".waypoint/context/RECENT_THREAD.md"), "utf8");
  assert.ok(recentThread.includes("take the 25 meaningful turns immediately before the last compaction"));
  assert.ok(recentThread.includes("I’m preparing the release."));
  assert.ok(recentThread.includes("Release plan is ready."));
  assert.ok(!recentThread.includes("This should not be in recent thread."));
  assert.ok(!recentThread.includes("This is after compaction."));
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
  writeFileSync(path.join(target, ".waypoint/IMPORT_LEGACY.md"), result.report, "utf8");
  assert.ok(result.report.includes("Legacy Repository Adoption Report"));
  assert.ok(existsSync(path.join(target, ".waypoint/IMPORT_LEGACY.md")));
  assert.ok(existsSync(path.join(target, ".waypoint/docs/legacy-import/example.md")));
});

function mkdirp(dirPath: string): void {
  mkdirSync(dirPath, { recursive: true });
}
