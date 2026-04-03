---
name: plan-swarm-audit
description: Use during execution of an approved plan phase when a bounded second-pass audit is needed. Requires plan path, active phase, changed-file scope or scope anchor commit, phase acceptance criteria, and a verify-completeness closeout target. If those inputs are missing or subagents cannot be staffed, block instead of spawning.
---

# Plan Swarm Audit

Use this skill while executing an approved plan phase when you need an independent audit loop before closeout. Do not improvise the audit shape or start from partial context.

## Required inputs

- plan path (for example `.waypoint/plans/<plan>.md`)
- active phase
- current changed-file scope (or scope anchor commit)
- phase acceptance criteria for the active phase
- verify-completeness closeout target

## Precondition validation

Before spawning any audit agents, confirm all of the following:

1. The referenced plan exists and is the approved source of truth for the work.
2. The active phase is identified and not already closed.
3. The changed-file scope or scope anchor commit is available.
4. The active phase acceptance criteria are explicit enough to test against.
5. A `verify-completeness` closeout pass will be run after the swarm loop.

If any required input is missing, ambiguous, or stale, do not spawn the swarm. Return `blocked` with the missing input(s) and the exact next input needed from the user or from the plan.

## Swarm setup

Spawn five parallel subagents when the preconditions are satisfied. Keep their scopes disjoint and narrow.

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
- a final status suitable for immediate closeout or escalation

If a subagent cannot be spawned, use the exception rule below. Do not silently reduce coverage.

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
5. If blockers remain and the round cap has not been reached, run another swarm round.

## Exception rule

Use the normal five-agent shape by default. You may deviate only in these bounded cases:

- Missing required inputs: block immediately and do not spawn any agents.
- Unavailable subagents: run fewer than five only if the remaining agents can still cover the five lenses by merging at most one adjacent lens per missing agent. Do not run with fewer than three agents.
- Justified fewer-agents mode: document why the reduction is necessary, which lenses were merged, and what residual risk remains. Treat the reduced coverage as a blocker if it weakens the audit materially.

Do not use the exception rule for convenience, speed, or to avoid waiting for missing context.

## Stop condition

You may stop only when all are true:

- no blocking findings remain across the five audit lenses
- active phase acceptance criteria are satisfied
- `verify-completeness` closeout is clean

## Escalation

Escalate to the user instead of continuing when either of these is true:

- the round cap for the phase has been reached
- the same blocker appears in two rounds after targeted fixes

Escalation must include:

- the exact blocker(s)
- what was tried
- why the blocker still remains
- the decision needed from the user, such as scope change, plan update, more context, or acceptance of a blocked phase

## Guardrails

- Use at most 3 swarm rounds per phase by default.
- Do not let subagents overlap ownership; keep scopes distinct.
- Always close every swarm subagent thread after consolidation for that round.
- Do not run full repo typecheck/test/build after every tiny fix. Use targeted checks during the loop, then full checks at pre-commit/final handoff.
- If the same finding repeats in 2 rounds, treat it as a structural blocker and change approach instead of micro-patching.
- Do not silently widen scope; escalate scope changes to the user.

## Output contract

Report:

- status: `complete`, `blocked`, or `escalated`
- swarm round number
- precondition check result
- consolidated blockers (with file/line refs)
- fixes applied
- verification run
- verify-completeness handoff result
- remaining blockers or confirmation that stop condition is met
- escalation, if any, with the decision needed from the user
