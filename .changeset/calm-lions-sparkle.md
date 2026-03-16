---
"waypoint-codex": patch
---

Fix the shipped wait/review workflow so Waypoint waits as long as needed for in-flight reviewers, subagents, CI, and automated review, and so the `pr-review` skill keeps waiting for new review rounds and requires inline replies on every meaningful review thread.
