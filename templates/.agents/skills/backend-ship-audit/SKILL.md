---
name: backend-ship-audit
description: Audit a backend scope for ship-readiness with evidence-based findings focused on real release risk. Use when a backend service, API, worker, scheduler, PR, or backend area needs a launch-readiness review rather than style feedback or PR comment triage.
---

# Backend ship audit

Follow this workflow in order. Optimize for practical release readiness. Ignore style-only issues.

Use bundled resources as follows:
- Use `references/audit-framework.md` for detailed evaluation prompts and severity calibration.
- Use `references/report-template.md` for the audit structure and finding format.

## When Not To Use This Skill

- Skip it for frontend release review; use the frontend ship-audit workflow instead.
- Skip it for generic code review or maintainability review that is not explicitly about ship readiness.
- Skip it for active PR comment triage; use `pr-review` for that loop.
- Skip it for a one-off coding-guide compliance check on a narrow slice; use `code-guide-audit` for that job.

## 1. Resolve the reviewable unit

Turn the user request into the narrowest defensible backend unit that can be audited end to end.

Determine and state:
- requested scope
- assumed scope used for the audit
- code and docs directly in scope
- adjacent dependencies and boundaries that materially affect behavior
- explicit out-of-scope areas

Use repository structure to narrow broad requests. Prefer a reviewable unit such as a single service, endpoint group, worker flow, API surface, migration set, or pull request boundary over a vague "entire backend" scope.

If the request is ambiguous, make the best defensible narrowing decision from the repository and state it in the audit. Do not block on clarification unless the ambiguity itself is the primary risk.

## 2. Build complete understanding from the repository

Explore the repository deeply enough to understand the scoped backend and the dependencies that materially affect ship readiness.

Start with a map, then move to complete reads:
1. Read project guidance first. Prefer root `AGENTS.md`, plus any scoped guidance files if present.
2. Read architecture docs, ADRs, onboarding docs, runbooks, incident notes, and API or contract docs that touch the scope.
3. Map entry points and main flows with fast search tools.
4. Read the full contents of every file that matters to architecture understanding, behavior, or findings.
5. Trace the end-to-end flow across handlers, validation, services, repositories, persistence, jobs, queues, external clients, configuration, and tests.

Read complete files for relevant materials. Do not rely on grep hits, matched snippets, partial chunks, or truncated previews for any file that informs architectural understanding or a finding.

Read complete files for all relevant artifacts you encounter, including when present:
- backend source files
- handlers, controllers, routes, services, jobs, workers, schedulers
- schemas, models, serializers, DTOs, validators
- repositories, query layers, persistence code
- migrations and migration helpers
- queue and background processing code
- configuration files and environment examples
- tests and test helpers
- API specs and contract definitions
- runbooks and operational docs
- incident notes or postmortems

Skip obviously irrelevant material such as vendored dependencies, generated artifacts, build outputs, caches, or unrelated subsystems.

Keep a working inventory of fully read files. Include that inventory in the audit under a "What was read" section.

When code and docs disagree, trust code for current behavior unless the docs clearly describe runtime behavior not visible in the repository. Call out the discrepancy if it matters to shipping risk.

## 3. Build an internal system model

Before asking questions or writing findings, form a concrete model of:
- request and event entry points
- trust boundaries
- data flow and persistence path
- transaction and consistency boundaries
- async boundaries and retry paths
- authn and authz assumptions
- tenant scoping model when relevant
- configuration, feature flags, and runtime dependencies
- observability and operational control points

Use that model to identify what can fail, what can race, what can duplicate, what can corrupt data, and what can become hard to detect or recover.

## 4. Ask only missing high-leverage questions

Ask questions only after repository exploration and only when the answer materially changes the ship-readiness bar.

Group questions by topic. Keep them concise. Usually ask no more than 3 to 8 questions total unless the backend context is unusually under-specified.

Target questions at facts that cannot be established from the codebase or docs, such as:
- deployment exposure and user type
- expected scale, burstiness, and concurrency
- data sensitivity or compliance constraints
- single-tenant or multi-tenant expectations
- uptime, recovery, and rollback tolerance
- backward compatibility and API stability requirements
- observability and incident response expectations
- security posture or access-control expectations

Do not ask generic architecture-preference questions. Do not ask for information already visible in the repository.

If answers are unavailable, proceed with explicit assumptions. Place assumptions in the audit and calibrate severity to the confidence of the evidence.

## 5. Persist durable backend context

Persist durable deployment context into the project root guidance file by editing it manually.

Choose the target file in this order:
1. `AGENTS.md` in the project root
2. no edit if it does not exist, unless the user explicitly asked to create one

