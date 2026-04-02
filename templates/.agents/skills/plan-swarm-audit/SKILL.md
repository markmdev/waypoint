---
name: plan-swarm-audit
description: Use during execution of an approved multi-phase plan when a second-pass audit is needed. Spawn five parallel subagents with distinct audit scopes, consolidate findings, fix blockers, and repeat in bounded rounds until the phase or plan meets acceptance criteria.
---

# Plan Swarm Audit

Use this skill while implementing an approved plan when you want an independent multi-agent audit loop before calling work complete.

## Required inputs

- plan path (for example `.waypoint/plans/<plan>.md`)
- active phase
- current changed-file scope (or scope anchor commit)

## Swarm setup (5 agents, disjoint scopes)

Spawn exactly five subagents in parallel, each with one owned audit lens:

1. Plan-scope compliance
2. Correctness and regression risk
3. Maintainability, duplication, and bloat
4. Verification and test coverage gaps
5. Docs and state drift (`ACTIVE_PLANS.md`, `WORKSPACE.md`, and relevant durable docs)

Each subagent must return:

- findings with severity
- exact file/line references
- whether each finding blocks phase completion
- recommended fix
- a final status suitable for immediate closeout

## Consolidation pass

After all five return:

1. Merge findings into one deduplicated list.
2. Group by severity and execution order.
3. Identify blockers vs optional polish.
4. Keep only findings within approved scope unless a scope-risk must be escalated to the user.
5. Close all swarm subagents after their outputs are captured. Do not leave audit agents running across rounds.

## Fix loop

1. Fix blocking findings first.
2. Run targeted verification for the changed area.
3. Re-check plan checklist and acceptance criteria.
4. Update `ACTIVE_PLANS.md` / `WORKSPACE.md` when state materially changes.
5. If blockers remain, run another swarm round.

## Stop condition

You may stop only when all are true:

- no blocking findings remain across the five audit lenses
- active phase acceptance criteria are satisfied
- `verify-completeness` closeout is clean

## Guardrails

- Use at most 3 swarm rounds per phase by default.
- Do not let subagents overlap ownership; keep scopes distinct.
- Always close every swarm subagent thread after consolidation for that round.
- Do not run full repo typecheck/test/build after every tiny fix. Use targeted checks during the loop, then full checks at pre-commit/final handoff.
- If the same finding repeats in 2 rounds, treat it as a structural blocker and change approach instead of micro-patching.
- Do not silently widen scope; escalate scope changes to the user.

## Output contract

Report:

- swarm round number
- consolidated blockers (with file/line refs)
- fixes applied
- verification run
- remaining blockers or confirmation that stop condition is met
