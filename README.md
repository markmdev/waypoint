# Waypoint

Waypoint is a collaborator-first repository operating system for Codex.

It exists to solve two problems at the same time:

- the next agent should be able to pick up the repo with real context
- the current agent should still feel smart, direct, and useful

## What Waypoint is for

Waypoint is built for repos where continuity and collaboration both matter.

It gives the next session real context and keeps the current session clear and useful.

Waypoint adds:

- explicit repo-local memory
- strong default collaboration
- optional structured workflows when the task actually needs them

The default mode centers a simple loop:

- investigate the issue
- explain what is happening
- fix what you can
- verify it
- leave the repo clearer than you found it

## Core idea

Waypoint keeps the good parts of a repo operating system:

- durable context in files
- explicit startup and routing
- repo-local skills
- reusable reviewer agents
- generated context for continuity

Those systems work best when they stay explicit and well-scoped.

Structured workflows belong in tools:

- review loops
- ship-readiness passes
- trackers
- retrospectives
- pre-PR hygiene

That keeps the default conversation focused on diagnosis, progress, and verification.

## What Waypoint sets up

Waypoint scaffolds a Codex-friendly repo around a few core pieces:

- `AGENTS.md` for the startup contract
- `.waypoint/MEMORY.md` for durable user/team preferences and collaboration context
- `.waypoint/WORKSPACE.md` for live operational state
- `.waypoint/docs/` for long-lived project docs
- `.waypoint/plans/` for durable plan documents
- `.waypoint/DOCS_INDEX.md` for docs and plans routing
- `.waypoint/context/` for generated startup context
- `.waypoint/track/` for long-running work that truly needs durable progress tracking
- `.agents/skills/` for optional structured workflows
- `.codex/` for optional reviewer and helper agents

The philosophy is simple:

- less hidden runtime magic
- more explicit repo-local state
- stronger default collaboration
- investigation before status narration
- structured workflows that stay in their own tools

By default, Waypoint routes docs from `.waypoint/docs/` and plans from `.waypoint/plans/`.
If your repo keeps routable docs elsewhere, you can add more explicit roots in `.waypoint/config.toml` with `docs_dirs` and `plans_dirs`.
Waypoint scans each configured root recursively and only includes Markdown files with valid Waypoint frontmatter.

## Best fit

Waypoint is most useful when you want:

- multi-session continuity in a real repo
- a durable memory structure for agents
- a cleaner default collaboration style
- optional planning, review, QA, and release workflows that travel with the project

If you only use Codex for tiny one-off edits, Waypoint is probably unnecessary.

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
    ├── MEMORY.md
    ├── TRACKS_INDEX.md
    ├── WORKSPACE.md
    ├── docs/
    ├── plans/
    ├── track/
    ├── context/
    ├── scripts/
    └── ...
```

From there, start your Codex session in the repo and follow the generated bootstrap in `AGENTS.md`.

If you want to add more routable roots, extend `.waypoint/config.toml` like this:

```toml
docs_dirs = [
  ".waypoint/docs",
  "services/app/docs",
]

plans_dirs = [
  ".waypoint/plans",
  "services/app/plans",
]
```

## Built-in skills

Waypoint ships a strong default skill pack for real coding work:

- `planning`
- `work-tracker`
- `docs-sync`
- `code-guide-audit`
- `adversarial-review`
- `break-it-qa`
- `conversation-retrospective`
- `frontend-ship-audit`
- `backend-ship-audit`
- `workspace-compress`
- `pre-pr-hygiene`
- `pr-review`

These are repo-local, so the workflow travels with the project.

The important design choice is that they stay out of the always-on voice.
Each skill explains what it is for and when it should be invoked.

## Reviewer agents

Waypoint scaffolds these reviewer agents by default:

- `code-health-reviewer`
- `code-reviewer`
- `plan-reviewer`

They are available for deliberate second passes.

## What makes Waypoint different

Waypoint is opinionated, but explicit:

- state lives in files you can inspect
- docs routing is generated, not guessed from memory
- the default contract tells the agent to investigate first
- durable memory is separated into user/team memory, live workspace state, project docs, and plan docs
- visual explanation stays lightweight: Mermaid in chat and screenshots from real UI inspection
- heavier workflows stay in optional skills

## Install

Waypoint requires Node 20+.

```bash
npm install -g waypoint-codex
```

Or run it without a global install:

```bash
npx waypoint-codex@latest --help
```

## Main commands

- `waypoint init` — scaffold or refresh the repo and, by default, update the global CLI first
- `waypoint doctor` — validate health and report drift
- `waypoint sync` — rebuild the docs/plans and tracker indexes
- `waypoint upgrade` — update the CLI and refresh the current repo using its saved config

## Learn more

- [Overview](docs/overview.md)
- [Architecture](docs/architecture.md)
- [Upgrading](docs/upgrading.md)
- [Releasing](docs/releasing.md)

## License

MIT. See [LICENSE](LICENSE).
