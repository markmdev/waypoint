---
name: verify-codebase-coherence
description: Verify that completed work fits the existing codebase instead of introducing unnecessary parallel patterns. Use after implementation within a defined scope to detect avoidable new components, utilities, abstractions, state paths, design patterns, or conventions that should have reused or extended existing ones. Correct the work so it integrates coherently with the repo's existing architecture, components, naming, contracts, and design language.
---

Review the completed work in the requested scope and check whether it fits the existing codebase.

Look for unnecessary parallel patterns such as:
- new frontend components where an existing component should have been reused or extended
- new helpers, hooks, utilities, or adapters that duplicate an existing pattern
- new state paths or data flows that bypass the established architecture
- new naming, file structure, or API shapes that do not match nearby conventions
- one-off design, styling, or interaction patterns that do not fit the app
- local abstractions that solve a problem the codebase already has a standard way to solve

Before keeping a new construct, check whether the repo already has:
- a reusable component or composition pattern
- an established state or data-fetching pattern
- a standard boundary for validation, formatting, permissions, or persistence
- an existing utility or shared contract
- a nearby feature that should be extended instead of bypassed

If the work introduced a parallel pattern without a clear reason, fix it. Do not just report it.

When correcting violations:
- reuse or extend existing components, utilities, and patterns where appropriate
- remove unnecessary one-off abstractions or duplicate paths
- align naming, structure, and interfaces with nearby code
- preserve intended behavior unless the user asked for a behavioral change

Rules:
- Do not create a new component, utility, hook, adapter, or pattern if the repo already has one that should be reused or extended.
- Do not fork the design language or architecture for a local feature without a clear reason.
- Do not bypass established patterns just because creating a new path is faster.
- Prefer extending the existing system over creating a parallel mini-system.
- If divergence is necessary, it must be justified by a real requirement, not convenience.