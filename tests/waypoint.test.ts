import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import assert from "node:assert/strict";

import { doctorRepository, initRepository, syncRepository } from "../src/core.js";

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
    profile: "universal"
  });

  assert.ok(readFileSync(path.join(root, "AGENTS.md"), "utf8").includes("<!-- waypoint:start -->"));
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "If you need repo-specific AGENTS instructions, write them outside this managed block."
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "Before making meaningful implementation, review, architectural, or tradeoff decisions, inspect the project root guidance files for persisted project context."
    )
  );
  assert.ok(readFileSync(path.join(root, "AGENTS.md"), "utf8").includes("at the start of a new session"));
  assert.ok(readFileSync(path.join(root, "AGENTS.md"), "utf8").includes("Do not rerun it mid-conversation"));
  assert.ok(readFileSync(path.join(root, ".waypoint/WORKSPACE.md"), "utf8").includes("## Active Goal"));
  assert.ok(readFileSync(path.join(root, ".waypoint/WORKSPACE.md"), "utf8").includes("## Active Trackers"));
  assert.ok(readFileSync(path.join(root, ".waypoint/WORKSPACE.md"), "utf8").includes("Timestamp discipline:"));
  assert.ok(readFileSync(path.join(root, ".waypoint/DOCS_INDEX.md"), "utf8").includes("## .waypoint/docs/"));
  assert.ok(readFileSync(path.join(root, ".waypoint/TRACKS_INDEX.md"), "utf8").includes("## .waypoint/track/"));
  assert.equal(readFileSync(path.join(root, ".waypoint/config.toml"), "utf8").includes("automations"), false);
  assert.equal(readFileSync(path.join(root, ".waypoint/config.toml"), "utf8").includes("rules"), false);
  assert.ok(readFileSync(path.join(root, ".codex/config.toml"), "utf8").includes('[agents."code-reviewer"]'));
  assert.equal(existsSync(path.join(root, "WORKSPACE.md")), false);
  assert.equal(existsSync(path.join(root, "DOCS_INDEX.md")), false);
  assert.ok(readFileSync(path.join(root, ".waypoint/SOUL.md"), "utf8").includes("Waypoint Soul"));
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes("Session start")
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes(
      "Do not rerun it mid-conversation just because a task becomes more substantial."
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes(
      "write it outside the managed `waypoint:start/end` block in `AGENTS.md`"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes(
      "Run `code-reviewer` before considering any non-trivial implementation slice complete."
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/scripts/prepare-context.mjs"), "utf8").includes("RECENT_THREAD.md")
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/scripts/build-track-index.mjs"), "utf8").includes("TRACKS_INDEX.md")
  );
  assert.ok(readFileSync(path.join(root, ".agents/skills/planning/SKILL.md"), "utf8").includes("# Planning"));
  assert.ok(readFileSync(path.join(root, ".agents/skills/work-tracker/SKILL.md"), "utf8").includes("# Work Tracker"));
  assert.ok(readFileSync(path.join(root, ".agents/skills/docs-sync/SKILL.md"), "utf8").includes("# Docs Sync"));
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/backend-ship-audit/SKILL.md"), "utf8").includes(
      "# Backend ship audit"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/backend-context-interview/SKILL.md"), "utf8").includes(
      "# Backend Context Interview"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/frontend-ship-audit/SKILL.md"), "utf8").includes(
      "Audit ship-readiness like a strong frontend reviewer."
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/frontend-context-interview/SKILL.md"), "utf8").includes(
      "# Frontend Context Interview"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/code-guide-audit/SKILL.md"), "utf8").includes("# Code Guide Audit")
  );
  assert.ok(readFileSync(path.join(root, ".agents/skills/break-it-qa/SKILL.md"), "utf8").includes("# Break-It QA"));
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/workspace-compress/SKILL.md"), "utf8").includes("# Workspace Compress")
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/pre-pr-hygiene/SKILL.md"), "utf8").includes("# Pre-PR Hygiene")
  );
  assert.ok(readFileSync(path.join(root, ".agents/skills/pr-review/SKILL.md"), "utf8").includes("# PR Review"));
  assert.equal(existsSync(path.join(root, ".agents/skills/error-audit")), false);
  assert.equal(existsSync(path.join(root, ".agents/skills/observability-audit")), false);
  assert.equal(existsSync(path.join(root, ".agents/skills/ux-states-audit")), false);
  assert.ok(readFileSync(path.join(root, ".waypoint/docs/README.md"), "utf8").includes("Waypoint-managed project memory"));
  assert.ok(readFileSync(path.join(root, ".waypoint/track/README.md"), "utf8").includes("active execution trackers"));
  assert.ok(readFileSync(path.join(root, ".waypoint/track/_template.md"), "utf8").includes("## Workstreams"));
  assert.ok(
    readFileSync(path.join(root, ".waypoint/docs/code-guide.md"), "utf8").includes(
      "Compatibility is opt-in, not ambient"
    )
  );
});

