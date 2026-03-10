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
- `.waypoint/docs/` is the durable project memory: architecture, decisions, integration notes, debugging knowledge, and durable plans
- `.waypoint/context/` is the generated session context bundle: current git/PR/doc index state

If something important lives only in your head or in the chat transcript, the repo is under-documented.

## Working rules

- Read code before editing it.
- Follow the repo's documented patterns when they are healthy.
- Update `.waypoint/WORKSPACE.md` as live execution state when progress meaningfully changes. In multi-topic sections, prefix new or materially revised bullets with a local timestamp like `[2026-03-06 20:10 PST]`.
- Update `.waypoint/docs/` when durable knowledge changes, and refresh each changed routable doc's `last_updated` field.
- Rebuild `.waypoint/DOCS_INDEX.md` whenever routable docs change.
- Use the repo-local skills and optional reviewer agents instead of improvising from scratch.
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
- `error-audit` when failures are being swallowed or degraded invisibly
- `observability-audit` when production debugging signals look weak
- `ux-states-audit` when async/data-driven UI likely lacks loading, empty, or error states
- `docs-sync` when routed docs may be stale, missing, or inconsistent with the codebase
- `workspace-compress` after meaningful chunks, before stopping, and before review when the live handoff needs compression
- `pre-pr-hygiene` before pushing or opening/updating a PR for substantial work
- `pr-review` once a PR has active review comments or automated review in progress
- `e2e-verify` for major user-facing or cross-system changes that need manual end-to-end verification

## When to use the optional reviewer agents

If the repo was initialized with Waypoint roles enabled, use them as focused second-pass specialists:

- `code-reviewer` for correctness and regression review
- `code-health-reviewer` for maintainability drift
- `plan-reviewer` to challenge weak implementation plans before execution

## Post-Commit Review Loop

If Waypoint's optional roles are enabled and you authored a commit, immediately after that commit:

1. Launch `code-reviewer` and `code-health-reviewer` in parallel as background, read-only reviewers.
2. Scope them to the commit you just made, then widen only when surrounding files are needed to validate a finding.
3. Do not call the work finished before you read both reviewer results.
4. Fix real findings, rerun the relevant verification, update workspace/docs if needed, and make a follow-up commit when fixes change the repo.

## Quality bar

- No silent assumptions
- No fake verification
- No skipping docs or workspace updates when they matter
- No broad scope creep under the banner of "while I'm here"

## Final test

Before wrapping up, ask:

Can the next agent understand what is going on by reading the repo?

If not, update the repo until the answer is yes.
