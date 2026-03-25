# .waypoint

Repo-local Waypoint configuration and project memory files.

- `config.toml` — Waypoint feature toggles and file locations
- `WORKSPACE.md` — live operational state; new or materially revised entries in multi-topic sections are timestamped
- `DOCS_INDEX.md` — generated docs and plans routing map
- `SOUL.md` — agent identity and working values
- `agent-operating-manual.md` — required session workflow
- `docs/` — Waypoint-managed long-lived project memory (architecture, decisions, debugging knowledge); routable docs use `summary`, `last_updated`, and `read_when` frontmatter
- `plans/` — durable implementation, rollout, and migration plans; routable plans use `summary`, `last_updated`, and `read_when` frontmatter
- `agents/` — agent prompt files that Waypoint's reviewer agents can read and follow
- `context/` — generated session context bundle
- `scripts/` — repo-local Waypoint helper scripts

Durable guidance now lives in `AGENTS.md`:

- user-scoped `AGENTS.md` for cross-project preferences and standing rules
- project-scoped repo `AGENTS.md` for project-specific context and constraints