test("doctor is clean after init", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-doctor-"));
  initRepository(root, {
    profile: "universal"
  });

  const findings = doctorRepository(root);
  assert.equal(findings.length, 0);
});

test("init removes retired audit skill directories on refresh", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-retired-audit-skills-"));
  initRepository(root, {
    profile: "universal"
  });

  mkdirSync(path.join(root, ".agents/skills/error-audit"), { recursive: true });
  writeFileSync(path.join(root, ".agents/skills/error-audit/SKILL.md"), "# Error Audit\n", "utf8");
  mkdirSync(path.join(root, ".agents/skills/observability-audit"), { recursive: true });
  writeFileSync(path.join(root, ".agents/skills/observability-audit/SKILL.md"), "# Observability Audit\n", "utf8");
  mkdirSync(path.join(root, ".agents/skills/ux-states-audit"), { recursive: true });
  writeFileSync(path.join(root, ".agents/skills/ux-states-audit/SKILL.md"), "# UX States Audit\n", "utf8");

  initRepository(root, {
    profile: "universal"
  });

  assert.equal(existsSync(path.join(root, ".agents/skills/error-audit")), false);
  assert.equal(existsSync(path.join(root, ".agents/skills/observability-audit")), false);
  assert.equal(existsSync(path.join(root, ".agents/skills/ux-states-audit")), false);
  assert.equal(existsSync(path.join(root, ".agents/skills/planning/SKILL.md")), true);
  assert.equal(existsSync(path.join(root, ".agents/skills/pr-review/SKILL.md")), true);
});

test("doctor warns when workspace entries are not timestamped", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-workspace-timestamps-"));
  initRepository(root, {
    profile: "universal"
  });

  writeFileSync(
    path.join(root, ".waypoint/WORKSPACE.md"),
    [
      "# Workspace",
      "",
      "Timestamp discipline: Prefix new or materially revised bullets in `Current State`, `In Progress`, `Next`, `Parked`, and `Done Recently` with `[YYYY-MM-DD HH:MM TZ]`.",
      "",
      "## Active Goal",
      "",
      "Ship something useful.",
      "",
      "## Active Trackers",
      "",
      "## Current State",
      "",
      "- Missing timestamp here.",
      "",
      "## In Progress",
      "",
      "## Next",
      "",
      "- [2026-03-06 20:10 PST] Run verification.",
      "",
      "## Parked",
      "",
      "## Done Recently",
      "",
      "- [2026-03-06 20:09 PST] Added the new rule.",
      ""
    ].join("\n"),
    "utf8"
  );

  const findings = doctorRepository(root);
  assert.ok(
    findings.some(
      (finding) =>
        finding.category === "workspace" &&
        finding.message.includes("untimestamped entries") &&
        finding.message.includes("## Current State")
    )
  );
});

