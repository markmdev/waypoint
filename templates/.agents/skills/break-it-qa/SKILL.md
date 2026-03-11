---
name: break-it-qa
description: Verify a user-facing feature by trying to break it on purpose instead of only following the happy path. Use after building forms, multistep flows, settings pages, onboarding, stateful UI, destructive actions, or any browser-facing feature where invalid inputs, refreshes, back navigation, repeated clicks, wrong action order, or recovery paths might expose real bugs.
---

# Break-It QA

Use this skill to attack the feature like an impatient, confused, or careless user.

This is not the same as `e2e-verify`.

- `e2e-verify` proves the intended flow works end to end.
- `break-it-qa` tries to make the feature fail through invalid, interrupted, stale, repeated, or out-of-order interactions.

## Step 1: Ask The Three Setup Questions

Before testing, ask the user these questions if the answer is not already clear from context:

- what exact feature or scope should this cover?
- how many attack items should the break log reach before stopping?
- should the skill stop at findings or also fix clear issues after they are found?

Keep this intake short. These are the main user-controlled knobs for the skill.

If the user does not specify a count, use a reasonable default such as `40`.

## Step 2: Read First

Before verification:

1. Read `.waypoint/SOUL.md`
2. Read `.waypoint/agent-operating-manual.md`
3. Read `.waypoint/WORKSPACE.md`
4. Read `.waypoint/context/MANIFEST.md`
5. Read every file listed in that manifest
6. Read the routed docs or nearby code that define the feature being tested

## Step 3: Identify Break Surfaces

- Identify the happy path first so you know what "broken" means.
- Find the fragile surfaces: forms, wizards, pending states, destructive actions, async transitions, navigation changes, and persisted state.
- For each major step or transition, ask explicit "What if...?" questions before testing. Examples:
  - What if the user refreshes here?
  - What if they go back now?
  - What if they click twice?
  - What if this input is empty, malformed, too long, or contradictory?
  - What if this action succeeds in the UI but fails in persistence?

Do not test blindly.

## Step 4: Create A Break Log

Write or update a durable markdown log under `.waypoint/docs/`.

- Prefer a focused path such as `.waypoint/docs/verification/<feature>-break-it-qa.md`.
- If a routed verification doc already exists for this feature, update it instead of creating a competing file.
- The log is part of the skill, not an optional extra.
- Pre-generate the attack plan in this log before executing it. Do not improvise everything live.

Use one item per attempted action. A good entry shape is:

```markdown
- [ ] What if the user refreshes on the confirmation step before the request finishes?
  Step: confirmation
  Category: navigation
  Status: pending
  Observed: not tried yet
```

Then update each item as you go:

- `survived`
- `broke`
- `fixed`
- `retested-survived`
- `blocked`
- `not-applicable`

Every executed item must include:

- `Step`
- `Category`
- `Status`
- `Observed`

If the user sets a target such as "make this file 150 items long before you stop," treat that as a hard stopping condition unless you hit a real blocker and explain why.

Use consistent categories such as:

- `navigation`
- `input-validation`
- `repeat-action`
- `stale-state`
- `error-recovery`
- `destructive-action`
- `permissions`
- `async-state`
- `persistence`

## Step 5: Enforce Coverage Before Execution

Before you start executing attacks:

- pre-generate a meaningful attack list
- spread it across the major flow steps
- spread it across relevant categories
- make sure the count is not satisfied by one repetitive corner of the feature

Do not treat total item count alone as sufficient coverage.

If the user asks for a large target such as `150`, ensure the log covers multiple steps and multiple categories instead of padding one surface.

Anti-cheating rules:

- no filler items
- each attack must be meaningfully distinct
- reworded duplicates do not count toward the target

## Step 6: Use The Real UI

- Use `playwright-interactive`.
- Exercise the actual UI instead of mocking the flow in code.
- Keep the scope focused on the feature the user asked you to verify.

## Step 7: Try To Break It On Purpose

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

As you test, keep expanding the break log with new "What if...?" cases that emerge from the flow. Do not rely on memory or chat-only notes.

## Step 8: Record And Fix Real Bugs

- Document each meaningful issue you find.
- Fix the issue when the remediation is clear and the chosen mode includes fixes.
- If the behavior is ambiguous, call out the product decision instead of bluffing a fix.
- Update docs when the verification exposes stale assumptions about how the feature works.
- Update the break log entry for each attempted action with what happened and whether the feature survived.
- Require a short observed-result note for every executed item. "Worked" is too weak; capture what actually happened.

Do not stop at the first bug.

## Step 9: Repeat Until The Feature Resists Abuse

After fixes:

- rerun the relevant happy path
- rerun the break attempts that previously failed
- rerun directly related attacks
- rerun neighboring attacks that touch the same step, state transition, or failure surface
- verify the fix did not create a new inconsistent state
- keep adding and executing new "What if...?" items until the requested target coverage is reached

The skill is not done when the feature only works once. It is done when the feature behaves predictably under sloppy real-world use.

## Step 10: Report Truthfully

Summarize:

- the path to the break log markdown file
- how many attack items were recorded and exercised
- how coverage was distributed across steps and categories
- what break attempts you tried
- which issues you found
- what you fixed
- a short systemic-risks summary describing recurring weakness patterns, not just individual bugs
- what still looks risky or was not exercised
