# Waypoint Overview

Waypoint is a Codex-native repository operating system.

The project exists to solve one main problem:

**the next agent should be able to pick up the repository with full context by reading the repo itself.**

Waypoint does this by combining:

- a repo contract (`AGENTS.md`, `WORKSPACE.md`, `docs/`, `DOCS_INDEX.md`)
- repo-local skills
- optional reviewer roles
- generated session context
- optional automation sync

Waypoint is not a hook-driven system. The philosophy is:

- less hidden runtime magic
- more explicit repo-local state
- more markdown
- more durable context
