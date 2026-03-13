# Waypoint

Waypoint is a docs-first repository operating system for Codex.

It helps the next agent understand your repo by making the important context live in the repo itself instead of disappearing into chat history.

## Why people use it

Most agent workflows break down the same way:

- the next session starts half-blind
- important project docs exist, but the agent does not know which ones matter
- workspace notes turn into noisy append-only logs
- repo conventions live in people's heads instead of files
- review and cleanup happen inconsistently

Waypoint gives you a lightweight repo contract that fixes those problems with explicit files, generated context, and a strong default skill set.

## What Waypoint sets up

Waypoint scaffolds a Codex-friendly repo structure built around a few core pieces:

- `AGENTS.md` for the startup contract
- `.waypoint/WORKSPACE.md` for live operational state
- `.waypoint/track/` for active long-running execution trackers
- `.waypoint/docs/` for durable project memory
- `.waypoint/DOCS_INDEX.md` for docs routing
- `.waypoint/TRACKS_INDEX.md` for tracker routing
- `.waypoint/context/` for generated startup context
- `.agents/skills/` for repo-local workflows like planning, tracking, audits, and QA

The philosophy is simple:

- less hidden runtime magic
- more repo-local state
- more markdown
- better continuity for the next agent

## Best fit

Waypoint is most useful when you want:

- multi-session continuity in a real repo
- a durable docs and workspace structure for agents
- stronger planning, tracking, review, QA, and closeout defaults
- repo-local scaffolding instead of a bunch of global mystery behavior

If you only use Codex for tiny one-off edits, Waypoint is probably unnecessary.

## Install

Waypoint requires Node 20+.

```bash
npm install -g waypoint-codex
```

Or run it without a global install:

```bash
npx waypoint-codex@latest --help
```

## Quick start

Inside the repo you want to prepare for Codex:

```bash
waypoint init --with-roles --with-automations
waypoint doctor
```

That gives you a repo that looks roughly like this:

```text
repo/
├── AGENTS.md
├── .agents/
│   └── skills/
└── .waypoint/
    ├── DOCS_INDEX.md
    ├── TRACKS_INDEX.md
    ├── WORKSPACE.md
    ├── docs/
    ├── track/
    ├── context/
    ├── scripts/
    └── ...
```

From there, start your Codex session in the repo and follow the generated bootstrap in `AGENTS.md`.

## Common init modes

### Minimal setup

```bash
waypoint init
```

By default, `waypoint init` updates the global CLI to the latest published `waypoint-codex` first, then scaffolds with that fresh version. If you want to scaffold with the currently installed binary instead, use:

```bash
waypoint init --skip-cli-update
```

### Full local workflow setup

```bash
waypoint init --with-roles --with-rules --with-automations
```

### App-friendly profile

```bash
waypoint init --app-friendly --with-roles --with-automations
```

Flags you can combine:

- `--app-friendly`
- `--with-roles`
- `--with-rules`
- `--with-automations`
- `--skip-cli-update`

## Main commands

- `waypoint init` — update the CLI to latest by default, then scaffold or refresh the repo
- `waypoint doctor` — validate health and report drift
- `waypoint sync` — rebuild the docs index and sync optional user-home artifacts
- `waypoint upgrade` — update the CLI and refresh the current repo using its saved config
- `waypoint import-legacy` — analyze an older repo layout and produce an adoption report

## Built-in skills

Waypoint ships a strong default skill pack for real coding work:

- `planning`
- `work-tracker`
- `docs-sync`
- `code-guide-audit`
- `break-it-qa`
- `workspace-compress`
- `pre-pr-hygiene`
- `pr-review`

These are repo-local, so the workflow travels with the project.

## Optional reviewer roles

If you initialize with `--with-roles`, Waypoint scaffolds:

- `code-health-reviewer`
- `code-reviewer`
- `plan-reviewer`

The intended workflow is chunk-based: once there is a meaningful reviewable slice, run the reviewers in parallel, fix real findings, then close out. A recent self-authored commit is the preferred scope anchor when one cleanly represents the slice, but it is not the only valid trigger.

## What makes it different

Waypoint is not trying to hide everything behind hooks and background machinery.

It is opinionated, but explicit:

- state lives in files you can inspect
- docs routing is generated, not guessed from memory
- repo conventions are encoded in markdown
- startup context is rebuilt on purpose
- the repo remains the source of truth

## Upgrading

Recommended path:

```bash
waypoint upgrade
```

That updates the global CLI and refreshes the current repo using its existing Waypoint config.

If you only want to update the CLI:

```bash
waypoint upgrade --skip-repo-refresh
```

## Importing an existing repo

If you already have an older assistant setup or repo-memory system:

```bash
waypoint import-legacy /path/to/source-repo /path/to/new-repo --init-target
```

This generates an adoption report and helps separate durable docs from old runtime-specific scaffolding.

## Learn more

- [Overview](docs/overview.md)
- [Architecture](docs/architecture.md)
- [Upgrading](docs/upgrading.md)
- [Importing Existing Repositories](docs/importing-existing-repos.md)
- [Releasing](docs/releasing.md)

## License

MIT. See [LICENSE](LICENSE).
