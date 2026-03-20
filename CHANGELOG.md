# Changelog

## 0.13.1

### Patch Changes

- Fix Waypoint's gitignore refresh so retired `visual-explanations` lines are removed cleanly during upgrades.

  Older repos could keep a stale `.agents/skills/visual-explanations/` ignore line outside the managed Waypoint block after refresh. Waypoint now recognizes that line as retired scaffold state, removes the old skill directory on refresh, and keeps the managed ignore block clean.

## 0.13.0

### Minor Changes

- Separate durable plan docs from long-lived project docs in the Waypoint scaffold.

  New repos now get a dedicated `.waypoint/plans/` directory, the docs index routes both docs and plans, and the built-in guidance now points planning workflows at the new plans layer instead of mixing plans into `.waypoint/docs/`.

- Remove the `visual-explanations` skill and simplify Waypoint's visual guidance.

  Visual explanation now stays in the core contract: use Mermaid directly in chat for diagrams, and show screenshots whenever browser or app inspection is part of reproduction or verification work. The public docs were also tightened so they describe Waypoint more directly and leave per-skill trigger logic inside the skills themselves.

## 0.12.2

### Patch Changes

- 977e8fd: Ignore `.waypoint/MEMORY.md` in the default Waypoint gitignore block.

  This restores the intended scaffold behavior so both `.waypoint/MEMORY.md` and other local-only Waypoint operating files are ignored in new repos.

## 0.12.1

### Patch Changes

- cdc748b: Stop mentioning Waypoint memory in the generated gitignore block.

  The default ignore rules now list the actual local-only Waypoint files explicitly, so `.waypoint/MEMORY.md` stays trackable without relying on a special exception line.

## 0.12.0

### Minor Changes

- 149e642: Move the durable memory layer into `.waypoint/MEMORY.md`.

  New Waypoint repos now scaffold memory inside `.waypoint/`, existing repos migrate their old root `MEMORY.md` automatically on refresh, and the ignore rules were updated so the memory file stays trackable even though the rest of the Waypoint operating layer remains mostly local.

## 0.11.0

### Minor Changes

- a55e746: Reframe Waypoint around a collaborator-first default.

  This release adds a first-class `MEMORY.md` scaffold, rewrites the managed agent contract to investigate first and treat heavier review workflows as deliberate tools, refreshes the shipped coding and review guidance, and updates the public docs to match the new product direction.

## 0.10.13

### Patch Changes

- Add a first-class `coding-agent` scaffold and default it to `gpt-5.4-mini`, while keeping reviewer agents on `gpt-5.4` and documenting when to step implementation work back up for more meticulous tasks.

## 0.10.12

### Patch Changes

- cdeba52: Add a managed-agent rule that makes the agent re-check whether a session-created PR is still open before pushing more work, and reopen the work on a fresh branch and PR from `origin/main` if that earlier PR was closed.

## 0.10.11

### Patch Changes

- 7a72412: Fix `waypoint upgrade` so it rewrites older Waypoint `.gitignore` sections in place instead of duplicating the `# Waypoint state` block. Future scaffolds now use an explicit end marker to keep the Waypoint ignore section stable across upgrades.

## 0.10.10

### Patch Changes

- Refresh the shipped review workflow and skill pack guidance.

## 0.10.9

### Patch Changes

- 4eaac27: Refine the scaffolded agent contract so it now requires `fork_context: false` for subagents and adds a fuller delivery expectations section around plain-language reporting, self-verification, and completion discipline.

## 0.10.8

### Patch Changes

- Default reviewer agents to GPT-5.4 with high reasoning and strengthen review prompts so they read full changed files plus related code instead of stopping at diffs.

## 0.10.7

### Patch Changes

- Require reviewer agents to be single-use so later review passes spawn fresh threads instead of reusing prior reviewer sessions.

## 0.10.6

### Patch Changes

- Require `code-health-reviewer` to read full files rather than reviewing diffs in isolation.

## 0.10.5

### Patch Changes

- Add the `visual-explanations` skill and bias Waypoint's workflow toward Mermaid-first visual explanations, richer generated images, and annotated screenshots when visuals communicate more clearly than prose.

## 0.10.4

### Patch Changes

- 2b3e7ef: Fix the shipped PR workflow so placeholder automated-review states like CodeRabbit's "review in progress" are treated as unfinished, and so PRs are not considered clear until the required Waypoint reviewer-agent passes have actually run.

## 0.10.3

### Patch Changes

