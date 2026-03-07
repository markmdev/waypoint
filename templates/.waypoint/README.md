# .waypoint

Repo-local Waypoint configuration and optional integration sources.

- `config.toml` — Waypoint feature toggles and file locations
- `WORKSPACE.md` — live operational state; new or materially revised entries in multi-topic sections are timestamped
- `DOCS_INDEX.md` — generated docs routing map
- `SOUL.md` — agent identity and working values
- `agent-operating-manual.md` — required session workflow
- `docs/` — Waypoint-managed project memory (architecture, decisions, debugging knowledge, durable plans); routable docs use `summary`, `last_updated`, and `read_when` frontmatter
- `agents/` — agent prompt files that optional Codex roles can read and follow
- `automations/` — optional automation source specs
- `context/` — generated session context bundle
- `rules/` — optional rule source files
- `scripts/` — repo-local Waypoint helper scripts
- `state/` — local sync state and tooling metadata