Prefer updating an existing `## Backend Context` section. Add the section only if it is missing. Preserve surrounding content exactly. Do not overwrite unrelated sections. Do not duplicate existing context. Do not make any edit if the existing section is already accurate and sufficiently complete.

Persist only stable context such as:
- internal vs internet-facing exposure
- expected scale and criticality
- data sensitivity or compliance constraints
- tenant model
- compatibility requirements
- reliability expectations
- security posture assumptions
- rollback tolerance

Do not persist transient audit findings, temporary mitigations, or release-specific defects.

Make this edit manually. Prefer the smallest precise change that preserves all unrelated guidance exactly.

## 6. Evaluate ship readiness with a backend-risk lens

Assess the scoped backend like a strong backend reviewer. Focus on real ship risk, not code taste.

Use `references/audit-framework.md` to drive the detailed category pass and severity calibration. Do not force findings in every category; use judgment and focus on the risks that actually matter for release readiness.

Treat missing evidence carefully:
- Missing tests, docs, or operational controls can be findings if the absence creates real release risk.
- Unknown deployment context can lower confidence or elevate a question into a release condition.
- Lack of proof is not the same as proof of failure. State uncertainty explicitly.

## 7. Calibrate priority consistently

Use this model exactly:
- `P0`: clear ship blocker; likely severe outage, data loss, data corruption, critical security issue, or fundamentally unsafe release
- `P1`: serious issue that should usually be fixed before shipping; substantial reliability, security, integrity, or operational risk
- `P2`: important issue that may be acceptable only with conscious risk acceptance; not an immediate blocker in all contexts
- `P3`: moderate weakness or gap; address soon but not necessarily before launch
- `P4`: minor improvement with limited near-term impact

Do not inflate severity. Severity depends on deployment context, blast radius, reversibility, exploitability, and confidence.

## 8. Write the audit document

Write the final audit to:

`.waypoint/audit/dd-mm-yyyy-hh-mm-backend-audit.md`

Create directories if needed.

Use `references/report-template.md` as the base structure. Include at minimum:
- title and timestamp
- requested scope and assumed scope
- in-scope, adjacent dependencies, and out-of-scope areas
- what was read
- open questions and explicit assumptions
- concise system understanding
- ship recommendation
- prioritized findings
- release conditions or follow-up actions

Prefer path and line-based evidence when practical. If line numbers are not practical, cite the full file path plus the specific symbol, function, class, migration, endpoint, or test that supports the finding.

## 9. Format findings for actionability

Give every finding:
- ID
- title
- priority from `P0` to `P4`
- why it matters
- evidence
- affected area
- risk if shipped as-is
- recommended fix
- confidence level if evidence is incomplete

Use concise, concrete language. Tie every finding to repository evidence or an explicit unanswered question that materially affects readiness.

## 10. Make the ship decision explicit

End with a clear recommendation:
- `Ready to ship`
- `Ready to ship with explicit risk acceptance`
- `Not ready to ship`

Use `Not ready to ship` when there is a `P0`, an unresolved `P1`, or a material unknown that could plausibly conceal a `P0` or `P1` under the stated deployment context.

If the scope is acceptable only with conditions, list the exact conditions.

## 11. Avoid low-value review behavior

Do not include:
- style policing
- subjective nitpicks
- trivial refactor suggestions without ship impact
- generic best-practice commentary unsupported by repository evidence
- vague advice such as "add more tests" without naming the missing failure mode or blind spot

Prefer a short audit with strong evidence over a long audit with weak claims.

## Gotchas

- Do not start asking deployment-context questions before you have read the scoped code and docs. This skill should ask only what the repository cannot answer.
- Do not rely on grep hits or partial snippets for anything that informs a finding. Backend ship audits need complete-file reads for the code and docs that matter.
- Do not drift into style review, generic refactor advice, or "nice to have" cleanup. Every finding should connect to real release risk.
- Do not trust route names or file names alone to define the scope. Resolve the actual entry points, persistence paths, jobs, and external dependencies before judging readiness.
- If deployment context is missing, state the assumption and calibrate confidence or severity accordingly. Do not present guessed operating conditions as established fact.

## Keep This Skill Sharp

- After meaningful audits, add new gotchas when the same backend-risk blind spot, scope mistake, or deployment-context question keeps recurring.
- Tighten the description if the skill misses real prompts like "is this API ready to ship" or fires on requests that only need generic code review.
- If the audit keeps reusing the same detailed evaluation logic or evidence format, move that reusable detail into `references/` instead of expanding the hub file.