- 7d51dea: Require browser-based reproduction and verification work to include screenshots for the user, and strengthen the shipped `break-it-qa` skill so QA runs capture and report the key UI states they observed.

## 0.10.2

### Patch Changes

- 922e854: Make `conversation-retrospective` a default closeout step after major work pieces and strengthen the shipped skill so it explicitly preserves user feedback, captures concrete errors and friction, and evaluates whether used skills succeeded, partially succeeded, or failed.

## 0.10.1

### Patch Changes

- 8eb89f4: Fix the shipped wait/review workflow so Waypoint waits as long as needed for in-flight reviewers, subagents, CI, and automated review, and so the `pr-review` skill keeps waiting for new review rounds and requires inline replies on every meaningful review thread.

## 0.10.0

### Minor Changes

- 63f2180: Ship a new `conversation-retrospective` built-in skill, tighten Waypoint's default execution contract so approved plans run autonomously end to end unless a real blocker or risky unresolved decision requires a pause, and improve the shipped `pr-review` skill for CI-first and stacked-PR review loops.

## 0.9.9

### Patch Changes

- Require `plan-reviewer` to run before presenting a non-trivial implementation plan to the user and to be rerun until the plan has no meaningful review findings left.

## 0.9.8

### Patch Changes

- Refine the frontend and backend context-interview skills so they explicitly ask only project-level operating-context questions, not feature-specific planning or product-detail questions.

## 0.9.7

### Patch Changes

- Make `waypoint init` and `waypoint upgrade` prune the retired `.waypoint/agents/` subtree so stale files like `docs-researcher.md` and old reviewer prompt markdown files are removed automatically on refresh.

## 0.9.6

### Patch Changes

- Add missing `agents/openai.yaml` interface files for the `planning`, `work-tracker`, `backend-context-interview`, and `frontend-context-interview` skills in both the scaffold and repo-local skill packs.

## 0.9.5

### Patch Changes

- Refine the default `.gitignore` scaffold so it names each Waypoint-created skill directory and reviewer-agent config file explicitly, instead of blanket-ignoring all of `.agents/` or `.codex/`.

## 0.9.4

### Patch Changes

- Tighten the default `.gitignore` scaffold so it ignores the exact Waypoint-created `.agents/skills/`, `.codex/config.toml`, and `.codex/agents/` artifacts, instead of blanket-ignoring all of `.agents/` and `.codex/`.

## 0.9.3

### Patch Changes

- Extend the default `.gitignore` scaffold so Waypoint-created `.codex/` and `.agents/` artifacts are ignored by default alongside Waypoint operational state, while still leaving user-authored docs under `.waypoint/docs/` trackable.

## 0.9.2

### Patch Changes

- Change the default `.gitignore` scaffold so new Waypoint installs ignore everything under `.waypoint/` except `.waypoint/docs/`, keeping durable docs trackable while workspace, context, indexes, and other operational state remain local by default.

## 0.9.1

### Patch Changes

- Embed the reviewer-agent prompts directly into `.codex/agents/*.toml` so the shipped agent definitions are single-file and cannot drift from separate `.waypoint/agents/*.md` prompt files. Remove the old scaffolded reviewer prompt markdown files and update the docs and tests to reflect the simpler reviewer-agent model.

## 0.9.0

### Minor Changes

- Refocus Waypoint on its repo-local core by removing the legacy import command and dropping Codex rules/automations from the supported surface. Reviewer agents now scaffold by default, the review loop is explicit about when `code-reviewer` vs `code-health-reviewer` should run before work is considered complete, and the managed AGENTS guidance now keeps user-facing audit skills out of the default autonomous workflow.

  Ship the new `backend-context-interview`, `frontend-context-interview`, `backend-ship-audit`, and `frontend-ship-audit` skills in the scaffold, while keeping `break-it-qa` and the ship-audit skills user-invoked rather than default agent steps.

## 0.8.1

### Patch Changes

- Make `waypoint init` update the global CLI before scaffolding by default, with `--skip-cli-update` to opt out.

## 0.8.0

### Minor Changes

- Add a first-class `.waypoint/track/` layer for long-running work, including a generated `.waypoint/TRACKS_INDEX.md`, active-tracker bootstrap context, and a built-in `work-tracker` skill. Also remove `error-audit`, `observability-audit`, and `ux-states-audit` from the default shipped skill pack while keeping the rest of Waypoint's core workflow skills.

## 0.7.0

### Minor Changes

