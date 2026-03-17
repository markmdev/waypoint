---
name: adversarial-review
description: Close out a meaningful implementation slice with the full iterative review loop. Use when the user asks for a final review pass, asks to "close the loop," asks whether work is ready to call done, or when Codex is about to say a non-trivial code change is complete. This skill scopes the slice, runs `code-reviewer`, runs `code-health-reviewer` when the change is medium or large or structurally risky, runs `code-guide-audit`, waits for the required outputs, fixes real findings, and repeats with fresh rounds until no meaningful issues remain. Do not use this for tiny obvious edits, pre-implementation plan review, or active PR comment triage.
---

# Adversarial Review

Use this skill to close the loop on implementation work instead of treating review as a one-shot pass.

This skill owns the default closeout workflow for a reviewable slice. It coordinates the specialist reviewers, keeps the scope tight, waits as long as needed, fixes meaningful findings, and reruns fresh review rounds until the remaining feedback is only optional polish or no findings at all.

## When To Skip This Skill

- Skip it for tiny obvious edits where launching the full closeout loop would be noise.
- Skip it for pre-implementation planning; that is `plan-reviewer` territory.
- Skip it for active PR comment back-and-forth; use `pr-review` for that workflow.
- Skip it when the user wants a one-off targeted coding-guide check and not the full closeout loop; use `code-guide-audit` directly in that case.

## Step 1: Define The Reviewable Slice

- Resolve the exact slice you are trying to close out before launching reviewers.
- Prefer a recent self-authored commit when one cleanly represents the slice.
- Otherwise use the current changed files, diff, or feature path.
- Pass the reviewers the same concrete scope anchor, plus a short plain-English summary of what changed.
- If the scope is muddy, tighten it before review instead of asking the reviewers to figure it out from an entire worktree.

## Step 2: Launch The Required Reviewers

- Spawn `code-reviewer` for every non-trivial implementation slice.
- Spawn `code-health-reviewer` when the change is medium or large, especially when it adds structure, duplicates logic, or introduces new abstractions.
- Run `code-guide-audit` on the same scoped slice as part of the closeout loop.
- Launch the reviewer agents with `fork_context: false`, `model: gpt-5.4`, and `reasoning_effort: high` unless the user explicitly asked for something else.
- Tell the reviewer agents what changed, what scope anchor to use, and which files or feature area represent the slice under review.
- When both reviewer agents apply, launch them in parallel.

## Step 3: Wait For The Round To Finish

- Wait for every required reviewer result, no matter how long it takes.
- Do not interrupt slow reviewer agents just because they are still running.
- Do not call the work done while a required reviewer round is still in flight.
- Read the full reviewer outputs before deciding what to fix.

## Step 4: Fix Meaningful Findings

- Fix real correctness, regression, maintainability, and code-guide issues.
- Rerun the most relevant verification for the changed area after the fixes.
- If a reviewer comment is only a nit or clearly optional polish, note that distinction and do not keep reopening the loop just to satisfy minor taste differences.
- If a finding changes durable behavior or repo memory, update the relevant docs and workspace state before the next round.

## Step 5: Close The Old Review Round

- Treat `code-reviewer` and `code-health-reviewer` as one-shot reviewer agents.
- After you have read a reviewer result, close that reviewer thread.
- If another pass is needed later, spawn a fresh reviewer instead of reusing the old thread.

## Step 6: Repeat Until The Slice Is Actually Clear

- Start a fresh round whenever you made meaningful fixes in response to the previous round.
- Reuse the same scope anchor when it still represents the slice cleanly; otherwise hand the new round the updated changed-file set or follow-up commit.
- Rerun `code-guide-audit` when the fixes materially changed guide-relevant behavior or when the previous round surfaced guide-related issues.
- Stop only when no meaningful findings remain. Optional polish and obvious nitpicks do not block closeout.

## Step 7: Report The Closeout State

Summarize:

- what scope was reviewed
- which reviewers ran
- what meaningful issues were fixed
- what verification ran
- whether the slice is now clear or what still blocks it

## Gotchas

- Fresh reviewer rounds matter. If you make meaningful fixes, do not treat older reviewer findings as if they still describe the current code.
- Green local tests are not enough if required reviewer threads are still running. Wait for the actual reviewer outputs before calling the slice done.
- Close reviewer agents after each round. Reusing a stale reviewer thread weakens the signal and blurs which code state the findings apply to.
- When this loop changes repo-health or upgrade behavior, test real old-repo edge cases, not just fresh-init cases.
- If a reviewer result is clean, it should still name the key paths and related files it checked. A "looks fine" skim is not a real closeout pass.

## Keep This Skill Sharp

- After meaningful runs, add new gotchas when the same review-loop failure, stale-review mistake, or repo-upgrade edge case is likely to happen again.
- Tighten the description if the skill fires too broadly or misses real prompts like "final review pass" or "before we call this done."
- If the loop keeps re-creating the same helper logic or review instructions, move that reusable logic into the skill or its supporting resources instead of leaving it in chat.
