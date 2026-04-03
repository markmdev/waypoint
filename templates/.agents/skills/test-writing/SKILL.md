---
name: test-writing
description: Choose and write the smallest durable automated test set for a non-trivial code change when test selection is ambiguous or high-value. Use when adding or modifying tests for a behavior change, regression fix, refactor, or other change where multiple test scopes are plausible and durable coverage matters. Do not use for documentation-only edits, cosmetic changes, or straightforward one-test maintenance.
---

# Test Writing

## Mission
Choose the smallest durable automated test set that proves the requested change and protects the highest-risk behavior.

## Default Workflow
1. Identify the contract.
   - State the behavior that must hold after the change.
   - Identify the smallest surface that can prove it.
   - Check whether existing tests already cover the contract.
2. Rank the risks.
   - Main path
   - Highest-value failure path or boundary
   - Regression that motivated the change
   - Non-trivial pure logic
3. Select the minimum set.
   - Choose one test per distinct risk.
   - Prefer the highest-level test that proves the contract.
   - Add unit tests only for non-trivial pure logic that is not already covered.
4. Remove redundancy.
   - Drop tests that restate confidence already provided by a stronger test.
   - Reject assertions that depend on implementation choreography instead of outcomes.
5. Verify sufficiency.
   - Confirm every chosen test has a distinct reason to exist.
   - Confirm the set is still small enough to maintain through refactors.
6. Report the decision.
   - State what was chosen, what was omitted, why the set is sufficient, and what remains at risk.

## Rules
- Do not add a test unless it protects a distinct behavior or failure mode.
- Do not mirror implementation structure in test structure.
- Do not test trivial helpers, pass-through glue, or obvious mappings unless they contain a real bug risk.
- Do not add redundant tests across layers unless the lower-level test covers a different risk than the higher-level test.
- Do not use brittle assertions on incidental DOM shape, private calls, exact class strings, or unstable snapshots.
- Do not expand to a matrix of cases by default.
- Do not optimize for test count; optimize for unique confidence.
- For frontend work, do not choose structural assertions when a user-visible assertion can prove the behavior.
- For backend or domain logic, do not skip contract, invariant, permission, validation, or state-transition coverage when those are the real risks.

## Exception Rule
Expand beyond the default budget only when the change introduces an additional high-risk contract that cannot be covered by the same test without losing clarity or coverage.

The default budget is 2 tests:
- 1 main-path test
- 1 highest-value edge, boundary, or failure-path test

You may expand to 3 tests only if all of the following are true:
- each added test covers a distinct high-risk behavior
- no existing test already proves the same contract
- a combined test would hide an important failure mode or become unreadable

Never exceed 4 total tests without explicit human approval.

## Output Contract
Return the decision in this shape:
- Chosen tests: list each test and the risk it covers.
- Omitted tests: list notable tests you did not write and why.
- Rationale: explain why the selected set is sufficient and minimal.
- Residual risk: name what remains untested and why that risk is acceptable.

If no new test is needed, say that explicitly and explain which existing test already covers the contract.
