---
name: work-tracker
description: Create or maintain a durable tracker under `.waypoint/track/` for large multi-step work. Use when implementation will span multiple sessions, when an audit or review produces many fix items, when verification has a long checklist, or whenever `WORKSPACE.md` would become too detailed if it tried to hold the whole execution log.
---

# Work Tracker

Use this skill when the work is too large, too long-running, or too itemized to live safely in `WORKSPACE.md`.

This skill owns the execution tracker layer:

- create or update `.waypoint/track/<slug>.md`
- keep `WORKSPACE.md` pointing at the active tracker
- move detailed checklists and progress into the tracker instead of bloating the workspace

## Read First

Before tracking:

1. Read `.waypoint/SOUL.md`
2. Read `.waypoint/agent-operating-manual.md`
3. Read `.waypoint/WORKSPACE.md`
4. Read `.waypoint/context/MANIFEST.md`
5. Read every file listed in that manifest
6. Read `.waypoint/track/README.md`

## When A Tracker Is Required

Create or update a tracker when any of these are true:

- the work will likely span multiple sessions
- there are many actionable items to implement
- an audit, QA pass, or review produced a remediation campaign
- verification requires a substantial checklist
- `WORKSPACE.md` would become noisy if it carried all the detail

Small, single-shot work does not need a tracker.

## Step 1: Choose The Tracker File

- Use `.waypoint/track/<kebab-case-slug>.md`.
- If a relevant tracker already exists, update it instead of creating a competing one.
- Keep one tracker per coherent workstream, not one tracker per tiny edit.

## Step 2: Set The Frontmatter

Trackers need:

```yaml
---
summary: One-line description
last_updated: "2026-03-13 11:38 PDT"
status: active
read_when:
  - resuming this workstream
---
```

Valid statuses:

- `active`
- `blocked`
- `paused`
- `done`
- `archived`

Use `active` unless there is a clear reason not to.

## Step 3: Structure The Tracker

A good tracker usually includes:

- `Goal`
- `Source`
- `Current State`
- `Next`
- `Workstreams`
- `Verification`
- `Decisions`
- `Notes`

Use checklists when there are many concrete items. Use timestamped bullets for materially revised state.

## Step 4: Link It From The Workspace

Add or update a bullet under `## Active Trackers` in `.waypoint/WORKSPACE.md` that points at the tracker path and states the current phase or next step.

`WORKSPACE.md` should answer "what matters right now?"
The tracker should answer "what exactly is happening across the whole workstream?"

## Step 5: Maintain It During Execution

- Update `last_updated` whenever you materially change the tracker.
- Mark completed items done instead of deleting the record.
- Add blockers, new tasks, and verification status as the work evolves.
- When the workstream finishes, set `status: done` or `status: archived`.

Do not let the tracker become fiction. It must match reality.

## Step 6: Distill Durable Knowledge

If the tracker reveals durable architecture, rollout, or debugging knowledge, move that durable knowledge into `.waypoint/docs/` and leave the tracker focused on execution state.

## Report

When you create or update a tracker, report:

- the tracker path
- the current status
- what `WORKSPACE.md` now points to
