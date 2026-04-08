# Skill Routing Matrix

This is the source of truth for task classification and skill selection.

## Single-skill defaults

| Task shape                      | Primary skill                   |
| ------------------------------- | ------------------------------- |
| Marketing copy rewrite          | `copywriting`                   |
| SEO diagnosis                   | `seo-audit`                     |
| AI search visibility            | `ai-seo`                        |
| SEO pages at scale              | `programmatic-seo`              |
| Social post or campaign content | `social-content`                |
| Technical frontend audit        | `audit`                         |
| Add purposeful motion           | `animate`                       |
| Browser-based validation        | `webapp-testing`                |
| Advanced typing work            | `typescript-advanced-types`     |
| React component API refactor    | `vercel-composition-patterns`   |
| View transitions                | `vercel-react-view-transitions` |
| Deploy request                  | `deploy-to-vercel`              |
| React Native or Expo            | `vercel-react-native-skills`    |
| Creative feature discovery      | `brainstorming`                 |

## Common combinations

| Task shape                              | Skill set                                            |
| --------------------------------------- | ---------------------------------------------------- |
| New page or redesign                    | `frontend-design` + `ui-ux-pro-max`                  |
| shadcn-heavy UI work                    | `frontend-design` + `shadcn`                         |
| Next.js route or App Router work        | `next-best-practices` + relevant primary skill       |
| Landing page                            | `copywriting` + `frontend-design` + `ui-ux-pro-max`  |
| Workflow UX change                      | `frontend-design` + `shadcn` + `next-best-practices` |
| Technical UI review                     | `audit` + `web-design-guidelines`                    |
| Animated redesign                       | `frontend-design` + `ui-ux-pro-max` + `animate`      |
| Real browser validation after UI change | primary implementation skill + `webapp-testing`      |

## Brainstorming policy

Use `brainstorming` automatically only when the task involves:

- defining a new feature;
- choosing between multiple product or UX directions;
- large copy or landing repositioning;
- redesigning a user flow with behavior tradeoffs.

Do not force `brainstorming` for:

- constrained bug fixes;
- straightforward implementation;
- direct code cleanup;
- narrow technical tasks.

## Prohibited or conditional use

- Do not use `deploy-to-vercel` unless the user asked for deployment.
- Do not use `vercel-react-native-skills` for regular web tasks.
- Do not use backend work at all unless the user explicitly asked for backend.
- Do not combine many skills if one or two fully cover the task.
