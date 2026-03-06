# Changesets

Waypoint uses Changesets for release management.

Contributors add a changeset for user-visible changes:

```bash
npm run changeset
```

That creates a markdown file in `.changeset/` describing:

- the release bump level
- a short human-readable summary

When changesets land on `main`, GitHub Actions opens or updates a release PR.
Merging that release PR publishes the package and creates the release commit.

