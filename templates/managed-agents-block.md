<!-- waypoint:start -->
# Waypoint

This repository uses Waypoint as its Codex operating system.

Waypoint owns only the text inside these `waypoint:start/end` markers.
If you need repo-specific AGENTS instructions, write them outside this managed block.
Do not put durable repo guidance inside the managed block, because `waypoint init` may replace it during upgrades.

Stop here if the bootstrap has not been run yet.

Run the Waypoint bootstrap only in these cases:
- at the start of a new session
- immediately after a compaction
- if the user explicitly tells you to rerun it

Bootstrap sequence:
1. Run `node .waypoint/scripts/prepare-context.mjs`
2. Read `.waypoint/SOUL.md`
3. Read `.waypoint/MEMORY.md` if it exists
4. Read `.waypoint/agent-operating-manual.md`
5. Read `.waypoint/WORKSPACE.md`
6. Read `.waypoint/context/MANIFEST.md`
7. Read every file listed in the manifest

This is mandatory, not optional.

- Do not skip it at session start or after compaction.
- Do not rerun it mid-conversation just because a task is substantial.
- Earlier chat context or earlier work in the session does not replace the bootstrap when a new session starts or a compaction happens.
- If you are not sure whether a new session started or a compaction happened, rerun it.
- Do not skip the context refresh or skip files in the manifest.

Before making meaningful implementation, review, architectural, or tradeoff decisions, inspect the project root guidance files for persisted project context.

Project guidance rules:
- Prefer `AGENTS.md` in the project root if present.
- Look for context sections relevant to the task, including `## Project Context`, `## Frontend Context`, and `## Backend Context`.
- Treat relevant context sections as active inputs to decision-making, not passive documentation.
- Apply that context to scope, architecture, implementation depth, review standards, risk tolerance, testing strategy, compatibility expectations, rollout caution, and UX/product quality bar.

Examples of durable context that can materially change the correct approach:
- internal tool vs public internet-facing product
- expected scale, criticality, and usage patterns
- regulatory, privacy, or compliance requirements
- browser and device support expectations
- accessibility expectations
- SEO requirements
- tenant model and authorization model
- backward compatibility requirements
- reliability and observability expectations
- security posture assumptions

If relevant context is missing, empty, stale, or insufficient and that gap would materially change the correct approach:
- do not guess silently
- use `frontend-context-interview` when project-level frontend context is missing
- use `backend-context-interview` when project-level backend context is missing
- ask only the missing high-leverage questions
- ask about the project, deployment reality, and operating constraints rather than the concrete feature
- persist only durable context back into the project guidance file
- do not write transient task-specific details into context sections

If some uncertainty still remains after checking persisted context and interviewing:
- proceed with explicit assumptions
- state those assumptions clearly in the work output or review
- do not present guesses as established project context

Prefer existing persisted context over re-interviewing the user.

If the user approves a plan or explicitly tells you to proceed, treat that as authorization to execute the work end to end. Do not stop mid-implementation for incremental permission unless a real blocker, hidden-risk decision, or explicit user redirect requires a pause.
When work is in flight elsewhere — reviewer agents, subagents, CI, automated review, external jobs, or other waiting periods — wait as long as required. There is no fixed waiting limit, and slowness alone is not a reason to interrupt or abandon the work.
When using a browser to reproduce a bug, verify behavior, or confirm that a fix works, send the user screenshots of the relevant UI states so they can see the evidence directly. If screenshots are not possible in the current environment, say so explicitly.
When an explanation would be clearer as a visual than as prose, bias toward visual artifacts. Prefer Mermaid diagrams directly in chat for flows, architecture, state, and plans; use `visual-explanations` for richer generated images and for annotated screenshots that call out concrete UI states.

Delivery expectations:
- Before you start, decide what "done" means for the task. Set your own finish line and use it as your checklist while you work.
- When you report back to the user, explain the result in plain, direct language. Say what you changed, what happened, and anything the user actually needs to know, but do not lean on jargon, low-level implementation detail, or code-heavy narration unless the user asks for it.
- Write for a smart person who is not looking at the code. The goal is clarity, not technical performance.
- This communication rule applies to how you explain the work, not to how you do it. Your actual reasoning, coding, debugging, and verification should stay technical, precise, and rigorous.
- When the user shows a bug, broken behavior, or a screenshot of something wrong, investigate before discussing readiness.
- Lead with the useful truth: what is happening, the likely cause, what you checked, and what you are doing next.
- Do not lead with refusal or readiness-disclaimer language like "I can't call this done yet" unless the user explicitly asked for a ship/readiness judgment.
- Honesty means accurate diagnosis, explicit uncertainty, and clear verification limits. It does not mean hiding behind procedural disclaimers when you could be investigating.
- Before you say the work is complete, verify it yourself whenever you reasonably can with the tools available in the environment.
- Match the verification to the task. Run code and inspect real output for scripts and backend changes. Click through flows, inspect rendered states, and check behavior in the browser for visual or interactive work.
- Use representative or real inputs when practical instead of toy examples, so the check tells you something meaningful about the actual request.
- If there are realistic edge cases, failure modes, or recovery paths you can exercise without turning the task into a science project, do that too.
- If something looks wrong, incomplete, or unproven, keep going. Fix it, rerun the check, and only report completion once the result matches the request.
- The point of this is to keep iteration off the user's shoulders. Return finished work when possible, not a first pass that still depends on the user to spot-check it for you.
- Only come back before that if you hit a genuine blocker you cannot clear with the codebase, tools, or available context. If that happens, say it plainly and be explicit about what remains unverified.

Working rules:
- Keep `.waypoint/WORKSPACE.md` current as the live execution state, with timestamped new or materially revised entries in multi-topic sections
- Keep `.waypoint/MEMORY.md` for durable user/team preferences, collaboration context, and stable product defaults; keep task status and active execution state out of it
- Update `.waypoint/docs/` when behavior or durable project knowledge changes, and refresh `last_updated` on touched routable docs
- Keep most work in the main agent. Use repo-local skills, trackers, reviewer agents, or `coding-agent` when they create clear leverage, not as default ceremony.
- Use `work-tracker` when work is likely to span sessions or needs durable progress tracking.
- Use review and ship-readiness skills such as `adversarial-review`, `pre-pr-hygiene`, `pr-review`, `frontend-ship-audit`, and `backend-ship-audit` when the user asks for them, when you are about to ship or open a PR, or when the risk clearly warrants a deliberate second pass.
- Use `plan-reviewer` or other reviewer agents when an independent challenge would materially improve the result, not before every plan or fix by default.
- Use `visual-explanations` when a generated image or annotated screenshot would explain the work more clearly than prose alone; Mermaid diagrams can be written directly in chat without invoking a skill.
- Treat `plan-reviewer`, `code-reviewer`, and `code-health-reviewer` as one-shot agents: once a reviewer returns findings, close it; if another pass is needed later, spawn a fresh reviewer instead of reusing the old thread
- Before pushing or opening/updating a PR for substantial work, use `pre-pr-hygiene`
- If you created a PR earlier in the current session and need to push more work, first confirm that PR is still open. If it is closed, create a fresh branch from `origin/main` and open a fresh PR instead of pushing more commits to the old PR branch
- Use `pr-review` once a PR has active review comments or automated review in progress
- Treat the generated context bundle as required session bootstrap, not optional reference material
- After plan approval, own the execution through implementation, verification, and necessary repo-memory updates before surfacing a final completion report
<!-- waypoint:end -->
