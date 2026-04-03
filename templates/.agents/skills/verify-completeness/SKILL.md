---
name: verify-completeness
description: Use when implementation appears done and before reporting completion. Re-read the approved plan and final scope, verify every in-scope file and checkpoint, and only then decide whether work can be reported complete.
---

# Verify Completeness

Use this skill at final closeout, right before you would report work complete. Its job is to gate completion, not to re-open the whole project.

## Rules

1. Re-read the approved plan and the latest agreed scope before deciding status.
2. Re-read `ACTIVE_PLANS.md` and `WORKSPACE.md` for the current checklist, phase, blockers, and verification state.
3. Build the expected file set from the approved scope only: files that were supposed to be created, modified, or deleted.
4. Re-read every file in the expected set directly. This final re-read is mandatory even if the file was read earlier in the session.
5. Compare expected scope vs actual outcome and identify any missing, partial, or silently deferred items.
6. Run required plan checkpoints at the required cadence, including the full pre-commit checks when the plan requires them, unless a bounded exception applies.
7. Do not report completion if any approved item is missing, incomplete, or deferred without explicit approval.
8. Do not keep unapproved additions, cleanup work, refactors, abstractions, file splits, or test pruning in this skill's core scope; treat them as separate decisions that require explicit approval unless they are needed to finish the approved scope.
9. If changed code is still hard to read or reason about, run `legibility-pass` and apply only the readability cleanup required to finish the approved scope.
10. Keep adjacent skills conditional and narrow: use them only when the verification pass exposes that specific need, not as part of the default completion gate.

## Exception Rule

You may relax the normal verification loop only when one of these is true:

- required plan artifacts are missing or stale, and you need to reconstruct the approved scope before continuing
- the task is read-only or review-only, so no code or files are expected to change
- required checks cannot run because the environment, dependencies, permissions, or upstream blockers make them impossible right now

In these cases, continue only far enough to identify the gap, record the blocker, and report the exact missing verification step or artifact. Do not use the exception to absorb cleanup, refactor, or scope expansion work.

## Completion Gate

You can report complete only when all are true:

- approved scope items are done
- planned file changes match reality
- required verification/checkpoints were run, or each skipped check has a specific blocked reason
- no hidden scope reduction occurred
- no unapproved scope expansion remains
- no obvious duplication or avoidable bloat remains in touched files
- no avoidable file fragmentation remains in touched feature areas
- test set remains high-signal and non-redundant for the risk level

## Output Contract

Before final status, report these items explicitly:

- `status`: `complete`, `blocked`, or `incomplete`
- `scope reviewed`: the plan/scope sources you re-read
- `files re-read`: the files you re-opened for final verification
- `missing scope items`: any approved items still absent, or `none`
- `checks run`: each verification step actually executed
- `checks skipped`: each omitted check with a reason, or `none`
- `removed extras`: any unapproved extras, cleanup, or bloat you removed, or `none`
- `adjacent skill escalation`: any conditional skill you invoked and why, or `none`
- `next action`: continue execution, request scope approval, or complete

Do not say the work is complete unless the `status` is `complete` and the completion gate is satisfied.

## Gotchas

- Do not mark complete from memory; verify by re-reading files.
- Do not treat partial completion as done.
- Do not skip plan checkpoints just because code compiles.
- Do not keep speculative extras "for future-proofing" unless the user approved them.
- Do not keep fragmented tiny files or low-signal tests as evidence theater.
