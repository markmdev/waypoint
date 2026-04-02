---
name: collapse-fragmented-modules
description: Consolidate over-fragmented existing code within a defined scope. Use when a feature, module, or directory has been split into too many tiny files, thin wrappers, pass-through layers, single-use helpers, local-only types, local-only constants, or other low-value fragments that make future changes harder. Reduce file count by merging code that changes together, removing unnecessary indirection, and reorganizing the scope into a smaller number of cohesive files without changing intended behavior.
---

Refactor the given scope to reduce unnecessary file fragmentation.

Treat this as consolidation work, not feature work. Preserve behavior while making the code easier to change.

Within the requested scope:

1. Identify files that should be merged, removed, or kept.
   Target especially:
   - tiny files with little logic
   - single-use helpers
   - local-only types
   - local-only constants
   - thin wrappers
   - pass-through adapters
   - split files that always change together

2. Merge code that belongs to the same feature or responsibility into a smaller number of cohesive files.

3. Remove low-value indirection.
   Collapse wrappers, adapters, and helper layers that do not enforce a real boundary or protect meaningful complexity.

4. Keep splits only when they are justified by one of these:
   - real shared reuse
   - clear architectural boundary
   - meaningful file size
   - clearly separate responsibility that does not usually change with neighboring code

5. Prefer edit locality over theoretical separation.
   A routine change in this scope should touch as few files as reasonably possible.

6. Preserve external behavior and stable public contracts unless the user asked for behavioral change.

7. Update imports, exports, and tests to match the new structure.

8. Delete obsolete files as part of the same work. Do not leave dead fragments behind.

Rules:
- Do not keep tiny files just because they already exist.
- Do not preserve thin wrappers, pass-through hooks, local-only type files, or local-only constants files unless they provide real value.
- Do not split by category alone.
- Do not create a new abstraction while trying to remove fragmentation.
- Prefer one cohesive file over several microscopic files when the code changes together.
- Keep public boundaries clean, but aggressively collapse internal fragmentation.
- If unsure whether two files should be merged, merge them unless there is a clear boundary reason not to.

Before finishing, do a consolidation pass:
- remove newly obsolete files
- collapse redundant exports
- simplify import paths
- check whether the same feature is still spread across too many files
- reduce file count further if behavior and clarity allow