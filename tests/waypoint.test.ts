import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import assert from "node:assert/strict";

import { doctorRepository, initRepository, syncRepository } from "../src/core.js";

let originalCodexHome: string | undefined;
let originalPiAgentHome: string | undefined;

beforeEach(() => {
  originalCodexHome = process.env.CODEX_HOME;
  originalPiAgentHome = process.env.PI_AGENT_HOME;
});

afterEach(() => {
  if (originalCodexHome === undefined) {
    delete process.env.CODEX_HOME;
  } else {
    process.env.CODEX_HOME = originalCodexHome;
  }

  if (originalPiAgentHome === undefined) {
    delete process.env.PI_AGENT_HOME;
  } else {
    process.env.PI_AGENT_HOME = originalPiAgentHome;
  }
});

test("init scaffolds core files", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-init-"));
  initRepository(root, {
    profile: "universal"
  });

  const gitignore = readFileSync(path.join(root, ".gitignore"), "utf8");

  assert.equal(existsSync(path.join(root, "AGENTS.md")), true);
  assert.equal(existsSync(path.join(root, ".agents/skills/planning/SKILL.md")), true);
  assert.equal(existsSync(path.join(root, ".agents/skills/foundational-redesign/SKILL.md")), true);
  assert.equal(existsSync(path.join(root, ".agents/skills/verify-completeness/SKILL.md")), true);
  assert.equal(existsSync(path.join(root, ".agents/skills/code-guide-audit/SKILL.md")), true);
  assert.equal(existsSync(path.join(root, ".waypoint/docs/code-guide.md")), true);

  assert.ok(readFileSync(path.join(root, ".waypoint/WORKSPACE.md"), "utf8").includes("## Active Plans"));
  assert.ok(readFileSync(path.join(root, ".waypoint/ACTIVE_PLANS.md"), "utf8").includes("# Active Plans"));

  assert.ok(gitignore.includes(".agents/skills/verify-completeness/"));
  assert.ok(gitignore.includes(".waypoint/ACTIVE_PLANS.md"));
  assert.ok(readFileSync(path.join(root, ".waypoint/DOCS_INDEX.md"), "utf8").includes("## .waypoint/docs/"));
  assert.ok(!existsSync(path.join(root, ".waypoint/TRACKS_INDEX.md")));
  assert.ok(readFileSync(path.join(root, ".waypoint/scripts/prepare-context.mjs"), "utf8").includes("SNAPSHOT.md"));
  assert.ok(readFileSync(path.join(root, ".codex/config.toml"), "utf8").includes('[agents."code-reviewer"]'));
  assert.equal(existsSync(path.join(root, "WORKSPACE.md")), false);
  assert.equal(existsSync(path.join(root, "ACTIVE_PLANS.md")), false);
  assert.equal(existsSync(path.join(root, "DOCS_INDEX.md")), false);
});

test("doctor is clean after init", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-doctor-"));
  initRepository(root, {
    profile: "universal"
  });

  const findings = doctorRepository(root);
  assert.equal(findings.length, 0);
});

test("init removes legacy root MEMORY.md", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-memory-migrate-"));
  writeFileSync(path.join(root, "MEMORY.md"), "# Legacy Memory\n", "utf8");

  initRepository(root, {
    profile: "universal"
  });

  assert.equal(existsSync(path.join(root, "MEMORY.md")), false);
  assert.equal(existsSync(path.join(root, ".waypoint/MEMORY.md")), false);
});

test("doctor flags missing adversarial-review skill", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-doctor-missing-adversarial-review-"));
  initRepository(root, {
    profile: "universal"
  });

  rmSync(path.join(root, ".agents/skills/adversarial-review"), { recursive: true, force: true });

  const findings = doctorRepository(root);
  assert.ok(
    findings.some(
      (finding) =>
        finding.category === "skills" && finding.message.includes("Repo skill `adversarial-review` is missing.")
    )
  );
  assert.equal(
    findings.filter((finding) => finding.message.includes("Repo skill `adversarial-review`")).length,
    1
  );
});

test("doctor flags missing adversarial-review skill metadata", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-doctor-missing-adversarial-review-metadata-"));
  initRepository(root, {
    profile: "universal"
  });

  rmSync(path.join(root, ".agents/skills/adversarial-review/agents/openai.yaml"), { force: true });

  const findings = doctorRepository(root);
  assert.ok(
    findings.some(
      (finding) =>
        finding.category === "skills" && finding.message.includes("Repo skill `adversarial-review` metadata is missing.")
    )
  );
});

test("doctor flags missing plans directory", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-doctor-missing-plans-"));
  initRepository(root, {
    profile: "universal"
  });

  rmSync(path.join(root, ".waypoint/plans"), { recursive: true, force: true });

  const findings = doctorRepository(root);
  assert.ok(
    findings.some(
      (finding) => finding.category === "docs" && finding.message.includes(".waypoint/plans/ directory is missing.")
    )
  );
});

