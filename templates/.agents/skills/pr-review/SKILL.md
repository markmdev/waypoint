---
name: pr-review
description: Triage and close the review loop on an open PR after automated or human review has started. Use when a PR has review comments pending, when automated reviewers are still running, or when you need to wait for review completion, answer every inline comment, fix meaningful issues, push follow-up commits, and keep repeating until no new meaningful review findings remain.
---

# PR Review

Use this skill to drive the PR through review instead of treating review as a one-shot comment sweep.

## Step 1: Wait For Review To Settle

- Check the PR's current review and CI status.
- If automated review is still running, wait for it to finish instead of racing it.
- If comments are still arriving, do not prematurely declare the loop complete.

## Step 2: Read Every Review Comment

- Read all open review comments, especially inline comments.
- Group duplicates, but do not ignore any comment.
- Distinguish between meaningful issues, optional suggestions, and comments that should be explicitly declined.

## Step 3: Triage And Respond Inline

For every comment:

- fix it if it is correct and in scope
- explain clearly if you are declining it
- reply inline where the comment lives instead of posting a disconnected summary comment

Do not leave comments unanswered.

## Step 4: Push The Next Round

- Make the needed fixes.
- rerun the relevant verification
- push follow-up commit(s)
- return to the PR and continue the loop

Stay in the loop until no new meaningful issues remain.

## Step 5: Close With A Crisp State Summary

Summarize:

- what was fixed
- what was intentionally declined
- what verification ran
- whether the PR is clear or still waiting on reviewer response
