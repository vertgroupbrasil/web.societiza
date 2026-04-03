# Workflow Domain

Use this reference whenever the task touches:

- `workflow`
- `workflow-template`
- Societario board behavior
- template builder UX

Key distinctions:

- Active workflow: used during actual process execution
- Draft template: editable copy for changes
- Step: kanban column
- Task: actionable unit inside a step
- Field: step-level or task-level input

Domain expectations:

- Draft and active workflow are not the same state.
- Order matters for steps, tasks, and fields.
- Template editing should follow the mental model of using the workflow.
- Duplicate names can cause publish or mapping problems.
- The frontend should expose useful error states instead of generic failures.

When touching this area, strongly consider:

- `frontend-design`
- `shadcn`
- `next-best-practices`
- `audit`
- `webapp-testing`

