# Waypoint Architecture

## Core layers

1. **Repo contract**
   - `AGENTS.md`
   - `.waypoint/WORKSPACE.md`
   - `.waypoint/docs/`
   - `.waypoint/DOCS_INDEX.md`

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
4. read `.waypoint/WORKSPACE.md`
5. read `.waypoint/context/MANIFEST.md`
6. read everything listed there, including the generated recent-thread continuity file

`prepare-context.mjs` generates both repo-state context and a bounded `RECENT_THREAD.md` from the latest local Codex session for the repo. If the session has compacted, it prefers the 25 meaningful turns immediately before the last compaction; otherwise it falls back to the latest 25 meaningful turns. Adjacent assistant commentary/final messages are merged into one readable turn, and obvious token formats are redacted before the file is written.

The contract is intentionally strict: prior chat context does not replace bootstrap, and if the agent is unsure whether bootstrap already happened, it should rerun it before continuing.

This is the Codex replacement for hidden hook-based context injection.
