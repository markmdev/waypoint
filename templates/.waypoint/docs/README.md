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

Every routable doc needs YAML frontmatter:

```yaml
---
summary: One-line description
read_when:
  - task cue
---
```

`DOCS_INDEX.md` is generated from the docs here.

