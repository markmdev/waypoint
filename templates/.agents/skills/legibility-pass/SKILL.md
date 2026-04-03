---
name: legibility-pass
description: Legibility-only refactors for code that is already behaviorally correct but hard to read, reason about, or safely modify. Use only for local readability improvements inside an explicitly requested scope. Do not use for behavior changes, invariant redesign, architectural cleanup, or broad refactors that change boundaries.
---

# Legibility Pass

Refactor the requested scope so the current behavior is easier to read without changing what the code does.

## Core Instruction
Make the smallest readable change that improves comprehension while preserving the existing contract, control flow, and runtime behavior.

## Default Workflow
1. Identify the narrow scope where readability is actively hurting maintenance or review.
2. Find the least intrusive change that improves naming, flow, or local structure.
3. Rewrite the code so the main path, failure path, and key boundary are easier to see.
4. Keep the public shape, observable behavior, and important data flow unchanged.
5. Verify the refactor did not introduce a new abstraction, boundary shift, or hidden dependency.

## Rules
- Do not change behavior, public API, persistence shape, wire format, timing, or error semantics.
- Do not rename or restructure code unless the change reduces reading friction in the requested scope.
- Do not introduce new layers, helper abstractions, or framework patterns just to make the diff look cleaner.
- Do not perform broad cleanup, mechanical formatting, dead-code sweeps, or unrelated simplification.
- Do not use this skill for collapsing unrelated abstractions, making invariants stricter, or redesigning architecture.
- Do not use this skill as a substitute for a foundational refactor, make-invariants pass, or behavior-preserving optimization.
- Do not rely on comments to explain code that can be made directly legible.
- Do not add comments unless they capture a local constraint that cannot be expressed clearly in code.

## Exception Rule
If the only readability improvement would require a change that risks an unacceptable behavior shift, boundary violation, or contract change, stop and leave the code unchanged except for a brief explanation of the constraint. Use this exception only when the safer rewrite would cross one of the hard rules above.

## Output Contract
- Return a diff limited to the explicitly requested scope.
- Include only legibility edits that preserve observable behavior.
- List the files changed and the specific readability improvements made.
- State any tempting cleanup, boundary change, or abstraction you intentionally left out because it would exceed the skill boundary.
- If no safe readability improvement exists, report that the scope was left unchanged and why.
