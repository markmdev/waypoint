---
name: foundational-redesign
description: Use for code changes, refactors, and migrations when quality matters. Treat the request as if it had been a foundational assumption from day one, inspect the current system, choose the clean target shape, implement direct replacement, and aggressively delete obsolete legacy code unless coexistence is explicitly required.
---

# Foundational Redesign

Apply this skill when the change should leave the system cleaner, not just patched.

## Core rule

For each change, examine the existing system and redesign it into the most elegant solution that would have emerged if the change had been a foundational assumption from the start.

## Execution loop

1. Inspect the real current shape first: code paths, constraints, routed docs, and approved scope.
2. Define the clean target shape that would exist if this requirement had always been true.
3. Pick the smallest coherent redesign that reaches that target.
4. If the redesign is non-trivial (architecture/interface/data-model impact), explain the redesign decision to the user and get agreement before executing it.
5. Implement with direct replacement and aggressively delete legacy seams or compatibility scaffolding unless coexistence is explicitly required.
6. Before stopping, re-read every changed file (mandatory), compare against the current plan and agreed scope, and continue working if any gap remains.

## Output contract for non-trivial changes

Summarize:

- current shape
- target shape
- redesign decision confirmed with user (for non-trivial redesign)
- what legacy code was deleted
- what verification was run
- any remaining gap to close

## Gotchas

- Do not preserve legacy branches by default "just in case".
- Do not call work complete before the mandatory final file re-read.
- Do not stop at partial scope; continue until approved scope is actually satisfied.
