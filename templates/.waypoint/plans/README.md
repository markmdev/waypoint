# Waypoint Plans

This directory is for durable plan documents.

Put plans here when they should stay in the repo beyond the current chat:

- implementation plans
- rollout plans
- migration plans
- investigation plans
- other task-specific design docs that are still useful after the session ends

Keep long-lived reference docs in `.waypoint/docs/`.

Every routable plan needs YAML frontmatter:

```yaml
---
summary: One-line description
last_updated: "2026-03-06 20:10 PST"
read_when:
  - task cue
---
```

Refresh `last_updated` whenever you materially change a plan. `DOCS_INDEX.md` is generated from both `.waypoint/docs/` and `.waypoint/plans/`.
