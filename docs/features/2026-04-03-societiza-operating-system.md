# Societiza Operating System

## Objective

Create a master project skill that standardizes how work is done in Societiza.

This feature does not change product behavior for end users. It changes how the
agent should operate inside the repository.

## Business Context

The project already has many specialized local skills, but they are fragmented.
That creates inconsistency in:

- architecture decisions
- skill selection
- testing expectations
- documentation discipline
- git and PR workflow
- backend scope control

The purpose of this feature is to make the agent behave consistently by default
and route tasks through the correct specialist guidance instead of improvising.

## What Was Added

- a new master skill: `societiza-operating-system`
- modular reference files for project rules
- explicit routing across all local skills currently present in the project
- a strict backend boundary
- a strict testing policy based on Jest and Playwright
- a strict feature documentation policy
- a strict git and PR workflow policy

## Operating Model

The new skill is the first layer for nearly any Societiza task.

Expected flow:

1. locate the feature and layer
2. classify the task
3. route to the right specialized skills
4. enforce project conventions
5. block backend unless explicitly requested
6. require tests
7. require feature documentation
8. enforce branch, commit, and PR hygiene

## Skill Routing Coverage

The feature explicitly accounts for all current local skills:

- ai-seo
- animate
- audit
- brainstorming
- copywriting
- deploy-to-vercel
- frontend-design
- next-best-practices
- programmatic-seo
- seo-audit
- shadcn
- social-content
- typescript-advanced-types
- ui-ux-pro-max
- vercel-composition-patterns
- vercel-react-view-transitions
- web-design-guidelines
- webapp-testing

## Key Rules

- backend is blocked unless the user explicitly asks for backend
- `brainstorming` is not universal; it is only automatic for creative or
  discovery-heavy work
- every relevant feature must produce a markdown document in `docs/features/`
- every code change must try Jest and Playwright by default
- PRs must describe the feature, conflicts, and validation instead of using weak
  summaries

## Files Added

- `.agents/skills/societiza-operating-system/SKILL.md`
- `.agents/skills/societiza-operating-system/agents/openai.yaml`
- `.agents/skills/societiza-operating-system/references/*`
- `docs/features/2026-04-03-societiza-operating-system.md`

## Validation Strategy

For this feature itself, runtime product testing is not applicable because the
change is documentation and agent-operating guidance, not executable product
code.

Validation should be done by exercising the skill with representative prompts:

- landing page work
- workflow-template rework
- frontend-only bugfix
- technical audit
- animation request
- SEO request
- deploy request
- backend-explicit request

## Known Limits

- the project still does not have a separate local skill dedicated only to
  "discover which skill should be used"; that responsibility remains inside the
  master skill for now
- the skill enforces policy, but the quality of execution still depends on the
  selected specialist skill and the clarity of the task
- some existing local skills have stronger workflow opinions than others, so the
  master skill must remain the authority on Societiza-specific boundaries

## Possible Conflicts

- `brainstorming` contains a hard gate for creative work; the master skill must
  use it only in the situations explicitly described, otherwise it can create
  unnecessary friction
- existing habits that skip docs, skip tests, or silently touch backend will now
  be considered out of policy
- future new local skills must be added to the routing matrix, or the master
  skill will become outdated
