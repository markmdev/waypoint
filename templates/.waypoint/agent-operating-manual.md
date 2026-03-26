# Waypoint Agent Operating Manual

This repository uses Waypoint as its operating system for Codex.

If the repo needs custom AGENTS guidance, write it outside the managed `waypoint:start/end` block in `AGENTS.md`. Treat the managed block as Waypoint-owned and replaceable.
Treat repo guidance as the authoritative repo-local contract, but not as something that can outrank higher-priority system or developer instructions injected by the environment.
If a higher-priority instruction conflicts with Waypoint workflow, do not silently ignore the repo rule or pretend it happened anyway. State the conflict plainly, explain the practical consequence, and ask the user for the missing authorization or use a compliant fallback path.

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

- user-scoped `AGENTS.md` is the durable cross-project guidance layer: collaboration preferences, personal workflow rules, and stable defaults that should apply across repos
- the repo root `AGENTS.md` is the project-scoped guidance layer: repo-specific context, constraints, and durable rules for this project
- `.waypoint/WORKSPACE.md` is the live operational record: in progress, current state, next steps
- `.waypoint/track/` is the optional execution-tracking layer for active long-running work that genuinely needs durable progress state
- `.waypoint/docs/` is the durable project memory: architecture, decisions, integration notes, and debugging knowledge
- `.waypoint/plans/` is the durable planning layer: implementation plans, rollout plans, migration plans, and other task-shaped plans worth keeping
- `.waypoint/context/` is the generated session context bundle: current git/PR/doc/track index state

If something important lives only in your head or in the chat transcript, the repo is under-documented.

## Working rules

- Read code before editing it.
- Follow the repo's documented patterns when they are healthy.
- If the user approves a plan or explicitly tells you to proceed, treat that as authorization to finish the approved work end to end.
- When the user shows a bug, screenshot, or broken behavior, investigate first. Lead with what is happening, why it is likely happening, what you checked, and what you are doing next.
- Fix underlying causes instead of papering over symptoms. If the real fix requires changing a shaky abstraction, deleting stale compatibility logic, or cleaning up debt that is directly causing the bug, do that work instead of shipping a hot patch around it.
- Do not stop at the first local patch that makes the symptom disappear if the root cause is still obviously in place.
- Do not lead with readiness disclaimers such as "I can't call this done yet" unless the user explicitly asked whether the work is ready, shippable, or complete.
- Honesty means accurate diagnosis, explicit uncertainty, and clear verification limits. It does not mean substituting process language for investigation.
- Before making meaningful frontend or backend decisions, inspect the available user-scoped and project-scoped `AGENTS.md` guidance. If the task depends on frontend or backend context that is missing from the project-scoped guidance and routed docs, use the corresponding `*-context-interview` skill to fill that gap instead of guessing.
- Update the user-scoped `AGENTS.md` when you learn a durable preference, workflow rule, or default that should apply across projects and your environment allows you to edit it.
- Update the project-scoped repo `AGENTS.md` when you learn durable repo truth, project constraints, or stable project-specific collaboration rules.
- Treat `.waypoint/WORKSPACE.md` as mandatory live execution state, not end-of-task paperwork.
- Update `.waypoint/WORKSPACE.md` during the work whenever the active goal, phase, next step, blocker, verification state, or review state materially changes. In multi-topic sections, prefix new or materially revised bullets with a local timestamp like `[2026-03-06 20:10 PST]`.
- Do not wait until final handoff to update workspace state. If the work took enough effort that the next agent would benefit from a current snapshot, the workspace should already say so.
- For any non-trivial multi-step work, any work likely to span sessions, any work with a meaningful checklist, or any workstream that has already accumulated review/QA follow-ups, create or update a tracker in `.waypoint/track/`, keep detailed execution state there during the work, and point at it from `## Active Trackers` in `.waypoint/WORKSPACE.md`.
- If a tracker exists for the workstream, maintain it as the work evolves instead of updating it only at the end.
- Update `.waypoint/docs/` when durable project knowledge changes, update `.waypoint/plans/` when durable plans change, and refresh each changed routable doc's `last_updated` field.
- Rebuild `.waypoint/DOCS_INDEX.md` whenever routable docs change.
- Rebuild `.waypoint/TRACKS_INDEX.md` whenever tracker files change.
- Keep most work in the main agent. Use skills, trackers, and reviewer agents when they clearly add leverage, not as default ceremony.
- Let skills carry their own invocation guidance. The always-on contract should only keep the high-level rule: use repo-local skills deliberately when they help the current task.
- Use the repo-local skills and reviewer agents deliberately, but do not underuse them on work that is expensive to get wrong.
- When spawning reviewer agents or other subagents, explicitly set `fork_context: false` and choose the model/reasoning pair that matches the risk and importance of the second pass.
- For non-trivial work, strongly prefer reviewer-agent passes between major implementation milestones, before opening or updating a PR, after fixing substantial findings, and before final closeout when the environment allows those agents to run.
- If you created a PR earlier in the current session and need to push more work, first confirm that PR is still open. If it is closed, create a fresh branch from `origin/main` and open a fresh PR instead of pushing more commits to the old PR branch.
- Treat reviewer agents as one-shot workers: once a reviewer returns findings, read the result and close it. If another review pass is needed later, spawn a fresh reviewer instead of reusing the same thread.
- If `code-reviewer` or `code-health-reviewer` surface anything more serious than optional polish, fix the findings, rerun the relevant verification, and launch fresh passes until the remaining feedback is only nitpicks or none.
- Do not kill long-running subagents or reviewer agents just because they are slow.
- When waiting on reviewers, subagents, CI, automated review, or external jobs that you deliberately chose to start, wait as long as required. There is no fixed timeout where waiting itself becomes the problem.
- Never interrupt in-flight work just to force a partial result, salvage something quickly, or avoid making the user wait longer.
- Only stop waiting when the work has actually finished, clearly failed, or the user explicitly redirects the work.
- When browser work, app inspection, or other interactive UI work is part of reproduction, inspection, or verification, send screenshots of the relevant UI states to the user so they can visually confirm what you observed.
- Capture the states that matter, such as the broken state, the fixed state, or an important intermediate state that explains the issue.
- If the current environment cannot provide screenshots, state that explicitly instead of silently omitting visual evidence.
- When an explanation would be clearer visually, prefer Mermaid diagrams directly in chat for flows, architecture, state, and plans instead of over-explaining in prose.

