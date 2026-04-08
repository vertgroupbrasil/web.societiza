# Git and PR Workflow

Use strict git hygiene.

Branch naming:

- `feat/` for new features
- `fix/` for bug fixes
- `refactor/` for structural improvements
- `docs/` for documentation-only work
- `chore/` only when no better semantic prefix applies

Commit rules:

- separate commits by responsibility;
- do not mix unrelated concerns in one commit if it can be avoided;
- docs, tests, and implementation may be split if the change is large enough to
  justify it.

PR rules:

- explain the feature or fix clearly;
- summarize major changes;
- list known risks, conflicts, or limitations;
- record validation performed;
- avoid empty PR bodies and vague summaries.

If the task is broad and naturally splits into multiple independent workstreams,
the agent should say so and recommend separate branches or clearly separated
commit blocks before implementation.
