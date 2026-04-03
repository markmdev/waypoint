---
name: collapse-fragmented-modules
description: Consolidate internal file fragmentation inside an existing module, feature, or directory when the code is split into too many tiny files, thin wrappers, pass-through layers, single-use helpers, or local-only types/constants. Use when the task is to reduce file count and remove low-value indirection without changing schemas, public contracts, persisted formats, or cross-boundary behavior.
---

# Collapse Fragmented Modules

## Core Instruction
Consolidate internal fragmentation into the smallest cohesive file set that preserves current behavior.

## Default Workflow
1. Map the scope and classify each file as merge, keep, or delete.
2. Merge code that changes together or serves one local responsibility.
3. Remove thin wrappers, pass-through layers, and local-only helper/type/constant files.
4. Update imports, exports, and tests to match the new file shape.
5. Delete obsolete fragments and rerun a consolidation pass for any remaining avoidable splits.

## Rules
- Do not create new abstractions to justify keeping fragmentation.
- Do not keep a split file unless at least one is true: multiple live callers reuse it, it sits on a real public or cross-boundary interface, it protects a distinct runtime or lifecycle boundary, or merging would create an unreasonably large file.
- Do not preserve local-only types, constants, or helpers in separate files unless they are reused outside the consolidation scope.
- Do not split code by category alone.
- Do not leave obsolete wrappers, adapters, re-export layers, or dead fragment files in place after the merge.
- Do not change schemas, wire formats, persisted state, or public contracts in this skill.

## Exception Rule
If a file is tied to a real external boundary that must remain separate, keep only that boundary file and consolidate everything else around it. If the requested work requires schema, contract, migration, or compatibility changes to proceed, stop and hand off to the appropriate redesign or hard-cut skill instead of stretching this one.

## Output Contract
Report:
- files merged
- files deleted
- files kept with the specific boundary reason
- imports, exports, or tests updated
- any remaining split that is still justified