test("doctor flags missing built-in ship-audit skill", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-doctor-missing-ship-audit-skill-"));
  initRepository(root, {
    profile: "universal"
  });

  rmSync(path.join(root, ".agents/skills/frontend-ship-audit"), { recursive: true, force: true });

  const findings = doctorRepository(root);
  assert.ok(
    findings.some(
      (finding) =>
        finding.category === "skills" && finding.message.includes("Repo skill `frontend-ship-audit` is missing.")
    )
  );
});

test("init adds missing gitignore lines without duplicating the full waypoint block", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-gitignore-merge-"));
  initRepository(root, {
    profile: "universal"
  });

  const gitignorePath = path.join(root, ".gitignore");
  const oldSnippet = [
    "# Waypoint state",
    ".codex/config.toml",
    ".codex/agents/code-reviewer.toml",
    ".codex/agents/code-health-reviewer.toml",
    ".codex/agents/plan-reviewer.toml",
    ".agents/skills/planning/",
    ".agents/skills/work-tracker/",
    ".agents/skills/docs-sync/",
    ".agents/skills/code-guide-audit/",
    ".agents/skills/break-it-qa/",
    ".agents/skills/frontend-context-interview/",
    ".agents/skills/backend-context-interview/",
    ".agents/skills/frontend-ship-audit/",
    ".agents/skills/backend-ship-audit/",
    ".agents/skills/conversation-retrospective/",
    ".agents/skills/merge-ready-owner/",
    ".agents/skills/workspace-compress/",
    ".agents/skills/pre-pr-hygiene/",
    ".agents/skills/pr-review/",
    ".waypoint/config.toml",
    ".waypoint/README.md",
    ".waypoint/SOUL.md",
    ".waypoint/WORKSPACE.md",
    ".waypoint/ACTIVE_PLANS.md",
    ".waypoint/agent-operating-manual.md",
    ".waypoint/DOCS_INDEX.md",
    ".waypoint/TRACKS_INDEX.md",
    ".waypoint/context/",
    ".waypoint/scripts/",
    ".waypoint/state/",
    ".waypoint/track/",
    ".waypoint/docs/README.md",
    ".waypoint/docs/code-guide.md",
  ].join("\r\n");
  writeFileSync(gitignorePath, oldSnippet, "utf8");

  initRepository(root, {
    profile: "universal"
  });

  const gitignore = readFileSync(gitignorePath, "utf8").replace(/\r\n/g, "\n");
  assert.equal(gitignore.match(/^# Waypoint state$/gm)?.length ?? 0, 1);
  assert.equal(gitignore.match(/^# End Waypoint state$/gm)?.length ?? 0, 1);
  assert.equal(gitignore.match(/^\.agents\/skills\/adversarial-review\/$/gm)?.length ?? 0, 1);
});

test("init restores the waypoint gitignore block in snippet order", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-gitignore-order-"));
  initRepository(root, {
    profile: "universal"
  });

  const gitignorePath = path.join(root, ".gitignore");
  writeFileSync(
    gitignorePath,
    [
      "# Waypoint state",
      ".codex/config.toml",
      ".codex/agents/code-reviewer.toml",
      ".codex/agents/code-health-reviewer.toml",
      ".codex/agents/plan-reviewer.toml",
      ".agents/skills/planning/",
      ".agents/skills/work-tracker/",
      ".agents/skills/docs-sync/",
      ".agents/skills/code-guide-audit/",
      ".agents/skills/adversarial-review/",
      ".agents/skills/break-it-qa/",
      ".agents/skills/frontend-context-interview/",
      ".agents/skills/backend-context-interview/",
      ".agents/skills/frontend-ship-audit/",
      ".agents/skills/backend-ship-audit/",
      ".agents/skills/conversation-retrospective/",
      ".agents/skills/merge-ready-owner/",
      ".agents/skills/workspace-compress/",
      ".agents/skills/pre-pr-hygiene/",
      ".agents/skills/pr-review/",
      ".waypoint/config.toml",
      ".waypoint/README.md",
      ".waypoint/SOUL.md",
      ".waypoint/WORKSPACE.md",
      ".waypoint/ACTIVE_PLANS.md",
      ".waypoint/agent-operating-manual.md",
      ".waypoint/DOCS_INDEX.md",
      ".waypoint/TRACKS_INDEX.md",
      ".waypoint/context/",
      ".waypoint/scripts/",
      ".waypoint/state/",
      ".waypoint/track/",
      ".waypoint/docs/README.md",
      ".waypoint/docs/code-guide.md",
      "# End Waypoint state",
      "",
    ].join("\n"),
    "utf8"
  );

  initRepository(root, {
    profile: "universal"
  });

  const gitignore = readFileSync(gitignorePath, "utf8").replace(/\r\n/g, "\n");
  const workspaceIndex = gitignore.indexOf(".waypoint/WORKSPACE.md");
  const docsIndex = gitignore.indexOf(".waypoint/docs/README.md");
  assert.notEqual(workspaceIndex, -1);
  assert.notEqual(docsIndex, -1);
  assert.ok(workspaceIndex < docsIndex);
});

test("init preserves user gitignore rules that follow the waypoint block", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-gitignore-trailing-user-rule-"));
  initRepository(root, {
    profile: "universal"
  });

  const gitignorePath = path.join(root, ".gitignore");
  writeFileSync(
    gitignorePath,
    [
      "# Waypoint state",
      ".codex/config.toml",
      ".codex/agents/code-reviewer.toml",
      ".codex/agents/code-health-reviewer.toml",
      ".codex/agents/plan-reviewer.toml",
      ".agents/skills/planning/",
      ".agents/skills/work-tracker/",
      ".agents/skills/docs-sync/",
      ".agents/skills/code-guide-audit/",
      ".agents/skills/break-it-qa/",
      ".agents/skills/frontend-context-interview/",
      ".agents/skills/backend-context-interview/",
      ".agents/skills/frontend-ship-audit/",
      ".agents/skills/backend-ship-audit/",
      ".agents/skills/conversation-retrospective/",
      ".agents/skills/merge-ready-owner/",
      ".agents/skills/workspace-compress/",
      ".agents/skills/pre-pr-hygiene/",
      ".agents/skills/pr-review/",
      ".waypoint/config.toml",
      ".waypoint/README.md",
      ".waypoint/SOUL.md",
      ".waypoint/WORKSPACE.md",
      ".waypoint/ACTIVE_PLANS.md",
      ".waypoint/agent-operating-manual.md",
      ".waypoint/DOCS_INDEX.md",
      ".waypoint/TRACKS_INDEX.md",
      ".waypoint/context/",
      ".waypoint/scripts/",
      ".waypoint/state/",
      ".waypoint/track/",
      ".waypoint/docs/README.md",
      ".waypoint/docs/code-guide.md",
      "dist/",
      "",
    ].join("\n"),
    "utf8"
  );

  initRepository(root, {
    profile: "universal"
  });

  const gitignore = readFileSync(gitignorePath, "utf8").replace(/\r\n/g, "\n");
  assert.equal(gitignore.match(/^dist\/$/gm)?.length ?? 0, 1);
});

test("init does not delete user rules when an old waypoint gitignore block is malformed", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-gitignore-malformed-block-"));
  initRepository(root, {
    profile: "universal"
  });

  const gitignorePath = path.join(root, ".gitignore");
  writeFileSync(
    gitignorePath,
    [
      "# Waypoint state",
      ".codex/config.toml",
      ".codex/agents/code-reviewer.toml",
      ".codex/agents/code-health-reviewer.toml",
      ".codex/agents/plan-reviewer.toml",
      ".agents/skills/planning/",
      ".agents/skills/work-tracker/",
      ".agents/skills/docs-sync/",
      ".agents/skills/code-guide-audit/",
      "dist/",
      "",
    ].join("\n"),
    "utf8"
  );

  initRepository(root, {
    profile: "universal"
  });

  const gitignore = readFileSync(gitignorePath, "utf8").replace(/\r\n/g, "\n");
  assert.equal(gitignore.match(/^dist\/$/gm)?.length ?? 0, 1);
  assert.ok(gitignore.includes(".agents/skills/adversarial-review/"));
});

