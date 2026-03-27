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
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "If the user approves a plan or explicitly tells you to proceed, treat that as authorization to execute the work end to end."
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "There is no fixed waiting limit, and slowness alone is not a reason to interrupt or abandon the work."
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "User-scoped `AGENTS.md` applies across projects"
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "The project root `AGENTS.md` is project-scoped"
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "When you use a browser, app, or other interactive UI to inspect, reproduce, or verify something, send the user screenshots"
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "When an explanation is clearer visually, use Mermaid diagrams directly in chat"
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "Delivery expectations:"
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "Keep communication concise by default."
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "For planned work, define done from the approved scope and acceptance criteria"
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "explain the result in plain, direct language"
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "This communication rule applies to how you explain the work, not to how you do it."
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "Before you say the work is complete, verify it yourself whenever you reasonably can"
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "Match the verification to the task."
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "Use representative or real inputs when practical instead of toy examples"
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "Return finished work when possible, not a first pass that still depends on the user to spot-check it for you."
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "Only come back before that if you hit a genuine blocker"
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "investigate before discussing readiness"
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "explain the problem to the user before jumping into implementation"
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "do not silently narrow, defer, or drop planned work"
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "Keep most work in the main agent."
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "Let repo-local skills describe their own triggers."
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "Use reviewer agents proactively at meaningful milestones"
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "If you created a PR earlier in the current session and need to push more work, first confirm that PR is still open."
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "Treat `.waypoint/WORKSPACE.md` as a mandatory live execution log"
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "update the tracker during the work as well"
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "Use reviewer agents proactively at meaningful milestones"
    )
  );
  assert.ok(
    readFileSync(path.join(root, "AGENTS.md"), "utf8").includes(
      "fix those findings, rerun the relevant verification, and run fresh review passes"
    )
  );
  assert.ok(readFileSync(path.join(root, "AGENTS.md"), "utf8").includes("at the start of a new session"));
  assert.ok(readFileSync(path.join(root, "AGENTS.md"), "utf8").includes("Do not rerun it mid-conversation"));
  assert.ok(readFileSync(path.join(root, ".waypoint/WORKSPACE.md"), "utf8").includes("## Active Goal"));
  assert.ok(readFileSync(path.join(root, ".waypoint/WORKSPACE.md"), "utf8").includes("## Active Trackers"));
  assert.ok(readFileSync(path.join(root, ".waypoint/WORKSPACE.md"), "utf8").includes("Timestamp discipline:"));
  const gitignore = readFileSync(path.join(root, ".gitignore"), "utf8");
  assert.ok(gitignore.includes(".codex/config.toml"));
  assert.ok(gitignore.includes(".codex/agents/code-reviewer.toml"));
  assert.ok(gitignore.includes(".codex/agents/code-health-reviewer.toml"));
  assert.ok(gitignore.includes(".codex/agents/plan-reviewer.toml"));
  assert.ok(gitignore.includes(".agents/skills/planning/"));
  assert.ok(gitignore.includes(".agents/skills/backend-context-interview/"));
  assert.ok(gitignore.includes(".agents/skills/frontend-context-interview/"));
  assert.ok(gitignore.includes(".agents/skills/backend-ship-audit/"));
  assert.ok(gitignore.includes(".agents/skills/frontend-ship-audit/"));
  assert.ok(gitignore.includes(".agents/skills/conversation-retrospective/"));
  assert.ok(gitignore.includes(".agents/skills/adversarial-review/"));
  assert.ok(gitignore.includes(".agents/skills/merge-ready-owner/"));
  assert.ok(gitignore.includes(".waypoint/config.toml"));
  assert.ok(gitignore.includes(".waypoint/README.md"));
  assert.ok(gitignore.includes(".waypoint/SOUL.md"));
  assert.ok(gitignore.includes(".waypoint/WORKSPACE.md"));
  assert.ok(gitignore.includes(".waypoint/agent-operating-manual.md"));
  assert.ok(gitignore.includes(".waypoint/DOCS_INDEX.md"));
  assert.ok(gitignore.includes(".waypoint/TRACKS_INDEX.md"));
  assert.ok(gitignore.includes(".waypoint/context/"));
  assert.ok(gitignore.includes(".waypoint/scripts/"));
  assert.ok(gitignore.includes(".waypoint/track/"));
  assert.ok(gitignore.includes(".waypoint/plans/"));
  assert.ok(gitignore.includes(".waypoint/docs/README.md"));
  assert.ok(gitignore.includes(".waypoint/docs/code-guide.md"));
  assert.ok(gitignore.includes("# End Waypoint state"));
  assert.ok(readFileSync(path.join(root, ".waypoint/DOCS_INDEX.md"), "utf8").includes("## .waypoint/docs/"));
  assert.ok(readFileSync(path.join(root, ".waypoint/DOCS_INDEX.md"), "utf8").includes("## .waypoint/plans/"));
  assert.ok(readFileSync(path.join(root, ".waypoint/TRACKS_INDEX.md"), "utf8").includes("## .waypoint/track/"));
  assert.equal(readFileSync(path.join(root, ".waypoint/config.toml"), "utf8").includes("automations"), false);
  assert.equal(readFileSync(path.join(root, ".waypoint/config.toml"), "utf8").includes("rules"), false);
  assert.ok(readFileSync(path.join(root, ".waypoint/config.toml"), "utf8").includes('coding_agent = "codex"'));
  assert.ok(readFileSync(path.join(root, ".waypoint/config.toml"), "utf8").includes('docs_dirs = [ ".waypoint/docs" ]'));
  assert.ok(readFileSync(path.join(root, ".waypoint/config.toml"), "utf8").includes('plans_dirs = [ ".waypoint/plans" ]'));
  assert.ok(readFileSync(path.join(root, ".codex/config.toml"), "utf8").includes('[agents."code-reviewer"]'));
  assert.equal(existsSync(path.join(root, "WORKSPACE.md")), false);
  assert.equal(existsSync(path.join(root, "DOCS_INDEX.md")), false);
  assert.equal(existsSync(path.join(root, "MEMORY.md")), false);
  assert.equal(existsSync(path.join(root, ".waypoint/MEMORY.md")), false);
  assert.ok(readFileSync(path.join(root, ".waypoint/SOUL.md"), "utf8").includes("Waypoint Soul"));
  assert.ok(readFileSync(path.join(root, ".waypoint/plans/README.md"), "utf8").includes("This directory is for durable plan documents."));
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
      "Keep most work in the main agent."
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes(
      "Keep communication concise by default."
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes(
      "user-scoped `AGENTS.md` is the durable cross-project guidance layer"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes(
      "Update the project-scoped repo `AGENTS.md`"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes(
      "Treat `.waypoint/WORKSPACE.md` as mandatory live execution state"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes(
      "For any non-trivial multi-step work"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes(
      "Let skills carry their own invocation guidance."
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes(
      "Once the user has approved a plan or otherwise told you to continue, own the work until the slice is genuinely complete."
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes(
      "Do not silently narrow, defer, or drop approved work"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes(
      "explain the diagnosis before jumping into implementation"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes(
      "When waiting on reviewers, subagents, CI, automated review, or external jobs that you deliberately chose to start, wait as long as required."
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes(
      "Use the repo-local skills and reviewer agents deliberately, but do not underuse them on work that is expensive to get wrong."
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes(
      "For non-trivial work, strongly prefer reviewer-agent passes between major implementation milestones"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes(
      "If `code-reviewer` or `code-health-reviewer` surface anything more serious than optional polish"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes(
      "When browser work, app inspection, or other interactive UI work is part of reproduction, inspection, or verification, send screenshots"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes(
      "prefer Mermaid diagrams directly in chat for flows, architecture, state, and plans"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes(
      "Did I solve the user's actual problem or clearly explain what remains and why?"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes(
      "Deliberate closeout review is available when you want a second pass for ship-readiness"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes(
      "If you created a PR earlier in the current session and need to push more work, first confirm that PR is still open."
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes(
      "Strengthen the plan when the reviewer surfaces real issues"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/agent-operating-manual.md"), "utf8").includes(
      "If you use it, follow the skill's loop fully"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/scripts/prepare-context.mjs"), "utf8").includes("RECENT_THREAD.md")
  );
  assert.ok(
    readFileSync(path.join(root, ".waypoint/scripts/build-track-index.mjs"), "utf8").includes("TRACKS_INDEX.md")
  );
  assert.ok(readFileSync(path.join(root, ".agents/skills/planning/SKILL.md"), "utf8").includes("# Planning"));
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/planning/SKILL.md"), "utf8").includes(
      "treat that approval as authorization to execute the plan end to end"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/planning/SKILL.md"), "utf8").includes(
      "Scope checklist"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/planning/SKILL.md"), "utf8").includes(
      "do not silently defer or drop checklist items later"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/planning/agents/openai.yaml"), "utf8").includes("display_name: \"Planning\"")
  );
  assert.ok(readFileSync(path.join(root, ".agents/skills/work-tracker/SKILL.md"), "utf8").includes("# Work Tracker"));
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/work-tracker/SKILL.md"), "utf8").includes(
      "Use this skill when the work has enough moving parts"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/work-tracker/SKILL.md"), "utf8").includes(
      "When in doubt, prefer creating or updating the tracker for non-trivial work"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/work-tracker/SKILL.md"), "utf8").includes(
      "Use `- [ ]` checkboxes when there are many concrete tasks to track. Use status-style entries when the work is better expressed as phase/state updates than as a task list."
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/work-tracker/agents/openai.yaml"), "utf8").includes(
      "display_name: \"Work Tracker\""
    )
  );
  assert.ok(readFileSync(path.join(root, ".agents/skills/docs-sync/SKILL.md"), "utf8").includes("# Docs Sync"));
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/backend-ship-audit/SKILL.md"), "utf8").includes(
      "# Backend ship audit"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/backend-context-interview/agents/openai.yaml"), "utf8").includes(
      "display_name: \"Backend Context Interview\""
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
    readFileSync(path.join(root, ".agents/skills/frontend-context-interview/agents/openai.yaml"), "utf8").includes(
      "display_name: \"Frontend Context Interview\""
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
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/adversarial-review/SKILL.md"), "utf8").includes("# Adversarial Review")
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/adversarial-review/SKILL.md"), "utf8").includes(
      "ready to ship"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/adversarial-review/SKILL.md"), "utf8").includes("## Gotchas")
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/adversarial-review/agents/openai.yaml"), "utf8").includes(
      'display_name: "Adversarial Review"'
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/merge-ready-owner/SKILL.md"), "utf8").includes(
      "update `WORKSPACE.md` as milestones, blockers, verification state, and next steps change"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/merge-ready-owner/SKILL.md"), "utf8").includes(
      "use them at meaningful milestones, not only at the very end"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/merge-ready-owner/SKILL.md"), "utf8").includes(
      "keep iterating until the remaining reviewer feedback is only nitpicks or none"
    )
  );
  assert.ok(readFileSync(path.join(root, ".agents/skills/break-it-qa/SKILL.md"), "utf8").includes("# Break-It QA"));
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/break-it-qa/SKILL.md"), "utf8").includes(
      "Capture screenshots of the important states you observe"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/pr-review/SKILL.md"), "utf8").includes(
      "Keep waiting as long as required."
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/pr-review/SKILL.md"), "utf8").includes(
      "wait for the next round of CI, automated review, and human review comments"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/pr-review/SKILL.md"), "utf8").includes(
      "CodeRabbit's \"review in progress\" as unfinished state"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/pr-review/SKILL.md"), "utf8").includes(
      "The loop is not complete while any meaningful review thread still lacks an inline response."
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/pr-review/SKILL.md"), "utf8").includes(
      "The loop is also not complete if required Waypoint reviewer-agent passes for the current slice have not been run yet."
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/conversation-retrospective/SKILL.md"), "utf8").includes(
      "# Conversation Retrospective"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/conversation-retrospective/agents/openai.yaml"), "utf8").includes(
      'display_name: "Conversation Retrospective"'
    )
  );
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
  assert.ok(
    readFileSync(path.join(root, ".agents/skills/planning/SKILL.md"), "utf8").includes(
      "Write or update a durable plan doc under `.waypoint/plans/`."
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
  assert.ok(readFileSync(path.join(root, ".waypoint/DOCS_INDEX.md"), "utf8").includes("## .waypoint/plans/"));
  assert.ok(readFileSync(path.join(root, ".waypoint/TRACKS_INDEX.md"), "utf8").includes("## .waypoint/track/"));
  assert.equal(existsSync(path.join(root, ".waypoint/automations")), false);
  assert.equal(existsSync(path.join(root, ".waypoint/rules")), false);
});

test("sync indexes additional configured docs and plans roots once each", () => {
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
      'plans_dirs = [ ".waypoint/plans", "services/app/plans", "services/app/plans/" ]',
      'docs_index_file = ".waypoint/DOCS_INDEX.md"',
      "",
      "[features]",
      "repo_skills = true",
      "docs_index = true",
      "",
    ].join("\n"),
    "utf8"
  );

  writeRoutableDoc(path.join(root, "services/app/docs/runtime.md"), {
    title: "Runtime Guide",
    summary: "Explain the app runtime.",
  });
  writeRoutableDoc(path.join(root, "services/app/plans/launch.md"), {
    title: "Launch Plan",
    summary: "Track the app launch plan.",
  });

  syncRepository(root);

  const docsIndex = readFileSync(path.join(root, ".waypoint/DOCS_INDEX.md"), "utf8");
  assert.equal(docsIndex.match(/^## services\/app\/docs\/$/gm)?.length ?? 0, 1);
  assert.equal(docsIndex.match(/^## services\/app\/plans\/$/gm)?.length ?? 0, 1);
  assert.ok(docsIndex.includes("services/app/docs/runtime.md"));
  assert.ok(docsIndex.includes("services/app/plans/launch.md"));
});

test("sync still honors legacy singular docs and plans roots", () => {
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
      'plans_dir = "services/api/plans"',
      'docs_index_file = ".waypoint/DOCS_INDEX.md"',
      "",
      "[features]",
      "repo_skills = true",
      "docs_index = true",
      "",
    ].join("\n"),
    "utf8"
  );

  writeRoutableDoc(path.join(root, "services/api/docs/contracts.md"), {
    title: "Contracts",
    summary: "Explain the API contracts.",
  });
  writeRoutableDoc(path.join(root, "services/api/plans/migration.md"), {
    title: "Migration Plan",
    summary: "Track the API migration plan.",
  });

  syncRepository(root);

  const docsIndex = readFileSync(path.join(root, ".waypoint/DOCS_INDEX.md"), "utf8");
  assert.ok(docsIndex.includes("## services/api/docs/"));
  assert.ok(docsIndex.includes("## services/api/plans/"));
  assert.ok(docsIndex.includes("services/api/docs/contracts.md"));
  assert.ok(docsIndex.includes("services/api/plans/migration.md"));
});

test("doctor flags missing configured docs and plans roots", () => {
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
      'plans_dirs = [ ".waypoint/plans", "services/app/plans" ]',
      'docs_index_file = ".waypoint/DOCS_INDEX.md"',
      "",
      "[features]",
      "repo_skills = true",
      "docs_index = true",
      "",
    ].join("\n"),
    "utf8"
  );

  const findings = doctorRepository(root);
  assert.ok(findings.some((finding) => finding.message.includes("services/app/docs/ directory is missing.")));
  assert.ok(findings.some((finding) => finding.message.includes("services/app/plans/ directory is missing.")));
});

test("init preserves custom docs roots and docs index path on refresh", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "waypoint-config-refresh-"));

  initRepository(root, {
    profile: "universal"
  });

  mkdirp(path.join(root, "services/app/docs"));
  mkdirp(path.join(root, "services/app/plans"));
  writeFileSync(
    path.join(root, ".waypoint/config.toml"),
    [
      "version = 1",
      'profile = "universal"',
      'workspace_file = ".waypoint/WORKSPACE.md"',
      'docs_dirs = [ ".waypoint/docs", "services/app/docs" ]',
      'plans_dirs = [ ".waypoint/plans", "services/app/plans" ]',
      'docs_index_file = ".waypoint/CUSTOM_DOCS_INDEX.md"',
      "",
      "[features]",
      "repo_skills = true",
      "docs_index = false",
      "",
    ].join("\n"),
    "utf8"
  );

  writeRoutableDoc(path.join(root, "services/app/docs/runtime.md"), {
    title: "Runtime Guide",
    summary: "Explain the refreshed runtime docs.",
  });
  writeRoutableDoc(path.join(root, "services/app/plans/launch.md"), {
    title: "Launch Plan",
    summary: "Explain the refreshed launch plan.",
  });

  initRepository(root, {
    profile: "universal"
  });

  const config = readFileSync(path.join(root, ".waypoint/config.toml"), "utf8");
  assert.ok(config.includes('docs_dirs = [ ".waypoint/docs", "services/app/docs" ]'));
  assert.ok(config.includes('plans_dirs = [ ".waypoint/plans", "services/app/plans" ]'));
  assert.ok(config.includes('docs_index_file = ".waypoint/CUSTOM_DOCS_INDEX.md"'));
  assert.ok(config.includes("docs_index = false"));

  const docsIndex = readFileSync(path.join(root, ".waypoint/CUSTOM_DOCS_INDEX.md"), "utf8");
  assert.ok(docsIndex.includes("## services/app/docs/"));
  assert.ok(docsIndex.includes("## services/app/plans/"));
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
  assert.ok(
    readFileSync(path.join(root, ".codex/agents/code-reviewer.toml"), "utf8").includes("You are a code reviewer.")
  );
  assert.ok(
    readFileSync(path.join(root, ".codex/agents/code-reviewer.toml"), "utf8").includes('model = "gpt-5.4"')
  );
  assert.ok(
    readFileSync(path.join(root, ".codex/agents/code-reviewer.toml"), "utf8").includes(
      "A diff-only review is a failed review."
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".codex/agents/code-reviewer.toml"), "utf8").includes(".waypoint/WORKSPACE.md")
  );
  assert.ok(
    readFileSync(path.join(root, ".codex/agents/code-health-reviewer.toml"), "utf8").includes(".waypoint/WORKSPACE.md")
  );
  assert.ok(
    readFileSync(path.join(root, ".codex/agents/code-health-reviewer.toml"), "utf8").includes('model = "gpt-5.4"')
  );
  assert.ok(
    readFileSync(path.join(root, ".codex/agents/code-health-reviewer.toml"), "utf8").includes(
      "Read every changed file in full before making a maintainability judgment."
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".codex/agents/code-reviewer.toml"), "utf8").includes(
      "Do not clear a change unless you can explain the critical paths you traced"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".codex/agents/code-health-reviewer.toml"), "utf8").includes(
      "Do not clear a change as healthy unless you can explain which surrounding files"
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".codex/agents/code-reviewer.toml"), "utf8").includes(
      'model_reasoning_effort = "high"'
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".codex/agents/code-health-reviewer.toml"), "utf8").includes(
      'model_reasoning_effort = "high"'
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".codex/agents/code-health-reviewer.toml"), "utf8").includes(
      "A diff-only review is a failed review."
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".codex/agents/plan-reviewer.toml"), "utf8").includes(
      "You are an elite Plan Review Architect."
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".codex/agents/plan-reviewer.toml"), "utf8").includes('model = "gpt-5.4"')
  );
  assert.ok(
    readFileSync(path.join(root, ".codex/agents/plan-reviewer.toml"), "utf8").includes(
      'model_reasoning_effort = "high"'
    )
  );
  assert.ok(
    readFileSync(path.join(root, ".codex/agents/plan-reviewer.toml"), "utf8").includes(
      "This reviewer agent is single-use"
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
  const manifest = readFileSync(path.join(root, ".waypoint/context/MANIFEST.md"), "utf8");

  assert.ok(recentThread.includes("sessions/--tmp-waypoint-pi-context--/2026-03-06T05-00-00-000Z_pi-session.jsonl"));
  assert.ok(recentThread.includes("Assistant (merged 2 messages)"));
  assert.ok(recentThread.includes("I’m checking the transcript format first."));
  assert.ok(recentThread.includes("[REDACTED]"));
  assert.ok(!recentThread.includes("npm_ABC123SECRET"));
  assert.ok(manifest.includes("latest meaningful turns from the local Pi session"));
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
