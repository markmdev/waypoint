# Frontend Context guidance file update rules

Use these rules when persisting durable frontend context.

## File selection

1. Prefer `AGENTS.md` in the project root.
2. If it does not exist, do not create a new guidance file unless the user explicitly asked for it.

## Section rules

- Target the exact heading `## Frontend Context`.
- Update the existing section when present.
- Otherwise append a new `## Frontend Context` section.
- Preserve all surrounding content exactly.
- Do not alter unrelated sections.
- Do not duplicate facts that already exist in accurate form.
- Do not persist audit findings, one-off bugs, or transient release notes.

## Good content for this section

Persist stable context such as:
- deployment surface and audience
- internal, partner, customer-facing, or public marketing classification
- required browsers and device classes
- accessibility target or compliance expectation
- performance budget or latency expectation
- SEO requirements
- localization requirements
- analytics or experimentation obligations
- design-system or brand constraints
- auth and role-based UI expectations
- privacy and client-side security expectations

## Bad content for this section

Do not add:
- current audit findings
- temporary workarounds
- one-time release decisions
- generic engineering principles unrelated to the frontend deployment context

## Suggested format

Use concise bullets under `## Frontend Context`. Prefer facts and defaults over prose.

Example:

## Frontend Context
- Surface: Public customer-facing web app.
- Devices: Mobile and desktop must both work.
- Browser support: Latest Chrome, Safari, Firefox, and Edge.
- Accessibility: Keyboard-accessible flows and screen-reader-compatible forms are required.
- Performance: Primary routes should remain responsive on mid-range mobile devices.
- SEO: Product and marketing routes require accurate metadata and indexable content.
- Localization: English only for now.
- Analytics: Core conversion events must remain instrumented.
