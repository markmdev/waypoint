---
name: planning
description: >
  Interview-driven planning methodology that produces implementation-ready plans.
  Use for new features, refactoring, architecture changes, migrations, or any non-trivial
  implementation work. Ask multiple rounds of clarifying questions about product behavior,
  user expectations, edge cases, and architecture; explore the repo deeply before deciding;
  do not waste questions on implementation details that can be learned directly from the
  code or routed docs; and write the final plan into `.waypoint/plans/` so it persists in the repo.
---

# Planning

Good plans prove you understand the problem. Size matches complexity — a rename might be 20 lines, a complex feature might be 500.

**The handoff test:** Could someone implement this plan without asking you questions? If not, find what's missing.

## When Not To Use This Skill

- Skip it for tiny obvious edits where a full planning pass would cost more than it saves.
- Skip it when the user explicitly wants implementation right away and the work is already straightforward.
- Skip it for post-implementation closeout; use the review or hygiene workflows for that.

## Read First

Before planning:

1. Read `.waypoint/SOUL.md`
2. Read `.waypoint/agent-operating-manual.md`
3. Read `.waypoint/WORKSPACE.md`
4. Read `.waypoint/context/MANIFEST.md`
5. Read every file listed in the manifest
6. Read the routed docs relevant to the task

## Output Location

The plan belongs in the repo, not only in chat.

- Write or update a durable plan doc under `.waypoint/plans/`.
- Choose the smallest routed location that matches the work, such as a project plan, implementation plan, or focused design note.
- If a relevant plan doc already exists, update it instead of creating a competing one.
- Make sure the doc remains discoverable through the routed docs layer.
- In chat, return only a concise summary plus the path to the plan doc.

If the planned implementation will be large, multi-step, or likely to span multiple sessions, also create or update a tracker under `.waypoint/track/` and link it from `WORKSPACE.md` before implementation begins.

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

**Interviewing is the most important part of planning.** You cannot build what you don't understand. Every unasked product, behavior, edge-case, or architecture question is an assumption that will break during implementation.

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

Do **not** spend those questions on implementation facts that can be learned from reading the code, routed docs, or external docs already linked by the repo.

Push back when something seems off. Neutrality is not the goal; correctness is.

## Exploring the Codebase

**More exploration = better plans.** The number one cause of plan failure is insufficient exploration.

Explore until you stop having questions, not until you've "done enough."

Use the repository like a map:

- find the real entry points
- trace callers and imports
- inspect nearby modules solving similar problems
- identify existing patterns worth following
- identify constraints that the change must respect

Do not plan from abstractions alone. Ground major decisions in actual files.

## Plan Content

Plans document your understanding. Include what matters for this task:

- **Current State**: What exists today — relevant files, data flows, constraints, existing patterns
- **Changes**: Every file to create/modify/delete, how changes connect
- **Decisions**: Why this approach, tradeoffs, assumptions
- **Scope checklist**: Concrete implementation items that can be marked done or not done
- **Acceptance criteria**: What must be true when each step is "done"
- **Test cases**: For behavioral changes, include input -> expected output examples
- **Non-Goals**: Explicitly out of scope to prevent implementation drift

Use ASCII diagrams when they clarify flow, layering, or state.

Distill the requirements and clarifications into a clean plan document. Do not turn the plan into a transcript dump.

## Self-Review Before Finalizing

Before presenting the plan, verify against real code:

- existing controls
- state invariants
- transaction boundaries for multi-write operations
- verification executability with current tooling

## Rules

- No TBD
- No "we'll figure it out during implementation"
- No literal code unless the user explicitly wants it
- No pretending you verified something you didn't
- Approved scope must be explicit enough to act as an execution contract after user approval
- If the user approves the plan, do not silently defer or drop checklist items later; discuss any proposed scope change first

If the change touches durable project behavior, include docs/workspace updates in the plan.
Write or update the durable plan doc under `.waypoint/plans/` as part of the skill, not as an optional follow-up.

## External APIs

If an external API or library is relevant, read the actual upstream docs before finalizing the plan. Prefer the repo's external-doc links or URL registry when one exists. Read the real source docs; do not copy vendor reference material into the repo unless the user explicitly wants a durable local note.

## Plan Shape

A good durable plan doc usually includes:

1. Current state
2. Proposed changes
3. Decisions and tradeoffs
4. Scope checklist
5. Acceptance criteria
6. Verification
7. TL;DR

## Final Response

When the plan doc is written:

- give a short chat summary
- include the doc path
- call out any unresolved decisions that still need the user's input
- if there are no unresolved decisions and the user approves the plan, treat that approval as authorization to execute the plan end to end rather than asking again at each obvious next step
- once approved, use the plan's checklist and acceptance criteria to decide whether the work is actually done; if anything approved is skipped, report that as partial work or ask to change scope instead of calling it complete

## Quality Bar

If the plan would make the implementer ask "where does this hook in?" or "what exactly am I changing?", it is not done.

## Gotchas

- Do not spend interview turns on implementation facts that are already in the code or routed docs.
- Do not stop exploring just because you have a plausible plan. The usual failure mode is shallow repo understanding.
- Do not leave unresolved architecture or product decisions hidden behind "we can figure that out during implementation."
- Do not dump a transcript into the plan doc. Distill the decisions and requirements into a clean implementation handoff.
- Do not treat a reviewed plan as a stopping point. Once the user approves it, the workflow expects execution to continue.

## Keep This Skill Sharp

- Add new gotchas when the same planning blind spot, under-explored area, or vague plan failure keeps recurring.
- Tighten the description if the skill fires on tiny tasks or misses real prompts about migrations, refactors, and implementation-ready design work.
- If planning keeps depending on the same durable context or external reference paths, encode that routing into the skill instead of rediscovering it in chat.