- Refine Waypoint's review and QA workflow guidance by making reviewer agents run on meaningful reviewable chunks instead of only post-commit, removing `e2e-verify` from the shipped skill pack, and tightening related scaffolded instructions.

## 0.6.1

### Patch Changes

- Strengthen the shipped break-it-qa skill with pre-generated attack logs, coverage rules, and rerun guidance.

## 0.6.0

### Minor Changes

- Ship the break-it-qa adversarial browser verification skill in the Waypoint scaffold.

## 0.5.0

### Minor Changes

- Ship the code-guide-audit skill in the Waypoint scaffold.

## 0.4.0

### Minor Changes

- Ship docs-sync and tighten planning persistence in the Waypoint scaffold.

## 0.3.1

### Patch Changes

- Fix the planning skill to read the Waypoint workspace path, persist durable plans into routed docs, ask product and architecture questions instead of code-discoverable implementation questions, and replace the old docs-researcher role with direct use of linked upstream documentation.

## 0.3.0

### Minor Changes

- Ship workspace compression, pre-PR hygiene, PR review, and end-to-end verification as built-in Waypoint skills, and strengthen the scaffolded coding guide and agent workflow guidance around review, QA, and long-running reviewers.

## 0.2.0

### Minor Changes

- Ship stronger repository hygiene and closeout defaults for Waypoint-managed repos.

  - require `last_updated` alongside `summary` and `read_when` for routable docs
  - require timestamped entries in multi-topic `WORKSPACE.md` sections and warn when they are missing
  - enable the optional reviewer role pack for post-commit background review with `code-reviewer` and `code-health-reviewer`

## 0.1.11

### Patch Changes

- Add `--thread-id` support to the context bootstrap script so repos can target an exact local Codex session transcript instead of relying only on repo-level session matching.

## 0.1.10

### Patch Changes

- Clarify that repo-specific AGENTS guidance belongs outside the managed Waypoint block, and verify that `waypoint init` preserves custom content outside those markers.

## 0.1.9

### Patch Changes

- Harden the startup contract so agents are explicitly told not to inspect code or plan before running the Waypoint bootstrap, and to rerun it whenever there is any doubt.

## 0.1.8

### Patch Changes

- Add `waypoint upgrade` to update the global CLI and refresh the current repo using its existing Waypoint config.

## 0.1.7

### Patch Changes

- Fix context generation to capture repo-state commands reliably, explain pull request lookup context, and avoid injecting the current conversation when the latest session has not compacted.

## 0.1.6

### Patch Changes

- Fix repo-state context generation so recent commits, uncommitted changes, and nested repo history are captured reliably without shell quoting bugs.

## 0.1.5

### Patch Changes

- Skip stale local Codex sessions whose recorded working directory no longer exists instead of crashing the bootstrap context script.

## 0.1.4

### Patch Changes

- Fix the built CLI to resolve `package.json` correctly so globally installed `waypoint` runs instead of crashing on startup.

## 0.1.3

### Patch Changes

- Move Waypoint-owned workspace and docs-index files under `.waypoint/`, leaving only `AGENTS.md` at repo root while keeping session continuity files under `.waypoint/context/`.

## 0.1.2

### Patch Changes

- Improve recent-thread continuity by preferring the 25 meaningful turns immediately before the last compaction, merging adjacent assistant messages, and redacting obvious secrets in the generated context file.

## 0.1.1

### Patch Changes

- Ship a stronger default Code Guide focused on explicit behavior, strict configuration, visible failures, and long-term legibility.

All notable changes to Waypoint will be documented in this file.

The format is inspired by Keep a Changelog and uses semantic versioning.

## [0.1.0] - 2026-03-05

### Added

- Initial Node/TypeScript CLI
- `waypoint init`
- `waypoint doctor`
- `waypoint sync`
- `waypoint import-legacy`
- Repo-local template scaffold for:
  - `AGENTS.md`
  - `WORKSPACE.md`
  - `DOCS_INDEX.md`
  - `.waypoint/`
  - `.agents/skills/`
- Session-start context generation via `.waypoint/scripts/prepare-context.mjs`
- Docs-index generation via `.waypoint/scripts/build-docs-index.mjs`
- Shipped skills:
  - `planning`
  - `error-audit`
  - `observability-audit`
  - `ux-states-audit`
- Optional reviewer agent pack:
  - `code-health-reviewer`
  - `code-reviewer`
  - `plan-reviewer`
- Declarative automation sync into Codex App's automation store