test("init upgrades a legacy root-scoped waypoint gitignore block in place", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-gitignore-legacy-root-scoped-"));
  initRepository(root, {
    profile: "universal"
  });

  const gitignorePath = path.join(root, ".gitignore");
  writeFileSync(
    gitignorePath,
    [
      "node_modules/",
      "",
      "# Waypoint state",
      "/.waypoint/DOCS_INDEX.md",
      "/.waypoint/state/",
      "/.waypoint/context/",
      "/.waypoint/",
      "/.agents/",
      "",
      "dist/",
      "",
    ].join("\n"),
    "utf8"
  );

  initRepository(root, {
    profile: "universal"
  });
  initRepository(root, {
    profile: "universal"
  });

  const gitignore = readFileSync(gitignorePath, "utf8").replace(/\r\n/g, "\n");
  assert.equal(gitignore.match(/^# Waypoint state$/gm)?.length ?? 0, 1);
  assert.equal(gitignore.match(/^# End Waypoint state$/gm)?.length ?? 0, 1);
  assert.equal(gitignore.match(/^\.agents\/skills\/adversarial-review\/$/gm)?.length ?? 0, 1);
  assert.equal(gitignore.match(/^\/\.waypoint\/state\/$/gm)?.length ?? 0, 0);
  assert.equal(gitignore.match(/^dist\/$/gm)?.length ?? 0, 1);
});

test("init collapses an already-duplicated waypoint gitignore section back to one block", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-gitignore-dedup-"));
  initRepository(root, {
    profile: "universal"
  });

  const gitignorePath = path.join(root, ".gitignore");
  writeFileSync(
    gitignorePath,
    [
      "# Waypoint state",
      "/.waypoint/DOCS_INDEX.md",
      "/.waypoint/state/",
      "/.waypoint/context/",
      "/.waypoint/",
      "/.agents/",
      "",
      "# Waypoint state",
      ".codex/config.toml",
      ".codex/agents/code-reviewer.toml",
      ".codex/agents/code-health-reviewer.toml",
      ".codex/agents/plan-reviewer.toml",
      ".agents/skills/planning/",
      ".agents/skills/work-tracker/",
      ".agents/skills/docs-sync/",
      ".agents/skills/code-guide-audit/",
      ".agents/skills/adversarial-review/",
      ".agents/skills/break-it-qa/",
      ".agents/skills/frontend-context-interview/",
      ".agents/skills/backend-context-interview/",
      ".agents/skills/frontend-ship-audit/",
      ".agents/skills/backend-ship-audit/",
      ".agents/skills/conversation-retrospective/",
      ".agents/skills/workspace-compress/",
      ".agents/skills/pre-pr-hygiene/",
      ".agents/skills/pr-review/",
      ".waypoint/config.toml",
      ".waypoint/MEMORY.md",
      ".waypoint/README.md",
      ".waypoint/SOUL.md",
      ".waypoint/WORKSPACE.md",
      ".waypoint/ACTIVE_PLANS.md",
      ".waypoint/agent-operating-manual.md",
      ".waypoint/DOCS_INDEX.md",
      ".waypoint/TRACKS_INDEX.md",
      ".waypoint/context/",
      ".waypoint/scripts/",
      ".waypoint/state/",
      ".waypoint/track/",
      ".waypoint/docs/README.md",
      ".waypoint/docs/code-guide.md",
      "# End Waypoint state",
      "",
      "dist/",
      "",
    ].join("\n"),
    "utf8"
  );

  initRepository(root, {
    profile: "universal"
  });

  const gitignore = readFileSync(gitignorePath, "utf8").replace(/\r\n/g, "\n");
  assert.equal(gitignore.match(/^# Waypoint state$/gm)?.length ?? 0, 1);
  assert.equal(gitignore.match(/^# End Waypoint state$/gm)?.length ?? 0, 1);
  assert.equal(gitignore.match(/^dist\/$/gm)?.length ?? 0, 1);
});

test("init does not delete user rules inserted inside an old waypoint gitignore block", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-gitignore-user-rule-inside-block-"));
  initRepository(root, {
    profile: "universal"
  });

  const gitignorePath = path.join(root, ".gitignore");
  writeFileSync(
    gitignorePath,
    [
      "# Waypoint state",
      ".codex/config.toml",
      ".codex/agents/code-reviewer.toml",
      ".codex/agents/code-health-reviewer.toml",
      ".codex/agents/plan-reviewer.toml",
      ".agents/skills/planning/",
      ".agents/skills/work-tracker/",
      ".agents/skills/docs-sync/",
      ".agents/skills/code-guide-audit/",
      "dist/",
      ".waypoint/docs/code-guide.md",
      "",
    ].join("\n"),
    "utf8"
  );

  initRepository(root, {
    profile: "universal"
  });

  const gitignore = readFileSync(gitignorePath, "utf8").replace(/\r\n/g, "\n");
  assert.equal(gitignore.match(/^dist\/$/gm)?.length ?? 0, 1);
  assert.ok(gitignore.includes(".agents/skills/adversarial-review/"));
});

test("init removes retired visual-explanations gitignore and skill on refresh", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-retired-visual-explanations-"));
  initRepository(root, {
    profile: "universal"
  });

  mkdirSync(path.join(root, ".agents/skills/visual-explanations/agents"), { recursive: true });
  writeFileSync(
    path.join(root, ".agents/skills/visual-explanations/SKILL.md"),
    "# Visual Explanations\n",
    "utf8"
  );
  writeFileSync(
    path.join(root, ".agents/skills/visual-explanations/agents/openai.yaml"),
    "display_name: \"Visual Explanations\"\n",
    "utf8"
  );

  const gitignorePath = path.join(root, ".gitignore");
  writeFileSync(
    gitignorePath,
    [
      "# Waypoint state",
      ".codex/config.toml",
      ".codex/agents/code-reviewer.toml",
      ".codex/agents/code-health-reviewer.toml",
      ".codex/agents/plan-reviewer.toml",
      ".agents/skills/planning/",
      ".agents/skills/work-tracker/",
      ".agents/skills/docs-sync/",
      ".agents/skills/code-guide-audit/",
      ".agents/skills/adversarial-review/",
      ".agents/skills/visual-explanations/",
      ".agents/skills/break-it-qa/",
      ".agents/skills/frontend-context-interview/",
      ".agents/skills/backend-context-interview/",
      ".agents/skills/frontend-ship-audit/",
      ".agents/skills/backend-ship-audit/",
      ".agents/skills/conversation-retrospective/",
      ".agents/skills/workspace-compress/",
      ".agents/skills/pre-pr-hygiene/",
      ".agents/skills/pr-review/",
      ".waypoint/config.toml",
      ".waypoint/MEMORY.md",
      ".waypoint/README.md",
      ".waypoint/SOUL.md",
      ".waypoint/WORKSPACE.md",
      ".waypoint/ACTIVE_PLANS.md",
      ".waypoint/agent-operating-manual.md",
      ".waypoint/DOCS_INDEX.md",
      ".waypoint/TRACKS_INDEX.md",
      ".waypoint/context/",
      ".waypoint/scripts/",
      ".waypoint/state/",
      ".waypoint/track/",
      ".waypoint/docs/README.md",
      ".waypoint/docs/code-guide.md",
      "# End Waypoint state",
      "",
    ].join("\n"),
    "utf8"
  );

  initRepository(root, {
    profile: "universal"
  });

  const gitignore = readFileSync(gitignorePath, "utf8").replace(/\r\n/g, "\n");
  assert.equal(gitignore.match(/^\.agents\/skills\/visual-explanations\/$/gm)?.length ?? 0, 0);
  assert.equal(existsSync(path.join(root, ".agents/skills/visual-explanations")), false);
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
  assert.equal(existsSync(path.join(root, ".agents/skills/foundational-redesign/SKILL.md")), true);
  assert.equal(existsSync(path.join(root, ".agents/skills/verify-completeness/SKILL.md")), true);
  assert.equal(existsSync(path.join(root, ".agents/skills/pr-review/SKILL.md")), true);
  assert.equal(existsSync(path.join(root, ".agents/skills/adversarial-review/SKILL.md")), true);
});

test("init removes retired .waypoint agent prompt files on refresh", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-retired-waypoint-agents-"));
  initRepository(root, {
    profile: "universal"
  });

  mkdirSync(path.join(root, ".waypoint/agents"), { recursive: true });
  writeFileSync(
    path.join(root, ".waypoint/agents/docs-researcher.md"),
    "---\nname: docs-researcher\n---\n",
    "utf8"
  );

  initRepository(root, {
    profile: "universal"
  });

  assert.equal(existsSync(path.join(root, ".waypoint/agents")), false);
});

test("init removes retired coding-agent scaffold on refresh", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-retired-coding-agent-"));
  initRepository(root, {
    profile: "universal"
  });

  writeFileSync(
    path.join(root, ".codex/agents/coding-agent.toml"),
    "model = \"gpt-5.4-mini\"\n",
    "utf8"
  );

  initRepository(root, {
    profile: "universal"
  });

  assert.equal(existsSync(path.join(root, ".codex/agents/coding-agent.toml")), false);
  assert.equal(readFileSync(path.join(root, ".codex/config.toml"), "utf8").includes('[agents."coding-agent"]'), false);
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
      "Timestamp discipline: Prefix new or materially revised bullets in `Active Plans`, `Current State`, `In Progress`, `Next`, `Parked`, and `Done Recently` with `[YYYY-MM-DD HH:MM TZ]`.",
      "",
      "## Active Goal",
      "",
      "Ship something useful.",
      "",
      "## Active Plans",
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

test("init fully replaces stale lines inside the managed AGENTS block", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-agents-refresh-"));

  initRepository(root, {
    profile: "universal"
  });

  const agentsPath = path.join(root, "AGENTS.md");
  const staleAgents = readFileSync(agentsPath, "utf8").replace(
    "<!-- waypoint:start -->",
    "<!-- waypoint:start -->\nSTALE WAYPOINT LINE"
  );
  writeFileSync(agentsPath, staleAgents, "utf8");

  initRepository(root, {
    profile: "universal"
  });

  const refreshed = readFileSync(agentsPath, "utf8");
  assert.equal(refreshed.includes("STALE WAYPOINT LINE"), false);
  assert.ok(refreshed.includes("<!-- waypoint:start -->"));
  assert.ok(refreshed.includes("<!-- waypoint:end -->"));
});

test("sync rebuilds the docs index only", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-sync-"));

  initRepository(root, {
    profile: "universal"
  });

  writeFileSync(path.join(root, ".waypoint/DOCS_INDEX.md"), "stale docs index\n", "utf8");

  const result = syncRepository(root);
  assert.deepEqual(result, ["Rebuilt .waypoint/DOCS_INDEX.md"]);
  assert.ok(readFileSync(path.join(root, ".waypoint/DOCS_INDEX.md"), "utf8").includes("## .waypoint/docs/"));
  assert.ok(!readFileSync(path.join(root, ".waypoint/DOCS_INDEX.md"), "utf8").includes("## .waypoint/plans/"));
  assert.equal(existsSync(path.join(root, ".waypoint/automations")), false);
  assert.equal(existsSync(path.join(root, ".waypoint/rules")), false);
});

test("sync indexes additional configured docs roots once each", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-multi-root-sync-"));

  initRepository(root, {
    profile: "universal"
  });

  writeFileSync(
    path.join(root, ".waypoint/config.toml"),
    [
      "version = 1",
      'profile = "universal"',
      'workspace_file = ".waypoint/WORKSPACE.md"',
      'docs_dirs = [ ".waypoint/docs", "services/app/docs", "./services/app/docs" ]',
      'docs_index_file = ".waypoint/DOCS_INDEX.md"',
    ].join("\n"),
    "utf8"
  );

  writeRoutableDoc(path.join(root, "services/app/docs/runtime.md"), {
    title: "Runtime Guide",
    summary: "Explain the app runtime.",
  });

  syncRepository(root);

  const docsIndex = readFileSync(path.join(root, ".waypoint/DOCS_INDEX.md"), "utf8");
  assert.equal(docsIndex.match(/^## services\/app\/docs\/$/gm)?.length ?? 0, 1);
  assert.ok(docsIndex.includes("services/app/docs/runtime.md"));
});

test("sync still honors legacy singular docs roots", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-legacy-roots-"));

  initRepository(root, {
    profile: "universal"
  });

  writeFileSync(
    path.join(root, ".waypoint/config.toml"),
    [
      "version = 1",
      'profile = "universal"',
      'workspace_file = ".waypoint/WORKSPACE.md"',
      'docs_dir = "services/api/docs"',
      'docs_index_file = ".waypoint/DOCS_INDEX.md"',
    ].join("\n"),
    "utf8"
  );

  writeRoutableDoc(path.join(root, "services/api/docs/contracts.md"), {
    title: "Contracts",
    summary: "Explain the API contracts.",
  });

  syncRepository(root);

  const docsIndex = readFileSync(path.join(root, ".waypoint/DOCS_INDEX.md"), "utf8");
  assert.ok(docsIndex.includes("## services/api/docs/"));
  assert.ok(docsIndex.includes("services/api/docs/contracts.md"));
});

test("doctor flags missing configured docs roots", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-doctor-multi-root-"));

  initRepository(root, {
    profile: "universal"
  });

  writeFileSync(
    path.join(root, ".waypoint/config.toml"),
    [
      "version = 1",
      'profile = "universal"',
      'workspace_file = ".waypoint/WORKSPACE.md"',
      'docs_dirs = [ ".waypoint/docs", "services/app/docs" ]',
      'docs_index_file = ".waypoint/DOCS_INDEX.md"',
    ].join("\n"),
    "utf8"
  );

  const findings = doctorRepository(root);
  assert.ok(findings.some((finding) => finding.message.includes("services/app/docs/ directory is missing.")));
});

test("init preserves custom docs roots and docs index path on refresh", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-config-refresh-"));

  initRepository(root, {
    profile: "universal"
  });

  mkdirp(path.join(root, "services/app/docs"));
  writeFileSync(
    path.join(root, ".waypoint/config.toml"),
    [
      "version = 1",
      'profile = "universal"',
      'workspace_file = ".waypoint/WORKSPACE.md"',
      'docs_dirs = [ ".waypoint/docs", "services/app/docs" ]',
      'docs_index_file = ".waypoint/CUSTOM_DOCS_INDEX.md"',
    ].join("\n"),
    "utf8"
  );

  writeRoutableDoc(path.join(root, "services/app/docs/runtime.md"), {
    title: "Runtime Guide",
    summary: "Explain the refreshed runtime docs.",
  });

  initRepository(root, {
    profile: "universal"
  });

  const config = readFileSync(path.join(root, ".waypoint/config.toml"), "utf8");
  assert.ok(config.includes('docs_dirs = [ ".waypoint/docs", "services/app/docs" ]'));
  assert.ok(config.includes('docs_index_file = ".waypoint/CUSTOM_DOCS_INDEX.md"'));

  const docsIndex = readFileSync(path.join(root, ".waypoint/CUSTOM_DOCS_INDEX.md"), "utf8");
  assert.ok(docsIndex.includes("## services/app/docs/"));
});

