# Naming Conventions

Use the existing project naming patterns.

Rules:

- Feature folders use domain names, not generic buckets.
- Schemas live in `schemas/*.schema.ts`.
- Services live in `server/services/*`.
- Server-side DTO or mutation input types live in `server/types/*`.
- Query hooks live in `hooks/queries/`.
- Mutation hooks live in `hooks/mutations/`.
- Public exports go through `index.ts` when the feature already follows that
  pattern.

Preferred naming:

- `use-{entity}-queries.ts`
- `use-{entity}-mutations.ts`
- `{entity}.schema.ts`
- `{entity}.service.ts`
- `{entity}.types.ts`
- `{entity}.constants.ts`

Component naming:

- feature components are explicit, not generic
- subcomponents go under `components/ui/` when feature-specific
- shared primitives belong under `src/components/`

