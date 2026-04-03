---
name: foundational-redesign
description: Use for non-trivial code changes, refactors, or migrations where the right answer is to redesign the system around a new or corrected assumption instead of patching the current shape. Use when the change affects architecture, data flow, interfaces, or long-lived abstractions; do not use for trivial bug fixes, cosmetic edits, or one-line patches.
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

## Rules

- Do not start redesigning until you have inspected the current shape and the approved scope.
- Do not preserve legacy branches, adapters, or compatibility scaffolding unless coexistence is explicitly required.
- Do not execute a non-trivial architecture, interface, or data-model redesign unless the user has seen and agreed to the redesign decision.
- Do not call the work complete unless every changed file has been re-read and the result matches the agreed scope.

## Exception Rule

Relax the direct-replacement and legacy-deletion rules only when the approved scope explicitly requires coexistence, migration bridging, or phased rollout. In that case, keep the bridge minimal, state the removal condition, and do not extend the exception beyond the approved scope.

## Output Contract

Always report:

- current shape
- target shape
- redesign decision confirmed with user, or `not needed`
- legacy code removed, or `none`
- verification run
- remaining gap, or `none`
