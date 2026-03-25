---
name: merge-ready-owner
description: Own a non-trivial change from approved plan through implementation, verification, PR creation or update, review handling, and merge-ready handoff. Use when the user wants Codex to take full ownership after the problem and plan are agreed, keep going without repeated check-ins, and return only when there is a clean PR ready to merge or a concrete blocker that cannot be cleared alone.
---

# Merge Ready Owner

Use this skill when the user wants one continuous ownership loop instead of a handoff after coding.

The job is not "write some code." The job is "carry the agreed work all the way to a merge-ready PR or a clearly explained blocker."

## When Not To Use This Skill

- Skip it when the problem is still being shaped or the plan is not actually approved. Use `planning` first.
- Skip it for tiny local edits that do not justify a full ship loop.
- Skip it when the user explicitly wants to stay in the loop for each step instead of delegating the closeout.

## Finish Line

Before starting, treat this as the default definition of done:

- the agreed scope is implemented
- the work is based on the repo's current default branch state
- the right PR exists and is up to date when the repo uses PRs
- the relevant tests, typechecks, lint, builds, or smoke checks for the touched surface are green
- real verification has been done against the risky user or runtime path when practical
- docs, trackers, and workspace state are updated when the shipped behavior changed materially
- review comments are answered and meaningful findings are fixed
- CI is green when the repo uses CI
- the PR is merge-ready, or there is a concrete blocker that cannot be cleared alone

When the product surface makes it practical, extend done to include:

- a short recorded walkthrough of the verified final browser or app flow
- the local path to that recording

Do not stop at "the code compiles" or "the first push is up."

During the loop, keep live execution state current:

- update `WORKSPACE.md` as milestones, blockers, verification state, and next steps change
- if a tracker exists or the work has become tracker-worthy, update the tracker during the work instead of reconstructing it later

## Step 1: Reconfirm The Scope And Ownership Mode

- Make sure the plan is already approved or the user explicitly said to proceed.
- Restate the finish line to yourself before editing.
- Identify the highest-risk parts of the change so verification matches the real failure surface.

If the plan is not actually settled, stop and use `planning` instead of guessing.

## Step 2: Start From Fresh Branch State

- Sync with the repo's current default branch and base the work on that fresh state.
- If there is no branch yet, create one from the refreshed default branch.
- If there is already a PR, confirm it is still open before pushing more commits.
- If an old PR was closed or merged, create a fresh branch from the current default branch, carry forward only the needed work, and open a new PR if the repo uses PRs.

## Step 3: Implement In Small Verified Chunks

- Make the change in small logical chunks.
- Commit in small steps when the repo workflow benefits from granular history.
- Keep unrelated local changes intact.
- Do not stop after the first implementation pass if clear follow-up fixes are still needed.

For bugs, prefer reproducing the problem first, then fixing it, then proving the fix.

## Step 4: Use The Right Repo-Local Helpers

Use the repo's existing skills and reviewer agents instead of inventing a parallel process.

- Use `work-tracker` early when the work becomes non-trivial, multi-step, review-heavy, or checklist-driven enough that `WORKSPACE.md` alone will stop being a good live record.
- Use `docs-sync` when shipped behavior, routes, contracts, or commands changed materially.
- Use `pre-pr-hygiene` before pushing or opening/updating a PR when the change surface is substantial.
- Use `pr-review` once active PR review or automated review has started.
- Use `break-it-qa` for extra abuse testing on risky interactive flows when that pass is worth the time.

If the repo ships reviewer agents under `.codex/agents/`, use them in the closeout flow when they are available:

- run `code-reviewer` for every non-trivial implementation slice before declaring the work clear
- run `code-health-reviewer` when the change is medium or large, especially when it adds structure, duplicates logic, or introduces new abstractions
- launch them in parallel when both apply
- use them at meaningful milestones, not only at the very end: after substantial implementation chunks, before opening or materially updating a PR, after fixing substantial findings, and before final closeout
- treat them as fresh closeout passes, not as optional decoration
- if either reviewer finds anything more serious than obvious optional polish, fix those findings, rerun the most relevant verification, and run fresh reviewer passes instead of trusting stale results
- keep iterating until the remaining reviewer feedback is only nitpicks or none

If those reviewer agents are not present in the repo, do the equivalent closeout thinking locally and continue instead of blocking on missing helpers.

