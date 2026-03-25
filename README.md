# Waypoint

Waypoint makes Codex better by default for real software work.

Codex is already powerful. The problem is that most users still have to teach it
the same things over and over:

- ask better questions before coding
- plan thoroughly instead of making hidden assumptions
- follow stronger coding standards
- review the result seriously before merge
- verify the work instead of guessing
- learn from corrections instead of repeating the same mistakes

Waypoint installs those defaults into a repo so you can spend less time
prompting and more time building.

## Install and upgrade

Waypoint requires Node 20+.

Install globally:

```bash
npm install -g waypoint-codex
```

Or try it without a global install:

```bash
npx waypoint-codex@latest --help
```

Keep an existing repo up to date:

```bash
waypoint upgrade
```

## What gets better

With Waypoint, Codex should become better at:

- understanding the product and technical context before it starts
- planning work in enough detail to avoid avoidable mistakes
- writing code that matches the codebase and holds up in production
- staying on track during larger or longer-running tasks
- reviewing and verifying its own work before calling it done
- improving its own guidance when the user corrects it

## Why Waypoint exists

Waypoint is for people using Codex on real apps and real codebases, not just
tiny one-off edits.

It exists because most Codex users should not have to manually remember every
best practice, every guardrail, every planning question, and every review step
for every task.

Waypoint packages that expertise into the repo so Codex starts from a much
better default.

## What Waypoint adds

### 1. Better default behavior

Waypoint gives Codex stronger repo guidance through the generated contract,
operating manual, core behavior files, and repo-local instructions.

That means the agent is pushed to:

- investigate before narrating status
- ask better questions about the product, architecture, and constraints
- explain what it found in a clear way
- verify what it changed
- leave the repo clearer than it found it

### 2. Better planning

Waypoint ships a thorough planning workflow for work that should not start from
guesswork.

That workflow pushes the agent to:

- interview the user until the real requirements are clear
- produce a detailed plan before implementation
- challenge that plan with a reviewer agent
- tighten the plan before coding starts

The goal is simple: fewer assumptions, fewer surprises, and a much better shot
at one-shot execution.

### 3. Better code quality

Waypoint does not assume Codex will naturally write production-quality code by
default.

It adds guardrails that push the agent toward:

- stronger coding standards
- better fit with the existing codebase
- fewer lazy shortcuts
- fewer architecture mistakes
- fewer duplicated or premature abstractions

Reviewer agents and audit workflows add another pass before merge when the work
needs it.

### 4. Better end-to-end execution

Waypoint also helps Codex follow through on bigger tasks.

It includes workflows for:

- long-running task tracking
- ship-readiness audits
- merge-ready ownership
- deliberate review passes before PR or merge

This helps the agent keep moving until the work is actually ready, not just
"probably done."

### 5. Self-improvement

Waypoint treats user corrections as product input, not just conversation noise.

When the user corrects behavior, rules, or workflow, the agent is pushed to
update the right durable files so the same issue is less likely to happen
again.

That includes:

- user-scoped guidance
- project-scoped guidance
- repo-local skills
- retrospectives that turn friction from the current conversation into lasting
  improvements

### 6. Better continuity

Waypoint gives Codex explicit continuity artifacts so the next session does not
start half-blind.

That includes:

- a generated docs index that tells the agent which docs exist and when to read
  them
- a live workspace file that records what is going on right now
- a generated recent thread file that carries the most important prior
  conversation context forward

## What Waypoint sets up

Waypoint scaffolds a Codex-friendly repo around a few core pieces:

- `AGENTS.md` for the project-scoped startup contract and durable repo guidance
- `.waypoint/WORKSPACE.md` for live operational state
- `.waypoint/docs/` for long-lived project docs
- `.waypoint/plans/` for durable plan documents
- `.waypoint/DOCS_INDEX.md` for docs and plans routing, so the agent knows what
  to read and when
- `.waypoint/context/` for generated startup context
- `.waypoint/context/RECENT_THREAD.md` for compact continuity from the previous
  conversation
- `.waypoint/track/` for long-running work that truly needs durable progress
  tracking
- `.agents/skills/` for optional structured workflows
- `.codex/` for optional reviewer and helper agents

By default, Waypoint routes docs from `.waypoint/docs/` and plans from
`.waypoint/plans/`.
If your repo keeps routable docs elsewhere, you can add more explicit roots in
`.waypoint/config.toml` with `docs_dirs` and `plans_dirs`.
Waypoint scans each configured root recursively and only includes Markdown files
with valid Waypoint frontmatter.

The continuity story matters:

- `.waypoint/DOCS_INDEX.md` helps the agent find the right docs before work
- `.waypoint/WORKSPACE.md` helps the next session understand what is in flight
- `.waypoint/context/RECENT_THREAD.md` helps the agent retain the important
  parts of the previous conversation

## Best fit

Waypoint is most useful when you want:

- a better default Codex workflow in a real repo
- stronger planning before implementation starts
- stronger coding standards and review guardrails
- better follow-through on long tasks
- a personal workflow that can live in almost any repo without becoming a team
  rollout

Waypoint is primarily an individual tool.
Most of its repo-local state is meant to stay personal and local by default.

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
- `merge-ready-owner`
- `workspace-compress`
- `pre-pr-hygiene`
- `pr-review`

These are repo-local, so the workflow travels with the project.

The important design choice is that they stay out of the always-on voice.
Each skill exists to improve the result when the task needs more rigor, without
turning every normal interaction into a heavy process.

## How to get full value

Installing Waypoint improves Codex's defaults right away, but the full workflow
is not completely automatic.

Some of Waypoint's biggest advantages come from user-invoked skills that should
be used deliberately when the moment calls for them.

The most important ones are:

- `code-guide-audit` when you want a code quality pass against your repo's
  standards and working rules
- `backend-ship-audit` when backend work needs a deeper production-readiness
  pass
- `frontend-ship-audit` when frontend work needs a deeper product, UX, and ship
  readiness pass
- `docs-sync` when the implementation changed and the repo docs should be
  brought back in sync
- `conversation-retrospective` when the conversation exposed friction,
  corrections, or workflow problems that should become durable improvements
- `merge-ready-owner` when you want the agent to own the task all the way to a
  merge-ready result with stronger autonomy

The practical rule is:

- install Waypoint for better defaults
- invoke the higher-rigor skills when you want a stronger planning, audit,
  review, docs, or closeout pass

## Reviewer agents

Waypoint scaffolds these reviewer agents by default:

- `code-health-reviewer`
- `code-reviewer`
- `plan-reviewer`

They are available for deliberate second passes and for ownership workflows like `merge-ready-owner`.

## What makes Waypoint different

Waypoint is opinionated, but explicit:

- state lives in files you can inspect
- docs routing is generated, not guessed from memory
- the default contract tells the agent to ask better questions and investigate
  first
- durable guidance is separated into user-scoped AGENTS, project-scoped AGENTS, live workspace state, project docs, and plan docs
- visual explanation stays lightweight: Mermaid in chat and screenshots from real UI inspection
- heavier workflows stay in optional skills
- user corrections are supposed to improve the system instead of disappearing
  into chat history

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
