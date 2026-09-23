# FarmGuide

FarmGuide is an Express and EJS web application for account registration, email login, mobile OTP login, and an authenticated profile page. MongoDB stores users and Vonage handles mobile verification.

## Technology

- Node.js and Express 4
- MongoDB through Mongoose 5
- EJS server-rendered views
- JWT authentication stored in an HTTP cookie
- Vonage/Nexmo Verify API for mobile login

## Repository map

```text
src/index.js              Express application and middleware setup
src/db/mongoose.js        MongoDB connection
src/models/user.js        User schema, password hashing, and JWT methods
src/routers/              Signup, login, profile, and logout routes
src/routers/reports.js    AI repository-readiness report route
src/middleware/auth.js    Authenticated-route middleware
src/views/                EJS pages
src/public/               CSS, browser JavaScript, fonts, and vendored assets
scripts/check-syntax.js   Local and CI JavaScript syntax check
```

## Requirements

- Node.js 18 or newer
- npm
- MongoDB 4 or newer, running locally or reachable through `MongoDB_URL`
- Vonage API credentials for mobile OTP flows

The application currently targets Node's CommonJS runtime. There is no TypeScript build step or frontend bundler.

## Setup

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env`.
3. Set a unique `JsonWebToken` secret and valid MongoDB credentials.
4. Set `apiKey` and `apiSecret` if testing mobile OTP login.
5. Start MongoDB.
6. Run `npm start`.

The default URL is `http://localhost:3004`. Use `npm run dev` for the nodemon workflow, after creating the ignored `config/dev.env` file.

Never commit `.env`, API credentials, JWT secrets, or production connection strings.

## Azure App Service deployment

Deploy this project as a Node.js App Service on Linux. App Service supplies environment variables through **Configuration > Application settings**, so the production `start` script intentionally runs `node src/index.js` without loading `.env`. The current Azure Southeast Asia runtime list supports Node 22 LTS for this app.

Set these Application settings in Azure Portal:

```text
PORT=3000
MongoDB_URL=<MongoDB Atlas or reachable MongoDB connection string>
JsonWebToken=<long-random-secret>
apiKey=<Vonage API key>
apiSecret=<Vonage API secret>
```

Use Node 20 LTS, deploy from the repository or a ZIP package, and set the startup command to `npm start` if Azure does not detect it automatically. The MongoDB server must be reachable from Azure; `localhost` refers to the App Service instance and will not provide MongoDB. Do not place secrets in the repository or deployment package.

## Standalone AI readiness report

The report UI is intentionally separate from the MongoDB-backed application. It lives under `report-ui/` and is deployed independently as an Azure Static Web App.

- Live report: https://lemon-mud-039e17d00.1.azurestaticapps.net
- Azure resource: `farmguide-readiness-report`
- Region: East Asia (Static Web Apps is not available in Southeast Asia)
- Tier: Free

Deploy only the report UI with the Azure Static Web Apps CLI after retrieving the deployment token from the resource:

```text
npx @azure/static-web-apps-cli deploy report-ui --deployment-token <token> --env production
```

The report's **Send email** action uses the Static Web App API under `report-ui/api/`. Configure these Application settings on the Static Web App before using it:

```text
SENDGRID_API_KEY=<SendGrid API key with mail.send permission>
SENDGRID_FROM_EMAIL=<verified SendGrid sender address>
```

Deploy the API with `--api-location report-ui/api`. The recipient is intentionally fixed to `priyamgpt444@gmail.com`; no recipient or provider secret is stored in the frontend. The API generates an A4 PDF attachment and sends it through SendGrid. The sender address must be verified in SendGrid first.

## Validation

```text
npm run check   Check syntax for application JavaScript
npm start       Start the application; requires MongoDB and environment variables
npm run dev     Start with nodemon; requires config/dev.env and MongoDB
```

There is currently no automated unit or integration test suite. Changes to routes, authentication, persistence, or views should include focused tests before being considered complete. The syntax check intentionally excludes third-party files under `src/public/vendor`.

The current dependency tree contains legacy packages and known `npm audit` findings. Dependency upgrades should be handled as a dedicated compatibility and security task before production deployment.

## Request flow

- `GET /signup` renders registration; `POST /userDetails` creates a user.
- `GET /emaillogin` and `POST /loginEmailAccount` handle email login.
- `GET /mobilelogin`, `POST /loginMobileAccount`, and `POST /otpLogin` handle mobile login.
- `GET /profile` requires the JWT cookie.
- `GET /logout` clears the authentication cookie.
- `GET /reports` renders the AI repository-readiness baseline report.

## Known limitations

- Startup currently reports a database driver error when MongoDB is unavailable.
- Mobile OTP depends on an external Vonage account and provider credentials.
- Existing authentication and OTP behavior should be security-reviewed before production use; do not treat this assignment as production-hardened.

See [AGENTS.md](AGENTS.md), [CONTRIBUTING.md](CONTRIBUTING.md), and [SECURITY.md](SECURITY.md) before making changes.