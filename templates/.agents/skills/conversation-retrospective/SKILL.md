---
name: conversation-retrospective
description: Harvest durable knowledge, user feedback, skill lessons, and repeated workflow patterns from the active conversation into the repo's existing memory system. Use when the user asks to save what was learned, write down what changed, capture lessons from this thread, update docs or handoff state without more prompting, improve skills that were used or exposed gaps, or record new skill ideas based on repetitive work in the live conversation. Do not use this for generic planning, broad docs audits, or digging through archived session history unless the user explicitly asks for that.
---

# Conversation Retrospective

Use this skill to harvest the active conversation into the repo's existing memory system.

This skill works from the live conversation already in context. Do not go hunting through archived session files unless the user explicitly asks for that.

This is a closeout and distillation workflow, not a generic planning pass or a broad docs audit.

## When Not To Use This Skill

- Skip it for generic planning or implementation design; use the planning workflow for that.
- Skip it for broad docs audits that are not driven by what happened in this conversation.
- Skip it when the user wants archived history analysis rather than the live thread; only dig into old sessions if they explicitly ask.
- Skip it when there is nothing durable to preserve and no skill or workflow lesson to capture.

## Read First

Before persisting anything:

1. Read the repo's main agent guidance and project-context files
2. Read the repo's current durable memory surfaces, such as docs, workspace/handoff files, trackers, decision logs, or knowledge files
3. Read the exact docs, notes, and skill files that the conversation touched

Do not assume the repo uses Waypoint. Adapt to the memory structure that already exists.

## Step 1: Distill Durable Knowledge

Review the current conversation and separate:

- durable project knowledge
- live execution state
- transient chatter
- direct user feedback, corrections, complaints, and preferences

Persist without asking follow-up questions when the correct destination is clear.

Treat explicit user feedback as a high-priority signal. If the user corrected the approach, rejected a behavior, called out friction, or stated a standing preference, prefer preserving that over the agent's earlier assumptions.

Write durable knowledge to the smallest truthful home the repo already uses:

- the main docs or knowledge layer for architecture, behavior, decisions, debugging knowledge, durable plans, and reusable operating guidance
- the repo's standing guidance file for durable project context or long-lived working rules
- the repo's live handoff or workspace file for current state, blockers, and immediate next steps
- the repo's tracker or execution-log layer when the conversation created or materially changed a long-running workstream

If the repo uses doc metadata such as `last_updated`, refresh it when needed.

If the repo has no obvious durable home but the need is clear, create the smallest coherent doc or note that fits the surrounding patterns instead of leaving the learning only in chat.

Do not leave important truths only in chat.

## Step 2: Improve Existing Skills

Identify which skills were actually used in this conversation, or which existing skills clearly should have covered the workflow but left avoidable gaps.

For each used or clearly relevant skill, explicitly decide whether it:

- succeeded
- partially succeeded
- failed

Base that judgment on the actual conversation, especially:

- direct user feedback
- whether the skill helped complete the task
- whether the agent had to work around missing guidance
- whether concrete errors, dead ends, or repeated corrections happened while using it

Distinguish between:

- a skill problem
- an execution mistake by the agent
- an external/tooling failure
- a one-off user preference that should not be generalized

Only change the skill when the problem is truly in the skill guidance.

For each affected skill:

- read the existing skill before editing it
- update only reusable guidance, not one-off transcript details
- add missing guardrails, path hints, failure modes, error-handling guidance, decision rules, or references that would have made the conversation easier to complete
- keep `SKILL.md` concise; prefer targeted structural improvements over turning the skill into a diary

If the environment has both a source-of-truth skill and one or more mirrored or installed copies, update the source-of-truth version and any copies the user expects to stay in sync.

Do not assume there is only one skill location, and do not assume there are many.

## Step 3: Propose New Skills

When the conversation revealed repetitive work that existing skills do not cover well:

- do not silently scaffold a new skill unless the user asked for implementation
- record the proposal in the repo's existing docs or idea-capture layer

If there is no obvious place for durable skill proposals, create a small doc such as `skill-ideas.md` in the repo's normal docs area.

Each proposal should include:

- the repeated workflow or problem
- likely trigger phrases
- expected outputs or side effects
- why existing skills were insufficient

Skip this doc when there is no real new-skill candidate.

## Step 4: Refresh Repo Memory

After changing docs, handoff state, trackers, or skills:

- run whatever repo-local refresh or index step the project uses, if one exists
- otherwise make sure the edited memory surfaces are internally consistent and discoverable

Do not invent a refresh command when the repo does not have one.

## Step 5: Report

Summarize:

- what durable knowledge you saved and where
- which skills you evaluated and whether they succeeded, partially succeeded, or failed
- which skills you improved
- which concrete errors, failure modes, or repeated friction points you captured
- which new skill ideas you recorded, if any
- what you intentionally left unpersisted because it was transient

If no substantive persistence changes were needed, say that explicitly instead of inventing updates.

## Gotchas

- Do not turn this skill into a transcript dump. Persist only durable knowledge, live state, or reusable lessons.
- Do not scatter the same learning across multiple files. Pick the smallest truthful home the repo already uses.
- Do not blame a skill for a problem that was really an execution mistake or an external tool failure.
- Do not preserve one-off user phrasing or temporary frustration as if it were standing repo policy unless the user clearly framed it that way.
- Do not go hunting through archived session files just because the live thread feels incomplete. This skill should work from the current conversation unless the user explicitly broadens the scope.

## Keep This Skill Sharp

- After meaningful retrospectives, add new gotchas when the same persistence mistake, memory-placement mistake, or skill-triage mistake keeps recurring.
- Tighten the description if the skill misses real prompts like "save what we learned here" or fires on requests that are really planning or docs-audit work.
- If the same kind of durable learning keeps needing a custom destination, add that routing guidance to the skill instead of leaving the decision to be rediscovered in chat.
