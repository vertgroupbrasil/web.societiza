# Backend Boundary

Backend work is blocked by default.

Only touch backend when the user explicitly asks for backend.

If the task appears to require backend but backend was not requested:

- identify the dependency clearly;
- do not edit backend code;
- continue only with frontend-safe work if possible;
- otherwise stop at a precise boundary note or plan.

Examples of allowed frontend-only handling:

- improve frontend errors for backend failures
- add guards, empty states, or disabled states
- document the missing backend dependency

Examples that remain blocked:

- creating backend endpoints
- changing backend contracts
- editing database, event, or API server code

