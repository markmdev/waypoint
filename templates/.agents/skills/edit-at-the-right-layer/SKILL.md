---
name: edit-at-the-right-layer
description: Make changes at the true ownership layer instead of patching nearby call sites. Use when implementing features, bug fixes, or refactors where behavior should be corrected at its source of truth rather than through wrappers, flags, or duplicated logic.
---

Identify where this behavior is actually owned, then edit there.

## Goal

Fix or extend behavior at the layer that owns the contract so future changes stay local and coherent.

## Workflow

1. Trace the path from entry point to ownership.
2. Identify the contract owner (domain/service/model/state boundary) for the requested behavior.
3. Prefer changing that owner over adding patches in callers, controllers, views, adapters, or wrappers.
4. Remove compensating logic that became unnecessary after the ownership-layer fix.
5. Update boundary tests at the owning layer and only add higher/lower-layer tests when they cover a distinct risk.

## Rules

- Do not patch symptoms in outer layers when the source-of-truth layer can be fixed directly.
- Do not add pass-through wrappers or compatibility branches as a default response.
- Do not duplicate the same rule across multiple layers.
- If a temporary cross-layer patch is unavoidable, mark it as transitional and remove it in the same phase whenever possible.
- Prefer one clear owner per rule.
