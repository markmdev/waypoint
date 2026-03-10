<!-- waypoint:start -->
# Waypoint

This repository uses Waypoint as its Codex operating system.

Waypoint owns only the text inside these `waypoint:start/end` markers.
If you need repo-specific AGENTS instructions, write them outside this managed block.
Do not put durable repo guidance inside the managed block, because `waypoint init` may replace it during upgrades.

Stop here if the bootstrap has not been run yet.

Run the Waypoint bootstrap only in these cases:
- at the start of a new session
- immediately after a compaction
- if the user explicitly tells you to rerun it

Bootstrap sequence:
1. Run `node .waypoint/scripts/prepare-context.mjs`
2. Read `.waypoint/SOUL.md`
3. Read `.waypoint/agent-operating-manual.md`
4. Read `.waypoint/WORKSPACE.md`
5. Read `.waypoint/context/MANIFEST.md`
6. Read every file listed in the manifest

This is mandatory, not optional.

- Do not skip it at session start or after compaction.
- Do not rerun it mid-conversation just because a task is substantial.
- Earlier chat context or earlier work in the session does not replace the bootstrap when a new session starts or a compaction happens.
- If you are not sure whether a new session started or a compaction happened, rerun it.
- Do not skip the context refresh or skip files in the manifest.

Working rules:
- Keep `.waypoint/WORKSPACE.md` current as the live execution state, with timestamped new or materially revised entries in multi-topic sections
- Update `.waypoint/docs/` when behavior or durable project knowledge changes, and refresh `last_updated` on touched routable docs
- Use the repo-local skills Waypoint ships for structured workflows when relevant
- Use `docs-sync` when the docs may be stale or a change altered shipped behavior, contracts, routes, or commands
- If optional reviewer roles are present and you make a commit, run `code-reviewer` and `code-health-reviewer` in parallel before calling the work done
- Before pushing or opening/updating a PR for substantial work, use `pre-pr-hygiene`
- Use `pr-review` once a PR has active review comments or automated review in progress
- Use `e2e-verify` for major user-facing or cross-system changes that need manual end-to-end verification
- Treat the generated context bundle as required session bootstrap, not optional reference material
<!-- waypoint:end -->
