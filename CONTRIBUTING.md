# Contributing

Thanks for contributing to Waypoint.

## What Waypoint Optimizes For

Waypoint is a Codex-native repository operating system. Contributions should improve one or more of these:

- repo legibility for the next agent
- quality of the generated scaffold
- quality of the shipped skills
- clarity of the docs-first workflow
- reliability of the CLI and sync flows

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
- If you change the generated repo contract, update the docs.
- If you change shipped skills or role prompts, preserve battle-tested behavior unless there is a strong reason to change it.

## Before submitting

- Run `npm run check`
- Update docs if public behavior changed
- Add a changelog entry if the change is user-visible

