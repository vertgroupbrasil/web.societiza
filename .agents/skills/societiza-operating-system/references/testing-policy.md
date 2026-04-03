# Testing Policy

Testing is required by default for code changes.

Baseline expectation:

- run Jest for code changes;
- run Playwright for UI, navigation, interaction, or visual regression risk.

Interpretation:

- Jest covers unit and integration behavior when available.
- Playwright covers real browser flow validation.

Playwright is expected when the change touches:

- pages
- dialogs, sheets, drawers, menus
- forms
- navigation
- drag and drop
- toasts or async UI state
- workflow or template interactions

If a test does not apply:

- say why it does not apply.

If a test fails because of legacy issues:

- say exactly what failed;
- say whether it is related to the current change;
- do not hide behind "not tested".

Required closeout format:

- what Jest command was run
- what Playwright flow was run
- what passed
- what failed
- what remains a legacy problem

