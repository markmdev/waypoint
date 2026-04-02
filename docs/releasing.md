# Releasing Waypoint

## Versioning

Waypoint uses semantic versioning:

- patch: fixes, docs improvements, non-breaking polish
- minor: new commands, new shipped skills, or meaningful non-breaking scaffold changes
- major: breaking changes to the repo contract, scaffold shape, or upgrade expectations

## Release workflow

Waypoint uses **Changesets**.

Normal flow:

1. a user-visible change lands with a changeset file in `.changeset/`
2. when those changesets reach `main`, the `Release` GitHub Action runs `changesets/action`
3. that workflow handles version/changelog commits or publishing, depending on pending changesets state and config

This keeps releases explicit.

### Important: local publish expectation

Treat npm publishing as **GitHub Actions-owned** for this repo.

- Do not assume local `npm publish` will succeed.
- A local publish failure (auth/permission) is not a release failure if the `Release` workflow on `main` succeeds.
- Confirm the release via GitHub Actions run status and `npm view waypoint-codex version`.

## What counts as user-visible

For Waypoint, user-visible changes include more than CLI behavior.

They also include:

- changes to the default scaffold
- changes to the always-on prompt contract
- changes to shipped skills
- changes to reviewer-agent behavior
- changes to how the product positions itself in the docs

If a release changes how Waypoint feels to use, treat that as a real product change.

## Local author workflow

For a user-visible change:

```bash
npm run changeset
```

Commit the changeset file with the code and doc changes.

## Release checklist

Before releasing:

1. make sure the docs still match the actual scaffold
2. make sure the scaffold still matches the intended product philosophy
3. run:

```bash
npm run check
```

4. dry-run the package:

```bash
npm pack --dry-run
```

## Notes

- `prepack` already runs `npm run check`
- the package should ship only `dist`, `templates`, `README.md`, and `LICENSE`
- if a release changes the default behavior, call that out clearly in the changeset and changelog instead of burying it as implementation detail
