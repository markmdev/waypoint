---
name: frontend-ship-audit
description: Audit a defined frontend scope for ship-readiness with a strong focus on real product risk, user-facing correctness, and evidence from the repository. Use when Codex needs to review an app, route group, feature, page set, component area, PR, or frontend directory to decide whether it is ready to ship; resolve the actual reviewable frontend scope from the user request and repository structure; read all relevant frontend code and docs completely; ask a concise high-leverage interview only for missing context that materially changes the release bar; persist durable frontend deployment context into the project root AGENTS.md under a Frontend Context section; and write an evidence-based audit with prioritized P0-P4 findings at .waypoint/audit/dd-mm-yyyy-hh-mm-frontend-audit.md.
---

Audit ship-readiness like a strong frontend reviewer. Optimize for user impact, release risk, and production correctness. Do not optimize for style policing.

Use this workflow:

1. Resolve the scope.
   - Infer the most defensible reviewable unit from the user request and repository structure.
   - State the assumed scope when the request is broad or ambiguous.
   - List what is directly in scope, what important dependencies matter, and what is explicitly out of scope.
   - Include dependent APIs, design systems, auth flows, platform constraints, analytics, SEO, localization, and accessibility requirements when they materially affect the scoped experience.

2. Build repository understanding before judging readiness.
   - Read the project root guidance file first: `AGENTS.md`.
   - Read package manifests, router entry points, route definitions, layouts, pages, screens, composition layers, state containers, API clients, validation logic, design-system primitives, styling and theming files, accessibility helpers, tests, specs, design docs, runbooks, and architecture docs when they matter to the scoped frontend.
   - Read complete files for all relevant materials. Do not rely on grep hits, single matched lines, or truncated snippets for anything that informs architecture or a finding.
   - Ignore clearly irrelevant material such as vendored dependencies, generated outputs, caches, and unrelated subsystems.

3. Model the real user experience.
   - Trace primary and secondary user journeys across entry points, route transitions, loading states, empty states, errors, retries, mutations, auth boundaries, success states, and exits.
   - Identify frontend boundary assumptions: API contracts, feature flags, experiments, permissions, browser support, device classes, SEO rules, localization rules, analytics expectations, and privacy constraints.
   - Distinguish proven behavior from assumed behavior.

4. Ask only the questions that materially change the release bar.
   - Ask the interview after repository exploration.
   - Group questions by topic.
   - Keep them concise and high leverage.
   - Skip questions that the codebase or docs already answer.
   - If answers are unavailable, proceed with explicit assumptions and label them clearly in the audit.

5. Persist durable frontend context.
   - Prefer the project root `AGENTS.md`.
   - If it does not exist, do not create a new guidance file unless the user explicitly asks.
   - Update an existing `## Frontend Context` section when present.
   - Otherwise add a new `## Frontend Context` section.
   - Preserve surrounding content exactly.
   - Do not overwrite unrelated sections.
   - Do not duplicate existing context.
   - Do not persist transient findings.
   - Persist only stable deployment context and durable product constraints such as audience, browser support, device classes, accessibility targets, performance expectations, SEO expectations, localization requirements, analytics obligations, design-system constraints, auth expectations, and privacy or security expectations.
   - Make this edit manually and preserve surrounding content exactly.
   - Read `references/guidance-file-updates.md` before editing the guidance file.

6. Produce the audit.
   - Write the audit to `.waypoint/audit/dd-mm-yyyy-hh-mm-frontend-audit.md`.
   - Create directories if needed.
   - Use current local execution time for the timestamp unless the project or task specifies a different timezone convention.
   - Use `scripts/create_frontend_audit.py` to create the timestamped audit file path and scaffold when helpful.
   - Read `references/report-template.md` before writing the final report.

7. Evaluate with practical release judgment.
   - Judge the scoped frontend across architecture fit, boundary clarity, user journey completeness, loading and failure handling, form correctness, validation, API integration robustness, state management correctness, rendering behavior, responsiveness, accessibility, focus management, keyboard support, visual consistency, design-system usage, interaction quality, auth and authorization exposure, client-side security and privacy, performance risks, hydration risks, SEO and metadata correctness, analytics correctness, observability, future legibility, and cross-browser or cross-device risk when relevant.
   - Do not limit the audit to that list. Apply specialist judgment.
   - Read `references/review-framework.md` for the detailed audit lenses.

8. Keep findings evidence-based and severity-calibrated.
   - Do not include stylistic preferences, generic best-practice commentary, or trivial refactors without ship impact.
   - Tie every finding to repository evidence.
   - Use the smallest severity that honestly reflects the risk.
   - Mark confidence when evidence is incomplete.

Use this priority model consistently:
- P0: clear ship blocker; likely severe production breakage, critical accessibility or security failure, or fundamentally unsafe release
- P1: serious issue that should usually be fixed before shipping; substantial user, reliability, accessibility, security, or operational risk
- P2: important issue that may be acceptable only with conscious acceptance of risk; not an immediate blocker in all contexts
- P3: moderate weakness or gap; should be addressed soon but not necessarily before launch
- P4: minor improvement with limited near-term impact

Every finding must include:
- ID
- title
- priority
- why it matters
- evidence
- affected area
- risk if shipped as-is
- recommended fix
- confidence level if evidence is incomplete

When evidence is partial:
- say what you verified
- say what remains assumed
- lower confidence instead of overstating certainty
- ask only the missing questions that would change the release decision