test("init preserves AGENTS content outside the managed block", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-agents-preserve-"));
  initRepository(root, {
    profile: "universal"
  });

  writeFileSync(
    path.join(root, "AGENTS.md"),
    [
      "# Repo Guidance",
      "",
      "This text should survive upgrades.",
      "",
      readFileSync(path.join(root, "AGENTS.md"), "utf8"),
    ].join("\n"),
    "utf8"
  );

  initRepository(root, {
    profile: "universal"
  });

  const agents = readFileSync(path.join(root, "AGENTS.md"), "utf8");
  assert.ok(agents.includes("This text should survive upgrades."));
  assert.ok(agents.includes("<!-- waypoint:start -->"));
});

test("sync rebuilds docs and tracks indexes only", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-sync-"));

  initRepository(root, {
    profile: "universal"
  });

  writeFileSync(path.join(root, ".waypoint/DOCS_INDEX.md"), "stale docs index\n", "utf8");
  writeFileSync(path.join(root, ".waypoint/TRACKS_INDEX.md"), "stale tracks index\n", "utf8");

  const result = syncRepository(root);
  assert.deepEqual(result, ["Rebuilt .waypoint/DOCS_INDEX.md", "Rebuilt .waypoint/TRACKS_INDEX.md"]);
  assert.ok(readFileSync(path.join(root, ".waypoint/DOCS_INDEX.md"), "utf8").includes("## .waypoint/docs/"));
  assert.ok(readFileSync(path.join(root, ".waypoint/TRACKS_INDEX.md"), "utf8").includes("## .waypoint/track/"));
  assert.equal(existsSync(path.join(root, ".waypoint/automations")), false);
  assert.equal(existsSync(path.join(root, ".waypoint/rules")), false);
});

test("init scaffolds reviewer agent pack by default", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-roles-"));
  initRepository(root, {
    profile: "universal"
  });

  const codexConfig = readFileSync(path.join(root, ".codex/config.toml"), "utf8");
  assert.ok(codexConfig.includes("[features]"));
  assert.ok(codexConfig.includes("multi_agent = true"));
  assert.ok(codexConfig.includes("max_threads = 24"));
  assert.ok(codexConfig.includes('[agents."code-health-reviewer"]'));
  assert.ok(codexConfig.includes('[agents."code-reviewer"]'));
  assert.ok(codexConfig.includes('[agents."plan-reviewer"]'));
  assert.ok(
    readFileSync(path.join(root, ".codex/agents/code-reviewer.toml"), "utf8").includes("You are a code reviewer.")
  );
  assert.ok(
    readFileSync(path.join(root, ".codex/agents/code-reviewer.toml"), "utf8").includes(".waypoint/WORKSPACE.md")
  );
  assert.ok(
    readFileSync(path.join(root, ".codex/agents/code-health-reviewer.toml"), "utf8").includes(".waypoint/WORKSPACE.md")
  );
  assert.ok(
    readFileSync(path.join(root, ".codex/agents/plan-reviewer.toml"), "utf8").includes(
      "You are an elite Plan Review Architect."
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".codex/agents/plan-reviewer.toml"), "utf8").includes(".waypoint/WORKSPACE.md")
  );
  assert.equal(existsSync(path.join(root, ".waypoint/agents/code-reviewer.md")), false);
});

