---
name: agi-help
description: Prepare a complete external handoff package for GPT-5.4-Pro in ChatGPT when a task is unusually high-stakes, ambiguous, leverage-heavy, or quality-sensitive and one excellent answer is worth a slower manual loop. Use for greenfield project starts, major refactors, architecture rethinks, migration strategy, big-feature planning, hard product or strategy decisions, and other work where the external model needs full relevant context because it has no access to the repo, files, history, or local tools.
---

# AGI-Help

Use this skill to prepare a high-quality manual handoff for GPT-5.4-Pro.

GPT-5.4-Pro is an external thinking partner, not a connected coding agent. It cannot see the repo, local files, prior discussion, current state, or failed attempts unless you package that context for Mark to send manually in ChatGPT.

The job of this skill is to create a complete handoff bundle that gives GPT-5.4-Pro the best possible chance of producing one exceptional answer.

## What This Skill Owns

This skill owns the preparation step:

- decide whether GPT-5.4-Pro is justified for this task
- collect all relevant context in full
- copy the relevant files into a temporary handoff folder
- write a strong prompt for an external model with zero local context
- tell Mark exactly what to send
- stop and wait for the external response

This skill does **not** send anything itself.

## When To Use This Skill

Use AGI-Help when:

- the task is high-stakes and a weak answer would be costly
- one strong answer is more valuable than a fast back-and-forth loop
- deep synthesis, architecture judgment, strategy, or reframing quality matters more than local tool execution speed
- the task is large enough or important enough that a manual GPT-5.4-Pro pass is worth 20-50 minutes

Typical examples:

- starting a project from scratch
- major refactors or system redesigns
- architecture or migration strategy
- planning a large feature or multi-phase initiative
- resolving hard tradeoffs across product, UX, engineering, and operations
- reshaping positioning, messaging, or strategy where synthesis quality matters a lot
- any other difficult task where Mark explicitly wants the strongest available single response

## When Not To Use This Skill

Do not use it for:

- small or routine edits
- local debugging where filesystem access matters more than abstract reasoning
- simple implementation tasks that are already clear
- requests where a normal answer or normal planning pass is sufficient

## Output

Create a handoff bundle at one of these locations:

- prefer `tmp/agi-help/<timestamp>/` inside the current workspace when that is practical
- otherwise use `~/.codex/tmp/agi-help/<timestamp>/`

The bundle should contain:

```text
tmp/agi-help/<timestamp>/
├── prompt.md
├── manifest.md
├── request-summary.md
└── files/
    └── ...copied source files...
```

### prompt.md

The exact prompt Mark should paste into GPT-5.4-Pro.

### manifest.md

A file-by-file list of what is included and why each file matters.

### request-summary.md

A short operator note for Mark that explains:

- why AGI-Help was used here
- what to paste
- which files to attach
- what kind of answer to ask for

### files/

Copies of every relevant file that should be attached.

## Core Rule: Include All Relevant Context

Do not optimize for brevity by dropping relevant material.

If a file is relevant, include it in full.
If multiple files are relevant, include all of them.
If prior plans, failed attempts, docs, architecture notes, or state files materially change the answer, include them too.
Do not trim the bundle down to only the files that seem to directly answer the question. Include files that define constraints, history, surrounding system behavior, rejected approaches, current state, or any other context that materially changes how GPT-5.4-Pro should reason.

The bottleneck here is not token thrift inside Codex. The bottleneck is giving GPT-5.4-Pro enough real context to reason well.

Curate relevance aggressively. Compress relevance only by excluding things that truly do not matter.
Do **not** compress relevant context just because it is long.

## Workflow

### 1. Justify AGI-Help

Before building the bundle, write 3-6 bullets in `request-summary.md` explaining why GPT-5.4-Pro is warranted here.

Focus on why:

- the task is unusually important, difficult, or leverage-heavy
- the answer needs deep synthesis, design judgment, or strategy
- normal local iteration is likely to be weaker than one high-quality external pass

### 2. Reconstruct The Full Situation

Assume GPT-5.4-Pro knows nothing.

Collect the context it would need to reason well, such as:

