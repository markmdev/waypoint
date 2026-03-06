---
name: observability-audit
description: Audit code for observability gaps — debug logs left in, errors caught without being logged, missing context on log entries, and untracked slow operations. Uses the app's existing observability tooling exclusively.
---

# Observability Audit

Code that works locally but is impossible to debug in production. This skill finds and fixes observability gaps using whatever tools the app already has.

## Read First

1. Read `.waypoint/SOUL.md`
2. Read `.waypoint/agent-operating-manual.md`
3. Read `WORKSPACE.md`
4. Read `.waypoint/context/MANIFEST.md`
5. Read every file listed in the manifest
6. Read `references/observability-patterns.md`

## Step 0: Research existing observability tooling

Before anything else, explore the codebase to understand what's already in use:

- Error tracking
- Logging
- APM / metrics
- Analytics
- Any custom logger or telemetry utilities

Read how they're configured and how they're used. All fixes must use these — never introduce a new observability dependency or pattern.

## What to look for

**Debug artifacts left in production code**

**Errors that disappear**

**Missing context on log entries**

**Untracked slow or critical operations**

See `references/observability-patterns.md` for concrete patterns.

## Process

1. Research existing tooling
2. Identify the scope
3. Find every instance of the anti-patterns
4. Fix using the existing tooling and patterns
5. Remove debug artifacts, add context to thin logs, add tracking where missing
6. Report changes

## Fix principles

- Every caught error should be logged with enough context to reproduce the problem
- Use the existing logger/tracker — never introduce a second one
- Debug `console.log` goes away entirely — no conversion to structured log, just deleted
- Log context should include: what operation, what failed, relevant IDs
- Don't add logging to every function — focus on boundaries and critical paths

## Reference files

- `references/observability-patterns.md` — Detection patterns, bad/fix examples for debug artifacts, missing logging, missing context, untracked operations. Read before starting the audit.

## Report

Summarize by file: what was removed, what was added or improved, what context was missing and is now included.

