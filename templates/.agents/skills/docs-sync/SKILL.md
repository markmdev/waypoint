---
name: docs-sync
description: Audit routed docs against the actual codebase and shipped behavior. Use when the user asks to sync docs, when docs may be stale after implementation work, before pushing or opening a PR, when routes, contracts, config, commands, or shipped behavior changed, or when Codex should find missing, incorrect, outdated, or broken documentation and then update or flag the exact gaps. Do not use this for vendor-doc ingestion, repo-memory cleanup, or broad code review that is not specifically about docs drift.
---

# Docs Sync

Use this skill to keep repo docs aligned with reality.

This is not a vendor-doc ingestion skill and not a workspace-cleanup skill. It owns one job: compare the codebase and shipped behavior against routed docs, then fix or flag the mismatches.

## When Not To Use This Skill

- Skip it for importing or summarizing upstream vendor docs. Link to the real source instead of copying it into the repo.
- Skip it for workspace compression or tracker cleanup. This skill is about docs drift, not handoff hygiene.
- Skip it for broad code review that is not specifically about docs-to-reality mismatches.
- Skip it when the user only wants a new durable plan or architecture note; use the planning or normal docs-writing flow in that case.

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

## Gotchas

- Do not trust docs-to-docs consistency alone. The source of truth is the shipped code and behavior, not whether two markdown files agree with each other.
- Do not leave stale future-tense claims behind after a feature ships or is cut. Docs drift often shows up as roadmap language that quietly became false.
- Do not update prose without checking commands, routes, config names, and examples. Small copied snippets are often where docs rot first.
- Do not invent certainty when the right doc shape is unclear. Flag the mismatch instead of bluffing a final answer.
- After touching routed docs, always refresh the generated docs/context layer so the repo’s index and bootstrap bundle match the new reality.

## Keep This Skill Sharp

- After meaningful runs, add new gotchas when the same docs-drift pattern, broken example shape, or stale-claim mistake keeps recurring.
- Tighten the description if the skill misses real prompts like "sync the docs" or fires on requests that are really about repo-memory cleanup instead.
- If the skill starts needing detailed provider-specific or command-heavy guidance, move that detail into references instead of bloating the hub file.
