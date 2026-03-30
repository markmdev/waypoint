# Waypoint Overview

Waypoint makes Codex better by default for real software work.

Its job is to improve Codex in two directions at once:

- better continuity across sessions
- better default behavior inside the current session

## What Waypoint improves

Waypoint helps a repo in two directions at once:

- it gives the next session real context through visible memory files
- it gives the current session a stronger working style focused on planning,
  diagnosis, progress, review, and verification

It exists because most users should not have to manually repeat the same
standards, planning rules, and review expectations every time they work with
Codex.

Waypoint also gives Codex continuity artifacts that help the next session pick
up cleanly instead of rebuilding context from scratch.

## The Waypoint stance

The default agent should feel like a strong collaborator that is much better
prepared for real project work.

In practice, that means:

- investigate before disclaiming
- ask better questions before implementation starts
- lead with diagnosis and next action
- verify before claiming success
- keep the repo legible for the next agent
- show screenshots when browser or app work is part of what the agent inspected or verified
- use Mermaid in chat when a diagram explains the point more clearly
- improve durable guidance when the user corrects the workflow

## Core pieces

Waypoint combines:

- a repo contract in `AGENTS.md`
- user-scoped `AGENTS.md` for cross-project preferences and standing rules
- project-scoped repo `AGENTS.md` for repo-specific context and constraints
- live operating state in `.waypoint/WORKSPACE.md`
- long-lived project memory in `.waypoint/docs/`
- durable planning docs in `.waypoint/plans/`
- generated routing and context files such as `.waypoint/DOCS_INDEX.md` and
  `.waypoint/context/RECENT_THREAD.md`
- repo-local skills for optional structured workflows
- optional reviewer/helper agents for deliberate second passes

These pieces exist to improve user-visible outcomes:

- better planning
- better code quality
- better review discipline
- better follow-through on large tasks
- better self-improvement over time
- better continuity across sessions

## The design principle

Keep the default mode simple.

The basic loop should be:

1. bootstrap and read the right context
2. investigate the actual problem
3. fix or move the work forward
4. verify the result
5. update durable repo memory when it matters

Heavier rigor should still exist, but as tools:

- plan review
- adversarial review
- ship audits
- trackers
- retrospectives
- pre-PR hygiene

Waypoint also treats corrections as a lasting improvement loop.
If the user corrects behavior, rules, or workflow, the system should update the
right durable layer instead of losing that lesson in chat history. Core always-on
rules belong in `AGENTS.md`; workflow-specific guidance belongs in skills.

## System shape

The system should stay understandable from the repo itself.

That means:

- the core contract stays lean
- workflows live in visible files
- reviews and audits are available when needed
- the repo remains inspectable without hidden machinery

## Practical outcome

If Waypoint is working, the repo should gain:

- explicit memory
- better continuity
- a clearer map of which docs matter and when
- reusable structured workflows
- clearer repo-local operating rules
- a stronger path for learning from user corrections

And the user should feel:

- supported
- unblocked
- clearly informed
- working with a capable collaborator that needs less repeated prompting
