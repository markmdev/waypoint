---
name: backend-context-interview
description: Fill missing backend project context that materially changes engineering decisions. Use when durable backend facts like exposure, scale, criticality, compatibility, tenant model, security, observability, or compliance are not already clear in `AGENTS.md` or routed docs.
---

# Backend Context Interview

Use this skill to fill in missing backend operating context only when that context materially changes the right engineering choices.

This skill is for durable project truth, not for feature planning. It should reduce repeated questioning, not create a habit of interviewing the user every time a backend task appears.

## What This Skill Owns

- identify which backend context facts are still missing after reading the repo guidance
- ask only the smallest set of high-leverage project questions
- persist the durable answers into the project guidance layer
- avoid re-asking the same foundational backend questions later

## When To Use This Skill

Use it when the task depends on backend context such as:

- whether the system is internal, customer-facing, partner-facing, or public
- expected scale, concurrency, workload shape, or job intensity
- reliability, outage, or data-loss tolerance
- tenant model and isolation expectations
- backward compatibility or migration constraints
- security posture or exposure assumptions
- regulatory, privacy, or compliance constraints
- observability, incident response, or audit expectations
- infrastructure or deployment constraints that materially affect design

## When Not To Use This Skill

- Do not use it when the answer is already clearly documented in `AGENTS.md`, architecture docs, runbooks, or durable repo guidance.
- Do not use it for feature-specific behavior, endpoint shapes, UX details, acceptance criteria, or implementation preferences.
- Do not use it as a substitute for planning. If the missing information is really about the feature itself, use planning or normal task clarification instead.

## Workflow

### 1. Read Persisted Context First

- Read `AGENTS.md` first.
- Look for `## Project Context`, `## Backend Context`, or equivalent sections.
- Read the repo docs that are most likely to hold deployment, security, migration, or operating constraints.
- If the existing context is sufficient and credible, stop. Do not interview the user just because the skill triggered.

### 2. Decide What Is Actually Missing

Ask only about facts that would materially change implementation or review choices.

High-value examples:

- internal tool vs public internet-facing product
- low-risk internal automation vs business-critical system
- best-effort batch work vs strict correctness and rollback expectations
- single-tenant assumptions vs hard tenant isolation
- backward compatibility required vs safe to break old contracts

Low-value examples:

- "What should this feature do?"
- "What endpoint shape do you want?"
- "Should I use library X or Y?"

### 3. Ask The Smallest Useful Interview

- Group questions so the user can answer quickly.
- Prefer a few project-level questions over a long checklist.
- Ask only what the repo cannot already tell you.

Good categories:

- product exposure and real users
- scale and criticality
- compatibility and migration safety
- data sensitivity and compliance
- reliability and observability expectations

Good question shapes:

- whether the product is internal, customer-facing, partner-facing, or public
- whether there are real users yet or only dev/staging use
- expected traffic, concurrency, or job/import volume
- whether backward compatibility is required
- how costly outages, data corruption, or security mistakes would be

### 4. Persist Only Durable Answers

- Write durable answers into the project root guidance file, normally `AGENTS.md`.
- Prefer a `## Backend Context` section if one exists.
- If there is no such section, add the smallest coherent backend-context section that matches the repo's guidance style.
- Persist stable operating facts, not one-off task details.
- Keep the wording concrete enough that a later agent can make decisions from it without rereading the whole conversation.

What belongs there:

- exposure level
- scale assumptions
- compatibility expectations
- tenant model
- security/compliance constraints
- reliability bar
- observability expectations

What does not belong there:

- current feature requirements
- temporary blockers
- one-off implementation notes
- chat-only phrasing that will age badly

### 5. Reuse The Saved Context

- After persisting the answers, treat them as the new source of truth for later work.
- Do not ask the same foundational questions again unless the saved context is clearly stale or contradictory.

## Gotchas

- Missing backend context is not the same as missing feature requirements. Do not drift into product discovery.
- If `AGENTS.md` already answers the important questions, stop there. Re-asking stable project questions is wasted user effort.
- Persist only durable operating truth. If the answer only matters for the current task, it does not belong in backend context.
- Do not ask broad "tell me about your backend" questions. Ask the few facts that would actually change architecture, migration, reliability, or security choices.
- If the repo gives partial answers, ask only the delta instead of restating the full questionnaire.

## Keep This Skill Sharp

- After meaningful runs, add new gotchas when the same backend-context confusion or repeated over-questioning happens again.
- Tighten the description if the skill starts firing for feature-planning prompts instead of true project-context gaps.
- If the same persistence pattern or backend-context template keeps getting recreated, move that reusable guidance into this skill instead of relearning it in chat.
