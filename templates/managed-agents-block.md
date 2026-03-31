<!-- waypoint:start -->
# Waypoint

This repository uses Waypoint as its Codex operating system.

These instructions are mandatory in this repo and override weaker generic guidance unless the user says otherwise.

Waypoint owns only the text inside these `waypoint:start/end` markers.
If you need repo-specific AGENTS instructions, write them outside this managed block.
Do not put durable repo guidance inside the managed block, because `waypoint init` may replace it during upgrades.

Run the Waypoint bootstrap only at session start, after compaction, or when the user explicitly asks for it:
1. Run `node .waypoint/scripts/prepare-context.mjs`
2. Read `.waypoint/SOUL.md`
3. Read `.waypoint/agent-operating-manual.md`
4. Read `.waypoint/WORKSPACE.md`
5. Read `.waypoint/ACTIVE_PLANS.md`
6. Read `.waypoint/context/MANIFEST.md`
7. Read every file listed in the manifest

Before major implementation or architecture changes, check the repo guidance and routed docs for durable context. Ask only the missing high-leverage questions.

Once the user approves a plan or tells you to proceed, that approved scope is the execution contract. Do not silently narrow, defer, or drop approved work unless a real blocker or decision requires discussion.

`WORKSPACE.md` is the live execution log. `ACTIVE_PLANS.md` is the live execution contract. Keep them current at phase boundaries, checkpoint changes, blockers, and before handoff.

Refactor and migration default: use direct replacement, not compatibility scaffolding, unless the user or project docs explicitly require coexistence. Delete obsolete code aggressively and finish the phase back to green. Large destructive edits are allowed when they are the clearest path to the approved target state.

Use reviewer passes at real phase boundaries, before PR-ready handoff, and before final closeout when helpful. Do not spend heavyweight review on a phase that still has known legacy seams or grep-gate failures.

Keep communication concise. Lead with the answer, diagnosis, decision, or next step. Explain the diagnosis before implementation when the cause, tradeoffs, or solution shape are not already obvious.

Before reporting completion, verify the result yourself when reasonably possible, reread `ACTIVE_PLANS.md`, `WORKSPACE.md`, and any active tracker, and compare reality against the approved scope and current checkpoint. If the work is not actually complete, keep going.
<!-- waypoint:end -->
