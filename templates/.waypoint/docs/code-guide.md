---
summary: Repository coding conventions — explicit behavior, maintainability, docs-first context, and verification discipline
read_when:
  - writing code
  - implementing a feature
  - fixing a bug
  - updating tests
  - making architectural changes
---

# Code Guide

This file is not a style guide for trivia. It captures the engineering rules that make the repo easier for the next agent to understand and change safely.

## Core rules

- Prefer explicit behavior over clever shortcuts.
- Keep changes scoped and reviewable.
- Do not swallow errors silently.
- Validate external data at boundaries.
- Update the durable markdown record when durable behavior changes.

## Docs-first engineering

If the next agent cannot understand the important context by reading the repo, the work is incomplete.

Document:

- architecture and boundaries
- major decisions and tradeoffs
- integration behavior
- invariants
- debugging and operational knowledge
- active plans and next steps when they matter beyond one session

Do **not** document every trivial implementation detail. Document the expensive-to-rediscover parts.

## Verification

- Run the smallest relevant verification first.
- Add or update tests when behavior changes.
- If verification cannot be run, say exactly why.
- Never imply a check passed if you did not run it.

## Maintainability

- Reuse healthy existing patterns.
- Prefer clear names and clean module boundaries over compact clever code.
- Avoid hidden fallback behavior unless it is intentionally visible and documented.
- Leave the repo easier for the next agent to work in.

