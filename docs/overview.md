# Waypoint Overview

Waypoint is a Codex-native repository operating system.

The project exists to solve one main problem:

**the next agent should be able to pick up the repository with full context by reading the repo itself.**

Waypoint does this by combining:

- a repo contract (`AGENTS.md`, `.waypoint/WORKSPACE.md`, `.waypoint/docs/`, `.waypoint/DOCS_INDEX.md`)
- repo-local skills
- reviewer agents for chunk-based background review, scaffolded by default
- generated session context

Waypoint is not a hook-driven system. The philosophy is:

- less hidden runtime magic
- more explicit repo-local state
- more markdown
- more durable context
- more visual explanation when visuals clarify the work better than prose

Two contract details matter in practice:

- `.waypoint/WORKSPACE.md` entries in multi-topic sections are timestamped
- routable docs under `.waypoint/docs/` carry `summary`, `last_updated`, and `read_when` frontmatter
- repo-local skills handle structured workflows such as planning, conversation retrospectives, pre-PR hygiene, break-it QA, PR review closure, and workspace compression
- Mermaid diagrams should be preferred directly in chat when they clarify a flow, architecture, state, or plan, with richer generated images and annotated screenshots used when text-native diagrams are not enough
