---
name: frontend-context-interview
description: Gather and persist durable frontend project context when missing or insufficient for implementation or review work. Use when frontend decisions depend on product type, audience, support matrix, accessibility, SEO, localization, design-system constraints, or similar context that is not clearly documented.
---

# Frontend Context Interview

Use this skill when relevant frontend context is missing, stale, contradictory, or too weak to support correct implementation or review decisions.

## Goals

1. identify the missing frontend context that materially affects the work
2. ask only high-leverage questions that cannot be answered from the repo or guidance files
3. persist durable context into the project root guidance file
4. avoid repeated questioning in future tasks

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
