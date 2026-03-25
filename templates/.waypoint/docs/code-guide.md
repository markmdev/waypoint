---
summary: Universal coding conventions — explicit behavior, root-cause fixes, security, concurrency, accessibility, performance, and behavior-focused verification
last_updated: "2026-03-25 10:40 PDT"
read_when:
  - writing code
  - coding standards
  - code conventions
  - TypeScript
  - frontend
  - backend
  - error handling patterns
  - testing
---

# Code Guide

Write code that keeps behavior explicit, failure visible, and the next change easier than the last one.

## 1. Compatibility is opt-in, not ambient

Do not preserve old behavior unless a user-facing requirement explicitly asks for it.

- Remove replaced paths instead of leaving shims, aliases, or silent compatibility branches.
- Do not keep dead fields, dual formats, or migration-only logic "just in case."
- If compatibility must stay, document the exact contract being preserved and the removal condition.

## 2. Fix root causes, not symptoms

Bug fixes should remove the reason the problem exists, not only hide its most obvious effect.

- Do not ship hot patches that leave the bad underlying decision untouched when the real cause is visible and fixable.
- If the real fix requires deleting stale code, changing an unhealthy abstraction, or paying down the debt that directly caused the issue, do that work.
- Prefer one clear correction over layering guards, retries, fallbacks, or one-off conditionals around broken logic.
- If you intentionally choose a temporary mitigation, label it clearly as temporary, explain the remaining risk, and leave a removal path.

## 3. Type safety is non-negotiable

The compiler is part of the design, not an afterthought.

- Write as if strict mode is enabled. Type errors are build blockers.
- Never use `any` when `unknown`, narrowing, generics, or better shared types can express the real contract.
- Reuse exported library or app types instead of recreating them locally.
- Be explicit at boundaries: function params, returns, public interfaces, API payloads, DB rows, and shared contracts.
- Validate external data at boundaries with schema validation and convert it into trusted internal shapes once.
- Avoid cross-package type casts unless there is no better contract available; fix the shared types instead when practical.

## 4. Fail clearly, never quietly

Errors are part of the contract.

- Fail explicitly. No silent fallbacks, empty catches, or degraded behavior that pretends everything is fine.
- Every caught exception must propagate, crash, or be surfaced truthfully to the user or operator.
- Do not silently switch to worse models, stale cache, inferred defaults, empty values, or best-effort modes unless that degradation is an intentional product behavior.
- Required configuration has no silent defaults. Missing required config is a startup or boundary failure.
- Error messages should identify what failed, where, and why.

## 5. Validate at boundaries

Anything crossing a boundary is untrusted until proven otherwise.

- Validate user input, config, files, HTTP responses, generated content, database reads, queue payloads, and external API data at the boundary.
- Reject invalid data instead of "normalizing" it into something ambiguous.
- Keep validation near the boundary instead of scattering half-validation deep inside the system.

## 6. Security and privacy by default

Security and privacy work is part of normal engineering, not a later hardening pass.

- Validate authorization at boundaries and re-check it when trust changes across layers or actors.
- Minimize privileges for services, jobs, tokens, and humans. Do not grant broad access when the narrower contract is known.
- Protect secrets in config, logs, traces, prompts, fixtures, screenshots, and error paths.
- Sanitize untrusted content before rendering, executing, storing, or forwarding it.
- Avoid storing, returning, or exposing sensitive data unless the product truly needs it.

## 7. Prefer direct code over speculative abstraction

Do not invent complexity for hypothetical future needs.

- Add abstractions only when multiple concrete cases already demand the same shape.
- Prefer straightforward code and small duplication over the wrong generic layer.
- If a helper hides critical validation, state changes, or failure modes, it is probably hurting clarity.

## 8. Make state, contracts, and provenance explicit

Readers should be able to tell what states exist, what transitions are legal, and what data can be trusted.

- Use explicit state representations and enforce invariants at the boundary of the operation.
- Multi-step writes must have clear transaction boundaries.
- Retryable operations must be idempotent or guarded against duplicate effects.
- New schema and persistence work should make provenance obvious and protect against duplication with the right uniqueness constraints, foreign keys, or equivalent invariants.
- Shared schemas, fixtures, and contract types must match the real API and stored data shape.

