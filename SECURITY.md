# Security Policy

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability. Contact the project maintainer privately with a description, reproduction steps, affected route or component, and the potential impact. No security contact address is configured in this assignment repository, so obtain the maintainer's private contact channel before sending sensitive details.

## Development requirements

- Keep `.env` and provider credentials local.
- Use a unique high-entropy `JsonWebToken` value outside local development.
- Do not include passwords, JWTs, OTPs, API keys, or database URLs in logs, screenshots, fixtures, or pull requests.
- Review authentication, cookie, input-validation, and dependency changes manually.
- Run dependency updates deliberately and inspect their changelog and audit results.

This project is an assignment and is not certified for production security or compliance use.