---
name: planning
description: >
  Interview-driven planning methodology that produces implementation-ready plans.
  Use for non-trivial implementation work such as new features, refactors, migrations,
  architecture changes, or ambiguous bugs that require repo exploration and product
  clarification. Do not use for tiny obvious edits, straightforward one-file changes,
  or post-implementation closeout. Ask multiple rounds of clarifying questions about
  behavior, constraints, edge cases, and architecture; explore the repo before deciding;
  and write the final plan into `.waypoint/plans/` so it persists in the repo.
---

# Planning

Good plans prove you understand the problem. Size matches complexity: a rename might be 20 lines, a complex feature might be 500.

The handoff test: could someone implement this plan without asking you questions? If not, find what is missing.

## When To Use This Skill

- Use it for new feature work, refactors, migrations, architecture changes, or bugs where the right fix depends on repo exploration plus product or architectural clarification.
- Use it when the request can affect contracts, schemas, data flow, compatibility, or multiple call sites.
- Use it when a durable plan doc will help someone else implement the change without re-discovering the problem.

Examples:

- Use: "Add a new billing flow with backend and frontend changes."
- Use: "Refactor the event pipeline to a new payload shape."
- Use: "Migrate the job runner to a new queue contract."
- Do not use: "Fix a typo in one markdown file."
- Do not use: "Rename this single variable in one function."
- Do not use: "Make this one-line styling tweak and ship it."

## When Not To Use This Skill

- Do not use it for tiny obvious edits where the overhead of a full planning pass would cost more than it saves.
- Do not use it for straightforward implementation that fits cleanly in one local change and does not need interview-driven discovery.
- Do not use it for post-implementation closeout; use the review or hygiene workflows for that.

## Ordered Workflow

1. Classify the request.
   - Decide whether the work needs full planning or the reduced-depth exception.
   - Identify the likely surface area: product behavior, architecture, migration, refactor, or local edit.
2. Read the routed workspace context.
   - Read `AGENTS.md`.
   - Read `.waypoint/WORKSPACE.md`.
   - Read `.waypoint/ACTIVE_PLANS.md`.
   - Read `.waypoint/DOCS_INDEX.md`.
   - Read `.waypoint/context/SNAPSHOT.md`.
   - Read the routed docs relevant to the task.
3. Explore the codebase.
   - Find the real entry points.
   - Trace callers, imports, and data flow.
   - Inspect adjacent modules that already solve similar problems.
   - Identify constraints the change must respect.
4. Interview the user.
   - Ask 2-4 focused questions.
   - Ask about behavior, edge cases, users, tradeoffs, and architecture.
   - Do not ask for facts that the repo or routed docs already answer.
5. Repeat exploration and interviewing until the plan is grounded.
   - Keep drilling until you can explain what exists today, what changes, what could go wrong, and what decisions remain.
6. Choose the plan depth.
   - Use the full planning shape by default.
   - Use the reduced-depth exception only when the task qualifies under the exception rule below.
7. Write or update the durable plan doc.
   - Put it under `.waypoint/plans/`.
   - Choose the smallest routed location that matches the work.
   - Update `.waypoint/ACTIVE_PLANS.md` when the plan is approved or changes phase.
8. Self-review the plan against real code.
   - Verify state invariants, transaction boundaries, and the current tooling.
   - Remove assumptions that are not backed by the repo or routed docs.

## Output Location

The plan belongs in the repo, not only in chat.

- Write or update a durable plan doc under `.waypoint/plans/`.
- Choose the smallest routed location that matches the work, such as a project plan, implementation plan, or focused design note.
- If a relevant plan doc already exists, update it instead of creating a competing one.
- Update `.waypoint/ACTIVE_PLANS.md` when this plan becomes the approved active plan or when its current phase changes.
- In chat, return only a concise summary plus the path to the plan doc.

## The Core Loop

```
ASK -> EXPLORE -> LEARN -> MORE QUESTIONS? -> REPEAT
```

Keep looping until you can explain:

- what exists today
- how the data and control flow work
- what needs to change
- what could go wrong

## Interviewing

Interviewing is the most important part of planning. You cannot build what you do not understand. Every unasked product, behavior, edge-case, or architecture question is an assumption that will break during implementation.

Interview iteratively: 2-4 questions -> answers -> deeper follow-ups -> repeat. Each round should go deeper.

- Simple bug -> a few focused questions
- Feature or migration -> many rounds of questions
- Architectural work -> keep drilling until the constraints and tradeoffs are clear

Ask aggressively about:

- how the feature should behave
- who the users are
- which edge cases matter
- what tradeoffs are acceptable
- what architecture direction the user wants

Do not spend those questions on implementation facts that can be learned from reading the code, routed docs, or external docs already linked by the repo.

Push back when something seems off. Neutrality is not the goal; correctness is.

## Plan Content

Plans document your understanding. Include what matters for this task.

### Mandatory in every plan

- **Current State**: What exists today, including the relevant files, data flow, constraints, and existing patterns.
- **Changes**: Every file to create, modify, or delete, and how the changes connect.
- **Decisions**: Why this approach, tradeoffs, and assumptions.
- **Phase breakdown**: Distinct execution phases in the order they should happen.
- **Scope checklist**: Concrete implementation items that can be marked done or not done.
- **Acceptance criteria**: What must be true when each phase is done.
- **Non-Goals**: Explicitly out of scope items to prevent implementation drift.
- **TL;DR**: A short summary for quick review.

### Conditional artifacts

Add these only when the work actually needs them:

- **Legacy seam inventory**: Required for migrations, refactors, or compatibility-sensitive replacements where legacy readers, writers, consumers, or tests still depend on the old shape.
- **Removals**: Required when obsolete code, compatibility logic, dead branches, or unused files will be deleted.
- **Phase checkpoints**: Required when the change needs explicit phase gates, review passes, or staged verification before moving on.
- **File strategy**: Required when multiple files or new files need justification, locality control, or split decisions.
- **Test strategy**: Required when the work needs a deliberate minimal test set and the risk is not obvious from the change itself.
- **Grep gates**: Required when the plan must prove that legacy symbols or shapes are gone before a phase completes.
- **Cleanup expectations**: Required when the implementation must delete replaced paths before the work is complete.
- **Test cases**: Required for behavioral changes where concrete input -> expected output examples prevent ambiguity.
- **Docs/workspace updates**: Required when the change affects durable project behavior or operator-facing guidance.

### Reduced-Depth Exception Rule

Use a reduced-depth plan only when all of the following are true:

- The request is small and localized.
- The change does not alter schemas, contracts, compatibility boundaries, or multi-step data flow.
- The likely implementation fits in a narrow set of files.
- The user wants planning support, but a full interview-and-audit pass would add more overhead than value.

When this exception applies:

- Ask at most one focused clarification round.
- Read only the directly relevant files and immediate neighbors.
- Produce a shorter plan doc that keeps `Current State`, `Changes`, `Decisions`, `Scope checklist`, `Acceptance criteria`, `Test strategy`, and `Non-Goals`.
- Omit `Legacy seam inventory`, `Grep gates`, and `Phase checkpoints` unless the request unexpectedly grows in scope.

Use ASCII diagrams when they clarify flow, layering, or state.

Distill the requirements and clarifications into a clean plan document. Do not turn the plan into a transcript dump.

## Self-Review Before Finalizing

Before presenting the plan, verify against real code:

- existing controls
- state invariants
- transaction boundaries for multi-write operations
- verification executability with current tooling

## Rules

- No TBD.
- No "we'll figure it out during implementation."
- No literal code unless the user explicitly wants it.
- No pretending you verified something you did not.
- Approved scope must be explicit enough to act as an execution contract after user approval.
- The plan must be explicit enough to support phase-by-phase execution and checkpoints without rediscovering the intended order in chat.
- Do not split files by concern labels alone. A new file requires a clear boundary, reuse need, or size reason.
- Do not inflate tests by default. Start from a small high-signal set and expand only when risk justifies it.
- If the user approves the plan, do not silently defer or drop checklist items later; discuss any proposed scope change first.
- For migrations and refactors, include the conditional legacy seam inventory and exact grep gates required by the work.
- For refactors and replacements, call out what legacy or obsolete code will be removed instead of preserving it by default.
- If the reduced-depth exception applies, do not force the full artifact set just to satisfy a template.

If the change touches durable project behavior, include docs/workspace updates in the plan.
Write or update the durable plan doc under `.waypoint/plans/` as part of the skill, not as an optional follow-up.

## External APIs

If an external API or library is relevant, read the actual upstream docs before finalizing the plan. Prefer the repo's external-doc links or URL registry when one exists. Read the real source docs; do not copy vendor reference material into the repo unless the user explicitly wants a durable local note.

## Plan Shape

A good durable plan doc usually includes:

1. Current state
2. Proposed changes
3. Decisions and tradeoffs
4. Phase breakdown
5. Scope checklist
6. Acceptance criteria
7. Verification
8. TL;DR

Include `Legacy seam inventory`, `Phase checkpoints`, `Grep gates`, and `Cleanup expectations` only when the conditional rules above require them.

## Final Response

When the plan doc is written:

- give a short chat summary
- include the doc path
- state whether the plan is full-depth or reduced-depth
- call out any unresolved decisions that still need the user's input
- list which artifacts are mandatory and which are conditional for this task
- if there are no unresolved decisions and the user approves the plan, treat that approval as authorization to execute the plan end to end rather than asking again at each obvious next step
- once approved, update `.waypoint/ACTIVE_PLANS.md` so the active plan, current phase, and current checkpoint are visible during execution
- once approved, use the plan's checklist, phase checkpoints, and acceptance criteria to decide whether the work is actually done; if anything approved is skipped, report that as partial work or ask to change scope instead of calling it complete

## Quality Bar

If the plan would make the implementer ask "where does this hook in?" or "what exactly am I changing?", it is not done.

## Gotchas

- Do not spend interview turns on implementation facts that are already in the code or routed docs.
- Do not stop exploring just because you have a plausible plan. The usual failure mode is shallow repo understanding.
- Do not leave unresolved architecture or product decisions hidden behind "we can figure that out during implementation."
- Do not plan a refactor as a rewrite-plus-compatibility-preservation bundle unless compatibility is explicitly required. Call out what should be deleted.
- Do not skip the legacy seam inventory for migrations or refactors and then rediscover dependencies one tiny edit at a time during implementation.
- Do not leave grep gates implicit. Name the exact legacy symbols or shapes that must be gone before the phase can move forward.
- Do not dump a transcript into the plan doc. Distill the decisions and requirements into a clean implementation handoff.
- Do not treat a reviewed plan as a stopping point. Once the user approves it, the workflow expects execution to continue.
- Do not use the reduced-depth exception for work that crosses contracts, data flow, or compatibility boundaries.

## Keep This Skill Sharp

- Add new gotchas when the same planning blind spot, under-explored area, or vague plan failure keeps recurring.
- Tighten the description if the skill fires on tiny tasks or misses real prompts about migrations, refactors, and implementation-ready design work.
- If planning keeps depending on the same durable context or external reference paths, encode that routing into the skill instead of rediscovering it in chat.
