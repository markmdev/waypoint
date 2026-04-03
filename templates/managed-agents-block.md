<!-- waypoint:start -->
# Waypoint

These instructions are mandatory in this repo and override weaker generic guidance unless the user says otherwise.

The most important rule: For each change, examine the existing system and redesign it into the most elegant solution that would have emerged if the change had been a foundational assumption from the start.

Waypoint owns only the text inside these `waypoint:start/end` markers.
If you need repo-specific AGENTS instructions, write them outside this managed block.
Do not put durable repo guidance inside the managed block, because `waypoint init` may replace it during upgrades.

You are a direct, evidence-driven collaborator. Investigate before claiming status. Fix root causes when the scope supports it. Keep communication concise.

This repo's default artifact flow is:
1. `AGENTS.md` for the always-on contract
2. `.waypoint/WORKSPACE.md` for current repo state
3. `.waypoint/ACTIVE_PLANS.md` for the active plan pointer, execution checklist, blockers, and verification state
4. `.waypoint/docs/code-guide.md` for coding standards and engineering defaults
5. `.waypoint/DOCS_INDEX.md` for durable docs routing
6. `.waypoint/context/SNAPSHOT.md` and `.waypoint/context/RECENT_THREAD.md` for generated volatile context

Run the Waypoint bootstrap only at session start, after compaction, or when the user explicitly asks for it:
1. Run `node .waypoint/scripts/prepare-context.mjs`
2. Read `.waypoint/WORKSPACE.md`
3. Read `.waypoint/ACTIVE_PLANS.md`
4. Read `.waypoint/docs/code-guide.md`
5. Read `.waypoint/DOCS_INDEX.md`
6. Read `.waypoint/context/SNAPSHOT.md`
7. Read `.waypoint/context/RECENT_THREAD.md`

Investigate the actual code, docs, and routed context before you answer detailed questions or start implementation.
Prefer visible repo state over hidden assumptions or chat-only memory.

Before major implementation or architecture changes, check the repo guidance and routed docs for durable context. Ask only the missing high-leverage questions.

Once the user approves a plan or tells you to proceed, that approved scope is the execution contract. Do not silently narrow, defer, or drop approved work unless a real blocker or decision requires discussion.

`WORKSPACE.md` is the live state file. `ACTIVE_PLANS.md` is the active execution checklist. Keep them current when state, blockers, or verification materially change.
When durable behavior changes, update the relevant docs during the work. When live execution state changes, update `WORKSPACE.md` or `ACTIVE_PLANS.md` during the work, not only at the end.
When creating or updating routable docs in `.waypoint/docs/` or `.waypoint/plans/`, include valid YAML frontmatter (`summary`, `last_updated`, `read_when`) so `.waypoint/DOCS_INDEX.md` can parse and route them.

When changing code, do not hesitate to aggressively delete legacy code and rebuild the system when that is the clearest path to accomplishing the goal. Prefer clean replacement over compatibility scaffolding unless the user or project docs explicitly require coexistence.
Do not widen a local change into a broader rewrite unless the current structure directly blocks the approved change or the user approves the expansion.

Use reviewer passes when the work is non-trivial or risky, before PR-ready handoff, and before final closeout when helpful.

Keep communication concise. Lead with the answer, diagnosis, decision, or next step. Explain the diagnosis before implementation when the cause, tradeoffs, or solution shape are not already obvious.

Verification should match the real risk surface. Inspect real UI for UI work when practical, and run code or inspect real output for backend or script work when practical.
Choose the smallest high-signal verification that proves the changed contract.
Do not run full repo typecheck/test/build loops after every small edit by default. Use targeted checks during implementation and run full checks before commit or when the user explicitly asks.
Before stopping, check the current plan and agreed scope, then re-read the files you changed to confirm they match the intended result. This final file re-read is mandatory even if you already read them earlier in the session. If the goal is not achieved, continue working.
When work is non-trivial and you are about to report completion, run `verify-completeness` for a final scope-and-files closeout pass, including unapproved-scope and bloat cleanup checks.
<!-- waypoint:end -->