## Step 5: Choose Verification That Matches The Real Risk

- Discover and use the verification tools that already exist in the current project instead of assuming one fixed stack.
- For browser-facing work, use the available browser QA tooling and exercise the real UI.
- For mobile or desktop app work, use the app or simulator tooling available in the repo and exercise the real flow.
- For backend work, hit the real route, worker, or runtime boundary when practical instead of trusting only unit tests.
- For environment-specific bugs, prefer the environment's logs, traces, payloads, or metrics over local guesswork.

If an existing repo-local skill clearly matches the verification surface, use it.

## Step 6: Run The Full Pre-Push Loop

- Run the required tests and typechecks for every touched package or service.
- Run builds, lint, migrations, or focused smoke tests when they are part of the real risk surface.
- Fix failing checks before pushing unless the user explicitly accepts an exception.
- For user-facing flows, do at least one realistic manual or UI-driven pass beyond pure unit coverage.
- Update `WORKSPACE.md` and any active tracker with the current verification state before moving on.

Do not push a branch that still obviously fails its own touched-surface checks.

## Step 7: Open Or Update The PR Cleanly

When the repo uses PRs:

- open the PR if one does not exist
- keep the PR title and body focused on user value and capability, not implementation trivia
- keep the PR description concise
- request preview or staging environments when they are part of validation

If the repo does not use PRs, keep moving through the equivalent review and handoff workflow instead of forcing PR-shaped steps.

Before opening or materially updating the PR on non-trivial work, strongly prefer a fresh reviewer-agent pass when those agents are available.

## Step 8: Babysit The PR Instead Of Dropping It

When the repo uses PRs, CI, or preview environments:

- watch CI until it settles
- investigate red checks instead of treating them as someone else's problem
- if a preview, staging, or deployment environment is required for validation, follow it through until the environment is usable or a real external blocker is proven
- if the live preview or deployed environment is the real risk surface, verify it directly when helpful instead of waiting only on a bot summary

The ownership loop is still active while CI, preview, or rollout is in flight.

## Step 9: Close The Review Loop

Once review starts:

- use `pr-review`
- read every meaningful comment
- fix valid findings
- reply inline where the workflow supports inline reply
- rerun the relevant verification after review-driven fixes
- if the fixes were meaningful, run fresh reviewer-agent passes before you call the work clear when those agents are available

Do not leave comments unanswered just because the code changed.

## Step 10: Re-Test The Risky User Paths

- Re-run the happy path after fixes.
- Re-run the exact paths that were previously broken.
- For stateful flows, also probe nearby failure surfaces: repeat actions, bad input, stale state, back navigation, recovery, and environment toggles.
- Capture screenshots when using interactive UI tooling if the environment allows it.

Record the walkthrough only after the verified final state is stable. Do not record the first flaky pass and call that proof.

## Step 11: Hand Back A Merge-Ready Truthful State

Only close out when you can truthfully say one of these:

- the PR is ready to merge
- or there is a concrete blocker you cannot clear alone

The final handoff should say:

- what is now working for the user
- what verification actually ran
- the PR link when there is one
- any remaining blocker or caveat that still matters

Keep the handoff plain and direct. The point of this skill is to reduce the user's need to supervise the loop.

## Gotchas

- Do not mistake planning approval for permission to stop at implementation; this skill owns the full closeout.
- Do not let `WORKSPACE.md` or an active tracker fall behind reality while the work is in flight.
- Do not rely only on automated tests when the risky surface is interactive.
- Do not let stale previews, staging selectors, old PR branches, or half-deployed environments quietly poison verification.
- Do not treat CI failures, review comments, or rollout gates as outside the task once the user asked for full ownership.
- Do not declare success while known meaningful review findings or failing checks still exist.
- Do not confuse a reusable test harness or scripted UI test with the final walkthrough artifact; the artifact should show the real verified surface when practical.
- Do not forget the reviewer-agent loop when `code-reviewer` and `code-health-reviewer` are available. They are part of the closeout signal, not an afterthought, and serious findings should reopen the fix-and-review cycle.

## Keep This Skill Sharp

- Add new gotchas when the same ownership failure mode repeats.
- Tighten the description if the skill fires too early before planning is settled.
- If the closeout loop keeps depending on the same helper skills, reviewer agents, or verification surfaces, encode that expectation here instead of rediscovering it in chat.
