---
name: code-guide-audit
description: Audit a specific feature, file set, or implementation slice against the coding guide and report only coding-guide-related violations or risks in that scope. Use when the user asks for a code-guide audit, coding-guide compliance check, guide-specific review, or wants to know whether a change follows rules like no silent fallbacks, strong boundary validation, frontend reuse, explicit state handling, and behavior-focused verification. Do not use this for broad ship-readiness review, generic bug hunting, PR comment triage, or repo-wide cleanup.
---

# Code Guide Audit

Use this skill for a targeted audit against the coding guide, not for a whole-repo hygiene sweep.

This skill owns one job: inspect the specific code the user points at, map it against the coding guide, and report only guide-related findings in that scope.

## When Not To Use This Skill

- Skip it for broad ship-readiness review; use `pre-pr-hygiene` or a ship-audit workflow for that.
- Skip it for generic bug finding or regression review that is not specifically about the coding guide.
- Skip it for active PR comment triage; use `pr-review` for that loop.
- Skip it for repo-wide cleanup unless the user explicitly asked for a repo-wide coding-guide audit.

## Step 1: Load The Right Scope

- Read the repo's routed code guide.
- In standard Waypoint repos, use `.waypoint/docs/code-guide.md`.
- If the repo routes the code guide somewhere else, follow the repo's own docs and routing instead of assuming another fixed path.
- Read only the files, routes, tests, contracts, and nearby docs needed to understand the specific feature or slice under review.
- If the scope is ambiguous, resolve it to a concrete file set, feature path, or commit-sized change surface before auditing.

Do not expand into a whole-repo audit unless the user explicitly asks for that.

## Step 2: Translate The Guide Into Checks

Audit only for rules that actually apply to the scoped code.

Look for:

- stale compatibility layers, shims, aliases, or migration-only branches
- weak typing, avoidable `any`, recreated shared types, or unsafe casts
- silent fallbacks, swallowed errors, degraded paths, or missing required-config failures
- missing validation at input, config, API, file, queue, or database boundaries
- speculative abstractions that hide the actual behavior
- unclear state transitions, weak transaction boundaries, missing idempotency, or weak persistence invariants
- frontend code that ignored reusable components or broke the existing design language
- missing loading, empty, or error states
- optimistic UI without rollback or invalidation
- missing observability at important failure or state boundaries
- regression tests that assert implementation details instead of behavior

Skip rules that genuinely do not apply, but say that you skipped them.

## Step 3: Keep The Audit Narrow

- Report only coding-guide findings for the requested scope.
- Do not drift into generic architecture advice, repo-wide cleanup, docs sync, or PR readiness unless the finding is directly required by the guide.
- If you notice issues outside scope, mention them only if they are severe enough that ignoring them would mislead the user about this audit.

This skill is narrower than `pre-pr-hygiene`. Use that other skill for broader ship-readiness.

If this audit produces a large remediation campaign, create or update a tracker under `.waypoint/track/` before switching into implementation so the fix list does not live only in chat.

## Step 4: Verify Evidence

Ground each finding in the actual code.

- Read the real implementation before calling something a violation.
- When relevant, inspect the nearest tests, contracts, schemas, or reused components to confirm the gap.
- Do not invent verification that you did not run.

If the user asked for a pure audit, stop at findings. If they asked for fixes too, fix the clear issues and then verify the changed area.

## Step 5: Report The Result

Summarize the scoped result in review style:

- findings first, ordered by severity
- each finding tied back to the relevant coding-guide rule
- include exact file references
- then note any skipped guide areas or residual uncertainty

## Gotchas

- Do not turn this into generic code review. Every finding should tie back to a specific coding-guide rule.
- Do not audit the whole repo by accident. Resolve the narrow slice first, then stay inside it unless an out-of-scope issue would seriously mislead the user.
- Do not report a guide violation from a grep hit alone. Read the real implementation and the nearby evidence before calling it a problem.
- Do not force every coding-guide rule onto every change. Skip non-applicable rules explicitly instead of inventing weak findings.
- If you notice a broader ship-risk issue that is not really a coding-guide issue, say it is outside this skill's scope instead of quietly drifting into another audit.

## Keep This Skill Sharp

- After meaningful runs, add new gotchas when the same guide-specific failure mode or scope-drift mistake keeps recurring.
- Tighten the description if the skill fires on generic review requests or misses real prompts like "check this against the code guide."
- If the same guide-rule translation logic keeps repeating, move that reusable detail into a supporting reference instead of expanding the hub file.
