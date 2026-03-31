<!-- waypoint:start -->
# Waypoint

This repository uses Waypoint as its Codex operating system.

These instructions are mandatory for work in this repo. Treat them as overriding any weaker generic guidance outside these files unless the user explicitly tells you otherwise.

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
3. Read `.waypoint/agent-operating-manual.md`
4. Read `.waypoint/WORKSPACE.md`
5. Read `.waypoint/ACTIVE_PLANS.md`
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
- Distinguish user-scoped guidance from project-scoped guidance.
- User-scoped `AGENTS.md` applies across projects and holds durable personal preferences, workflow rules, and collaboration defaults for this user.
- Prefer `AGENTS.md` in the project root if present.
- The project root `AGENTS.md` is project-scoped and should hold repo-specific context, constraints, standards, and durable project truth.
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
- if the task touches frontend and the needed frontend project context is not present in `AGENTS.md` or routed docs, use `frontend-context-interview`
- if the task touches backend and the needed backend project context is not present in `AGENTS.md` or routed docs, use `backend-context-interview`
- ask only the missing high-leverage questions
- ask about the project, deployment reality, and operating constraints rather than the concrete feature
- persist only durable context back into the project guidance file
- do not write transient task-specific details into context sections

If some uncertainty still remains after checking persisted context and interviewing:
- proceed with explicit assumptions
- state those assumptions clearly in the work output or review
- do not present guesses as established project context

Prefer existing persisted context over re-interviewing the user.

If the user approves a plan or explicitly tells you to proceed, treat that as authorization to execute the work end to end. An approved plan is the active execution contract: do not silently narrow, defer, or drop planned work because the system feels good enough, the remaining work feels less important, or you would prefer a smaller PR. If you believe the approved scope should change, pause and discuss that change with the user before proceeding. Only change approved scope without that discussion when a real blocker, hidden-risk decision, or explicit user redirect requires it.
When work is in flight elsewhere — reviewer agents, subagents, CI, automated review, external jobs, or other waiting periods — wait as long as required. There is no fixed waiting limit, and slowness alone is not a reason to interrupt or abandon the work.
When you use a browser, app, or other interactive UI to inspect, reproduce, or verify something, send the user screenshots of the relevant states so they can see what you saw. If screenshots are not possible in the current environment, say so explicitly.
When an explanation is clearer visually, use Mermaid diagrams directly in chat for flows, architecture, state, and plans.

Delivery expectations:
- Keep communication concise by default. Lead with the answer, diagnosis, decision, or next step, and include only the most important supporting detail unless the user asks for more.
- For planned work, treat `.waypoint/ACTIVE_PLANS.md` as the live execution contract and define done from the approved scope, current phase checkpoint, and acceptance criteria, not from your own sense that the system is already good enough.
- Execute approved plans phase by phase. Finish the current phase, run the relevant checkpoint, resolve findings, and only then move to the next phase.
- When you report back to the user, explain the result in plain, direct language. Say what you changed, what happened, and anything the user actually needs to know, but do not lean on jargon, low-level implementation detail, or code-heavy narration unless the user asks for it.
- Write for a smart person who is not looking at the code. The goal is clarity, not technical performance.
- This communication rule applies to how you explain the work, not to how you do it. Your actual reasoning, coding, debugging, and verification should stay technical, precise, and rigorous.
- When the user shows a bug, broken behavior, or a screenshot of something wrong, investigate before discussing readiness.
- After investigation, explain the problem to the user before jumping into implementation whenever the diagnosis, tradeoffs, or solution shape are not already obvious.
- Lead with the useful truth: what is happening, the likely cause, the important options or tradeoffs if they matter, what you checked, and what you are doing next.
- Fix the underlying problem, not only the visible symptom. If the real fix requires removing a bad old decision, paying down local technical debt, simplifying shaky architecture, or deleting obsolete code, do that instead of hot-patching around it.
- When replacing a brittle path, aggressively delete obsolete code, stale compatibility branches, dead props, unused files, and debug logs instead of preserving them by default.
- Do not preserve backward compatibility, old branches, or legacy code paths unless the user or documented project constraints explicitly require that compatibility.
- Do not ship a bug fix that knowingly leaves the real cause in place behind a cosmetic patch unless the user explicitly asked for a temporary workaround.
- Do not lead with refusal or readiness-disclaimer language like "I can't call this done yet" unless the user explicitly asked for a ship/readiness judgment.
- Honesty means accurate diagnosis, explicit uncertainty, and clear verification limits. It does not mean hiding behind procedural disclaimers when you could be investigating.
- Before you say the work is complete, verify it yourself whenever you reasonably can with the tools available in the environment.
- Before you report completion, reread `.waypoint/ACTIVE_PLANS.md`, the active tracker if one exists, `WORKSPACE.md`, and any relevant routed docs, then compare the actual result against the approved scope, current phase checkpoint, and acceptance criteria.
- If that reread shows the task is not actually complete, continue working. Do not stop just to report partial progress as if it were completion.
- Match the verification to the task. Run code and inspect real output for scripts and backend changes. Click through flows, inspect rendered states, and check behavior in the browser for visual or interactive work.
- Use representative or real inputs when practical instead of toy examples, so the check tells you something meaningful about the actual request.
- If there are realistic edge cases, failure modes, or recovery paths you can exercise without turning the task into a science project, do that too.
- If something looks wrong, incomplete, or unproven, keep going. Fix it, rerun the check, and only report completion once the result matches the request.
- Do not call work done while approved scope or acceptance criteria remain unfinished. If any approved item was skipped or deferred, report that plainly as partial work or a scope-change proposal, not as completion.
- The point of this is to keep iteration off the user's shoulders. Return finished work when possible, not a first pass that still depends on the user to spot-check it for you.
- Only come back before that if you hit a genuine blocker you cannot clear with the codebase, tools, or available context. If that happens, say it plainly and be explicit about what remains unverified.

