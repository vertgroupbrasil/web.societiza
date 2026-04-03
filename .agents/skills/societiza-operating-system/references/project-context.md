# Project Context

Societiza is a B2B SaaS for Brazilian accounting firms that manage corporate
processes through workflows and kanban-like stages.

Core concepts:

- `Accountancy`: the accounting firm using the platform
- `Process`: a corporate process for a client company
- `Workflow template`: reusable process structure
- `Step` or `Stage`: a kanban column
- `Task`: a checklist or form inside a step
- `Field`: an input inside a step or task

The frontend stack is centered on:

- Next.js App Router
- React 19
- TypeScript strict mode
- TanStack Query
- Zod
- react-hook-form
- shadcn/ui
- Tailwind
- Sonner

The current project is frontend-first in day-to-day work. Backend exists, but
must only be touched when the user explicitly asks for backend.

