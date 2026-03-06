# Changelog

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
  - `docs-researcher`
  - `plan-reviewer`
- Declarative automation sync into Codex App's automation store
