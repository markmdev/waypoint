---
name: make-invariants-explicit
description: Use when behavior depends on hidden assumptions about data shape, ordering, uniqueness, idempotency, authorization, state transitions, or lifecycle constraints. Surface the invariant, choose the correct enforcement layer, and make invalid states hard to represent or hard to persist.
---

# Make Invariants Explicit

## Core Instruction
Find the invariant that correctness depends on, enforce it at the strongest appropriate layer, and remove hidden assumptions from the implementation.

## Trigger Examples
Use this skill when the requested change involves one or more of these cases:
- a value must always be present before processing
- operations must happen in a specific order
- a transition is forbidden from a given state
- a record must be unique
- a side effect must happen exactly once
- retries, duplicate delivery, or replay are possible
- a caller may have skipped validation
- authorization depends on a stable contract, not an informal assumption
- external data may not match the expected shape

Do not use this skill for purely stylistic cleanup, broad refactors with no correctness invariant, or features where the only goal is to make code shorter.

## Default Workflow
1. State the invariant in one sentence.
2. Identify the owner of the invariant.
   - If the invariant is owned by persistence, enforce it in schema, constraints, or transactional logic.
   - If the invariant is owned by the domain model, encode it in types, constructors, or state transitions.
   - If the invariant is owned by an external boundary, validate it at ingress before it reaches core logic.
3. Choose the enforcement layer using this order:
   - persistence or database constraint when multiple writers, processes, or retries can violate the rule
   - type or schema constraint when the invalid state should not be representable
   - state machine or transition guard when the rule depends on lifecycle order
   - boundary validation when the input is untrusted or externally shaped
   - idempotency key, deduplication, or lock when duplicates or replay are possible
   - assertion or defensive guard only when the invariant is guaranteed elsewhere and this code sits at the true correctness boundary
4. Replace scattered checks with one authoritative enforcement point unless the invariant genuinely exists at multiple boundaries.
5. Add or update tests that prove the invariant is enforced and that the failure mode is rejected.
6. Call out any remaining gap that the code does not and cannot fully eliminate.

If an important invariant is only implied, make it explicit.

When correcting violations:
- encode the invariant where it is naturally enforced
- remove duplicate or scattered half-checks when one authoritative check is better
- keep the invariant visible in the code structure
- preserve intended behavior unless the user asked for a change in behavior

## Rules
- Do not rely on hidden assumptions for correctness.
- Do not assume earlier layers already enforced a critical invariant unless that contract is explicit, stable, and tested.
- Do not scatter partial checks across many places when one authoritative enforcement point exists.
- Do not normalize invalid state away when the correct behavior is to reject it.
- Do not use assertions as the primary enforcement mechanism when a stronger boundary exists.
- Do not leave a critical invariant implicit if it can be represented in code, types, schema, or transitions.

## Exception Rule
You may leave an invariant implicit only when all of the following are true:
- the invariant is already enforced by a documented contract in the same repository or a strictly stronger upstream boundary
- that contract is stable enough that breaking it would be a compatibility defect, not a routine possibility
- the current change does not weaken, duplicate, or relocate that enforcement point
- the output explicitly records the dependency and residual risk

This exception does not apply to correctness, security, permissions, uniqueness, idempotency, duplicate handling, or lifecycle-transition invariants.

## Output Contract
Return the result with these fields:
- Invariant: the exact rule being enforced
- Owner: the layer or component responsible for the invariant
- Enforcement point: the concrete code, schema, type, or transition boundary used
- Verification/tests: the tests or checks added or updated to prove enforcement
- Residual risk: any remaining assumption, dependency, or gap
