---
name: test-writing
description: Write a small, high-signal test set that protects important behavior without overfitting to implementation details. Use whenever adding or modifying automated tests for a feature, bug fix, refactor, or behavior change. Prefer durable tests that verify user-visible behavior, important business rules, and meaningful failure modes. Avoid redundant, brittle, or low-value tests that increase maintenance cost without materially increasing confidence.
---

Write tests for confidence, not volume.

Start with the smallest test set that gives strong confidence in the requested change.

Default test budget for a normal feature or bug fix:
- one main-path test
- one key edge case or failure-path test
- unit tests only for non-trivial pure logic

Test at the highest level that gives strong confidence at reasonable cost.

Prefer tests that:
- verify observable behavior
- protect important business rules and invariants
- cover meaningful boundaries and failure modes
- survive refactors
- exercise public interfaces rather than private helpers

Avoid tests that:
- duplicate confidence across layers without a distinct risk
- assert implementation choreography instead of outcomes
- test trivial helpers, thin wrappers, pass-through glue, or obvious mappings
- encode fragile structure such as incidental DOM shape, exact class strings, private function calls, or unstable snapshots
- expand a feature into a large matrix of low-value cases unless the risk truly requires it

When choosing between many narrow tests and one stronger test, prefer the smaller set that better protects real behavior.

For frontend work:
- prefer stable user-visible behavior over structural assertions
- add automated regression tests only when the behavior is worth protecting and likely to remain stable
- do not add large numbers of UI tests for cosmetic or refactor-sensitive details

For backend or domain logic:
- prefer behavior-focused tests around contracts, invariants, validation, permissions, state transitions, and real regressions
- add targeted unit tests for tricky pure logic only when they materially improve confidence

If an integration-style test already proves the important flow, do not add multiple lower-level tests that mostly restate the same confidence.

Before finishing, remove or avoid any test whose main effect is to make future refactors harder without protecting an important contract.

Rules:
- Do not optimize for test count.
- Do not mirror the implementation structure in the test structure.
- Do not create one test per helper by default.
- Do not add redundant tests across layers unless a distinct risk justifies them.
- Do not test trivial code just because it exists.
- Prefer the smallest durable set that gives high confidence.