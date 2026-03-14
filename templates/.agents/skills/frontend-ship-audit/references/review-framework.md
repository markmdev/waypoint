# Frontend ship-readiness review framework

Use these lenses to decide whether the scoped frontend is safe and complete enough to ship.

## Reading order

1. Read root guidance and product docs.
2. Read route entry points, layouts, and page or screen composition.
3. Read state, data fetching, API clients, validation, and mutation paths.
4. Read design-system, styling, accessibility, metadata, analytics, and auth helpers that affect the scope.
5. Read tests that exercise the scoped behavior.
6. Read adjacent docs or runbooks when they explain production expectations.

## Core evaluation lenses

### Scope and architecture fit
- Check whether the implementation boundary matches the requested surface.
- Check whether route, page, and component boundaries are legible and coherent.
- Check whether critical behavior is spread across too many layers or hidden behind implicit defaults.

### User journey completeness
- Trace main happy paths, edge paths, entry paths, exits, and return paths.
- Check loading, empty, error, retry, disabled, unauthorized, and success states.
- Check whether failures are visible and actionable rather than silent.

### Boundary correctness
- Verify request and response assumptions at frontend boundaries.
- Check parsing, validation, null handling, optimistic updates, stale data handling, retries, and race conditions.
- Check whether the UI assumes fields, permissions, or states that the backend does not guarantee.

### State and rendering correctness
- Check whether state ownership is clear.
- Check whether derived state duplicates server state or causes drift.
- Check whether effects, memoization, and conditional rendering create stale UI, loops, or hydration mismatches.

### Forms and input correctness
- Verify validation rules, error surfacing, submission gating, retry behavior, and server error handling.
- Check whether defaults, formatting, and field constraints match product expectations.

### Responsiveness and device fit
- Check whether layouts, interactions, and content density hold across required breakpoints and device classes.
- Check tap target sizes, overflow, sticky elements, keyboard overlap, and modal behavior on smaller screens.

### Accessibility
- Check semantic structure, labels, accessible names, focus order, focus visibility, keyboard access, screen-reader announcements, and dialog or popover behavior.
- Check whether error messaging and status changes are perceivable.
- Treat critical accessibility failures as real ship risk.

### Visual and interaction quality
- Check whether design-system primitives are used consistently where required.
- Check whether states provide clear feedback and whether destructive or irreversible actions are appropriately signaled.
- Do not flag visual issues that are purely stylistic unless they affect usability, consistency, or release confidence.

### Auth, authorization, security, and privacy
- Check whether privileged UI states are exposed to the wrong roles.
- Check whether secrets, tokens, PII, or internal data are exposed in client code, storage, logs, analytics payloads, or rendered markup.
- Check whether client-side behavior could mislead users about authorization.

### Performance and delivery risk
- Check route-level loading strategy, bundle pressure, unnecessary client rendering, hydration risk, redundant requests, and expensive re-renders where relevant.
- Check whether performance expectations or budgets are violated for the target surface.

### SEO, metadata, analytics, and observability
- Check metadata, canonical handling, structured data, crawlability, and rendering mode when the scope is indexable.
- Check event wiring, experiment exposure, and required tracking for key journeys.
- Check whether failures have enough logging or observability to support release confidence when relevant.

### Maintainability as ship risk
- Flag overengineering, underengineering, hidden coupling, or silent fallback behavior when they create near-term release risk.
- Ignore refactor ideas that do not materially affect shipping confidence.

## Risk heuristics

Raise priority when the issue is likely to:
- break the primary journey
- mis-handle auth or roles
- hide errors or create silent failure
- expose private or unsafe data
- strand keyboard or screen-reader users
- fail on a required browser or device class
- create high-probability production regressions due to unclear ownership or boundary assumptions

Lower priority when the issue is isolated, recoverable, obvious to users, or only affects non-critical polish.
