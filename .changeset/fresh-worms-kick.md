---
"waypoint-codex": patch
---

Fix `waypoint upgrade` so it rewrites older Waypoint `.gitignore` sections in place instead of duplicating the `# Waypoint state` block. Future scaffolds now use an explicit end marker to keep the Waypoint ignore section stable across upgrades.
