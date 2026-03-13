# Waypoint Docs

This directory is Waypoint-managed project memory.

Put the durable context here that the next agent will need to continue the work:

- architecture
- decisions and tradeoffs
- integration notes
- invariants and constraints
- debugging knowledge
- active plans that should survive beyond one session

These are **project docs**, not Waypoint internals.

Do not use `.waypoint/docs/` as the execution tracker layer for active long-running work. That belongs under `.waypoint/track/`.

Every routable doc needs YAML frontmatter:

```yaml
---
summary: One-line description
last_updated: "2026-03-06 20:10 PST"
read_when:
  - task cue
---
```

Refresh `last_updated` whenever you materially change a doc. `DOCS_INDEX.md` is generated from the docs here.
