# UX State Patterns Reference

Use this file to guide UX state audits.

## Missing loading state

Look for:

- fetch starts and nothing changes visually
- button-triggered async action with no pending state
- form submission with no disabled or in-progress signal

## Missing empty state

Look for:

- empty lists rendering blank space
- search results with no explanation when empty
- dashboard widgets vanishing instead of explaining that no data exists

## Missing error state

Look for:

- fetch failure rendering the same as loading
- mutation failure with no user-visible feedback
- components returning blank/null on failure

Quality bar:

- use the repo's established UI primitives
- implement all three states where relevant
- favor clarity over decorative treatment

