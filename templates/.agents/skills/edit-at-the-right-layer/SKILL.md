---
name: edit-at-the-right-layer
description: Use when a change should be implemented at the owning layer of an existing behavior, not in callers, wrappers, adapters, or duplicated checks. Trigger only when the main decision is which layer owns the contract. Examples: moving validation into the domain model, fixing serialization in the owning mapper, or deleting a controller workaround after the service layer can enforce the rule.
---

# Edit At The Right Layer

## Core Instruction
Change the layer that owns the contract, not the layer that merely observes the failure.

## Default Workflow
1. Trace the request path to the first layer that can enforce the behavior once.
2. Name the owning layer and the exact contract it must own.
3. Implement the behavior at that layer.
4. Remove caller-side workarounds, duplicate checks, and pass-through code made obsolete by the fix.
5. Update tests at the owning layer first; add outer-layer tests only for distinct integration risk.

## Rules
- Do not patch symptoms in controllers, views, clients, wrappers, or adapters when the source-of-truth layer can enforce the behavior.
- Do not duplicate the same rule across multiple layers.
- Do not add compatibility branches, feature flags, or fallback paths unless a bounded migration requires them and they are removed in the same phase.
- Do not leave temporary cross-layer patches in place after the owning-layer fix is available.
- Do not use this skill for pure redesign, greenfield architecture, or broad refactors whose goal is to rebase the system; use the more appropriate skill for that work.

## Exception Rule
If the owning layer cannot be changed in the current phase because of an external dependency, a hard compatibility constraint, or an unowned migration boundary, allow a temporary outer-layer patch only when it is isolated, explicitly time-bounded, and paired with a tracked follow-up to move the rule inward.

## Output Contract
- Owning layer identified
- Change made at that layer
- Obsolete outer-layer logic removed or retained with a reason
- Tests updated at the owning layer
- Exception used, if any, with the follow-up plan