- what the project, company, system, or situation is
- who the users are
- what the current state is
- what we want to achieve
- why this matters now
- what constraints exist
- what tradeoffs matter
- what has already been tried
- what is blocked, unclear, risky, or contentious
- what a successful answer would help us decide or do next

This is not a fixed checklist. Include whatever materially changes the quality of the answer.

### 3. Copy The Relevant Files

Create `files/` and copy in the relevant source material.

The standard is completeness, not minimality.
If a file materially affects the question, the answer, the constraints, or the reasoning path, include it even when it is only indirectly relevant.

Examples of relevant files:

- core implementation files
- supporting files that materially change the reasoning, even if they do not directly answer the question
- architecture docs
- plans
- active plan or workspace files
- config files
- failing or partial implementations
- screenshots or exported artifacts when available through the current tool surface
- strategy docs, briefs, drafts, notes, or prior outputs that define the problem

Preserve relative structure inside `files/` when it helps orientation.

### 4. Write manifest.md

For each included file, list:

- copied path inside the bundle
- original path
- why the file matters
- any brief note about how GPT-5.4-Pro should interpret it

Keep this concise but useful.

### 5. Write prompt.md

Write the prompt as if briefing a world-class expert who has zero implicit context.

The prompt should usually include:

1. **Role / framing**
   - who GPT-5.4-Pro should act as for this task
2. **Project or situation context**
   - what this is, who it serves, and how to think about it
3. **Current state**
   - what exists today and what is happening now
4. **Objective**
   - what we need help with
5. **Constraints and tradeoffs**
   - technical, product, operational, organizational, or personal constraints
6. **What has already been tried or considered**
   - prior attempts, rejected options, partial work, or known problems
7. **Attached materials**
   - tell it that files are attached and should be read before answering
8. **Specific request**
   - the concrete question or task
9. **Desired output shape**
   - exactly how the answer should be structured

## Prompt Writing Rules

### Be Exhaustive About Relevant Context

Write enough that GPT-5.4-Pro can reason without guessing the basics.

### Ask For A Concrete Deliverable

Do not ask vague questions like "thoughts?"

Ask for something concrete, such as:

- a recommendation with reasoning
- a detailed architecture proposal
- a refactor or migration plan
- a critique of the current direction
- a better strategy or positioning approach
- a decision memo with tradeoffs and risks

### Specify The Output Format

Tell GPT-5.4-Pro how to respond.

Good example shapes:

- recommendation first, then reasoning, then alternatives, then risks, then implementation plan
- diagnosis, root causes, proposed direction, concrete changes, failure modes, validation plan
- executive summary, strategic recommendation, tradeoffs, suggested next steps, open questions

### Tell It To Read The Attachments First

Explicitly instruct it to review the attached files before answering.

## Final Handoff To Mark

When the bundle is ready, report:

- the bundle path
- why AGI-Help was used here
- the exact file to paste: `prompt.md`
- which files to attach from `files/`
- any note about what kind of response will be most useful when Mark pastes it back

Do not continue into implementation as if GPT-5.4-Pro already answered.
Stop and wait for Mark.

## After Mark Returns With The Response

Once Mark pastes the GPT-5.4-Pro response back into the conversation:

- treat it as a strong external input, not automatic truth
- compare it against the actual repo and current state
- identify where it fits reality, where it conflicts, and what needs adaptation
- turn the useful parts into a concrete plan, decision, or implementation path

## Gotchas

- Do not use this skill just because a task is non-trivial. Use it when answer quality is worth the slower manual loop.
- Do not assume GPT-5.4-Pro knows the repo, current state, history, or constraints.
- Do not omit relevant files just because they are large.
- Do not give GPT-5.4-Pro a vague prompt when a concrete deliverable is needed.
- Do not bury the actual question under context; the prompt needs both deep context and a crisp ask.
- Do not continue as though the external answer has already arrived.

## Keep This Skill Sharp

- Tighten the trigger description if it fires on normal planning or routine coding tasks.
- Add new gotchas when a GPT-5.4-Pro handoff fails because context, constraints, or the requested output shape were incomplete.
- If the same bundle structure or prompt sections keep recurring, strengthen this skill around those patterns instead of rediscovering them each time.
