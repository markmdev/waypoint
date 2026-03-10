---
name: workspace-compress
description: Compress and refresh the repository's live workspace handoff so `WORKSPACE.md` stays short, current, and useful to the next agent. Use after finishing a meaningful chunk of work, before stopping for the session, before asking for review, before opening or updating a PR, or whenever the workspace has started accumulating stale history, repeated status logs, or resolved context that should no longer stay in the live handoff. Keep the minimum current operational state, collapse old resolved entries, and move durable detail into existing routed docs instead of duplicating it in the workspace.
---

# Workspace Compress

Keep `WORKSPACE.md` as a live handoff, not a project diary.

This skill is for compression, not for erasing context. Preserve what the next agent needs in the first few minutes of a resume, and push durable detail into the docs layer that already exists in the repo.

## Read First

Before compressing:

1. Read `.waypoint/SOUL.md`
2. Read `.waypoint/agent-operating-manual.md`
3. Read `.waypoint/WORKSPACE.md`
4. Read `.waypoint/context/MANIFEST.md`
5. Read every file listed in that manifest
6. Read the routed docs relevant to the active workspace sections

## Step 1: Build Context From Routing, Not From Git Diff

This skill must work even in a dirty tree or an arbitrary session state.

- Read the workspace file in full.
- Read `.waypoint/DOCS_INDEX.md` and the workspace's obvious routing pointers.
- Read the project or domain docs directly linked from the active sections you may compress.
- If the workspace references a progress, status, architecture, or release doc, treat that as the durable home for details before removing anything from the live handoff.

Do not rely on `git diff` as the primary signal for what matters.

## Step 2: Apply The Handoff Test

Ask one question:

**What does the next agent need in the first 10 minutes to resume effectively?**

Keep only the answer to that question in the workspace. Usually that means:

- current focus
- latest verified state
- open blockers or risks
- immediate next steps
- only the last few meaningful timestamped updates

Usually remove or collapse:

- resolved implementation logs
- repeated status updates that say the same thing
- validation transcripts
- old milestone history
- duplicated durable documentation

Compression is documentation quality, not data loss.

## Step 3: Compress Safely

When editing the workspace:

1. Preserve the active operational truth.
2. Collapse stale resolved bullets into one short summary when history still matters.
3. Remove entries that are already preserved elsewhere and no longer affect immediate execution.
4. Keep timestamp discipline for new or materially revised bullets.
5. Do not turn the workspace into an archive, changelog, or debug notebook.

If durable context is missing from `.waypoint/docs/`, add or refresh the smallest coherent routed doc before removing it from the workspace.

## Step 4: Protect User-Owned State

- Never overwrite or revert unrelated user changes.
- If a workspace or doc already has in-flight edits you did not make, read carefully and work around them.
- Prefer surgical edits over broad rewrites.
- Do not delete project memory just because live state is being compressed.

## Step 5: Refresh Routing

After changing routed docs or the workspace:

- Run `node .waypoint/scripts/prepare-context.mjs` so the docs index and generated context match the edited sources.

## Step 6: Report The Result

Summarize:

- what stayed in the live handoff
- what was collapsed or removed
- which durable docs now hold the preserved detail
- any remaining risk that still belongs in the workspace
