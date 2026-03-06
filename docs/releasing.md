# Releasing Waypoint

## Versioning

Waypoint uses semantic versioning:

- patch: fixes, docs, non-breaking polish
- minor: new commands, new shipped skills, non-breaking scaffold changes
- major: breaking repo contract or upgrade behavior changes

## Release workflow

Waypoint uses **Changesets**.

Normal flow:

1. user-visible change lands with a changeset file in `.changeset/`
2. when those changesets reach `main`, GitHub Actions opens or updates a **release PR**
3. merging that release PR publishes the npm package and writes the version/changelog commit

This means:

- not every push to `main` becomes a release
- releases happen when changesets say they should
- version bumps and changelog updates stay explicit

## Local author workflow

For a user-visible change:

```bash
npm run changeset
```

That creates a markdown file describing:

- patch / minor / major
- release notes

Commit that file with the change.

## One-time setup for automation

GitHub repo secrets/settings needed:

- `NPM_TOKEN` — npm automation token with publish rights

The workflow uses:

- `GITHUB_TOKEN` for the release PR
- `NPM_TOKEN` for npm publish

## Manual release checklist

If you ever need to release manually:

1. Run:

1. Update `CHANGELOG.md`
2. Run:

```bash
npm run check
```

3. Dry-run the package:

```bash
npm pack --dry-run
```

2. Dry-run the package:

```bash
npm pack --dry-run
```

3. Publish:

```bash
npm publish --access public
```

## Notes

- `prepack` already runs `npm run check`
- the package should ship only `dist`, `templates`, `README.md`, and `LICENSE`
