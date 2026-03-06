# Waypoint Agent Operating Manual

This repository uses Waypoint as its operating system for Codex.

## Session start

At the start of every session:

1. Run `node .waypoint/scripts/prepare-context.mjs`
2. Read `.waypoint/SOUL.md`
3. Read this file
4. Read `WORKSPACE.md`
5. Read `.waypoint/context/MANIFEST.md`
6. Read every file listed in that manifest

Do not skip this sequence.

## Repository memory model

The repository should contain the context the next agent needs.

- `WORKSPACE.md` is the live operational record: in progress, current state, next steps
- `docs/` is the durable project memory: architecture, decisions, integration notes, debugging knowledge, and durable plans
- `.waypoint/context/` is the generated session context bundle: current git/PR/doc index state

If something important lives only in your head or in the chat transcript, the repo is under-documented.

## Working rules

- Read code before editing it.
- Follow the repo's documented patterns when they are healthy.
- Update `WORKSPACE.md` as live execution state when progress meaningfully changes.
- Update `docs/` when durable knowledge changes.
- Rebuild `DOCS_INDEX.md` whenever routable docs change.
- Use the repo-local skills and optional reviewer agents instead of improvising from scratch.

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

## When to use the optional reviewer agents

If the repo was initialized with Waypoint roles enabled, use them as focused second-pass specialists:

- `code-reviewer` for correctness and regression review
- `code-health-reviewer` for maintainability drift
- `docs-researcher` for external dependency research
- `plan-reviewer` to challenge weak implementation plans before execution

## Quality bar

- No silent assumptions
- No fake verification
- No skipping docs or workspace updates when they matter
- No broad scope creep under the banner of "while I'm here"

## Final test

Before wrapping up, ask:

Can the next agent understand what is going on by reading the repo?

If not, update the repo until the answer is yes.
