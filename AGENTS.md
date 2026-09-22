# Agent Instructions

## Scope

- Keep application code under `src/` and validation utilities under `scripts/`.
- Preserve the existing CommonJS, Express, Mongoose, and EJS architecture unless a task explicitly requests a migration.
- Do not edit `node_modules`, vendored files under `src/public/vendor`, `.env`, or generated lockfile content without a specific reason and review.
- Do not commit secrets, user data, or local database files.

## Workflow

1. Read the route, model, or view that owns the requested behavior before editing.
2. Make the smallest change that preserves existing route names and rendered view contracts.
3. Run `npm run check` after JavaScript changes.
4. Run the relevant application flow with MongoDB available for changes involving persistence or authentication.
5. Record any unrun checks and external-service prerequisites in the pull request.

## Code conventions

- Use the existing CommonJS module style and four-space indentation.
- Keep request validation at the route/model boundary and avoid logging credentials, tokens, or personal data.
- Handle asynchronous failures and return one response per request.
- Keep secrets in environment variables; update `.env.example` when a new variable is required.
- Preserve public route paths and view data names unless the task includes a compatibility change.

## Safety boundaries

Human approval is required before changing authentication, cookie settings, database schema/data, deployment configuration, dependency versions, or external-provider behavior. Never run destructive database commands or rotate/revoke credentials as part of an automated change.