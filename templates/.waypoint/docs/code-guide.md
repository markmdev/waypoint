---
summary: Opinionated rules for writing and changing Waypoint code so behavior stays explicit, strict, observable, and easy to evolve.
read_when:
  - writing new code
  - changing existing behavior
  - introducing or removing configuration
  - handling external input or external systems
  - adding tests, logging, or state transitions
---

# Code Guide

Waypoint favors explicitness over convenience, correctness over compatibility theater, and deletion over accumulation. Code should make the system easier to reason about after the change, not merely pass today.

## 1. Compatibility is opt-in, not ambient

Do not preserve old behavior unless a user-facing requirement explicitly asks for it.

When replacing a path, remove the old one instead of leaving a shim, alias, translation layer, or silent compatibility branch. If compatibility must be preserved, document the exact contract being preserved and the planned removal condition.

Do not keep dead fields, dead parameters, dual formats, or migration-only logic "just in case". Every compatibility layer becomes part of the design whether intended or not.

## 2. Fail clearly, never quietly

Errors are part of the contract. Surface them early and with enough context to diagnose the cause.

Do not swallow errors, downgrade them to logs, or return partial success unless partial success is the explicit API. If an operation can fail in distinct ways, preserve those distinctions. Do not replace a specific failure with a generic one that destroys meaning.

Error messages should identify what failed, at which boundary, and why the system refused to proceed. They should not force readers to infer missing state from generic text.

## 3. No silent fallback paths

Fallbacks are allowed only when they are deliberate product behavior, not a coding reflex.

Do not silently retry with weaker behavior, alternate providers, cached data, inferred defaults, empty values, or best-effort modes unless the user asked for degraded operation and the degraded result remains truthful.

If degradation exists, it must be explicit in code, testable, and observable. Hidden fallback logic makes the system look healthy while it is already off-contract.

## 4. Validate at boundaries, not deep inside

Anything that crosses a boundary must be treated as untrusted: user input, config, environment, files, network responses, database reads, queue payloads, generated content, and data from other modules.

Validate structure, required fields, allowed values, and invariants at the boundary. Convert external data into a trusted internal shape once. Do not pass loosely-typed or half-validated data deeper into the system and hope downstream code copes.

Boundary validation should reject invalid data, not "normalize" it into something ambiguous.

## 5. Configuration must be strict

Missing or invalid configuration should stop the system at startup or at the feature boundary where it becomes required.

Do not hide absent configuration behind guessed defaults, environment-dependent behavior, or implicit no-op modes. Defaults are acceptable only when they are safe, intentional, and documented as part of the product contract.

Configuration should be centralized enough to audit. A reader should be able to tell which settings matter, what values are valid, and what happens when they are wrong.

## 6. Prefer direct code over speculative abstraction

Do not introduce abstractions for imagined future use. Add them only when multiple concrete cases already demand the same shape.

A small amount of duplication is cheaper than the wrong abstraction. Prefer code that exposes the current domain plainly over generic layers, plugin systems, factories, wrappers, or strategy trees created before the need is real.

Abstractions must remove real complexity, not relocate it. If a helper hides critical behavior, state changes, validation, or failure modes, it is making the system harder to read.

## 7. Make state and invariants explicit

State transitions should be visible in code. Readers should be able to answer: what states exist, what moves the system between them, and what must always be true.

Do not encode important transitions as scattered flag mutations, ordering assumptions, optional fields, or side effects hidden in utility calls. Avoid representations where invalid states are easy to create and hard to detect.

When a function changes state, make the transition obvious. When a module depends on an invariant, assert it at the boundary of the operation instead of relying on folklore.

## 8. Tests define behavior changes, not just regressions

Any behavior change must update tests to describe the new contract. If the old behavior mattered, remove or rewrite the old tests instead of making them weaker.

Test observable behavior and boundary cases, not implementation trivia. Cover failure modes, validation rules, configuration strictness, and any intentional degradation path. If a bug fix closes a previously possible bad state, add a test that proves the bad state is now rejected.

Do not merge code whose behavior changed without leaving behind executable evidence of the new rules.

## 9. Observability is part of correctness

Code is not complete if production failures cannot be understood from its signals.

Emit structured logs, metrics, or events at important boundaries and state transitions, especially around input rejection, external calls, retries, and degraded modes. Observability should explain which path executed and why.

Do not log noise to compensate for poor design. Prefer a small number of high-value signals tied to decisions, failures, and contract edges.

## 10. Optimize for future legibility

Write code for the next person who must change it under pressure.

Keep modules narrow in responsibility. Keep data flow obvious. Keep control flow boring. Prefer designs where the main path is easy to follow and unusual behavior is explicitly named.

When changing code, improve the shape around the change if needed. Do not leave behind half-migrated designs, obsolete branches, commented-out code, or placeholders for imagined follow-ups.

The best code is not code that can handle every possible future. It is code whose current truth is obvious, whose failures are visible, and whose wrong parts can be deleted without fear.
