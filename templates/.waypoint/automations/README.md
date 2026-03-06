# Automations

Place optional Waypoint automation specs here.

Each file is TOML with fields like:

```toml
id = "daily-doc-garden"
name = "Daily doc garden"
prompt = "Run a lightweight docs maintenance sweep."
rrule = "RRULE:FREQ=WEEKLY;BYHOUR=9;BYMINUTE=0;BYDAY=FR"
execution_environment = "worktree"
status = "ACTIVE"
enabled = true
```

These specs are not consumed directly by Codex. `waypoint sync` converts them into Codex App automation files under `~/.codex/automations/`.

