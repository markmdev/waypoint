---
name: e2e-verify
description: Perform manual end-to-end verification for a shipped feature or major change. Use when frontend and backend behavior must be verified together, when a feature needs a realistic walkthrough, or when the agent should manually exercise the flow, inspect logs and persisted state, document issues, fix them, and repeat until no meaningful end-to-end issues remain.
---

# E2E Verify

Use this skill when "it should work" is not enough and the flow needs to be proven end to end.

## Read First

Before verification:

1. Read `.waypoint/SOUL.md`
2. Read `.waypoint/agent-operating-manual.md`
3. Read `.waypoint/WORKSPACE.md`
4. Read `.waypoint/context/MANIFEST.md`
5. Read every file listed in that manifest
6. Read the routed docs that define the feature, flow, or contract being verified

## Step 1: Exercise The Real Flow

- For browser-facing paths, manually exercise the feature through the real UI.
- For backend-only or service flows, drive the real API or runtime path directly.
- Follow the feature from entry point to persistence to user-visible outcome.

## Step 2: Inspect End-To-End State

Check the surfaces that prove the system actually behaved correctly:

- UI state
- server responses
- logs
- background-job state if relevant
- database or persisted records when relevant

Do not stop at "the page looked okay."

## Step 3: Record And Fix Issues

- Document each meaningful issue you find.
- Fix the issue when the remediation is clear.
- Update docs or contracts if verification exposes stale assumptions.

## Step 4: Repeat Until Clean

Re-run the end-to-end flow after fixes.

The skill is complete only when:

- the intended flow works
- the persisted state is correct
- the logs tell a truthful story
- no meaningful issues remain

## Step 5: Report Verification Truthfully

Summarize:

- the flows exercised
- the state surfaces inspected
- the issues found and fixed
- any residual risks or unverified edges
