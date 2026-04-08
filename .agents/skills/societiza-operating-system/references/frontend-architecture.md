# Frontend Architecture

The frontend uses feature-based organization.

Main structure:

- `src/app/` for routes
- `src/features/` for business features
- `src/components/` for shared UI
- `src/routes/endpoints.ts` for centralized API endpoints
- `src/lib/`, `src/hooks/`, `src/types/` for shared support code

Every new feature should follow this shape when applicable:

```txt
src/features/{feature}/
├── schemas/
├── server/
│   ├── services/
│   └── types/
├── hooks/
│   ├── queries/
│   └── mutations/
├── components/
│   └── ui/
├── constants/
└── index.ts
```

Rules:

- Find the existing feature before creating new files.
- Extend the existing feature if the task belongs there.
- Avoid leaking one feature's private implementation into another.
- Prefer project aliases instead of long relative imports.
- Keep data fetching in query hooks and server services, not scattered inside UI.
- Keep schema parsing and type inference close to the feature.