test("prepare-context writes merged recent thread with redaction", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-context-"));
  const codexHome = mkdtempSync(path.join(os.tmpdir(), "waypoint-codex-home-"));
  process.env.CODEX_HOME = codexHome;

  initRepository(root, {
    profile: "universal"
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
    },
    {
      type: "compacted",
      payload: { message: "", replacement_history: [] }
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

test("prepare-context includes active trackers in generated context", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-active-trackers-"));
  const codexHome = mkdtempSync(path.join(os.tmpdir(), "waypoint-codex-home-"));
  process.env.CODEX_HOME = codexHome;

  initRepository(root, {
    profile: "universal"
  });

  writeFileSync(
    path.join(root, ".waypoint/track/backend-hardening.md"),
    [
      "---",
      "summary: Close the backend hardening fix campaign",
      'last_updated: "2026-03-13 11:38 PDT"',
      "status: active",
      "read_when:",
      "  - resuming backend hardening",
      "---",
      "",
      "# Backend Hardening",
      "",
      "## Goal",
      "",
      "Ship the hardening fixes.",
      ""
    ].join("\n"),
    "utf8"
  );

  execFileSync("node", [path.join(root, ".waypoint/scripts/prepare-context.mjs")], {
    cwd: root,
    env: { ...process.env, CODEX_HOME: codexHome },
    stdio: "pipe"
  });

  const tracksIndex = readFileSync(path.join(root, ".waypoint/TRACKS_INDEX.md"), "utf8");
  const activeTrackers = readFileSync(path.join(root, ".waypoint/context/ACTIVE_TRACKERS.md"), "utf8");
  const manifest = readFileSync(path.join(root, ".waypoint/context/MANIFEST.md"), "utf8");

  assert.ok(tracksIndex.includes(".waypoint/track/backend-hardening.md"));
  assert.ok(activeTrackers.includes(".waypoint/track/backend-hardening.md"));
  assert.ok(manifest.includes(".waypoint/TRACKS_INDEX.md"));
  assert.ok(manifest.includes(".waypoint/context/ACTIVE_TRACKERS.md"));
  assert.ok(manifest.includes(".waypoint/track/backend-hardening.md"));
});

test("prepare-context prefers turns before the last compaction", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-compaction-"));
  const codexHome = mkdtempSync(path.join(os.tmpdir(), "waypoint-codex-home-"));
  process.env.CODEX_HOME = codexHome;

  initRepository(root, {
    profile: "universal"
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

test("prepare-context does not inject current thread when no compaction exists", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-no-compaction-"));
  const codexHome = mkdtempSync(path.join(os.tmpdir(), "waypoint-codex-home-"));
  process.env.CODEX_HOME = codexHome;

  initRepository(root, {
    profile: "universal"
  });

  const sessionDir = path.join(codexHome, "sessions/2026/03/06");
  mkdirp(sessionDir);
  const sessionPath = path.join(sessionDir, "waypoint-no-compaction-session.jsonl");
  const sessionLines = [
    {
      type: "session_meta",
      payload: { cwd: root }
    },
    {
      type: "response_item",
      timestamp: "2026-03-06T05:00:00.000Z",
      payload: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text: "This is still the current conversation.\n" }]
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
  assert.ok(recentThread.includes("No compaction was found"));
  assert.ok(!recentThread.includes("This is still the current conversation."));
});

test("prepare-context can target an explicit thread id", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-thread-id-"));
  const codexHome = mkdtempSync(path.join(os.tmpdir(), "waypoint-codex-home-"));
  process.env.CODEX_HOME = codexHome;

  initRepository(root, {
    profile: "universal"
  });

  const sessionDir = path.join(codexHome, "sessions/2026/03/06");
  mkdirp(sessionDir);

  const targetedThreadId = "session-targeted-123";
  writeFileSync(
    path.join(sessionDir, "targeted-session.jsonl"),
    [
      JSON.stringify({
        type: "session_meta",
        payload: { id: targetedThreadId, cwd: root, timestamp: "2026-03-06T22:44:58.467Z" }
      }),
      JSON.stringify({
        type: "response_item",
        timestamp: "2026-03-06T22:45:00.000Z",
        payload: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: "Targeted session message.\n" }]
        }
      }),
      JSON.stringify({ type: "compacted", payload: { message: "", replacement_history: [] } })
    ].join("\n") + "\n",
    "utf8"
  );

  writeFileSync(
    path.join(sessionDir, "newer-session.jsonl"),
    [
      JSON.stringify({
        type: "session_meta",
        payload: { id: "session-newer-456", cwd: root, timestamp: "2026-03-06T23:55:07.825Z" }
      }),
      JSON.stringify({
        type: "response_item",
        timestamp: "2026-03-06T23:55:10.000Z",
        payload: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: "Newer session should not win when override is set.\n" }]
        }
      })
    ].join("\n") + "\n",
    "utf8"
  );

  execFileSync("node", [path.join(root, ".waypoint/scripts/prepare-context.mjs"), "--thread-id", targetedThreadId], {
    cwd: root,
    env: { ...process.env, CODEX_HOME: codexHome },
    stdio: "pipe"
  });

  const recentThread = readFileSync(path.join(root, ".waypoint/context/RECENT_THREAD.md"), "utf8");
  assert.ok(recentThread.includes("targeted-session.jsonl"));
  assert.ok(recentThread.includes("Compactions in source session: 1"));
  assert.ok(!recentThread.includes("newer-session.jsonl"));
});

