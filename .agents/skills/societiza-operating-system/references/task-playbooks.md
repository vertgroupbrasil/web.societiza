# Task Playbooks

## New frontend feature

1. Locate the owning feature.
2. Read `societiza-code-rules` first.
3. Route to the right implementation skills.
4. Extend schemas, services, hooks, components in that order when needed.
5. Document the feature.
6. Validate with Jest and Playwright.

## UX or UI refactor

1. Identify whether the change is visual only or behavior plus visual.
2. Use `frontend-design` and `ui-ux-pro-max`.
3. Use `shadcn` if component composition matters.
4. Validate with Playwright.
5. Document behavior and UX changes.

## Integration work inside an existing feature

1. Find the existing service, schema, query, and mutation hooks.
2. Use `societiza-code-rules` as the code-structure contract.
3. Extend the current structure instead of creating parallel patterns.
4. Keep server state logic out of leaf UI where possible.
5. Validate with Jest and Playwright if UI is affected.

## Landing page or copy rewrite

1. Use `copywriting`.
2. Combine with `frontend-design` and `ui-ux-pro-max` if implementation is also
   requested.
3. Document messaging changes if they materially reposition the product.
4. Validate UI flow with Playwright.

## Technical audit or review

1. Use `audit` first.
2. Use `web-design-guidelines` if the request is external-guideline oriented.
3. Do not implement unless the user asked for fixes.

## Motion work

1. Use `animate`.
2. Add `frontend-design` or `ui-ux-pro-max` if motion changes hierarchy or UX.
3. Validate in browser with Playwright.

## Type-heavy refactor

1. Use `typescript-advanced-types`.
2. Keep types aligned with schemas and feature boundaries.
3. Run Jest if type-driven behavior changed.

## Task requires backend but backend was not requested

1. Stop backend implementation.
2. Explain the missing backend dependency clearly.
3. Continue only with frontend-safe improvements if useful.
4. Do not silently extend scope.

## Documentation

1. Create or update `docs/features/YYYY-MM-DD-<feature-name>.md`.
2. Explain business context, architecture, flow, validation, and limitations.

## Branch, commit, PR

1. Choose semantic branch name.
2. Separate commits by responsibility.
3. Write a PR body with summary, risks, conflicts, and validation.