test("sync skips symlinked directories while walking docs roots", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-symlink-docs-"));

  initRepository(root, {
    profile: "universal"
  });

  writeRoutableDoc(path.join(root, ".waypoint/docs/reference.md"), {
    title: "Reference",
    summary: "Explain the stable reference doc.",
  });

  if (process.platform !== "win32") {
    symlinkSync(path.join(root, ".waypoint/docs"), path.join(root, ".waypoint/docs/loop"));
  }

  syncRepository(root);

  const docsIndex = readFileSync(path.join(root, ".waypoint/DOCS_INDEX.md"), "utf8");
  assert.equal(docsIndex.match(/\.waypoint\/docs\/reference\.md/g)?.length ?? 0, 1);
});

test("prepare-context skips looped symlink directories while rebuilding docs index", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-generated-docs-loop-"));
  const codexHome = mkdtempSync(path.join(os.tmpdir(), "waypoint-codex-home-"));
  process.env.CODEX_HOME = codexHome;

  initRepository(root, {
    profile: "universal"
  });

  writeRoutableDoc(path.join(root, ".waypoint/docs/reference.md"), {
    title: "Reference",
    summary: "Explain the stable reference doc.",
  });

  if (process.platform !== "win32") {
    symlinkSync(path.join(root, ".waypoint/docs"), path.join(root, ".waypoint/docs/loop"));
  }

  execFileSync("node", [path.join(root, ".waypoint/scripts/prepare-context.mjs")], {
    cwd: root,
    env: { ...process.env, CODEX_HOME: codexHome },
    stdio: "pipe"
  });

  const docsIndex = readFileSync(path.join(root, ".waypoint/DOCS_INDEX.md"), "utf8");
  assert.equal(docsIndex.match(/\.waypoint\/docs\/reference\.md/g)?.length ?? 0, 1);
});

