---
"waypoint-codex": minor
---

Support multiple configured docs and plans roots in the docs index while preserving the default `.waypoint/docs` and `.waypoint/plans` routing. Refreshes now keep custom index roots in config, and docs scanning skips symlinked directories to avoid recursive loops.
