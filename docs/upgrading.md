# Upgrading Waypoint

## Recommended update path

If Waypoint is installed globally from npm, use:

```bash
waypoint upgrade
```

That does two things:

1. updates the globally installed `waypoint-codex` package
2. reruns `waypoint init` and `waypoint doctor` in the current repo using the repo's existing Waypoint config

## CLI-only update

If you only want to update the CLI and skip repo refresh:

```bash
waypoint upgrade --skip-repo-refresh
```

If you use `npx`, no global update step is required:

```bash
npx waypoint-codex@latest --help
```

## Repo update

If you updated the CLI outside `waypoint upgrade`, refresh the repo scaffold manually:

```bash
waypoint init --with-automations --with-roles
waypoint doctor
```

`init` is designed to refresh Waypoint-managed files and preserve the repo's user-owned files.

## What to check after upgrading

- `AGENTS.md`
- `.waypoint/WORKSPACE.md`
- `.waypoint/DOCS_INDEX.md`
- `.waypoint/SOUL.md`
- `.waypoint/agent-operating-manual.md`
- `.waypoint/scripts/prepare-context.mjs`
- `.agents/skills/`
- `.codex/agents/` if roles are enabled
