# Upgrading Waypoint

## CLI update

If Waypoint is installed globally from npm:

```bash
npm install -g waypoint-codex@latest
```

If you use `npx`, no global update step is required:

```bash
npx waypoint-codex@latest --help
```

## Repo update

After upgrading the CLI, refresh the repo scaffold:

```bash
waypoint init --with-automations --with-roles
waypoint doctor
```

`init` is designed to refresh Waypoint-managed files and preserve the repo's user-owned files.

## What to check after upgrading

- `AGENTS.md`
- `.waypoint/SOUL.md`
- `.waypoint/agent-operating-manual.md`
- `.waypoint/scripts/prepare-context.mjs`
- `.agents/skills/`
- `.codex/agents/` if roles are enabled

