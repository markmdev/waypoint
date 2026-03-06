# Waypoint

It gives a repository a clean working contract for Codex:

- a small `AGENTS.md` map
- a live `WORKSPACE.md`
- indexed `docs/`
- repo-local skills under `.agents/skills/`
- optional sync for Codex App automations and user-home rules

Waypoint is a standalone Codex-native repository operating system. It is advisory-first, repo-local, and open-source-first.

## Why it exists

The next agent should be able to pick up a repository with full context by reading the repository itself.

Waypoint pushes projects toward:

- docs-first project memory
- visible operational state
- explicit session bootstrap
- battle-tested reusable workflows
- less hidden magic and less reliance on chat history

## What ships today

- `waypoint init` — scaffold the core repository contract
- `waypoint doctor` — validate repo health and detect drift
- `waypoint sync` — rebuild `DOCS_INDEX.md` and optionally sync automations/rules into Codex home
- `waypoint import-legacy` — analyze a legacy repository layout and write an adoption report into a target Waypoint repo

## Install for development

From the `projects/waypoint/` directory:

```bash
npm install
npm run build
```

Run directly in development:

```bash
npm run dev -- --help
```

Run the compiled CLI after building:

```bash
node dist/src/cli.js --help
```

Run the tests:

```bash
npm test
```

## Install for usage

Global install:

```bash
npm install -g waypoint-codex
```

One-off usage:

```bash
npx waypoint-codex@latest --help
```

After upgrading the CLI, refresh a repo's scaffold with:

```bash
waypoint init --with-automations --with-roles
waypoint doctor
```

## Quick start

Initialize a repository:

```bash
npx tsx src/cli.ts init /path/to/repo
```

Check repo health:

```bash
npx tsx src/cli.ts doctor /path/to/repo
```

Sync optional user-home artifacts:

```bash
npx tsx src/cli.ts sync /path/to/repo
```

Analyze a legacy repository layout and scaffold a target Waypoint repo:

```bash
npx tsx src/cli.ts import-legacy /path/to/source-repo /path/to/new-repo --init-target
```

## Repo contract

Waypoint creates and manages:

```text
repo/
├── AGENTS.md
├── WORKSPACE.md
├── DOCS_INDEX.md
├── docs/
├── .agents/skills/
└── .waypoint/
```

Optional packs:

- `.waypoint/automations/*.toml`
- `.waypoint/rules/*.rules`
- `.codex/config.toml`
- `.codex/agents/*.toml`

## Shipped Waypoint skills

- `planning`
- `error-audit`
- `observability-audit`
- `ux-states-audit`

## Optional role pack

If you initialize with `--with-roles`, Waypoint also scaffolds project-scoped Codex role configs for:

- `code-health-reviewer`
- `code-reviewer`
- `docs-researcher`
- `plan-reviewer`

## Tested

- `waypoint init`
- `waypoint doctor`
- `waypoint sync` with real Codex automation TOML output
- `waypoint import-legacy`

## Notes

- Core Waypoint does not require Codex App, Cloud tasks, IDE integration, plugins, or MCP.
- App automations are supported as an optional declarative sync target.
- Rules are supported as an optional sync target.

For public docs, see [docs/overview.md](docs/overview.md), [docs/architecture.md](docs/architecture.md), [docs/upgrading.md](docs/upgrading.md), [docs/releasing.md](docs/releasing.md), and [docs/importing-existing-repos.md](docs/importing-existing-repos.md).