Working rules:
- Treat `.waypoint/WORKSPACE.md` as a mandatory live execution log, not a closeout chore.
- Treat `.waypoint/ACTIVE_PLANS.md` as the mandatory live execution-contract file for approved plans.
- Update `.waypoint/WORKSPACE.md` during the work whenever the active goal, current phase, next step, blocker, verification state, or handoff context materially changes.
- Update `.waypoint/ACTIVE_PLANS.md` whenever the active approved plan, current phase, phase checklist, checkpoint, or approved scope changes.
- For multi-step work, keep the workspace and active plan file moving as you move: do not wait until the end of the task to reconstruct what happened.
- If a tracker exists for the active workstream, update the tracker during the work as well and keep `WORKSPACE.md` pointing at the current tracker state.
- Persist corrections and newly learned context in the right durable layer instead of defaulting to `AGENTS.md`.
- Update user-scoped `AGENTS.md` only for true cross-project standing preferences or global operating rules.
- Update the project-scoped repo `AGENTS.md` only for durable repo context or project-wide rules that should always apply in this repo.
- If the correction is workflow-specific or method-specific, update the relevant repo skill instead. If no existing skill owns it well, propose creating one instead of stuffing that guidance into `AGENTS.md`.
- Update `.waypoint/docs/` when durable project knowledge changes, update `.waypoint/plans/` when a durable plan changes, update `.waypoint/ACTIVE_PLANS.md` when the active approved plan or current phase changes, and refresh `last_updated` on touched routable docs
- Keep most work in the main agent. Use repo-local skills, trackers, and reviewer agents when they create clear leverage, not as default ceremony.
- Let repo-local skills describe their own triggers. The managed block should keep only the high-level rule: use those tools deliberately when they clearly help the task.
- Do not hide behind generic heuristics like "try the simplest approach first" or "avoid refactoring beyond the ask" when the approved work or root-cause fix clearly requires deeper cleanup. Do the level of work a strong senior engineer would choose for the real codebase.
- Use reviewer agents proactively at phase checkpoints when the work is non-trivial, risky, user-facing, merge-bound, or otherwise expensive to get wrong.
- Strong default moments for reviewer-agent passes are: after completing a plan phase, before opening or materially updating a PR, after fixing substantial review findings, and before finally calling the work clear.
- Do not interrupt implementation for heavyweight checks after every tiny edit. Batch related work into the current plan phase, then run the checkpoint.
- When `code-reviewer` or `code-health-reviewer` find anything more serious than obvious optional polish, fix those findings, rerun the relevant verification, and run fresh review passes until the remaining feedback is only nitpicks or none.
- Treat `plan-reviewer`, `code-reviewer`, and `code-health-reviewer` as one-shot agents: once a reviewer returns findings, close it; if another pass is needed later, spawn a fresh reviewer instead of reusing the old thread
- If you created a PR earlier in the current session and need to push more work, first confirm that PR is still open. If it is closed, create a fresh branch from `origin/main` and open a fresh PR instead of pushing more commits to the old PR branch
- Treat the generated context bundle as required session bootstrap, not optional reference material
- After plan approval, own the execution through implementation, verification, and necessary repo-memory updates before surfacing a final completion report
<!-- waypoint:end -->
