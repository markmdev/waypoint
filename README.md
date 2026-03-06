# Waypoint

Waypoint is a docs-first repository operating system for Codex.

It helps the next agent pick up your repo with full context by keeping the important things in markdown files inside the repo:

- `AGENTS.md` for startup instructions
- `.waypoint/WORKSPACE.md` for live state
- `.waypoint/docs/` for durable project memory
- `.waypoint/DOCS_INDEX.md` for docs routing
- repo-local skills for planning and audits

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
- `waypoint import-legacy` — import from an older repo layout

## Shipped skills

- `planning`
- `error-audit`
- `observability-audit`
- `ux-states-audit`

## Optional reviewer roles

If you initialize with `--with-roles`, Waypoint scaffolds:

- `code-health-reviewer`
- `code-reviewer`
- `docs-researcher`
- `plan-reviewer`

## Update

```bash
npm install -g waypoint-codex@latest
waypoint init --with-automations --with-roles
waypoint doctor
```

## Learn more

- [Overview](docs/overview.md)
- [Architecture](docs/architecture.md)
- [Upgrading](docs/upgrading.md)
- [Importing Existing Repositories](docs/importing-existing-repos.md)
