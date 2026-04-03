---
name: replace-dont-layer
description: Prevent a replacement change from being layered on top of an old path. Use when an existing implementation, flow, abstraction, or behavior already has a clear old path and the requested change is to replace it, redirect traffic to the new path, and remove obsolete glue in the same change. Do not use for additive-only work, broad redesigns, or schema/state hard cuts.
---

# Replace Don't Layer

Replace the old path. Do not add the new path beside it.

## Core Instruction

When the requested change is a replacement, the codebase must end with one clear active path, and the old path must be removed, redirected, or explicitly fenced at a real compatibility boundary in the same work.

## When To Use

Use this skill when all of the following are true:

1. There is already an old implementation path in the codebase.
2. The change is meant to replace that path, not add a separate alternative.
3. Leaving both paths alive would create split behavior, duplicated logic, or hidden fallback handling.
4. The work is not primarily a schema migration, persisted-state cutover, or architecture redesign.

Do not use this skill when the change is truly additive and both paths are intentionally independent.

## Default Workflow

1. Identify the old path, the proposed new path, and every live caller or producer/consumer that touches them.
2. Classify the change as one of three cases:
   - replacement
   - additive and independent
   - transitional with a bounded compatibility bridge
3. If the change is replacement, update the owning layer first, then redirect callers to the new path, then delete obsolete adapters, branches, flags, and duplicate code.
4. If the change is additive, keep both paths only when they serve distinct responsibilities and do not share behavior that should be unified.
5. If the change is transitional, keep the bridge minimal, name the removal condition, and schedule the cleanup in the same change set.
6. Re-check the diff for any code that still silently preserves the old path, even indirectly through helper functions, compatibility branches, or fallback routing.

## Rules

- Do not leave both old and new paths active by default.
- Do not add a new path beside the old one just to reduce immediate risk.
- Do not preserve compatibility glue after the redirection is complete.
- Do not leave hidden fallback behavior, duplicate branching, or parallel implementations in place.
- Do not use vague TODO comments as a cleanup plan.
- Do not call the change complete while old logic still handles the same traffic, data, or behavior behind the scenes.
- Do not use this skill to justify broad redesign work that belongs under `foundational-redesign`.
- Do not use this skill to police schema or persisted-state compatibility that is already governed by `hard-cut`.

## Exception Rule

Keep an old path only at a real compatibility boundary that cannot be removed in the same change.

The exception is allowed only when the old path is required for one of these:

- already persisted user or system data
- on-disk or database state that must still load
- an external wire format or process boundary
- a documented public or supported contract

When the exception applies:

- isolate it to the exact boundary function, file, or adapter
- keep the bridge as small as possible
- name the concrete removal condition
- avoid spreading compatibility logic to callers or new codepaths

## Output Contract

Return a short implementation summary that states:

- the old path
- the new path
- the decision: replacement, additive, or transitional
- what was removed or redirected
- whether any compatibility boundary remains
- the exact removal condition if a transitional bridge remains
- the verification performed

If the work is incomplete, say exactly what remains instead of implying it is done.
