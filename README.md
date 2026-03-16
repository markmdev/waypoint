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
- `.codex/` for the default reviewer-agent pack

The philosophy is simple:

- less hidden runtime magic
- more repo-local state
- more markdown
- better continuity for the next agent

By default, Waypoint appends a `.gitignore` snippet that ignores the exact Waypoint-created skill directories and reviewer-agent config files, plus everything under `.waypoint/` except `.waypoint/docs/`, while still ignoring the scaffolded `.waypoint/docs/README.md` and `.waypoint/docs/code-guide.md` assets. User-authored durable docs stay trackable; workspace, context, indexes, and other operational state remain local.

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
waypoint init
waypoint doctor
```

That gives you a repo that looks roughly like this:

```text
repo/
├── AGENTS.md
├── .codex/
│   ├── agents/
│   └── config.toml
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

By default, `waypoint init` updates the global CLI to the latest published `waypoint-codex` first, then scaffolds with that fresh version. It also installs the reviewer-agent pack by default. If you want to scaffold with the currently installed binary instead, use:

```bash
waypoint init --skip-cli-update
```

### App-friendly profile

```bash
waypoint init --app-friendly
```

Flags you can combine:

- `--app-friendly`
- `--skip-cli-update`

## Main commands

- `waypoint init` — update the CLI to latest by default, then scaffold or refresh the repo
- `waypoint doctor` — validate health and report drift
- `waypoint sync` — rebuild the docs and tracker indexes
- `waypoint upgrade` — update the CLI and refresh the current repo using its saved config

## Built-in skills

Waypoint ships a strong default skill pack for real coding work:

- `planning`
- `work-tracker`
- `docs-sync`
- `code-guide-audit`
- `break-it-qa`
- `conversation-retrospective`
- `frontend-ship-audit`
- `backend-ship-audit`
- `workspace-compress`
- `pre-pr-hygiene`
- `pr-review`

These are repo-local, so the workflow travels with the project.
`conversation-retrospective`, `break-it-qa`, `frontend-ship-audit`, and `backend-ship-audit` are on-demand skills, not default autonomous agent steps.

In practice, Waypoint now expects `conversation-retrospective` to run automatically after major completed work pieces so durable learnings, user feedback, errors, and skill improvements do not stay trapped in chat.

## Reviewer agents

Waypoint scaffolds these reviewer agents by default:

- `code-health-reviewer`
- `code-reviewer`
- `plan-reviewer`

The intended workflow is closeout-based: run `code-reviewer` before considering any non-trivial implementation slice complete, and run `code-health-reviewer` before considering medium or large changes complete, especially when they add structure, duplicate logic, or introduce new abstractions. If both apply, run them in parallel. A recent self-authored commit is the preferred scope anchor when one cleanly represents the slice, but it is not the only valid trigger.

For planning work, run `plan-reviewer` before presenting a non-trivial implementation plan to the user and iterate until it has no meaningful review findings left.

When the user approves a reviewed plan or explicitly says to proceed, the intended Waypoint behavior is autonomous execution: keep going through implementation, verification, review, and repo-memory updates unless a real blocker or materially risky unresolved decision requires a pause. If reviewers, subagents, CI, or other external work are still running, Waypoint should wait as long as necessary rather than interrupting them for speed. For PR work, placeholder automated-review states like CodeRabbit's "review in progress" do not count as a completed review.

When browser-based reproduction or verification is part of the work, Waypoint should also send screenshots of the relevant UI states so the user can see the evidence directly.

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

## Learn more

- [Overview](docs/overview.md)
- [Architecture](docs/architecture.md)
- [Upgrading](docs/upgrading.md)
- [Releasing](docs/releasing.md)

## License

MIT. See [LICENSE](LICENSE).
