# Waypoint

Waypoint is a docs-first repository operating system for Codex.

It helps the next agent pick up your repo with full context by keeping the important things in markdown files inside the repo:

- `AGENTS.md` for startup instructions
- `.waypoint/WORKSPACE.md` for live state, with timestamped multi-topic entries
- `.waypoint/docs/` for durable project memory, with `summary`, `last_updated`, and `read_when` frontmatter on routable docs
- `.waypoint/DOCS_INDEX.md` for docs routing
- repo-local skills for planning, audits, verification, workspace compression, and review closure

## Install

```bash
npm install -g waypoint-codex
```

Or use it without installing globally:

```bash
npx waypoint-codex@latest --help
```

## Start using it

Inside your Codex project:

```bash
waypoint init --with-automations --with-roles
waypoint doctor
```

That scaffolds:

```text
repo/
├── AGENTS.md
├── .agents/skills/
└── .waypoint/
    ├── WORKSPACE.md
    ├── DOCS_INDEX.md
    ├── docs/
    ├── context/
    └── ...
```

## Main commands

- `waypoint init` — scaffold or refresh the repo
- `waypoint doctor` — check for drift and missing pieces
- `waypoint sync` — rebuild `.waypoint/DOCS_INDEX.md` and sync optional automations/rules
- `waypoint upgrade` — update the global Waypoint CLI and refresh the current repo with its existing config
- `waypoint import-legacy` — import from an older repo layout

## Shipped skills

- `planning`
- `error-audit`
- `observability-audit`
- `ux-states-audit`
- `docs-sync`
- `code-guide-audit`
- `break-it-qa`
- `workspace-compress`
- `pre-pr-hygiene`
- `pr-review`
- `e2e-verify`

## Optional reviewer roles

If you initialize with `--with-roles`, Waypoint scaffolds:

- `code-health-reviewer`
- `code-reviewer`
- `plan-reviewer`

The intended workflow is post-commit: after your own commit lands, run `code-reviewer` and `code-health-reviewer` in parallel in the background, then fix real findings before you call the work finished.

## Update

```bash
waypoint upgrade
```

If you only want to update the CLI without refreshing the repo:

```bash
waypoint upgrade --skip-repo-refresh
```

## Learn more

- [Overview](docs/overview.md)
- [Architecture](docs/architecture.md)
- [Upgrading](docs/upgrading.md)
- [Importing Existing Repositories](docs/importing-existing-repos.md)
