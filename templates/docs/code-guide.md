---
summary: Repository coding conventions — correctness, explicit error handling, maintainability, and testing discipline
read_when:
  - writing code
  - implementing a feature
  - fixing a bug
  - updating tests
---

# Code Guide

## Core rules

- Prefer explicit behavior over clever shortcuts.
- Keep changes scoped and reviewable.
- Update docs when durable behavior changes.
- Validate external data at boundaries.
- Do not swallow errors silently.

## Testing

- Run the smallest relevant verification first.
- Add or update tests when behavior changes.
- If tests cannot be run, say exactly why.

## Maintainability

- Reuse existing patterns where they are healthy.
- Do not introduce hidden fallback behavior without making it visible.
- Prefer clear names and clear module boundaries over compact code.

