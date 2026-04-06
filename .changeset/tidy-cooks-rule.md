---
"waypoint-codex": patch
---

Update the `pr-review` skill to handle Codex and CodeRabbit review loops independently.

- Retrigger `@codex review` only when Codex findings were addressed.
- Retrigger `@coderabbitai review` only when CodeRabbit findings were addressed.
- Treat reviewer state from each bot's latest comment (including CodeRabbit `Review triggered` as pending).
- Stop retriggering after the first round where both latest completed reviewer comments contain no major (`P1+`) issues, then perform terminal cleanup.
