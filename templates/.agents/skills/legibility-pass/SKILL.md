---
name: legibility-pass
description: Improve code legibility within a defined scope without changing intended behavior. Use when code is correct but hard to read, reason about, or safely modify. Focus on making intent, control flow, state, boundaries, and important behavior easier to see through better naming, clearer structure, reduced indirection, and simpler local reasoning.
---

Refactor the given scope to make the current truth easier to see.

Preserve behavior unless the user asked for functional change.

Focus on:
- clearer names for modules, functions, variables, and states
- making the main flow easy to follow
- making failure paths and edge conditions explicit
- reducing indirection that hides important behavior
- making state, contracts, and boundaries easier to understand
- collapsing unnecessary wrappers or pass-through helpers
- improving local reasoning so a reader needs less cross-referencing

Within the requested scope:
1. Identify the parts that are hardest to understand or easiest to misread.
2. Improve naming so intent is obvious.
3. Restructure code so the main path is visible and important branches are easy to spot.
4. Make hidden assumptions, state transitions, and invariants more explicit.
5. Remove low-value indirection that makes behavior harder to trace.
6. Keep comments rare; prefer making the code itself explain the behavior.
7. Add a brief clarifying comment only when the underlying rule or constraint is not obvious from the code alone.

Rules:
- Do not preserve confusing structure just because it already exists.
- Do not add abstractions that make reading harder.
- Do not replace clear code with clever code.
- Do not rely on comments to explain code that should be rewritten instead.
- Prefer fewer mental hops.
- Prefer one obvious reading of the code over multiple plausible interpretations.