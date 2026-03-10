# Waypoint Overview

Waypoint is a Codex-native repository operating system.

The project exists to solve one main problem:

**the next agent should be able to pick up the repository with full context by reading the repo itself.**

Waypoint does this by combining:

- a repo contract (`AGENTS.md`, `.waypoint/WORKSPACE.md`, `.waypoint/docs/`, `.waypoint/DOCS_INDEX.md`)
- repo-local skills
- optional reviewer roles for post-commit background review
- generated session context
- optional automation sync

Waypoint is not a hook-driven system. The philosophy is:

- less hidden runtime magic
- more explicit repo-local state
- more markdown
- more durable context

Two contract details matter in practice:

- `.waypoint/WORKSPACE.md` entries in multi-topic sections are timestamped
- routable docs under `.waypoint/docs/` carry `summary`, `last_updated`, and `read_when` frontmatter
- repo-local skills handle structured workflows such as planning, pre-PR hygiene, end-to-end verification, PR review closure, and workspace compression
