---
summary: Waypoint internal release operations — package publishing, Changesets workflow, required secrets, and maintenance notes
last_updated: "2026-03-16 11:53 PDT"
read_when:
  - waypoint release operations
  - waypoint npm publish
  - waypoint release process
  - waypoint changesets
---

# Waypoint Release Operations

This is the internal release note for how Waypoint is meant to ship.

## Chosen model

Waypoint uses **Changesets**.

Reasoning:

- releases should not happen on every push to `main`
- user-visible changes should carry explicit release intent
- version bumps and release notes should be reviewable

## Public flow

1. contributor adds a changeset
2. changeset lands on `main`
3. GitHub Actions opens or updates a release PR
4. merge the release PR
5. package publishes to npm

## Operator expectation

When asked to "release" Waypoint, the job is not done at a local version bump or local package validation.

The expected outcome is:

1. the repo is in a release-ready committed state
2. the release commit or release PR lands on `main`
3. the GitHub release workflow runs
4. the npm package is actually published, or the operator reports the exact blocking failure

Default to the GitHub-driven publish path when it is configured and available. Treat direct local `npm publish` as a fallback for workflow failures or when the user explicitly wants a manual publish.

## Secrets

- `NPM_TOKEN`

## GitHub release automation requirements

The release workflow also needs the repository setting that allows GitHub Actions to create pull requests.

Even with `pull-requests: write` in `.github/workflows/release.yml`, Changesets cannot open the release PR if the repo-level Actions setting still forbids PR creation.

If that setting is disabled:

- the GitHub-driven release-PR path will fail with `GitHub Actions is not permitted to create or approve pull requests`
- local `npm whoami` may still be unauthenticated, so local direct publish is not necessarily the best fallback
- the practical fallback is to run `npm run version-packages` locally, commit the generated version bump to `main`, and let the release workflow publish the versioned package on push using the stored `NPM_TOKEN`

## Current package name

- `waypoint-codex`

## Important note

The npm package's `bin` entry is routed through `bin/waypoint.js`, not directly to `dist/src/cli.js`, to avoid npm stripping the command during publish validation.

## If automation breaks

Fallback:

```bash
npm run check
npm pack --dry-run
npm publish --access public
```
