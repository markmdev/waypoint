---
name: make-invariants-explicit
description: Surface and enforce critical invariants directly in code so invalid states are hard to represent and easy to detect. Use when behavior depends on assumptions about data shape, ordering, state transitions, permissions, or lifecycle constraints.
---

Review the requested scope and identify assumptions that correctness depends on.

Look for assumptions such as:
- a value is always present
- operations happen in a specific order
- a transition cannot occur from a certain state
- a record is unique
- a side effect only happens once
- retries or duplicate delivery cannot happen
- a caller already validated something important
- a user or actor is authorized because an earlier layer checked it
- external data already has the expected shape

If an important invariant is only implied, make it explicit.

Make invariants explicit using the strongest fitting mechanism:
- boundary validation
- state modeling
- type constraints
- schema constraints
- uniqueness or foreign-key rules
- idempotency guards
- explicit transition checks
- assertions or defensive guards at the true correctness boundary

When correcting violations:
- encode the invariant where it is naturally enforced
- remove duplicate or scattered half-checks when one authoritative check is better
- keep the invariant visible in the code structure
- preserve intended behavior unless the user asked for a change in behavior

Rules:
- Do not rely on hidden assumptions for correctness.
- Do not assume earlier layers already enforced critical invariants unless that contract is explicit and stable.
- Do not scatter partial checks across many places when one authoritative enforcement point exists.
- Prefer explicit invalid-state rejection over ambiguous normalization.
- If the invariant matters for correctness, make it visible in code, types, schema, or state transitions.
