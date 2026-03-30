---
name: work-tracker
description: Create or maintain a durable tracker under `.waypoint/track/` for any non-trivial workstream that needs ongoing execution state. Use when work has multiple steps, meaningful verification, review follow-ups, milestone checkpoints, or any real chance that `WORKSPACE.md` alone will stop being enough as the work evolves.
---

# Work Tracker

Use this skill when the work has enough moving parts that the next state should not live only in chat or in a few workspace bullets.

This skill owns the execution tracker layer:

- create or update `.waypoint/track/<slug>.md`
- keep `WORKSPACE.md` pointing at the active tracker
- move detailed checklists and progress into the tracker instead of bloating the workspace

## When Not To Use This Skill

- Skip it for small single-shot tasks that fit comfortably in `WORKSPACE.md`.
- Skip it when the work has already finished and does not need a durable execution log.
- Skip it when the real need is docs compression or docs sync rather than active execution tracking.

## Read First

Before tracking:

1. Read `.waypoint/SOUL.md`
2. Read `.waypoint/agent-operating-manual.md`
3. Read `.waypoint/WORKSPACE.md`
4. Read `.waypoint/ACTIVE_PLANS.md`
5. Read `.waypoint/context/MANIFEST.md`
6. Read every file listed in that manifest
7. Read `.waypoint/track/README.md`

## When A Tracker Is Required

Create or update a tracker when any of these are true:

- the work is non-trivial and will unfold across multiple meaningful steps
- the work will likely span multiple sessions
- there are many actionable items to implement
- an audit, QA pass, or review produced a remediation campaign
- verification requires a substantial checklist
- the work has milestone checkpoints, PR stages, or repeated fix-and-verify loops
- `WORKSPACE.md` would become noisy if it carried all the detail

When in doubt, prefer creating or updating the tracker for non-trivial work instead of hoping the workspace alone will stay enough.
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
- `Phase Checkpoints`
- `Verification`
- `Decisions`
- `Notes`

Use `- [ ]` checkboxes when there are many concrete tasks to track. Use status-style entries when the work is better expressed as phase/state updates than as a task list. Use timestamped bullets for materially revised state.

## Step 4: Link It From The Workspace

Add or update a bullet under `## Active Trackers` in `.waypoint/WORKSPACE.md` that points at the tracker path and states the current phase or next step.
If the work is driven by an approved plan, keep `.waypoint/ACTIVE_PLANS.md` aligned with the same phase naming and checkpoint language.

`WORKSPACE.md` should answer "what matters right now?"
`.waypoint/ACTIVE_PLANS.md` should answer "what plan and phase must be followed right now?"
The tracker should answer "what exactly is happening across the whole workstream?"

## Step 5: Maintain It During Execution

- Update `last_updated` whenever you materially change the tracker.
- Keep task lists or status entries current instead of deleting history. Mark completed checkbox items as `- [x]`, and update status-style entries when the phase or state changes.
- Add blockers, new tasks, and verification status as the work evolves.
- Update the tracker during the work, not only at the end. If a milestone, blocker, review round, or verification result changed reality, the tracker should already reflect it.
- When the workstream finishes, set `status: done` or `status: archived`.

Do not let the tracker become fiction. It must match reality.

## Step 6: Distill Durable Knowledge

If the tracker reveals durable architecture, rollout, or debugging knowledge, move that durable knowledge into `.waypoint/docs/` and leave the tracker focused on execution state.

## Report

When you create or update a tracker, report:

- the tracker path
- the current status
- what `WORKSPACE.md` now points to

## Gotchas

- Do not create a new tracker if a relevant active tracker already exists for the same workstream.
- Do not wait until final handoff to start the tracker if the work has already become multi-step, review-heavy, or hard to summarize from memory.
- Do not let the tracker become fiction. Completed items, blockers, and verification state should match reality.
- Do not stuff durable architecture or debugging knowledge into the tracker if it belongs in `.waypoint/docs/`.
- Do not leave `WORKSPACE.md` carrying the full execution log after a tracker exists.
- Do not keep trackers "active" forever after the work is done; update the status.

## Keep This Skill Sharp

- Add new gotchas when the same tracker drift, duplicate-tracker pattern, or workspace-bloat problem keeps recurring.
- Tighten the description if the skill fires for tiny work that does not need a tracker or misses long-running remediation campaigns.
- If the tracker format keeps needing the same recurring section or checklist pattern, capture that reusable pattern in the skill instead of rediscovering it each time.
