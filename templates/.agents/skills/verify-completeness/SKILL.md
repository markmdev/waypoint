---
name: verify-completeness
description: Use when implementation appears done and before reporting completion. Re-read the original plan and agreed scope, re-read files that were supposed to be created or changed, verify no approved scope was reduced or skipped, and continue working until the scope is truly complete.
---

# Verify Completeness

Use this skill at final closeout, right before you would report the work complete.

## Required verification loop

1. Re-read the original plan and the latest agreed scope before deciding status.
2. Re-read `ACTIVE_PLANS.md` and `WORKSPACE.md` for current checklist, phase, blockers, and verification state.
3. Build the expected file set from plan/scope: files that were supposed to be created, modified, or deleted.
4. Re-read those files directly. This final re-read is mandatory even if they were read earlier in the session.
5. Compare expected scope vs actual outcome and list any missing or partially completed items.
6. Run a scope-discipline pass: identify additions that were not requested or approved. Remove/simplify them before completion, or explicitly ask the user to approve keeping them.
7. Run a cleanup pass on changed files: remove duplicated logic, unnecessary abstractions/files, and low-value comments that create maintenance bloat.
8. Run a file-footprint sanity pass: collapse avoidable tiny-file fragmentation and keep code that changes together in the same place when boundary/reuse/size reasons are weak.
9. Run a test-signal sanity pass: remove redundant or brittle tests and keep the smallest high-signal set that still protects the contract.
10. Before commit/final handoff, run the full checks required by the plan (for example full typecheck/test/build sweep) once, unless explicitly blocked or the user asks for a different cadence.
11. If any approved item is missing, incomplete, or silently deferred, do not report completion. Continue working until the agreed scope is fully satisfied or discuss a scope change explicitly.

## Completion gate

You can report complete only when all are true:

- approved scope items are done
- planned file changes match reality
- verification/checkpoints required by the plan were run at the required cadence, including full pre-commit checks when required (or explicitly called out as blocked)
- no hidden scope reduction occurred
- no unapproved scope expansion remains
- no obvious duplication or avoidable bloat remains in touched files
- no avoidable file fragmentation remains in touched feature areas
- test set remains high-signal and non-redundant for the risk level

## Output contract

Before final status, summarize briefly:

- scope reviewed
- files re-read for final verification
- completed items
- removed unapproved extras or bloat cleanup applied
- file-collapsing or test-pruning done during sanity passes
- remaining gaps (if any)
- next action (continue execution or complete)

## Gotchas

- Do not mark complete from memory; verify by re-reading files.
- Do not treat partial completion as done.
- Do not skip plan checkpoints just because code compiles.
- Do not keep speculative extras "for future-proofing" unless the user approved them.
- Do not keep fragmented tiny files or low-signal tests as evidence theater.
