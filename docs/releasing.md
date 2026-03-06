# Releasing Waypoint

## Versioning

Waypoint uses semantic versioning:

- patch: fixes, docs, non-breaking polish
- minor: new commands, new shipped skills, non-breaking scaffold changes
- major: breaking repo contract or upgrade behavior changes

## Release checklist

1. Update `CHANGELOG.md`
2. Run:

```bash
npm run check
```

3. Dry-run the package:

```bash
npm pack --dry-run
```

4. Bump the version in `package.json`
5. Commit the release prep
6. Tag the release:

```bash
git tag vX.Y.Z
```

7. Push branch + tag
8. Publish the npm package
9. Create the GitHub release notes

## Notes

- `prepack` already runs `npm run check`
- the package should ship only `dist`, `templates`, `README.md`, and `LICENSE`

