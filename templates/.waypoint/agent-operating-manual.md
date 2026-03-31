# Waypoint Agent Operating Manual

This repository uses Waypoint as its operating system for Codex.

These instructions are mandatory in this repo and override weaker generic guidance unless the user says otherwise.

If the repo needs custom AGENTS guidance, write it outside the managed `waypoint:start/end` block in `AGENTS.md`. Treat the managed block as Waypoint-owned and replaceable.
If a higher-priority instruction conflicts with Waypoint workflow, do not pretend the repo rule happened anyway. State the conflict plainly, explain the consequence, and ask the user for direction when needed.

## Session start

Run the Waypoint bootstrap only at session start, after compaction, or when the user explicitly asks for it:

1. Run `node .waypoint/scripts/prepare-context.mjs`
2. Read `.waypoint/SOUL.md`
3. Read this file
4. Read `.waypoint/WORKSPACE.md`
5. Read `.waypoint/ACTIVE_PLANS.md`
6. Read `.waypoint/context/MANIFEST.md`
7. Read every file listed in that manifest

## Repository memory model

The repository should contain the context the next agent needs.

- user-scoped `AGENTS.md` holds cross-project preferences and standing rules
- the repo root `AGENTS.md` holds durable repo context and always-on project rules
- `.waypoint/WORKSPACE.md` holds live execution state
- `.waypoint/ACTIVE_PLANS.md` holds the currently approved plan and active phase checkpoints
- `.waypoint/track/` holds detailed execution state for long-running work
- `.waypoint/docs/` holds durable project knowledge
- `.waypoint/plans/` holds durable plan docs
- `.waypoint/context/` holds the generated bootstrap bundle

General always-on workflow rules belong in `AGENTS.md` and this manual, not only in optional helper skills. Workflow-specific method detail belongs in the relevant skill. After bootstrap, use progressive disclosure: read only the routed docs and files the current task actually needs.

## Working defaults

- Fix root causes instead of papering over symptoms.
- The default for refactors and migrations is contract replacement, not compatibility preservation.
- Delete obsolete code aggressively. Remove stale branches, dead props, debug logs, compatibility scaffolding, unused files, and legacy paths as part of the change.
- Large destructive edits are allowed when they are the clearest route to the approved target state.
- Temporary breakage inside the active phase is acceptable. Do not stop there; finish the phase back to green.
- Do the level of cleanup the real codebase requires. Do not use generic “stay narrow” heuristics to avoid the root-cause fix.
- Keep communication concise and direct.

## Execution contract

Once the user approves a plan or tells you to proceed, that approved scope is the execution contract.

- Do not silently narrow, defer, or drop approved work.
- Execute approved work phase by phase.
- `WORKSPACE.md` and `ACTIVE_PLANS.md` are live files, not paperwork. Update them during the work, not after.
- Once scope is approved, execute it without asking for permission again for obvious implementation steps, cleanup, validation, or documentation that the approved work requires.
- Before reporting completion, reread `ACTIVE_PLANS.md`, the active tracker if one exists, `WORKSPACE.md`, and the relevant routed docs, then compare reality against the approved scope, current phase checkpoint, and acceptance criteria.
- If that reread shows the work is not complete, keep going.

Pause only when:
- a real blocker prevents forward progress
- a hidden-risk or non-obvious decision would materially change scope, behavior, cost, or data safety
- you want to change approved scope or defer approved work
- the user explicitly redirects, pauses, or narrows the work

## Refactors and migrations

For migrations and refactors:

- do a legacy seam inventory before implementation
- list every remaining read path, write path, sync or worker path, route contract, frontend consumer, event payload, fixture, and test surface that still depends on the legacy shape
- give each phase exact grep gates for the legacy symbols being removed
- do not treat the phase as review-ready or complete while those grep gates still fail
- when a contract cut changes the expected shape broadly, rewrite affected tests and fixtures in bulk for the new contract instead of dragging legacy test shapes forward through micro-edits

## Review and verification

Reviewer passes are for real phase boundaries, PR-ready handoff, and final closeout.

- Do not run heavyweight review loops after every tiny edit.
- Do not spend reviewer passes on a phase that still has known legacy seams or grep-gate failures.
- If reviewers find meaningful issues, fix them, rerun the relevant verification, and use fresh passes when needed.

Verify your own work before reporting completion.

- Match verification to the real risk surface.
- For UI work, inspect the real UI and send screenshots when the environment allows it.
- For backend or scripts, run code and inspect real output.
- If the result is still incomplete or unproven, keep going.

## State and documentation

- Update `WORKSPACE.md` whenever the active goal, phase, next step, blocker, checkpoint state, or verification state materially changes.
- Update `ACTIVE_PLANS.md` whenever the active approved plan, current phase, checkpoint, or approved scope changes.
- Use `.waypoint/track/` only when `WORKSPACE.md` is no longer enough to keep the work legible.
- Persist corrections in the right durable layer instead of defaulting to `AGENTS.md`.
- Update user-scoped `AGENTS.md` only for true cross-project standing rules.
- Update repo `AGENTS.md` only for durable repo-wide context or always-on project rules.
- Put workflow-specific corrections in the relevant skill, not in `AGENTS.md`.
- Update `.waypoint/docs/` for durable project knowledge and `.waypoint/plans/` for durable plan changes.

## Final quality bar

Before wrapping up, ask:

- Did I solve the user's actual problem?
- Did I finish the approved phase cleanly?
- Are the live state files current?
- Would the next agent understand what is going on from the repo?

If not, keep going.
