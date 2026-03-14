# Backend audit framework

Use this reference to turn repository understanding into a practical release-risk review.

## Table of contents

1. [Scope and architecture fit](#1-scope-and-architecture-fit)
2. [API and contract quality](#2-api-and-contract-quality)
3. [Domain modeling and correctness](#3-domain-modeling-and-correctness)
4. [Data integrity and consistency](#4-data-integrity-and-consistency)
5. [Migration safety and rollback safety](#5-migration-safety-and-rollback-safety)
6. [Async, queue, and worker correctness](#6-async-queue-and-worker-correctness)
7. [Failure handling, timeouts, and backpressure](#7-failure-handling-timeouts-and-backpressure)
8. [Security, auth, and tenant isolation](#8-security-auth-and-tenant-isolation)
9. [Reliability and operational readiness](#9-reliability-and-operational-readiness)
10. [Test evidence](#10-test-evidence)
11. [Severity calibration](#11-severity-calibration)
12. [Handling unknowns](#12-handling-unknowns)

## 1. Scope and architecture fit

Check whether the scoped backend unit has a clear responsibility and a defensible boundary.

Look for:
- hidden coupling to unrelated subsystems that makes the requested scope impossible to reason about safely
- ownership split across layers or services without clear contracts
- feature behavior controlled by undocumented flags or runtime configuration
- operational behavior that only exists in deployment config but is absent from docs and tests

Evidence to seek:
- route or handler entry points
- service and repository boundaries
- config loading paths
- feature flag checks
- ADRs or architecture docs

## 2. API and contract quality

Check whether external or internal contracts are safe to release under the expected compatibility bar.

Look for:
- request validation gaps
- response-shape drift from spec or tests
- undocumented behavior changes
- missing idempotency on retryable writes
- unsafe pagination or filtering semantics
- partial-success behavior without clear client contract
- incompatible changes to event payloads, queues, or partner-facing APIs

Evidence to seek:
- handlers, validators, serializers, DTOs, OpenAPI or protobuf specs
- consumer tests or contract tests
- backward-compatibility notes in docs or migrations

## 3. Domain modeling and correctness

Check whether the code actually enforces business invariants.

Look for:
- invariants enforced only in UI or caller code
- state transitions with missing guards
- invalid states representable in persistence
- derived fields that can drift from source-of-truth data
- duplicate logic that can diverge under edge cases

Evidence to seek:
- model logic, service logic, validators, persistence constraints, tests

## 4. Data integrity and consistency

Check how writes behave under failure, retries, and concurrent activity.

Look for:
- missing transactions around multi-step writes
- transactions that include external calls and can hang or partially commit
- non-atomic read-modify-write flows
- retry paths that can duplicate side effects
- absence of uniqueness or foreign-key enforcement where the invariant depends on it
- eventual-consistency behavior with no compensating logic or visibility

Evidence to seek:
- transaction boundaries
- repositories and queries
- migration constraints and indexes
- retry wrappers and dedup logic
- job enqueue order relative to commits

## 5. Migration safety and rollback safety

Check whether schema and data changes are safe under real deploy conditions.

Look for:
- destructive or irreversible migrations without a rollback story
- schema changes that break old binaries during rolling deploys
- backfills mixed into request paths or startup
- long-running or locking operations on hot tables
- reliance on application code to keep dual-write or dual-read windows safe without tests

Evidence to seek:
- migration files
- deploy docs
- backfill code
- startup hooks
- compatibility tests

## 6. Async, queue, and worker correctness

Check whether background processing is safe under duplicate delivery, delay, and partial failure.

Look for:
- no idempotency for retryable jobs
- poison-message loops
- missing dead-letter or terminal-failure handling
- enqueue-before-commit races
- jobs that assume fresh state but run much later
- scheduled tasks that can overlap or race
- side effects without deduplication keys

Evidence to seek:
- worker code
- queue wrappers
- job payload definitions
- retry config
- scheduling config
- tests for duplicate or delayed execution

## 7. Failure handling, timeouts, and backpressure

Check whether the system fails predictably under dependency issues and traffic spikes.

Look for:
- outbound calls without timeout or cancellation
- retries without budget, jitter, or bounding
- fan-out paths with unbounded concurrency
- silent fallbacks that hide corruption or dropped work
- blocking behavior in request paths that should shed load
- missing admission control or queue bounds where bursts are expected

Evidence to seek:
- HTTP or RPC client construction
- context propagation
- timeout configuration
- retry policies
- worker pool limits
- queue depth controls

## 8. Security, auth, and tenant isolation

Check whether trust boundaries are explicit and enforced server-side.

Look for:
- authz performed only in callers or UI layers
- object-level access checks missing on reads or writes
- tenant scoping inferred from untrusted input
- secrets in code, logs, examples, or unsafe defaults
- admin flows exposed through general routes without stronger controls
- unsafe deserialization, query injection, SSRF, path traversal, or similar flaws relevant to the stack

Evidence to seek:
- middleware
- route guards
- policy checks
- repository filters
- config files and environment examples
- tests for unauthorized access

## 9. Reliability and operational readiness

Check whether on-call engineers could detect, triage, and mitigate failures.

Look for:
- missing structured logs around critical writes or state transitions
- no metrics for queues, retries, dead letters, or error rates
- no tracing through core flows
- lack of alerting hooks for silent backlog growth or repeated failure
- missing runbooks for risky operations or recovery paths
- no feature flag, kill switch, or disable path for a new high-risk flow

Evidence to seek:
- logging calls
- metrics and tracing instrumentation
- alert config
- dashboards
- runbooks
- incident notes

## 10. Test evidence

Check whether tests cover the failure modes that matter for shipping.

Look for:
- tests only for happy paths
- no coverage for authorization failures, duplicate delivery, retries, partial failures, migrations, or concurrency-sensitive paths
- mocks that hide contract drift or persistence behavior
- no integration coverage where correctness depends on transaction, queue, or DB behavior

Evidence to seek:
- unit tests
- integration tests
- end-to-end tests
- test helpers and fixtures
- migration or backfill tests

## 11. Severity calibration

Calibrate severity using blast radius, exploitability, reversibility, and confidence.

Typical anchors:
- P0: a likely severe outage, corruption path, data-loss path, or critical security flaw with no acceptable workaround
- P1: a serious integrity, security, or reliability gap that should usually block release
- P2: a material weakness that may be acceptable with explicit risk acceptance and monitoring
- P3: a moderate gap with limited immediate blast radius
- P4: a minor improvement with little near-term release impact

Increase severity when the backend is public, high-scale, handles sensitive data, or has low rollback tolerance.
Decrease severity when the flow is internal, low-volume, reversible, heavily monitored, and has a strong kill switch.

## 12. Handling unknowns

Treat missing context as a first-class part of the audit.

When context is missing:
- ask only the questions that change severity or release conditions
- state assumptions explicitly
- lower confidence when evidence is incomplete
- promote the unknown into a release condition when the uncertainty itself is risky

Do not invent certainty.
