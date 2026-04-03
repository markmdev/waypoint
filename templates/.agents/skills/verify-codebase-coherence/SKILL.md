---
name: verify-codebase-coherence
description: Audit completed work in a defined scope for codebase coherence before handoff. Use after implementation to verify the change reuses existing components, utilities, abstractions, state paths, naming, contracts, and design language instead of introducing avoidable parallel patterns. Do not use for redesign, replacement, collapse, or other implementation tasks that belong to foundational/edit-layer skills.
---

# Verify Codebase Coherence

## Mission
Audit the finished change for coherence with the existing codebase and report whether it is ready for closeout.

## Ordered Workflow
1. Confirm the requested scope and the files actually changed by the implementation.
2. Inspect the changed code in context of nearby code, shared helpers, and adjacent conventions.
3. Check for avoidable parallel patterns: duplicate components, helpers, hooks, adapters, state paths, naming, API shapes, styling, or local abstractions.
4. Check whether the change should have reused an existing component, utility, boundary, or composition pattern instead of introducing a new one.
5. Classify each issue as either a coherence finding, a deliberate divergence, or out of scope.
6. Decide closeout status: pass only if no unresolved coherence findings remain.
7. Report findings with enough detail for the owner to act on them.

## Rules
- Do not edit files.
- Do not recommend a redesign, replacement, collapse, or refactor as a substitute for this audit.
- Do not accept a new component, utility, hook, adapter, state path, or API shape if an existing one already covers the same job.
- Do not treat faster implementation as a valid reason to fork the architecture, data flow, or design language.
- Do not expand the review beyond the requested scope unless a change in that scope creates a direct coherence issue outside it.
- Do not mark a deliberate divergence as a finding when the repo already documents or consistently uses that variant.

## Exception Rule
If the codebase already has a sanctioned local variant, feature flag boundary, or documented exception that justifies the divergence, classify it as accepted and do not report it as a coherence defect.

## Output Contract
- Start with `PASS` or `FAIL`.
- If `FAIL`, list each finding with file path, concise reason, and the specific reuse or alignment that should have happened.
- If `PASS`, state that the audited scope is coherent and closeout-ready.
- Include no code changes, no patch plan, and no redesign proposal.
