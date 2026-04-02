---
name: execution-reset
description: Recover momentum in long-running implementation plans when progress degrades into tiny local edits, repeated patching, or phase drift. Use when working from a referenced plan or roadmap and the current session is stalled, compacted, or no longer completing meaningful milestones. Reconstruct actual progress from the codebase, detect whether the current phase is stuck, and choose the next substantial work package that advances or completes the phase.
---

Rebuild state from the current codebase and the referenced plan, not from memory.

1. Identify the active phase and its intended outcome.
2. Inspect the current implementation and determine:
   - complete
   - partial
   - missing
   - broken or stale
3. Decide whether execution is stalled.
4. If stalled, restate the current phase as concrete system behavior.
5. Pick exactly one substantial work package that will:
   - complete a sub-milestone
   - unblock the main dependency
   - or finish the end-to-end path
6. Execute that package.
7. Re-check whether system capability materially increased.

Use this output shape:

## Execution Reset
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
[why progress is not advancing]

### Next Work Package
[one substantial chunk]

### Definition of Done
[concrete completion conditions]

### Plan Correction
[only if the plan is locally stale]

Rules:
- Do not continue with micro-edits unless they directly unblock the chosen work package.
- Do not polish incomplete phases.
- Do not trust prior session context over the codebase.
- Prefer end-to-end completion over local cleanup.
- Revise the current phase if the original plan no longer matches reality, but do not rewrite the whole roadmap unless necessary.