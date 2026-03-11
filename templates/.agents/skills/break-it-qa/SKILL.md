---
name: break-it-qa
description: Verify a user-facing feature by trying to break it on purpose instead of only following the happy path. Use after building forms, multistep flows, settings pages, onboarding, stateful UI, destructive actions, or any browser-facing feature where invalid inputs, refreshes, back navigation, repeated clicks, wrong action order, or recovery paths might expose real bugs.
---

# Break-It QA

Use this skill to attack the feature like an impatient, confused, or careless user.

This is not the same as `e2e-verify`.

- `e2e-verify` proves the intended flow works end to end.
- `break-it-qa` tries to make the feature fail through invalid, interrupted, stale, repeated, or out-of-order interactions.

## Read First

Before verification:

1. Read `.waypoint/SOUL.md`
2. Read `.waypoint/agent-operating-manual.md`
3. Read `.waypoint/WORKSPACE.md`
4. Read `.waypoint/context/MANIFEST.md`
5. Read every file listed in that manifest
6. Read the routed docs or nearby code that define the feature being tested

## Step 1: Identify Break Surfaces

- Identify the happy path first so you know what "broken" means.
- Find the fragile surfaces: forms, wizards, pending states, destructive actions, async transitions, navigation changes, and persisted state.

Do not test blindly.

## Step 2: Use The Real UI

- Use `playwright-interactive`.
- Exercise the actual UI instead of mocking the flow in code.
- Keep the scope focused on the feature the user asked you to verify.

## Step 3: Try To Break It On Purpose

Do more than a happy-path walkthrough.

Actively try:

- invalid inputs
- empty required fields
- boundary-length or malformed inputs
- repeated or double clicks
- submitting twice
- wrong action order
- back and forward navigation
- page refresh during the flow
- closing and reopening modals or screens
- canceling mid-flow and re-entering
- stale UI state after edits
- conflicting selections or toggles
- error recovery after a failed action

If the feature is stateful, also check whether the UI, network result, and persisted state stay coherent after those interactions.

## Step 4: Record And Fix Real Bugs

- Document each meaningful issue you find.
- Fix the issue when the remediation is clear.
- If the behavior is ambiguous, call out the product decision instead of bluffing a fix.
- Update docs when the verification exposes stale assumptions about how the feature works.

Do not stop at the first bug.

## Step 5: Repeat Until The Feature Resists Abuse

After fixes:

- rerun the relevant happy path
- rerun the break attempts that previously failed
- verify the fix did not create a new inconsistent state

The skill is not done when the feature only works once. It is done when the feature behaves predictably under sloppy real-world use.

## Step 6: Report Truthfully

Summarize:

- what break attempts you tried
- which issues you found
- what you fixed
- what still looks risky or was not exercised
