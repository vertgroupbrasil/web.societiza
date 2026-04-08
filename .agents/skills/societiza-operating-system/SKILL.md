---
name: societiza-operating-system
description: Master operating skill for the Societiza project. Use for nearly any Societiza task involving frontend implementation, workflow or template domain work, UI and UX changes, copy, SEO, testing, documentation, code quality, and git workflow. This skill decides which local project skills to consult, always loads societiza-code-rules as the primary frontend code contract, requires Jest and Playwright validation by default, requires detailed feature documentation, and blocks backend work unless the user explicitly asks for backend.
user-invocable: true
argument-hint: '[task or area]'
---

# Societiza Operating System

This is the default operating skill for work inside the Societiza project.

Use it as the first layer for almost any task. Its job is not to replace the
specialized skills. Its job is to decide which specialized skill or combination
of skills must be consulted, while enforcing the project rules that are unique
to Societiza.

## Primary Responsibilities

1. Locate the affected feature, route, or layer before editing anything.
2. Route the task to the correct local skills.
3. Enforce Societiza frontend orchestration while delegating code rules to
   `societiza-code-rules`.
4. Block backend work unless the user explicitly requests backend.
5. Require validation with Jest and Playwright by default.
6. Require detailed feature documentation for relevant changes.
7. Enforce branch, commit, and PR discipline.

## Required Reading Order

Read these references before implementation:

1. `references/project-context.md`
2. `../societiza-code-rules/SKILL.md`
3. `references/skill-routing-matrix.md`

Then read additional references only as needed:

- Workflow or template work: `references/workflow-domain.md`
- Task touches backend boundary: `references/backend-boundary.md`
- Validation plan or closeout: `../societiza-code-rules/references/testing-and-quality.md`
- Docs requirement: `../societiza-code-rules/references/docs-and-readmes.md`
- Git and PR handling: `references/git-and-pr-workflow.md`
- Concrete execution flow: `references/task-playbooks.md`

## Operating Rules

- Always locate the feature before making changes.
- Always load `societiza-code-rules` before implementing frontend code.
- Never improvise structure outside the feature-based architecture.
- Never cross features with brittle relative imports.
- Always prefer the project's aliases.
- Treat schemas as the source of truth when applicable.
- Prefer existing project patterns before inventing a new local pattern.
- Every relevant feature must receive a detailed markdown document in
  `docs/features/`.
- Every code change must try to validate with Jest and Playwright by default.
- If a test does not apply or is broken by legacy issues, say so explicitly in
  the final response and in the PR summary.

## Backend Boundary

Backend is blocked by default.

If the task clearly requires backend but the user did not explicitly ask for
backend:

- do not implement backend changes;
- explain the dependency clearly;
- continue with frontend-only work if that still makes sense;
- otherwise stop at a plan or boundary note.

Only perform backend work when the user explicitly asks for backend.

## Brainstorming Rule

Use `brainstorming` automatically only for:

- new feature discovery;
- UX redesigns with product tradeoffs;
- landing page positioning or major copy direction;
- workflow redesigns that change behavior and mental model.

Do not force `brainstorming` for:

- straightforward bug fixes;
- constrained refactors;
- direct technical implementation where the user already specified the change.

## Skill Routing

Use `references/skill-routing-matrix.md` as the source of truth.

Core routing expectations:

- UI build or redesign: `frontend-design`, `ui-ux-pro-max`
- shadcn component work: `shadcn`
- Next.js architecture work: `next-best-practices`
- marketing copy: `copywriting`
- SEO audit: `seo-audit`
- AI search visibility: `ai-seo`
- SEO pages at scale: `programmatic-seo`
- social media content: `social-content`
- technical frontend review: `audit`
- motion and microinteractions: `animate`
- external interface guideline review: `web-design-guidelines`
- browser flow validation: `webapp-testing`
- advanced TS typing: `typescript-advanced-types`
- React component API design: `vercel-composition-patterns`
- native view transitions: `vercel-react-view-transitions`
- deploy requests: `deploy-to-vercel`
- React Native or Expo: `vercel-react-native-skills`

If multiple skills apply, use the minimum set that fully covers the task.

## Validation Rule

Use `../societiza-code-rules/references/testing-and-quality.md` before closing
work.

Default expectation:

- run Jest for code changes;
- run Playwright for UI, navigation, interaction, or regression-prone flows.

Do not close work with a vague "not tested". State exactly what was run, what
failed, and whether the failure is related to the current change.

## Git and PR Rule

Use `references/git-and-pr-workflow.md`.

Always prefer:

- semantic branch names such as `feat/`, `fix/`, `refactor/`, `docs/`;
- separate commits by responsibility;
- PR bodies that explain the feature, risks, conflicts, and validation.

Do not write low-information PR descriptions.
