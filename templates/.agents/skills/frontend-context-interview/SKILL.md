---
name: frontend-context-interview
description: Gather and persist durable frontend project context when missing or insufficient for implementation or review work. Use this to ask project-level questions about audience, deployment surface, browser/device expectations, accessibility, SEO, localization, analytics obligations, and other durable frontend context that is not clearly documented. This is not a feature-discovery skill.
---

# Frontend Context Interview

Use this skill when relevant frontend project context is missing, stale, contradictory, or too weak to support correct implementation or review decisions.

## Goals

1. identify the missing frontend context that materially affects the work
2. ask only high-leverage questions that cannot be answered from the repo or guidance files
3. persist durable context into the project root guidance file
4. avoid repeated questioning in future tasks

This skill is for project-level operating context, not feature requirements gathering.

## When Not To Use This Skill

- Skip it when the needed context is already clearly documented in `AGENTS.md` or routed docs.
- Skip it for feature-specific UX, copy, flow, or acceptance-criteria questions.
- Skip it for implementation preferences that can be resolved from the codebase.

## When to use

Use this skill when the current task depends on context such as:
- internal tool vs customer-facing product vs public marketing site
- expected scale or traffic patterns
- browser and device support requirements
- accessibility targets
- SEO requirements
- localization or internationalization requirements
- analytics or experimentation requirements
- design-system or branding constraints
- auth or role-based UI expectations
- security or privacy expectations that change frontend behavior

Do not use this skill when the answer is already clearly present in `AGENTS.md`, product docs, or the task itself.
Do not use this skill to ask about feature-specific UX, copy, flows, acceptance criteria, implementation preferences, or detailed product behavior that belongs in planning or normal task clarification.

## Workflow

### 1. Check persisted context first

Inspect the project root guidance files.

Priority:
1. `AGENTS.md`

Look for:
- `## Project Context`
- `## Frontend Context`
- equivalent sections with the same intent

If the existing section is accurate and sufficient, do not interview the user.

### 2. Determine what is actually missing

Only ask questions that materially affect implementation or review choices.

Good triggers:
- the right browser support changes implementation or QA expectations
- accessibility bar changes component and interaction requirements
- public marketing surface vs internal tool changes polish, SEO, and content expectations
- localization changes copy, layout, and component design

Do not ask broad or low-value questions.
Do not ask generic discovery questions that do not affect implementation.
Do not ask feature-specific product questions.

Good project-level question areas include:
- whether the product is internal, customer-facing, partner-facing, or public marketing
- whether there are real users yet or only development/staging use
- expected device mix and browser support
- accessibility expectations or compliance targets
- whether SEO matters for any routes
- whether backward compatibility in user workflows matters

## Gotchas

- Do not re-ask stable context that is already present in `AGENTS.md` or routed docs.
- Do not drift into feature discovery. This skill is about project context that changes implementation or review choices across many tasks.
- Do not persist transient task details into `## Frontend Context`; only save durable deployment and product constraints.
- Do not create a new guidance file if `AGENTS.md` is missing unless the user explicitly asked for that.

## Keep This Skill Sharp

- Add new gotchas when the same frontend-context blind spot or repeated unnecessary question keeps showing up in real work.
- Tighten the description if the skill fires on feature-planning prompts or misses real requests about browser support, accessibility, SEO, or deployment context.
- If the same stable setup facts keep being asked across repos, add sharper routing or persistence guidance instead of leaving that learning in chat.
