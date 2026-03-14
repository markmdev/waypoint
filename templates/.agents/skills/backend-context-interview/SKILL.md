---
name: backend-context-interview
description: Gather and persist durable backend project context when missing or insufficient for implementation, architecture decisions, or ship-readiness review. Use when backend choices depend on scale, criticality, compliance, tenant model, compatibility, reliability, security posture, or similar context that is not clearly documented.
---

# Backend Context Interview

Use this skill when relevant backend context is missing, stale, contradictory, or too weak to support correct implementation or review decisions.

## Goals

1. identify the missing backend context that materially affects the work
2. ask only high-leverage questions that cannot be answered from the repo or guidance files
3. persist durable context into the project root guidance file
4. avoid repeated questioning in future tasks

## When to use

Use this skill when the current task depends on context such as:
- internal tool vs public internet-facing product
- expected scale, concurrency, and criticality
- regulatory, privacy, or compliance requirements
- multi-tenant vs single-tenant behavior
- backward compatibility requirements
- uptime and reliability expectations
- migration and rollback risk tolerance
- security posture expectations
- observability or incident response expectations
- infrastructure constraints that materially affect design

Do not use this skill when the answer is already clearly present in `AGENTS.md`, architecture docs, runbooks, or the task itself.

## Workflow

### 1. Check persisted context first

Inspect the project root guidance files.

Priority:
1. `AGENTS.md`

Look for:
- `## Project Context`
- `## Backend Context`
- equivalent sections with the same intent

If the existing section is accurate and sufficient, do not interview the user.

### 2. Determine what is actually missing

Only ask questions that materially affect implementation or review choices.

Good triggers:
- public service vs internal tool changes reliability and security bar
- scale and concurrency change architecture depth and observability expectations
- compatibility requirements change migration and API decisions
- tenant model changes authorization and data-isolation design

Do not ask broad or low-value questions.

### 3. Ask concise grouped questions

Ask the minimum set of questions needed.

Suggested categories:
- product type and exposure
- scale and criticality
- data sensitivity and compliance

Do not ask generic product questions that do not affect backend engineering.
