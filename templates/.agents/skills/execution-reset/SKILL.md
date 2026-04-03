---
name: execution-reset
description: Recover stalled mid-execution work on a referenced implementation plan when progress has degraded into local edits, repeated patching, or phase drift. Use only after a phase has already started and the current session is no longer advancing a concrete milestone. Reconstruct actual progress from the codebase, test for a stall, and select the next substantial work package that advances or completes the active phase.
---

## Core Instruction
Reset execution from evidence, not memory, when an in-progress phase has stalled and the next meaningful unit of work is unclear.

## Required Inputs
You must have all of the following before you act:
1. A referenced plan or roadmap.
2. The active phase or checkpoint within that plan.
3. The relevant workspace or codebase context needed to inspect current state.

## Blocked Behavior
If any required input is missing, do not infer it, do not continue, and do not propose a reset package.
State exactly which input is missing and request it.

## Trigger Boundary
Use this skill only when:
1. Work on the current phase has already started.
2. The current session is not advancing the phase toward completion.
3. The problem is execution drift, not plan creation, backlog grooming, or initial scoping.

Do not use this skill at plan start or for ordinary planning questions.

## Stall Test
Treat execution as stalled when inspection shows at least one of the following:
- Three consecutive implementation attempts have changed files or run checks without moving any acceptance condition from missing or partial to complete.
- The same local area has been patched twice or more in the current phase without producing a measurable milestone change.
- The current state is still partial, broken, or stale after a review of the codebase, and no next step can be named that clearly advances the phase end-to-end.
- Progress is limited to micro-edits, reformatting, or cleanup that does not change the phase outcome.

The stall test is objective: if none of the conditions above hold, do not declare a reset.

## Workflow
1. Identify the active phase and its intended outcome from the plan.
2. Inspect the codebase and classify the phase state as complete, partial, missing, or broken/stale.
3. Apply the stall test.
4. If stalled, restate the phase as concrete system behavior and identify one work package that will complete a sub-milestone, unblock the main dependency, or complete the end-to-end path.
5. Execute only that work package.
6. Re-check whether the change moved at least one acceptance condition from missing or partial to complete.

## Rules
- Do not continue with micro-edits unless they directly unblock the selected work package.
- Do not polish incomplete phases.
- Do not trust prior session context over the codebase.
- Do not select more than one work package per reset cycle.
- Do not expand scope to adjacent cleanup unless it is required for the chosen package to finish.

## Exception Rule
You may relax the stall test only when the workspace evidence shows a phase-critical blocker outside the current code path, such as a missing prerequisite, unavailable dependency, or an upstream change that makes the current plan invalid. This exception is bounded:
- The blocker must be named.
- The blocker must be evidenced in the inspected state.
- The response must switch to blocker resolution, not continued execution.

## Stop Condition
Stop the reset cycle immediately when one of these is true:
- The selected package cannot be executed because a required input is still missing.
- The selected package fails to move at least one acceptance condition from missing or partial to complete after a concrete attempt.
- The inspected codebase shows the phase is no longer the right unit of work.

## Next Action If Reset Package Fails
If the chosen package fails, do not chain into a second package. Report the blocker, the evidence, and the smallest next question or dependency needed to continue.

## Output Contract
Use this shape:

### Execution Reset
### Active Phase
[phase]

### Objective
[what this phase must accomplish]

### Actual Status
- Complete: [...]
- Partial: [...]
- Missing: [...]
- Broken/stale: [...]

### Stall Diagnosis
[why the stall test passed, or why it did not]

### Next Work Package
[one substantial chunk, or the blocker if execution is stopped]

### Definition of Done
[concrete completion conditions for the package]

### Plan Correction
[only if the plan is locally stale]
