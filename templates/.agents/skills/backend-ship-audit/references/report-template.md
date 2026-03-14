# Backend audit report template

Use this template for `.waypoint/audit/dd-mm-yyyy-hh-mm-backend-audit.md`.

```markdown
# Backend Ship-Readiness Audit: <scope name>

- Timestamp: <dd-mm-yyyy hh:mm>
- Requested scope: <user request>
- Assumed audit scope: <narrowed reviewable unit>
- Ship recommendation: <Ready to ship | Ready to ship with explicit risk acceptance | Not ready to ship>

## Scope

### In scope
- <paths, services, APIs, workers, migrations, docs>

### Adjacent dependencies and boundaries
- <datastores, queues, auth layers, partner APIs, shared libraries>

### Out of scope
- <explicit exclusions>

## What was read
- `<path>`: <why it mattered>
- `<path>`: <why it mattered>

## Open questions
- <only unresolved questions that materially affect readiness>

## Assumptions used in this audit
- <assumption>
- <assumption>

## System understanding

Provide a concise explanation of the scoped backend:
- primary entry points
- data flow
- trust boundaries
- transaction and async boundaries
- external dependencies
- operational controls

## Priority summary

- P0: <count>
- P1: <count>
- P2: <count>
- P3: <count>
- P4: <count>

## Findings

### BA-001: <title>
- Priority: <P0-P4>
- Why it matters: <plain-language impact>
- Evidence:
  - `<path>:<line-range>` <concise fact>
  - `<path>:<line-range>` <concise fact>
- Affected area: <service, endpoint, worker, migration, table, client>
- Risk if shipped as-is: <practical release risk>
- Recommended fix: <specific fix or mitigation>
- Confidence: <High | Medium | Low>

### BA-002: <title>
- Priority: <P0-P4>
- Why it matters: <plain-language impact>
- Evidence:
  - `<path>:<line-range>` <concise fact>
- Affected area: <service, endpoint, worker, migration, table, client>
- Risk if shipped as-is: <practical release risk>
- Recommended fix: <specific fix or mitigation>
- Confidence: <High | Medium | Low>

## Release conditions / next actions

List only the conditions that matter for shipment.

1. <required fix, mitigation, or explicit risk acceptance>
2. <required fix, mitigation, or explicit risk acceptance>

## Notes

Include only brief context that materially helps a future reviewer.
```

Guidance:
- Keep the summary short.
- Prefer fewer findings with stronger evidence.
- Include no finding that is unsupported by the repository or an explicit unanswered question.
- Use stable IDs in the form `BA-001`, `BA-002`, and so on.
