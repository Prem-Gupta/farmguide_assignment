# Contributing

## Before opening a pull request

- Explain the user-visible behavior and affected routes, models, or views.
- Keep changes focused and avoid committing secrets or generated/vendor files.
- Run `npm ci` and `npm run check`.
- For database or authentication changes, test the affected flow with a local MongoDB instance and describe the setup used.
- Add or update automated tests when changing behavior. The repository does not yet contain a test suite, so new tests should establish the pattern for the area they cover.

## Pull requests

Use a focused branch and provide:

- A concise summary of the change
- Validation commands and their results
- Configuration or migration notes
- Known limitations and follow-up work

Do not merge changes that expose secrets, bypass authentication, or alter persisted data without explicit review.