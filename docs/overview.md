# Waypoint Overview

Waypoint is a collaborator-first repository operating system for Codex.

Its job is to make agents better in two directions at once:

- better continuity across sessions
- better default behavior inside the current session

## The problem it is solving

Agent setups usually fail in one of two ways.

The first failure mode is memory:

- important context lives only in chat
- the next session starts half-blind
- the agent does not know which docs matter

The second failure mode is process:

- too much workflow lives in the always-on prompt
- the agent starts narrating readiness instead of investigating
- reviews, trackers, and closeout rituals start feeling like personality instead of tools

Waypoint is designed to solve both.

## The Waypoint stance

The default agent should feel like a strong collaborator.

In practice, that means:

- investigate before disclaiming
- lead with diagnosis and next action
- verify before claiming success
- keep the repo legible for the next agent

## Core pieces

Waypoint combines:

- a repo contract in `AGENTS.md`
- durable user/team memory in `.waypoint/MEMORY.md`
- live operating state in `.waypoint/WORKSPACE.md`
- durable project memory in `.waypoint/docs/`
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
