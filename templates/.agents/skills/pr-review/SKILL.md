---
name: pr-review
description: Run and close the full PR review loop with CodeRabbit and Codex reviewers. Use when a PR already has review activity or when you need to request, wait for, triage, fix, and re-request automated review until no meaningful issues remain and CI/CD is green.
---

# PR review

Use this skill to drive an open PR through reviewer and CI/CD convergence. This is a loop, not a one-shot comment sweep.

## When To Use

- Use when PR comments already exist (human or automated).
- Use when CodeRabbit or Codex review is expected for the PR.
- Use when CI/CD checks are part of merge readiness.

## Core Loop

Run this loop until exit criteria are satisfied.

1. Load PR state:
- collect all current review threads and comments, including existing comments present before the skill started
- collect CI/CD status for required checks

2. Triage and act:
- treat each reviewer finding as actionable unless it is clearly a false positive
- fix all non-false-positive findings in code/docs/tests
- if CI/CD has failures, fix those failures as part of the same loop

3. Thread discipline for every addressed or skipped finding:
- post an inline reply on that thread explaining the fix or why it is a false positive
- resolve the thread after replying

4. Push and re-request automated review:
- push commits
- post comment: `@coderabbitai review`
- post comment: `@codex review`

5. Wait for review/check updates:
- wait up to 30 minutes total
- check every 5 minutes using a sleep interval (`sleep 300`)
- on each check, re-read both review and CI/CD status
- if meaningful findings or CI/CD failures appear, continue the loop immediately

## Exit Criteria

You may end the loop only when all are true:

- no unresolved meaningful CodeRabbit findings remain
- no unresolved meaningful Codex findings remain
- every addressed or skipped finding has an inline reply and is resolved
- CI/CD is green (or explicitly non-blocking per repo policy)
- the latest reviewer rounds contain no meaningful new issues

## Required Behavior

- Do not ignore existing comments that were already open when the skill was invoked.
- Do not stop after one pass if reviewer bots are still producing new findings.
- Do not mark false positives without a concrete reason in the inline reply.
- Do not leave handled threads unresolved.
- Do not declare completion while CI/CD is failing for actionable reasons.

## Output Contract

Before finishing, report:

- total loop rounds executed
- fixes made for reviewer findings
- false positives skipped with rationale
- CI/CD failures fixed
- links or identifiers for final reviewer rounds checked
- final status: `clear` or `still blocked`
