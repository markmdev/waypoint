# Waypoint Trackers

This directory holds active execution trackers for long-running work.

Use `.waypoint/track/` when the work is too large to fit safely in `WORKSPACE.md`, especially for:

- multi-session implementation campaigns
- broad audits followed by remediation
- large fix lists or rollout work
- verification or review loops that will take time to close

Tracker files are **execution state**, not general project memory.

- Keep durable architecture, decisions, and long-term reference material in `.waypoint/docs/`.
- Keep `WORKSPACE.md` short and current.
- Put detailed checklists, per-item status, blockers, and verification progress in `.waypoint/track/`.

Every tracker needs YAML frontmatter:

```yaml
---
summary: One-line description
last_updated: "2026-03-13 11:38 PDT"
status: active
read_when:
  - resuming the workstream
---
```

Valid tracker statuses:

- `active`
- `blocked`
- `paused`
- `done`
- `archived`

`WORKSPACE.md` should point at the active tracker file under `## Active Trackers`.