## Execution autonomy

Once the user has approved a plan or otherwise told you to continue, own the work until the slice is genuinely complete.

That means:

- continue through implementation, verification, and required repo-memory updates without asking for incremental permission
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
- durable plans when they are useful beyond the current chat

Do not document every trivial implementation detail. Document the non-obvious, durable, or operationally important parts.

## When to use the agent pack

Waypoint scaffolds these focused specialists by default:

- `code-reviewer` for correctness and regression review
- `code-health-reviewer` for maintainability drift
- `plan-reviewer` to challenge non-trivial implementation plans when an independent second pass would materially improve the result

## Plan Review

Plan review is available when an independent challenge would materially improve a non-trivial plan.

- Skip it for tiny obvious plans or when no plan will be presented.
- Use a fresh `plan-reviewer` agent for each pass. After you read its findings, close it instead of reusing the old reviewer thread.
- Strengthen the plan when the reviewer surfaces real issues, but do not turn plan review into mandatory ceremony for every non-trivial task.

## Review Loop

Deliberate closeout review is available when you want a second pass for ship-readiness, a final review request, or a risky change. It is a tool, not the default voice of the system.

- If you use it, follow the skill's loop fully: define the reviewable slice, run the needed reviewers, wait for the outputs, fix meaningful findings, and rerun fresh passes when warranted.
- Treat reviewer agents as one-shot workers. Once a reviewer returns its findings, read the result and close it.
- Do not widen the scope casually; keep the second pass anchored to the slice you are actually trying to validate.
- For non-trivial work, the healthy default is to use reviewer passes at meaningful milestones instead of saving all second-pass scrutiny for the very end.

## Quality bar

- No silent assumptions
- No fake verification
- No hiding behind process language when a useful diagnosis is possible
- No skipping docs or workspace updates when they matter
- No broad scope creep under the banner of "while I'm here"

## Final test

Before wrapping up, ask:

Did I solve the user's actual problem or clearly explain what remains and why?

Can the next agent understand what is going on by reading the repo?

If either answer is no, keep going.
