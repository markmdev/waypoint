# Waypoint Architecture

## Core layers

### 1. Repo contract

The always-on layer should stay lean and load-bearing:

- `AGENTS.md`
- `.waypoint/WORKSPACE.md`
- `.waypoint/DOCS_INDEX.md`
- generated startup context in `.waypoint/context/`

This layer defines:

- how to bootstrap
- how to route context
- how to communicate
- how to distinguish durable memory from live state

More specialized workflows live in skills and reviewer agents, where they can be used deliberately.

### 2. Memory layer

Waypoint separates repo memory into three different jobs:

- user-scoped `AGENTS.md` for cross-project preferences, standing rules, and stable defaults
- the repo root `AGENTS.md` for project-specific context, constraints, and durable collaboration rules
- `.waypoint/WORKSPACE.md` for live operational state
- `.waypoint/docs/` for durable project behavior, architecture, decisions, and debugging knowledge
- `.waypoint/plans/` for durable implementation, rollout, migration, and investigation plans

Waypoint uses those as the default routed roots, but the docs index can also include additional explicit docs and plans roots from `.waypoint/config.toml`.
Each configured root is scanned recursively, and only Markdown files with valid Waypoint frontmatter are routed into `.waypoint/DOCS_INDEX.md`.

This separation matters because many bad agent experiences come from mixing personal preferences, active task state, and project knowledge into one noisy blob.

### 3. Skill layer

Repo-local skills under `.agents/skills/` handle structured workflows such as:

- planning
- work tracking
- merge-ready ownership
- code-guide audits
- adversarial review
- PR review
- retrospectives
- ship-readiness audits

The key design choice is that these workflows are optional tools.

They exist so the repo can reach for more rigor when needed without forcing that rigor into every normal interaction.

### 4. Agent layer

Waypoint can scaffold helper and reviewer agents under `.codex/agents/`.

These are for deliberate use:

- `coding-agent` for bounded implementation slices where delegation truly helps
- `code-reviewer` for correctness and regression review
- `code-health-reviewer` for maintainability review
- `plan-reviewer` for challenging plans that carry real design risk

The main agent should keep most work local by default.

### 5. Generated context layer

Waypoint rebuilds explicit startup context on purpose:

- `.waypoint/DOCS_INDEX.md`
- `.waypoint/TRACKS_INDEX.md`
- `.waypoint/context/MANIFEST.md`
- generated recent-thread continuity

This gives the agent continuity without requiring hidden prompt magic.

## Execution model

Waypoint's default execution model is:

- collaborator-first
- investigation-first
- ownership-based after approval

That means the agent should usually:

- stay in the main thread
- diagnose the issue
- make progress directly
- verify what it changed
- update the right memory surfaces

Waypoint adds rigor through explicit escalation paths:

- delegate bounded implementation slices when delegation clearly helps
- use review passes when the user asks for them or the change is risky
- use explicit ship workflows when preparing to release

## Review model

Waypoint offers deliberate second-pass review for moments that benefit from extra scrutiny.

Use second-pass review when:

- the user asks for it
- the work is risky
- you are preparing to ship
- a PR workflow calls for it

`adversarial-review` is the main repo-local workflow for that pass.

## Bootstrap flow

Waypoint's session bootstrap is explicit and event-based:

1. run `.waypoint/scripts/prepare-context.mjs`
2. read `.waypoint/SOUL.md`
3. read `.waypoint/agent-operating-manual.md`
4. read `.waypoint/WORKSPACE.md`
5. read `.waypoint/context/MANIFEST.md`
6. read everything listed there

This is the replacement for hidden hook-based context injection.

## Quality bar

A good Waypoint repo should satisfy both of these:

- the next agent can understand what is going on
- the current user experiences the agent as clear, useful, and collaborative

If only one of those is true, the architecture is not doing its job.
