# Importing Existing Repositories

Waypoint can help adopt repositories that already have older assistant scaffolding or repo-memory conventions.

## What imports cleanly

- durable markdown docs
- battle-tested workflow prompts
- reviewer and planning guidance

## What should usually be replaced

- hidden session injection
- hook-specific lifecycle wiring
- transcript-dependent automation
- opaque state files that are hard for the next agent to inspect

## Command

```bash
waypoint import-legacy /path/to/source-repo /path/to/new-repo --init-target
```

This writes an adoption report into `.waypoint/IMPORT_LEGACY.md` and copies legacy docs into `.waypoint/docs/legacy-import/` for review.
