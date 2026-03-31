# .waypoint

Repo-local Waypoint configuration and project memory files.

- `config.toml` — Waypoint configuration and file locations
- `WORKSPACE.md` — live operational state; new or materially revised entries in multi-topic sections are timestamped
- `ACTIVE_PLANS.md` — active plan pointer, execution checklist, blockers, and verification state
- `DOCS_INDEX.md` — generated docs routing map
- `docs/` — Waypoint-managed long-lived project memory (architecture, decisions, debugging knowledge); routable docs use `summary`, `last_updated`, and `read_when` frontmatter
- `plans/` — stored implementation, rollout, and migration plans
- `context/` — generated volatile context (`SNAPSHOT.md` and `RECENT_THREAD.md`)
- `scripts/` — repo-local Waypoint helper scripts

Durable guidance now lives in `AGENTS.md`:

- user-scoped `AGENTS.md` for cross-project preferences and standing rules
- project-scoped repo `AGENTS.md` for project-specific context and constraints
