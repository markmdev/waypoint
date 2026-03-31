---
name: pr-review
description: Triage and close the review loop on an open PR after automated or human review has started. Use when a PR has review comments pending, when automated reviewers are still running, or when you need to wait for review completion, answer every inline comment, fix meaningful issues, push follow-up commits, and keep repeating until no new meaningful review findings remain.
---

# PR Review

Use this skill to drive the PR through review instead of treating review as a one-shot comment sweep.

## When Not To Use This Skill

- Skip it before a PR has active review or automated review in flight.
- Skip it for the repo-internal closeout loop on an unpushed slice; use the normal review workflows instead.

## Step 1: Wait For Review To Settle

- Check the PR's current review and CI status.
- If CI is red or pending, inspect the failed check logs before triaging review comments so you do not chase comment fixes while a separate blocker is breaking the branch.
- If automated review is still running, wait for it to finish instead of racing it.
- Treat placeholder messages such as CodeRabbit's "review in progress" as unfinished state, not as a meaningful review result.
- If an automated reviewer like CodeRabbit is still pending, in progress, or has not reached a green/completed check state yet, keep waiting before you conclude there are no findings.
- Once the automated reviewer check turns green/completed, reread the review comments and threads because the real findings may only appear after the placeholder state clears.
- If comments are still arriving, do not prematurely declare the loop complete.
- For stacked or non-`main` PRs, explicitly compare the PR head against its base branch and make sure later fixes on the base branch have actually been merged or rebased forward. Do not assume a sibling/base PR fix is already present in the dependent PR.
- Keep waiting as long as required. Do not interrupt or abandon the review loop just because CI, reviewers, or automated checks are taking a long time.

## Step 2: Read Every Review Comment

- Read all open review comments, especially inline comments.
- Group duplicates, but do not ignore any comment.
- Distinguish between meaningful issues, optional suggestions, and comments that should be explicitly declined.

## Step 3: Triage And Respond Inline

For every comment:

- fix it if it is correct and in scope
- explain clearly if you are declining it
- reply inline where the comment lives instead of posting a disconnected summary comment
- after pushing a fix, go back and answer the comment thread explicitly so the reviewer can see what changed
- do not leave a comment thread silent just because the code was updated

Do not leave comments unanswered.

## Step 4: Push The Next Round

- Make the needed fixes.
- rerun the relevant verification
- if the PR is stacked, repeat the base-vs-head sanity check after pushes so you catch missing forward-merges before the next CI cycle
- push follow-up commit(s)
- after pushing, return to the PR and wait for the next round of CI, automated review, and human review comments before deciding whether the loop is complete
- if CI or review is still in flight, keep waiting instead of assuming your last push ended the process
- before declaring the PR clear or ready, make sure the required Waypoint reviewer agents for this slice have actually run and that their real findings, if any, were handled

Stay in the loop until no new meaningful issues remain.
Never cut the loop short by forcing a partial return from still-running review or verification systems.
The loop is not complete while any meaningful review thread still lacks an inline response.
The loop is also not complete if required Waypoint reviewer-agent passes for the current slice have not been run yet.

## Step 5: Close With A Crisp State Summary

Summarize:

- what was fixed
- what was intentionally declined
- what verification ran
- whether the PR is clear or still waiting on reviewer response

## Gotchas

- Do not treat a placeholder like "review in progress" as a clean review result.
- Do not leave comment threads silent just because the code changed. The reply is part of the workflow.
- Do not assume stacked PR fixes have landed in the branch you are reviewing; compare against the actual base.
- Do not leave the loop just because CI is slow. A pending review state is still unfinished.
- Do not declare the PR clear if the required repo-level reviewer passes have not actually run.

## Keep This Skill Sharp

- Add new gotchas when the same PR-review failure mode, automation blind spot, or reviewer-state confusion keeps recurring.
- Tighten the description if the skill fires before review has actually started or misses real prompts about "address these PR comments" or "close the loop on this PR."
- If the workflow keeps repeating the same review-system quirks, preserve them in the skill instead of letting them stay as one-off chat lessons.