test("init scaffolds codex agent pack by default", () => {
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
  assert.equal(existsSync(path.join(root, ".codex/agents/coding-agent.toml")), false);
  assert.equal(existsSync(path.join(root, ".codex/agents/code-reviewer.toml")), true);
  assert.equal(existsSync(path.join(root, ".codex/agents/code-health-reviewer.toml")), true);
  assert.equal(existsSync(path.join(root, ".codex/agents/plan-reviewer.toml")), true);
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
  const snapshot = readFileSync(path.join(root, ".waypoint/context/SNAPSHOT.md"), "utf8");

  assert.ok(recentThread.includes("Assistant (merged 2 messages)"));
  assert.ok(recentThread.includes("I’m validating the package first."));
  assert.ok(recentThread.includes("Published successfully."));
  assert.ok(recentThread.includes("[REDACTED]"));
  assert.ok(!recentThread.includes("npm_ABC123SECRET"));
  assert.ok(snapshot.includes("## Git Status"));
});

test("prepare-context reads recent thread from Pi transcripts when configured", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-pi-context-"));
  const piAgentHome = mkdtempSync(path.join(os.tmpdir(), "waypoint-pi-agent-home-"));
  process.env.PI_AGENT_HOME = piAgentHome;

  initRepository(root, {
    profile: "universal"
  });

  writeFileSync(
    path.join(root, ".waypoint/config.toml"),
    readFileSync(path.join(root, ".waypoint/config.toml"), "utf8").replace('coding_agent = "codex"', 'coding_agent = "pi"'),
    "utf8"
  );

  const sessionDir = path.join(piAgentHome, "sessions", "--tmp-waypoint-pi-context--");
  mkdirp(sessionDir);
  const sessionPath = path.join(sessionDir, "2026-03-06T05-00-00-000Z_pi-session.jsonl");
  const sessionLines = [
    {
      type: "session",
      version: 3,
      id: "pi-session-123",
      timestamp: "2026-03-06T05:00:00.000Z",
      cwd: root
    },
    {
      type: "message",
      id: "msg-1",
      timestamp: "2026-03-06T05:00:01.000Z",
      message: {
        role: "user",
        content: [{ type: "text", text: "# AGENTS.md instructions for /tmp/demo\n" }]
      }
    },
    {
      type: "message",
      id: "msg-2",
      timestamp: "2026-03-06T05:00:02.000Z",
      message: {
        role: "user",
        content: [{ type: "text", text: "Please ship the Pi support.\n" }]
      }
    },
    {
      type: "message",
      id: "msg-3",
      timestamp: "2026-03-06T05:00:03.000Z",
      message: {
        role: "assistant",
        content: [{ type: "text", text: "I’m checking the transcript format first.\n" }]
      }
    },
    {
      type: "message",
      id: "msg-4",
      timestamp: "2026-03-06T05:00:04.000Z",
      message: {
        role: "assistant",
        content: [{ type: "text", text: "Here is a token: npm_ABC123SECRET\n" }]
      }
    },
    {
      type: "compaction",
      id: "cmp-1",
      parentId: "msg-4",
      timestamp: "2026-03-06T05:00:05.000Z",
      summary: "Compacted session"
    }
  ];
  writeFileSync(sessionPath, `${sessionLines.map((line) => JSON.stringify(line)).join("\n")}\n`, "utf8");

  execFileSync("node", [path.join(root, ".waypoint/scripts/prepare-context.mjs")], {
    cwd: root,
    env: { ...process.env, PI_AGENT_HOME: piAgentHome },
    stdio: "pipe"
  });

  const recentThread = readFileSync(path.join(root, ".waypoint/context/RECENT_THREAD.md"), "utf8");
  const snapshot = readFileSync(path.join(root, ".waypoint/context/SNAPSHOT.md"), "utf8");

  assert.ok(recentThread.includes("sessions/--tmp-waypoint-pi-context--/2026-03-06T05-00-00-000Z_pi-session.jsonl"));
  assert.ok(recentThread.includes("Assistant (merged 2 messages)"));
  assert.ok(recentThread.includes("I’m checking the transcript format first."));
  assert.ok(recentThread.includes("[REDACTED]"));
  assert.ok(!recentThread.includes("npm_ABC123SECRET"));
  assert.ok(snapshot.includes("## Pull Requests"));
});

