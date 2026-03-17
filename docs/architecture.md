# Waypoint Architecture

## Core layers

1. **Repo contract**
   - `AGENTS.md`
   - `.waypoint/WORKSPACE.md` with timestamped multi-topic entries
   - `.waypoint/docs/` with `summary`, `last_updated`, and `read_when` frontmatter on routable docs
   - `.waypoint/DOCS_INDEX.md`

2. **Skill layer**
   - repo-local skills under `.agents/skills/`
   - includes planning, adversarial review, visual explanations, conversation retrospectives, audits, workspace compression, pre-PR hygiene, PR review, and adversarial QA workflows

3. **Reviewer agent layer**
   - `.codex/config.toml` with multi-agent enabled by default
   - `.codex/agents/*.toml`

The default reviewer workflow is closeout-based and now lives in the `adversarial-review` skill: use that skill before calling a non-trivial implementation slice complete. It scopes the slice, runs `code-reviewer`, runs `code-health-reviewer` when the change is medium or large or otherwise structurally risky, runs `code-guide-audit`, waits as long as needed, fixes meaningful findings, closes the old reviewer threads, and reruns fresh review rounds until no meaningful findings remain. A recent self-authored commit is the preferred scope anchor when one cleanly represents the slice, but it is not the only valid trigger. Reviewer agents are still one-shot workers: once a reviewer returns findings, close it, and if another pass is needed later, spawn a fresh reviewer instead of reusing the old thread. Slow reviewers should be allowed to finish, and Waypoint should wait as long as required rather than interrupting them just because they are still running. The shipped reviewer TOMLs pin `gpt-5.4` with `high` reasoning, and the main-agent contract tells Codex to use the same values with `fork_context: false` whenever it spawns subagents. Reviewer prompts treat diffs as starting pointers only: they must read changed files in full, expand into related files, and then decide.

Waypoint's execution model is ownership-based after plan approval: once a reviewed plan is approved, the agent should continue through implementation and closeout without stopping for incremental permission unless a real blocker or risky unresolved decision appears.

When that execution uses a browser for reproduction or verification, the workflow should surface screenshots of the relevant UI states back to the user instead of relying on text-only descriptions.

When a concept, plan, or tradeoff would be clearer visually, the workflow should bias toward Mermaid diagrams directly in chat before falling back to longer prose. When Mermaid is not expressive enough, the workflow should reach for richer generated images or annotated screenshots.

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
