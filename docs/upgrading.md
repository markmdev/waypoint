# Upgrading Waypoint

## Recommended path

If Waypoint is installed globally from npm, use:

```bash
waypoint upgrade
```

That does two things:

1. updates the globally installed `waypoint-codex` package
2. refreshes the current repo scaffold using the repo's existing Waypoint config

If you only want to update the CLI and skip the repo refresh:

```bash
waypoint upgrade --skip-repo-refresh
```

If you use `npx`, no global update step is required:

```bash
npx waypoint-codex@latest --help
```

## Manual refresh

If you updated the CLI some other way, refresh the repo scaffold manually:

```bash
waypoint init
waypoint doctor
```

`waypoint init` is designed to refresh Waypoint-managed files while preserving user-owned repo content outside the managed scaffold.

## What to verify after upgrading

Focus on the files that define the default behavior:

- `AGENTS.md`
- `.waypoint/WORKSPACE.md`
- `.waypoint/ACTIVE_PLANS.md`
- `.waypoint/DOCS_INDEX.md`
- `.waypoint/context/`
- `.agents/skills/`
- `.codex/agents/`

## What to look for

After an upgrade, sanity-check three things:

1. The default voice still matches the product.
The core contract should read like a strong collaborator with clear judgment and useful next actions.

2. Heavy workflows still live in tools.
Review loops and ship audits should stay available without taking over the always-on layer.

3. Repo memory still has clear boundaries.
User-scoped `AGENTS.md`, project-scoped `AGENTS.md`, `.waypoint/WORKSPACE.md`, `.waypoint/docs/`, and `.waypoint/plans/` should still have distinct jobs.

## If you customized a repo

Repo-specific guidance should live outside the managed Waypoint block in `AGENTS.md`.

That means upgrades should be able to refresh Waypoint-owned content without clobbering your custom repo guidance.

If the upgrade changes the product philosophy in a meaningful way, review the repo's custom guidance and make sure it still complements the scaffold instead of fighting it.
