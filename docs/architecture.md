# Waypoint Architecture

## Core layers

1. **Repo contract**
   - `AGENTS.md`
   - `WORKSPACE.md`
   - `.waypoint/docs/`
   - `DOCS_INDEX.md`

2. **Skill layer**
   - repo-local skills under `.agents/skills/`

3. **Optional role layer**
   - `.codex/config.toml`
   - `.codex/agents/*.toml`
   - `.waypoint/agents/*.md`

4. **Optional sync layer**
   - rules
   - automations

## Session bootstrap

Waypoint's session bootstrap is explicit:

1. run `.waypoint/scripts/prepare-context.mjs`
2. read `.waypoint/SOUL.md`
3. read `.waypoint/agent-operating-manual.md`
4. read `WORKSPACE.md`
5. read `.waypoint/context/MANIFEST.md`
6. read everything listed there

This is the Codex replacement for hidden hook-based context injection.
