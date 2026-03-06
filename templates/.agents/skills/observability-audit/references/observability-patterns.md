# Observability Anti-Patterns Reference

Use this file to guide observability audits.

## Debug artifacts

- `console.log`, `console.debug`, `print`, `fmt.Printf` in non-CLI production paths
- commented-out debug statements
- `debugger` and focused tests left behind

## Errors without useful traces

- catch/except blocks that rethrow or return without logging context
- tracker calls with no metadata
- logs that say "failed" without saying what failed

## Missing context

- no user, entity, request, or job identifiers
- no operation name
- no correlation/request ID at service boundaries

## Slow paths with no timing

- external API calls
- critical database queries
- background jobs without start/complete/fail visibility
- webhook handlers with no event-level logging

Quality bar:

- use the existing observability stack
- improve debugging value, not log volume
- focus on boundaries and critical paths

