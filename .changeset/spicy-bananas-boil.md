---
"waypoint-codex": minor
---

Move the durable memory layer into `.waypoint/MEMORY.md`.

New Waypoint repos now scaffold memory inside `.waypoint/`, existing repos migrate their old root `MEMORY.md` automatically on refresh, and the ignore rules were updated so the memory file stays trackable even though the rest of the Waypoint operating layer remains mostly local.
