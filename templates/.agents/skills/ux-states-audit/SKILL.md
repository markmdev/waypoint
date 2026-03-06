---
name: ux-states-audit
description: Audit UI code for missing loading states, empty states, and error states. Every async operation and data-driven UI must handle all three. Finds gaps and implements the missing states using the app's existing patterns.
---

# UX States Audit

Every piece of UI that fetches data or triggers async work has three states beyond the happy path: **loading**, **empty**, and **error**. LLMs implement the happy path and leave the rest blank. This skill finds and fills those gaps.

This is distinct from `error-audit`: `error-audit` finds errors that are suppressed. This finds states that were never implemented.

## Read First

1. Read `.waypoint/SOUL.md`
2. Read `.waypoint/agent-operating-manual.md`
3. Read `WORKSPACE.md`
4. Read `.waypoint/context/MANIFEST.md`
5. Read every file listed in the manifest
6. Read `references/ux-patterns.md`

## Step 0: Understand existing patterns

Before touching anything, read the codebase to understand how it currently handles these states:

- loading components or primitives
- empty state patterns
- error display patterns

Use these patterns exclusively. Don't introduce a new loading spinner if one already exists.

## What to look for

**Missing loading state**

**Missing empty state**

**Missing error state**

See `references/ux-patterns.md` for concrete patterns.

## Process

1. Identify the scope
2. Find every component that fetches data or triggers async work
3. For each: check whether loading, empty, and error states are handled
4. Implement missing states using the patterns found in Step 0
5. Report what was added, by component

## Fix principles

- Loading states should be immediate
- Empty states should explain the situation and, where appropriate, offer an action
- Error states should say what went wrong and what the user can do
- Don't invent new UI primitives — use what already exists

## Reference files

- `references/ux-patterns.md` — Detection patterns and examples for missing loading, empty, and error states. Read before starting the audit.

## Report

Summarize by component: which states were missing, what was added.

