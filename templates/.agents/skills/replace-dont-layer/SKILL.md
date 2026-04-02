---
name: replace-dont-layer
description: Prevent layering a new implementation path on top of an older one when the change should replace it. Use when modifying an existing flow, interface, abstraction, migration, or behavior and there is a risk of leaving both old and new paths alive. Determine whether the new path is additive, replacing, or transitional, and remove, redirect, or explicitly deprecate the old path as part of the same work.
---

Determine whether the requested change is additive, replacing, or transitional.

Identify the old path, the new path, and where each is used.

If the change is additive, keep both paths only if they serve clearly different intended roles.

If the change is replacing, do not just add the new path. In the same work:
- redirect callers to the new path
- remove or deprecate the old path
- delete obsolete conditionals, adapters, and compatibility glue
- update tests to reflect the intended single path

If the change is transitional:
- keep duplication to the minimum necessary
- make the temporary path explicit
- attach a concrete removal condition
- add a brief in-code comment only if it materially helps future cleanup, and make it specific rather than a vague TODO

Before considering the work complete, check whether both old and new paths still exist without a clear reason. If they do, keep cleaning up.

Rules:
- Do not keep both paths alive by default.
- Do not leave old logic in place just because removal feels riskier.
- Do not call the work complete if the new path exists but the old one still silently handles traffic.
- Prefer one clear path over split behavior.
- If temporary coexistence is necessary, make the exit condition explicit.
- Do not rely on vague TODO comments as the cleanup plan.