test("prepare-context skips stale sessions whose cwd no longer exists", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-stale-session-"));
  const codexHome = mkdtempSync(path.join(os.tmpdir(), "waypoint-codex-home-"));
  process.env.CODEX_HOME = codexHome;

  initRepository(root, {
    profile: "universal"
  });

  const sessionDir = path.join(codexHome, "sessions/2026/03/06");
  mkdirp(sessionDir);

  writeFileSync(
    path.join(sessionDir, "stale-session.jsonl"),
    [
      JSON.stringify({ type: "session_meta", payload: { cwd: "/Users/mark/code/atg/olympus-transfer-prod-data" } }),
      JSON.stringify({
        type: "response_item",
        payload: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: "Old session that should be ignored.\n" }]
        }
      })
    ].join("\n") + "\n",
    "utf8"
  );

  writeFileSync(
    path.join(sessionDir, "valid-session.jsonl"),
    [
      JSON.stringify({ type: "session_meta", payload: { cwd: root } }),
      JSON.stringify({
        type: "response_item",
        timestamp: "2026-03-06T05:00:00.000Z",
        payload: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: "Real current session.\n" }]
        }
      }),
      JSON.stringify({ type: "compacted", payload: { message: "", replacement_history: [] } })
    ].join("\n") + "\n",
    "utf8"
  );

  execFileSync("node", [path.join(root, ".waypoint/scripts/prepare-context.mjs")], {
    cwd: root,
    env: { ...process.env, CODEX_HOME: codexHome },
    stdio: "pipe"
  });

  const recentThread = readFileSync(path.join(root, ".waypoint/context/RECENT_THREAD.md"), "utf8");
  assert.ok(recentThread.includes("Real current session."));
  assert.ok(!recentThread.includes("Old session that should be ignored."));
});

test("prepare-context captures repo state for commits and changes without extra context files", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-repo-state-"));
  const codexHome = mkdtempSync(path.join(os.tmpdir(), "waypoint-codex-home-"));
  process.env.CODEX_HOME = codexHome;

  initRepository(root, {
    profile: "universal"
  });

  execFileSync("git", ["init"], { cwd: root, stdio: "pipe" });
  execFileSync("git", ["config", "user.name", "Waypoint Test"], { cwd: root, stdio: "pipe" });
  execFileSync("git", ["config", "user.email", "waypoint@example.com"], { cwd: root, stdio: "pipe" });
  writeFileSync(path.join(root, "README.md"), "# Temp Repo\n", "utf8");
  execFileSync("git", ["add", "README.md"], { cwd: root, stdio: "pipe" });
  execFileSync("git", ["commit", "-m", "Initial commit"], { cwd: root, stdio: "pipe" });
  writeFileSync(path.join(root, "scratch.txt"), "local change\n", "utf8");

  execFileSync("node", [path.join(root, ".waypoint/scripts/prepare-context.mjs")], {
    cwd: root,
    env: { ...process.env, CODEX_HOME: codexHome },
    stdio: "pipe"
  });

  const changes = readFileSync(path.join(root, ".waypoint/context/UNCOMMITTED_CHANGES.md"), "utf8");
  const commits = readFileSync(path.join(root, ".waypoint/context/RECENT_COMMITS.md"), "utf8");
  const manifest = readFileSync(path.join(root, ".waypoint/context/MANIFEST.md"), "utf8");

  assert.ok(changes.includes("scratch.txt"));
  assert.ok(commits.includes("Initial commit"));
  assert.ok(manifest.includes("## Context Snapshot"));
  assert.ok(manifest.includes("Local timezone:"));
  assert.ok(manifest.includes("Current local datetime:"));
  assert.equal(existsSync(path.join(root, ".waypoint/context/CURRENT_DATETIME.md")), false);
  assert.equal(existsSync(path.join(root, ".waypoint/context/NESTED_REPOS.md")), false);
});