## 9. Time, concurrency, and distributed failure are real inputs

Systems do not run in a single-threaded, perfectly ordered world.

- Be explicit about timeouts, cancellation, retries, duplicate delivery, race conditions, clock assumptions, and ordering guarantees.
- Treat retry behavior, background work, and message handling as correctness boundaries, not incidental plumbing.
- Assume network calls, workers, queues, and remote dependencies can be slow, reordered, repeated, or partially failed.
- Make conflict handling and failure recovery explicit where concurrency can affect user or system state.

## 10. Frontend must reuse and fit the existing system

Frontend changes should extend the app, not fork its design language.

- Before creating a new component, check whether the app already has a component or pattern that should be reused.
- Reuse existing components when they satisfy the need, even if minor adaptation is required.
- When a new component is necessary, make it match the design language, interaction model, spacing, states, and compositional patterns of the rest of the app.
- Handle all states for async and data-driven UI: loading, success, empty, error.
- Optimistic UI must have an explicit rollback or invalidation strategy. Never leave optimistic state hanging without a recovery path.

## 11. Accessibility is part of correctness

UI work is not correct if important users cannot operate it.

- Support keyboard navigation, semantic structure, accessible names, focus states, and readable contrast.
- Make interactive states and errors perceivable to assistive technologies, not only visually obvious.
- Treat accessibility regressions as correctness issues, not optional polish.
- Verify accessibility behavior in the actual UI surface when the change affects interaction or rendering.

## 12. Observability is part of correctness

If you cannot see the failure path, you have not finished the work.

- Emit structured logs, metrics, or events at important boundaries and state transitions.
- Include enough context to reproduce issues without logging secrets or sensitive data.
- Failed async work, retries, degraded paths, and rejected inputs must leave a useful trace.
- Do not use noisy logging to compensate for unclear control flow.

## 13. Performance by measurement

Optimize based on real impact, not superstition, but do not ignore performance failures once users or operators feel them.

- Measure before and after when performance work matters.
- Treat pathological queries, unnecessary renders, large payloads, and unbounded memory or retry behavior as correctness issues once they affect users, cost, or operations.
- Prefer targeted fixes at the real bottleneck over broad speculative optimization.
- Keep performance assumptions visible in code, docs, or comments when they are important to correctness.

## 14. Test behavior, not implementation

Tests should protect the contract users depend on.

- Test observable behavior and boundary cases, not implementation trivia.
- Never write brittle regression tests that assert exact class strings, styling internals, private helper calls, incidental DOM structure, internal schema representations, or other implementation-detail artifacts.
- Regression tests must focus on the behavior that was broken and the behavior that is now guaranteed.
- For backend bugs, prefer behavior-focused regression tests by default.
- For frontend bugs, prefer manual QA by default; add automated regression coverage only when there is a stable user-visible behavior worth protecting.
- Do not merge behavior changes without leaving behind executable or clearly documented evidence of the new contract.

## 15. Simplicity in naming and organization

Code should be easy to navigate under pressure.

- Use names that describe intent, not cleverness, incidental mechanics, or historical accidents.
- Keep functions, modules, and APIs small enough that a reader can understand the responsibility without cross-referencing half the repo.
- Prefer one obvious place for a behavior over scattering it across thin wrappers and pass-through layers.
- Group code by responsibility and boundary, not by vague convenience buckets.
- If a file or API has grown hard to name clearly, it is probably doing too much.

## 16. Optimize for future legibility

Write code for the next engineer or agent who has to change it under pressure.

- Keep modules narrow in responsibility and data flow obvious.
- Remove stale branches, half-migrations, dead code, and obsolete docs around the change.
- Keep docs and shipped behavior aligned.
- Before pushing or opening a PR, do a hygiene pass for stale docs, drifting contracts, typing gaps, missing rollback strategies, and new persistence correctness risks.

The best code is not the most flexible code. It is the code whose current truth is obvious, whose failures are visible, and whose wrong parts can be deleted without fear.
