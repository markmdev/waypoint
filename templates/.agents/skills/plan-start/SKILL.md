---
name: plan-start
description: Start execution on an existing implementation plan in a fresh session. Use when a plan, roadmap, or phase list already exists and Codex needs to begin work on it without re-deriving everything from scratch. Rebuild context from the plan and current codebase, identify the active phase, choose the first meaningful work package, and begin execution.
---

Start from the plan and the current codebase, not from assumptions.

1. Read the referenced plan.
2. Inspect the current repository state relevant to that plan.
3. Determine:
   - which phases are already complete
   - which phase is active
   - what remains in the active phase
4. Restate the active phase as concrete system behavior.
5. Select the first substantial work package.
6. Begin executing it immediately.

Use this output shape:

## Plan Start
### Active Phase
[phase]

### Goal
[what this phase must accomplish]

### Current State
- Complete: [...]
- In progress: [...]
- Missing: [...]

### First Work Package
[one substantial chunk]

### Definition of Done
[what makes this chunk complete]

Rules:
- Do not re-plan the whole project unless the plan is clearly stale.
- Do not spend the session on broad summaries when execution can begin.
- Do not start with cosmetic cleanup.
- Prefer the work package that most directly advances the active phase.