# Error Anti-Patterns Reference

Patterns to identify when auditing error handling. Each section describes the anti-pattern structurally — what the code does, not just what keywords to grep for.

## Silent error swallowing

- empty catch blocks
- `.catch(() => {})`
- broad exception handlers that return defaults
- ignored Go errors via `_`

## Log-and-continue

An error gets logged, but execution continues as if the operation succeeded.

## Return-null-on-failure

The function converts a real operational failure into what looks like a normal "empty" result.

## Invisible degradation

The code silently falls back to a worse model, API, cache, or degraded mode with no visible signal.

## Config defaults hiding misconfiguration

Required settings should fail loudly, not silently pick a fallback.

## UI error blindness

Failure should not render the same as loading or empty.

Quality bar:

- confirm the issue is real in context
- prefer concrete fixes over broad rewrites
- use existing repo patterns for user-visible error handling

