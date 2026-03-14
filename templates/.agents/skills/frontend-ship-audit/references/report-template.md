# Frontend audit report template

Use this structure for `.waypoint/audit/dd-mm-yyyy-hh-mm-frontend-audit.md`.

# Frontend Ship-Readiness Audit

Generated: DD-MM-YYYY HH:MM

## Scope
- Requested scope:
- Assumed reviewable unit:
- In scope:
- Important dependencies:
- Explicitly out of scope:

## Deployment Context
- Established context:
- Missing context that affects the bar:
- Assumptions used for this audit:

## Repository Coverage
- Files and docs read completely:
- Areas intentionally skipped as irrelevant:

## Summary
- Verdict: Ready / Ready with accepted risk / Not ready
- Highest-risk themes:
- What would need to change before shipping, if not ready:

## Findings

### F-001: Title
- Priority: P1
- Why it matters:
- Evidence:
- Affected area:
- Risk if shipped as-is:
- Recommended fix:
- Confidence: High / Medium / Low

Repeat for each finding in priority order.

## Positive evidence
- Note behaviors that reduce release risk when they are directly supported by repository evidence.

## Open questions
- List only unanswered questions that would materially change the release decision.

## Release recommendation
- State the release recommendation in one concise paragraph.
- If the scope can ship only with accepted risk, name the exact accepted risks.
