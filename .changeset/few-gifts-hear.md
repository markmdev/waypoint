---
"waypoint-codex": patch
---

Fix the shipped PR workflow so placeholder automated-review states like CodeRabbit's "review in progress" are treated as unfinished, and so PRs are not considered clear until the required Waypoint reviewer-agent passes have actually run.
