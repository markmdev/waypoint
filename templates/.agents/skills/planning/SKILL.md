---
name: planning
description: >
  Interview-driven planning methodology that produces implementation-ready plans.
  Use for new features, refactoring, architecture changes, migrations, or any non-trivial
  implementation work. Ask multiple rounds of clarifying questions about product behavior,
  user expectations, edge cases, and architecture; explore the repo deeply before deciding;
  and do not waste questions on implementation details that can be learned directly from the
  code or routed docs.
---

# Planning

Good plans prove you understand the problem. Size matches complexity — a rename might be 20 lines, a complex feature might be 500.

**The handoff test:** Could someone implement this plan without asking you questions? If not, find what's missing.

## Read First

Before planning:

1. Read `.waypoint/SOUL.md`
2. Read `.waypoint/agent-operating-manual.md`
3. Read `.waypoint/WORKSPACE.md`
4. Read `.waypoint/context/MANIFEST.md`
5. Read every file listed in the manifest
6. Read the routed docs relevant to the task

## Verbatim Requirements

Capture the user's exact words at the top of every plan when the wording matters. No paraphrasing, no compression.

```markdown
## Verbatim Requirements

### Original Request
> [User's ENTIRE message, word for word]

### Clarifications
**Q:** [Your question]
**A:** [User's ENTIRE answer, verbatim]
```

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
- **Acceptance criteria**: What must be true when each step is "done"
- **Test cases**: For behavioral changes, include input -> expected output examples
- **Non-Goals**: Explicitly out of scope to prevent implementation drift

Use ASCII diagrams when they clarify flow, layering, or state.

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

If the change touches durable project behavior, include docs/workspace updates in the plan.
If the plan is meant to outlive the current chat, write or update a durable plan doc under `.waypoint/docs/` and make sure it is discoverable through the routed docs layer.

## External APIs

If an external API or library is relevant, read the actual upstream docs before finalizing the plan. Prefer the repo's external-doc links or URL registry when one exists. Read the real source docs; do not copy vendor reference material into the repo unless the user explicitly wants a durable local note.

## Output

A good final plan usually includes:

1. Current state
2. Proposed changes
3. Decisions and tradeoffs
4. Acceptance criteria
5. Verification
6. TL;DR

## Quality Bar

If the plan would make the implementer ask "where does this hook in?" or "what exactly am I changing?", it is not done.
