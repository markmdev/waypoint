---
name: plan-start
description: Bootstrap a fresh session onto an existing implementation plan. Use when a referenced plan already exists, execution has not meaningfully started in the current session, and Codex needs to reconstruct the active phase from the plan plus current repository state before beginning the first substantial work package.
---

# Plan Start

## Core Instruction
Convert a referenced plan into the first executable work package for a fresh session.

## Trigger Boundary
Use this skill when:
- a durable plan, roadmap, or phase list already exists
- the current session has not yet become a stalled execution loop
- the task is to re-enter the plan, recover the active phase, and begin substantive work

Do not use this skill when:
- the session is already mid-execution and progress has degraded into micro-edits, repeated patching, or phase drift
- the current problem is recovering momentum on a stuck phase
- the request is to revise the plan itself before execution can begin

In those cases, route to:
- `$execution-reset` for stalled or compacted plan execution
- `$planning` when the plan is missing, non-durable, or too underspecified to execute

## Required Inputs
Do not proceed until you have:
- a plan path, plan identifier, or equivalent durable plan reference
- the current repository/worktree state relevant to that plan
- enough current context to tell whether the referenced plan is still actionable

If any required input is missing, stop and route to `$planning` or ask for the missing reference instead of guessing.

## Workflow
1. Read the referenced plan end to end.
2. Inspect the current repository state relevant to the plan.
3. Determine:
   - which phases are complete
   - which phase is active
   - what remains inside the active phase
4. Restate the active phase as concrete system behavior.
5. Select the first substantial work package that most directly advances that phase.
6. Begin execution on that package.

## Rules
- Do not re-plan the whole project unless the referenced plan is locally stale.
- Do not use this skill to recover from a stalled session; that is `$execution-reset`.
- Do not spend the session on summaries, narration, or cosmetic cleanup when a substantive work package is available.
- Do not choose a micro-edit as the first move unless it is the smallest change that unblocks the first substantial package.
- Select the work package that most directly advances the active phase.

## Bounded Exception
If the plan is locally stale, allow one bounded re-anchoring pass:
- reconcile the active phase against the current codebase
- update the phase boundary only as needed to make execution possible
- do not rewrite the whole roadmap

If the plan still cannot be executed after that pass, stop and route to `$planning`.

## Output Contract
### Normal
Return:
- `Active Phase`
- `Objective`
- `Current State`
- `First Work Package`
- `Definition of Done`

### Blocked
Return `Blocked` when required inputs are missing or the plan cannot be safely actioned yet. Include:
- what is missing
- why execution cannot start
- the exact reroute target: `$planning` or `$execution-reset`

### Reroute
Return `Reroute` when the request belongs to another skill. Include:
- `Reroute Target`
- `Reason`
- the minimal handoff needed to continue
