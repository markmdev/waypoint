---
"waypoint-codex": patch
---

Stop mentioning Waypoint memory in the generated gitignore block.

The default ignore rules now list the actual local-only Waypoint files explicitly, so `.waypoint/MEMORY.md` stays trackable without relying on a special exception line.
