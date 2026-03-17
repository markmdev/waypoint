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
- If the user approves a plan or explicitly tells you to proceed, treat that as authorization to finish the approved work end to end.
- Update `.waypoint/WORKSPACE.md` as live execution state when progress meaningfully changes. In multi-topic sections, prefix new or materially revised bullets with a local timestamp like `[2026-03-06 20:10 PST]`.
- For large multi-step work, create or update a tracker in `.waypoint/track/`, keep detailed execution state there, and point at it from `## Active Trackers` in `.waypoint/WORKSPACE.md`.
- Update `.waypoint/docs/` when durable knowledge changes, and refresh each changed routable doc's `last_updated` field.
- Rebuild `.waypoint/DOCS_INDEX.md` whenever routable docs change.
- Rebuild `.waypoint/TRACKS_INDEX.md` whenever tracker files change.
- When spawning reviewer agents or other subagents, explicitly set `fork_context: false`, `model` to `gpt-5.4`, and `reasoning_effort` to `high` unless the user explicitly requests a different model or lower reasoning.
- Use the repo-local skills and reviewer agents instead of improvising from scratch.
- Treat reviewer agents as one-shot workers: once a reviewer returns findings, read the result and close it. If another review pass is needed later, spawn a fresh reviewer instead of reusing the same thread.
- Do not kill long-running subagents or reviewer agents just because they are slow.
- When waiting on reviewers, subagents, CI, automated review, or external jobs, wait as long as required. There is no fixed timeout where waiting itself becomes the problem.
- Never interrupt in-flight work just to force a partial result, salvage something quickly, or avoid making the user wait longer.
- Only stop waiting when the work has actually finished, clearly failed, or the user explicitly redirects the work.
- When browser work is part of reproduction or verification, send screenshots of the relevant UI states to the user so they can visually confirm what you observed.
- Capture the states that matter, such as the broken state, the fixed state, or an important intermediate state that explains the issue.
- If the current environment cannot provide screenshots, state that explicitly instead of silently omitting visual evidence.
- When an explanation would be clearer visually, prefer Mermaid diagrams directly in chat for flows, architecture, state, and plans instead of over-explaining in prose.
- Use `visual-explanations` when the explanation needs a richer generated image or an annotated screenshot rather than only text or Mermaid.

## Execution autonomy

Once the user has approved a plan or otherwise told you to continue, own the work until the slice is genuinely complete.

That means:

- continue through implementation, verification, reviewer passes, and required docs/workspace updates without asking for incremental permission
- use commentary for short progress updates, not as a handoff back to the user
- do not stop just to announce the next obvious step and ask whether to do it

Pause only when:

- a real blocker prevents forward progress
- a hidden-risk or non-obvious decision would materially change scope, behavior, cost, or data safety
- the user explicitly redirects, pauses, or narrows the work

If none of those are true, keep going.

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
- `adversarial-review` when a non-trivial implementation slice is nearing completion and needs the default closeout loop for reviewer agents plus code-guide checks
- `visual-explanations` when a generated image or annotated screenshot would explain the work more clearly than prose alone; Mermaid diagrams do not need a skill
- `conversation-retrospective` after major completed work pieces so the active conversation is distilled into durable memory, user feedback and errors are preserved, exercised skills are improved, and real new-skill candidates are recorded
- `break-it-qa` when a browser-facing feature should be attacked with invalid inputs, refreshes, repeated clicks, wrong action order, or other adversarial manual QA
- `frontend-ship-audit` and `backend-ship-audit` only when the user explicitly requests a ship-readiness audit; do not trigger them autonomously as part of the default Waypoint workflow
- `workspace-compress` after meaningful chunks, before stopping, and before review when the live handoff needs compression
- `pre-pr-hygiene` before pushing or opening/updating a PR for substantial work
- `pr-review` once a PR has active review comments or automated review in progress

Treat `conversation-retrospective` as a default closeout step for major work pieces, not as a rare manual tool.

## When to use the reviewer agents

Waypoint scaffolds these focused second-pass specialists by default:

- `code-reviewer` for correctness and regression review
- `code-health-reviewer` for maintainability drift
- `plan-reviewer` to challenge non-trivial implementation plans before they are shown to the user

## Plan Review

Run `plan-reviewer` before presenting a non-trivial implementation plan to the user.

- Use it when the plan includes meaningful design choices, multiple work phases, migrations, or non-obvious tradeoffs.
- Skip it for tiny obvious plans or when no plan will be presented.
- Use a fresh `plan-reviewer` agent for each pass. After you read its findings, close it instead of reusing the old reviewer thread.
- Read the reviewer result, strengthen the plan, and rerun `plan-reviewer` until there are no meaningful issues left before showing the plan to the user.

## Review Loop

Use `adversarial-review` before considering the work complete, not just as a reflex after every tiny commit.

1. Run `adversarial-review` before considering any non-trivial implementation slice complete.
2. That skill owns the default closeout loop for the current slice: define the scope, run `code-reviewer`, run `code-health-reviewer` when applicable, run `code-guide-audit`, wait as long as needed, fix meaningful issues, and repeat with fresh reviewer rounds until no meaningful findings remain.
3. Treat reviewer agents as one-shot workers. Once a reviewer returns its findings, read the result and close it.
4. If you need another review pass after changes, spawn a fresh reviewer agent rather than reusing the old thread.
5. If you have a recent self-authored commit that cleanly represents the reviewable slice, use it as the default review scope anchor. Otherwise scope the review loop to the current changed slice.
6. Widen only when surrounding files are needed to validate a finding.
7. Do not call the work finished before you read the required closeout outputs.
8. Wait for reviewer outputs even if that requires repeated or long waits. Do not interrupt them just because they are still running.
9. Do not call a PR clear, ready, or done until the required reviewer-agent passes for the current slice have actually run.

## Quality bar

- No silent assumptions
- No fake verification
- No skipping docs or workspace updates when they matter
- No broad scope creep under the banner of "while I'm here"

## Final test

Before wrapping up, ask:

Can the next agent understand what is going on by reading the repo?

If not, update the repo until the answer is yes.