test("prepare-context writes a merged snapshot file", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-snapshot-"));
  const codexHome = mkdtempSync(path.join(os.tmpdir(), "waypoint-codex-home-"));
  process.env.CODEX_HOME = codexHome;

  initRepository(root, {
    profile: "universal"
  });

  execFileSync("node", [path.join(root, ".waypoint/scripts/prepare-context.mjs")], {
    cwd: root,
    env: { ...process.env, CODEX_HOME: codexHome },
    stdio: "pipe"
  });

  const snapshot = readFileSync(path.join(root, ".waypoint/context/SNAPSHOT.md"), "utf8");
  assert.ok(snapshot.includes("## Git Status"));
  assert.ok(snapshot.includes("## Recent Commits"));
  assert.ok(snapshot.includes("## Pull Requests"));
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

test("prepare-context skips looped symlink directories in Codex session roots", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-looped-session-"));
  const codexHome = mkdtempSync(path.join(os.tmpdir(), "waypoint-codex-home-"));
  process.env.CODEX_HOME = codexHome;

  initRepository(root, {
    profile: "universal"
  });

  const sessionDir = path.join(codexHome, "sessions/2026/04/01");
  mkdirp(sessionDir);

  writeFileSync(
    path.join(sessionDir, "valid-session.jsonl"),
    [
      JSON.stringify({ type: "session_meta", payload: { cwd: root } }),
      JSON.stringify({
        type: "response_item",
        timestamp: "2026-04-01T17:00:00.000Z",
        payload: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: "Session survives looped symlink traversal.\n" }]
        }
      }),
      JSON.stringify({ type: "compacted", payload: { message: "", replacement_history: [] } })
    ].join("\n") + "\n",
    "utf8"
  );

  if (process.platform !== "win32") {
    symlinkSync(path.join(codexHome, "sessions"), path.join(sessionDir, "loop"));
  }

  execFileSync("node", [path.join(root, ".waypoint/scripts/prepare-context.mjs")], {
    cwd: root,
    env: { ...process.env, CODEX_HOME: codexHome },
    stdio: "pipe"
  });

  const recentThread = readFileSync(path.join(root, ".waypoint/context/RECENT_THREAD.md"), "utf8");
  assert.ok(recentThread.includes("Session survives looped symlink traversal."));
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

  const snapshot = readFileSync(path.join(root, ".waypoint/context/SNAPSHOT.md"), "utf8");

  assert.ok(snapshot.includes("scratch.txt"));
  assert.ok(snapshot.includes("Initial commit"));
  assert.ok(snapshot.includes("## Context Snapshot"));
  assert.ok(snapshot.includes("Local timezone:"));
  assert.ok(snapshot.includes("Current local datetime:"));
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

  const snapshot = readFileSync(path.join(root, ".waypoint/context/SNAPSHOT.md"), "utf8");
  assert.ok(snapshot.includes("GitHub viewer: markmdev"));
  assert.ok(snapshot.includes("GitHub repo: markmdev/waypoint-test"));
  assert.ok(snapshot.includes("#12 Fix transfer bug"));
  assert.ok(snapshot.includes("#11 Ship continuity fixes"));
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

function writeRoutableDoc(
  filePath: string,
  options: {
    title: string;
    summary: string;
  },
): void {
  mkdirp(path.dirname(filePath));
  writeFileSync(
    filePath,
    [
      "---",
      `summary: "${options.summary}"`,
      'last_updated: "2026-03-23 10:00 PDT"',
      "read_when:",
      "  - you need the routed doc",
      "---",
      "",
      `# ${options.title}`,
      "",
      "Useful details live here.",
      "",
    ].join("\n"),
    "utf8"
  );
}

function mkdirp(dirPath: string): void {
  mkdirSync(dirPath, { recursive: true });
}
