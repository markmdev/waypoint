---
"waypoint-codex": patch
---

Add a managed-agent rule that makes the agent re-check whether a session-created PR is still open before pushing more work, and reopen the work on a fresh branch and PR from `origin/main` if that earlier PR was closed.