test("prepare-context explains PR context using gh output", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-pr-context-"));
  const codexHome = mkdtempSync(path.join(os.tmpdir(), "waypoint-codex-home-"));
  const fakeBin = mkdtempSync(path.join(os.tmpdir(), "waypoint-fake-bin-"));
  process.env.CODEX_HOME = codexHome;

  initRepository(root, {
    profile: "universal"
  });

  execFileSync("git", ["init"], { cwd: root, stdio: "pipe" });
  execFileSync("git", ["config", "user.name", "Waypoint Test"], { cwd: root, stdio: "pipe" });
  execFileSync("git", ["config", "user.email", "waypoint@example.com"], { cwd: root, stdio: "pipe" });
  writeFileSync(path.join(root, "README.md"), "# Temp Repo\n", "utf8");
  execFileSync("git", ["add", "README.md"], { cwd: root, stdio: "pipe" });
  execFileSync("git", ["commit", "-m", "Initial commit"], { cwd: root, stdio: "pipe" });

  const ghPath = path.join(fakeBin, "gh");
  writeFileSync(
    ghPath,
    [
      "#!/usr/bin/env node",
      "const args = process.argv.slice(2);",
      "if (args[0] === 'repo' && args[1] === 'view') {",
      "  process.stdout.write('markmdev/waypoint-test');",
      "  process.exit(0);",
      "}",
      "if (args[0] === 'api' && args[1] === 'user') {",
      "  process.stdout.write('markmdev');",
      "  process.exit(0);",
      "}",
      "if (args[0] === 'pr' && args[1] === 'list') {",
      "  const stateIndex = args.indexOf('--state');",
      "  const state = stateIndex >= 0 ? args[stateIndex + 1] : '';",
      "  if (state === 'open') {",
      "    process.stdout.write('#12 Fix transfer bug (markmdev) [codex/fix-transfer]\\n');",
      "  } else if (state === 'merged') {",
      "    process.stdout.write('#11 Ship continuity fixes (markmdev) merged 2 days ago\\n');",
      "  }",
      "  process.exit(0);",
      "}",
      "process.exit(1);",
    ].join("\n"),
    "utf8"
  );
  chmodSync(ghPath, 0o755);

  execFileSync("node", [path.join(root, ".waypoint/scripts/prepare-context.mjs")], {
    cwd: root,
    env: {
      ...process.env,
      CODEX_HOME: codexHome,
      PATH: `${fakeBin}${path.delimiter}${process.env.PATH ?? ""}`,
    },
    stdio: "pipe"
  });

  const prs = readFileSync(path.join(root, ".waypoint/context/PULL_REQUESTS.md"), "utf8");
  assert.ok(prs.includes("GitHub viewer: markmdev"));
  assert.ok(prs.includes("GitHub repo: markmdev/waypoint-test"));
  assert.ok(prs.includes("#12 Fix transfer bug"));
  assert.ok(prs.includes("#11 Ship continuity fixes"));
});

test("built cli can read package version", () => {
  const repoRoot = path.resolve(process.cwd());
  const distCli = path.join(repoRoot, "dist/src/cli.js");
  const expectedVersion = JSON.parse(readFileSync(path.join(repoRoot, "package.json"), "utf8")).version as string;
  const actualVersion = execFileSync("node", [distCli, "--version"], {
    cwd: repoRoot,
    encoding: "utf8"
  }).trim();

  assert.equal(actualVersion, expectedVersion);
});

function mkdirp(dirPath: string): void {
  mkdirSync(dirPath, { recursive: true });
}
