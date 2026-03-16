# Waypoint Agent Operating Manual

This repository uses Waypoint as its operating system for Codex.

If the repo needs custom AGENTS guidance, write it outside the managed `waypoint:start/end` block in `AGENTS.md`. Treat the managed block as Waypoint-owned and replaceable.

## Session start

Run the Waypoint bootstrap only:

- at the start of every new session
- immediately after a compaction
- when the user explicitly asks for a rerun

Bootstrap sequence:

1. Run `node .waypoint/scripts/prepare-context.mjs`
2. Read `.waypoint/SOUL.md`
3. Read this file
4. Read `.waypoint/WORKSPACE.md`
5. Read `.waypoint/context/MANIFEST.md`
6. Read every file listed in that manifest

Do not skip this sequence.

- Do not skip it at new-session start or after compaction.
- Do not rerun it mid-conversation just because a task becomes more substantial.
- Earlier chat context or partial memory from the current session does not count as a substitute when a new session starts or a compaction happens.
- If you are unsure whether a new session started or a compaction happened, rerun it instead of guessing.

## Repository memory model

The repository should contain the context the next agent needs.

- `.waypoint/WORKSPACE.md` is the live operational record: in progress, current state, next steps
- `.waypoint/track/` is the durable execution-tracking layer for active long-running work
- `.waypoint/docs/` is the durable project memory: architecture, decisions, integration notes, debugging knowledge, and durable plans
- `.waypoint/context/` is the generated session context bundle: current git/PR/doc/track index state

If something important lives only in your head or in the chat transcript, the repo is under-documented.

## Working rules

- Read code before editing it.
- Follow the repo's documented patterns when they are healthy.
- Update `.waypoint/WORKSPACE.md` as live execution state when progress meaningfully changes. In multi-topic sections, prefix new or materially revised bullets with a local timestamp like `[2026-03-06 20:10 PST]`.
- For large multi-step work, create or update a tracker in `.waypoint/track/`, keep detailed execution state there, and point at it from `## Active Trackers` in `.waypoint/WORKSPACE.md`.
- Update `.waypoint/docs/` when durable knowledge changes, and refresh each changed routable doc's `last_updated` field.
- Rebuild `.waypoint/DOCS_INDEX.md` whenever routable docs change.
- Rebuild `.waypoint/TRACKS_INDEX.md` whenever tracker files change.
- Use the repo-local skills and reviewer agents instead of improvising from scratch.
- Do not kill long-running subagents or reviewer agents just because they are slow. Wait unless they are clearly stuck, failed, or the user redirects the work.

## Documentation expectations

Document the things the next agent cannot safely infer from raw code alone:

- architecture and boundaries
- decisions and tradeoffs
- integration behavior
- invariants and constraints
- debugging and operational knowledge
- active plans and next steps

Do not document every trivial implementation detail. Document the non-obvious, durable, or operationally important parts.

## When to use Waypoint skills

- `planning` for non-trivial changes
- `work-tracker` when large multi-step work needs durable progress tracking in `.waypoint/track/`
- `docs-sync` when routed docs may be stale, missing, or inconsistent with the codebase
- `code-guide-audit` when a specific feature or file set needs a targeted coding-guide compliance check
- `break-it-qa` when a browser-facing feature should be attacked with invalid inputs, refreshes, repeated clicks, wrong action order, or other adversarial manual QA
- `frontend-ship-audit` and `backend-ship-audit` only when the user explicitly requests a ship-readiness audit; do not trigger them autonomously as part of the default Waypoint workflow
- `workspace-compress` after meaningful chunks, before stopping, and before review when the live handoff needs compression
- `pre-pr-hygiene` before pushing or opening/updating a PR for substantial work
- `pr-review` once a PR has active review comments or automated review in progress

## When to use the reviewer agents

Waypoint scaffolds these focused second-pass specialists by default:

- `code-reviewer` for correctness and regression review
- `code-health-reviewer` for maintainability drift
- `plan-reviewer` to challenge non-trivial implementation plans before they are shown to the user

## Plan Review

Run `plan-reviewer` before presenting a non-trivial implementation plan to the user.

- Use it when the plan includes meaningful design choices, multiple work phases, migrations, or non-obvious tradeoffs.
- Skip it for tiny obvious plans or when no plan will be presented.
- Read the reviewer result, strengthen the plan, and rerun `plan-reviewer` until there are no meaningful issues left before showing the plan to the user.

## Review Loop

Use reviewer agents before considering the work complete, not just as a reflex after every tiny commit.

1. Run `code-reviewer` before considering any non-trivial implementation slice complete.
2. Run `code-health-reviewer` before considering medium or large changes complete, especially when they add structure, duplicate logic, or introduce new abstractions.
3. If both apply, launch `code-reviewer` and `code-health-reviewer` in parallel as background, read-only reviewers.
4. If you have a recent self-authored commit that cleanly represents the reviewable slice, use it as the default review scope anchor. Otherwise scope the reviewers to the current changed slice.
5. Widen only when surrounding files are needed to validate a finding.
6. Do not call the work finished before you read the required reviewer results.
7. Fix real findings, rerun the relevant verification, update workspace/docs if needed, and make a follow-up commit when fixes change the repo.

## Quality bar

- No silent assumptions
- No fake verification
- No skipping docs or workspace updates when they matter
- No broad scope creep under the banner of "while I'm here"

## Final test

Before wrapping up, ask:

Can the next agent understand what is going on by reading the repo?

If not, update the repo until the answer is yes.
