---
name: pre-pr-hygiene
description: Run a broad final hygiene pass before pushing, before opening or updating a PR, or after a large implementation chunk when the diff is substantial and needs a deeper audit than per-commit review. Verify code-guide compliance, docs-to-behavior alignment, shared contract/schema drift, typing gaps, optimistic UI rollback or invalidation strategy, persistence correctness risks, and any other cross-cutting quality issues that would make the next review painful.
---

# Pre-PR Hygiene

Use this skill for the larger final audit before code leaves the machine.

## When Not To Use This Skill

- Skip it for tiny changes that do not justify a broad hygiene pass.
- Skip it after a PR already has active review comments; use `pr-review` for that loop.
- Skip it when the task is only a narrow coding-guide check or only a docs sync pass.

## Read First

Before the hygiene pass:

1. Read `.waypoint/SOUL.md`
2. Read `.waypoint/agent-operating-manual.md`
3. Read `.waypoint/WORKSPACE.md`
4. Read `.waypoint/context/MANIFEST.md`
5. Read every file listed in that manifest
6. Read the repo's routed code guide and the routed docs relevant to the area being shipped

In standard Waypoint repos, the code guide lives at `.waypoint/docs/code-guide.md`. If the repo routes it somewhere else, follow the repo's own docs and routing instead of assuming another fixed path.

## Step 1: Audit The Whole Change Surface

Inspect the code and docs that are about to ship.

Look for:

- code-guide violations such as silent fallbacks, swallowed errors, weak boundary validation, unsafe typing, or stale compatibility layers
- stale docs, stale routes, or workspace notes that no longer match real behavior
- shared schema, fixture, or API-contract drift
- typing gaps such as avoidable `any`, weak narrowing, or unnecessary casts
- optimistic UI without rollback or invalidation
- persistence risks such as missing provenance, missing idempotency protection, weak uniqueness, or missing foreign-key style invariants

Skip checks that truly do not apply, but say that you skipped them.

## Step 2: Fix Or Stage Findings

- Fix meaningful issues directly when the right remediation is clear.
- Update `.waypoint/docs/` when shipped behavior or routes changed.
- If the live handoff has become bloated or stale, use `workspace-compress`.

Do not stop at reporting obvious fixable issues.

## Step 3: Verify Before Ship

Run the most relevant verification for the area:

- tests
- typecheck
- lint
- build
- targeted manual QA

## Step 4: Report The Gate Result

Summarize:

- what you checked
- what you fixed
- what verification ran
- what residual risks remain, if any

## Gotchas

- Do not turn this into a whole-repo cleanup mission. Keep the pass tied to the change surface that is about to leave the machine.
- Do not stop at reporting obvious fixable issues if the correct remediation is clear.
- Do not call the pass complete without real verification that matches the risk of the change.
- Do not let docs, contracts, and code drift just because the implementation itself "works."
- Do not use this as a replacement for active PR review or the normal closeout loop.

## Keep This Skill Sharp

- Add new gotchas when the same hygiene blind spot, contract drift, or verification miss keeps recurring.
- Tighten the description if the skill fires on tiny edits or misses real prompts about "do a final pass before I push."
- If the same cross-cutting checks keep being rediscovered, encode them more explicitly here instead of relying on chat memory.
