# Contributing

Thanks for contributing to Waypoint.

## What Waypoint Optimizes For

Waypoint is a collaborator-first repository operating system for Codex.

Good contributions improve one or more of these:

- repo legibility for the next agent
- quality of the generated scaffold
- quality of the shipped skills
- quality of the default collaboration experience
- reliability of the CLI and context-generation flows

## Product guardrails

When in doubt, preserve these principles:

- the default agent should feel smart, direct, and useful
- the core contract should stay lean
- investigation should beat readiness narration
- durable memory should stay explicit and well separated
- heavy procedure should live in optional tools, not in the always-on voice

## Local setup

```bash
npm install
npm run check
```

## Development loop

```bash
npm run dev -- --help
npm test
```

## Contribution rules

- Prefer real files over embedded blobs.
- Keep the generated scaffold legible and reviewable.
- Do not add hidden magic when an explicit file or command would be clearer.
- If you change the generated repo contract, update the docs and tests.
- If you change shipped skills or reviewer prompts, decide whether the behavior belongs in the always-on layer or in an optional tool.
- If a change makes Waypoint more procedural by default, the burden of proof is high.

## Before submitting

- Run `npm run check`
- Update docs if public behavior changed
- Add a changelog entry if the change is user-visible
- Sanity-check that the result still sounds like a collaborator rather than a process manager
