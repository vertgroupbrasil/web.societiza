# Feature Documentation

Every relevant feature, rework, or behavioral change must generate a detailed
markdown document inside:

- `docs/features/YYYY-MM-DD-<feature-name>.md`

This is required for:

- new features
- major UX reworks
- workflow or template behavior changes
- structural frontend integrations
- backend-enabled features when backend is explicitly requested

The markdown must cover:

- objective
- business context
- user flow
- architecture and data flow
- components, hooks, services, and schemas involved
- contracts or important types
- edge cases
- validation strategy
- known limitations
- possible conflicts with nearby areas

The PR body should summarize the change, but it does not replace the file in
`docs/features/`.
