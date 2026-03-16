# Waypoint Architecture

## Core layers

1. **Repo contract**
   - `AGENTS.md`
   - `.waypoint/WORKSPACE.md` with timestamped multi-topic entries
   - `.waypoint/docs/` with `summary`, `last_updated`, and `read_when` frontmatter on routable docs
   - `.waypoint/DOCS_INDEX.md`

2. **Skill layer**
   - repo-local skills under `.agents/skills/`
   - includes planning, conversation retrospectives, audits, workspace compression, pre-PR hygiene, PR review, and adversarial QA workflows

3. **Reviewer agent layer**
   - `.codex/config.toml` with multi-agent enabled by default
   - `.codex/agents/*.toml`

The default reviewer workflow is closeout-based: run `code-reviewer` before considering any non-trivial implementation slice complete, and run `code-health-reviewer` before considering medium or large changes complete, especially when they add structure, duplicate logic, or introduce new abstractions. If both apply, run them in parallel. A recent self-authored commit is the preferred scope anchor when one cleanly represents the slice, but it is not the only valid trigger. Slow reviewers should be allowed to finish, and Waypoint should wait as long as required rather than interrupting them just because they are still running.

Waypoint's execution model is ownership-based after plan approval: once a reviewed plan is approved, the agent should continue through implementation and closeout without stopping for incremental permission unless a real blocker or risky unresolved decision appears.

4. **Index rebuild layer**
   - `.waypoint/DOCS_INDEX.md`
   - `.waypoint/TRACKS_INDEX.md`

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
