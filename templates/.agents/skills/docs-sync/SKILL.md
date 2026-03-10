---
name: docs-sync
description: Audit routed docs against the actual codebase and shipped behavior. Use when docs may be stale after implementation work, before pushing or opening a PR, when routes/contracts/config changed, or when the agent should find missing, incorrect, outdated, or broken documentation and then update or flag the exact gaps.
---

# Docs Sync

Use this skill to keep repo docs aligned with reality.

This is not a vendor-doc ingestion skill and not a workspace-cleanup skill. It owns one job: compare the codebase and shipped behavior against routed docs, then fix or flag the mismatches.

## Read First

Before auditing docs:

1. Read `.waypoint/SOUL.md`
2. Read `.waypoint/agent-operating-manual.md`
3. Read `.waypoint/WORKSPACE.md`
4. Read `.waypoint/context/MANIFEST.md`
5. Read every file listed in that manifest
6. Read the routed docs for the area under review

## Step 1: Compare Docs To Reality

Audit the real code, routes, contracts, config surfaces, and user-visible behavior against `.waypoint/docs/`.

Look for:

- missing docs for real shipped behavior
- stale docs that describe removed or changed behavior
- broken routing links or docs index gaps
- examples or commands that no longer work
- contract/schema/config docs that no longer match the code
- docs that still describe future work as if it is already shipped

## Step 2: Fix Or Flag

- Update the docs when the correct wording is clear.
- Add the smallest routed doc needed when behavior exists but is undocumented.
- Remove or reframe stale claims instead of letting them linger.
- If a mismatch is real but the correct doc shape is unclear, flag it explicitly instead of bluffing.

Do not mirror vendor reference docs into the repo. Link to the real upstream docs when that is the right source of truth.

## Step 3: Refresh Routing

After changing routed docs:

- Run `node .waypoint/scripts/prepare-context.mjs` so the docs index and generated context match the updated docs.

## Step 4: Report The Sync Result

Summarize:

- what docs were stale or missing
- what you updated
- what still needs a decision, if anything
