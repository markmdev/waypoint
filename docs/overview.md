# Waypoint Overview

Waypoint is a collaborator-first repository operating system for Codex.

Its job is to make agents better in two directions at once:

- better continuity across sessions
- better default behavior inside the current session

## What Waypoint improves

Waypoint helps a repo in two directions at once:

- it gives the next session real context through visible memory files
- it gives the current session a clear working style focused on diagnosis, progress, and verification

## The Waypoint stance

The default agent should feel like a strong collaborator.

In practice, that means:

- investigate before disclaiming
- lead with diagnosis and next action
- verify before claiming success
- keep the repo legible for the next agent
- show screenshots when browser or app work is part of what the agent inspected or verified
- use Mermaid in chat when a diagram explains the point more clearly

## Core pieces

Waypoint combines:

- a repo contract in `AGENTS.md`
- durable user/team memory in `.waypoint/MEMORY.md`
- live operating state in `.waypoint/WORKSPACE.md`
- long-lived project memory in `.waypoint/docs/`
- durable planning docs in `.waypoint/plans/`
- generated routing and context files
- repo-local skills for optional structured workflows
- optional reviewer/helper agents for deliberate second passes

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
- reusable structured workflows
- clearer repo-local operating rules

And the user should feel:

- supported
- unblocked
- clearly informed
- working with a capable collaborator
