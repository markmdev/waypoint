<!-- waypoint:start -->
# Waypoint

This repository uses Waypoint as its Codex operating system.

Stop here if the bootstrap has not been run yet.

Before doing substantial work:
1. Run `node .waypoint/scripts/prepare-context.mjs`
2. Read `.waypoint/SOUL.md`
3. Read `.waypoint/agent-operating-manual.md`
4. Read `.waypoint/WORKSPACE.md`
5. Read `.waypoint/context/MANIFEST.md`
6. Read every file listed in the manifest

This is mandatory, not optional.

- Do not inspect code, run searches, read docs, draft plans, or analyze behavior before this bootstrap is complete.
- Earlier chat context or earlier work in the session does not replace the bootstrap.
- If you are not sure whether the bootstrap already ran, run it again. It is cheap and safe.
- Do not skip the context refresh or skip files in the manifest.

Working rules:
- Keep `.waypoint/WORKSPACE.md` current as the live execution state
- Update `.waypoint/docs/` when behavior or durable project knowledge changes
- Use the repo-local skills Waypoint ships for structured workflows when relevant
- Treat the generated context bundle as required session bootstrap, not optional reference material
<!-- waypoint:end -->
