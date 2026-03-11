# Waypoint Architecture

## Core layers

1. **Repo contract**
   - `AGENTS.md`
   - `.waypoint/WORKSPACE.md` with timestamped multi-topic entries
   - `.waypoint/docs/` with `summary`, `last_updated`, and `read_when` frontmatter on routable docs
   - `.waypoint/DOCS_INDEX.md`

2. **Skill layer**
   - repo-local skills under `.agents/skills/`
   - includes planning, audits, workspace compression, pre-PR hygiene, PR review, and adversarial QA workflows

3. **Optional role layer**
   - `.codex/config.toml` with multi-agent enabled when roles are scaffolded
   - `.codex/agents/*.toml`
   - `.waypoint/agents/*.md`

The default intent for the reviewer pair is a chunk-based review loop: once there is a meaningful reviewable slice, spawn `code-reviewer` and `code-health-reviewer` in parallel, then reconcile and fix findings before final closeout. A recent self-authored commit is the preferred scope anchor when one cleanly represents that slice, but it is not the only valid trigger. Slow reviewers should be allowed to finish unless they are clearly stuck or the user redirects the work.

4. **Optional sync layer**
   - rules
   - automations

## Session bootstrap

Waypoint's session bootstrap is explicit and event-based:

1. run `.waypoint/scripts/prepare-context.mjs`
2. read `.waypoint/SOUL.md`
3. read `.waypoint/agent-operating-manual.md`
4. read `.waypoint/WORKSPACE.md`
5. read `.waypoint/context/MANIFEST.md`
6. read everything listed there, including the generated recent-thread continuity file

`prepare-context.mjs` generates both repo-state context and a bounded `RECENT_THREAD.md` from the latest local Codex session for the repo. If the session has compacted, it prefers the 25 meaningful turns immediately before the last compaction; otherwise it falls back to the latest 25 meaningful turns. Adjacent assistant commentary/final messages are merged into one readable turn, and obvious token formats are redacted before the file is written.

The intended trigger is narrow: run it at the start of a new session or immediately after compaction, not before every substantial task inside the same conversation.

This is the Codex replacement for hidden hook-based context injection.
