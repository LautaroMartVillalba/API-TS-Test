# Api-TS-Testeo

Minimal NestJS API project with Prisma and JWT authentication.

This repository contains a small TypeScript API built with NestJS. It
demonstrates a Prisma-based model layer, JWT authentication (access + refresh
tokens), cookie-based token storage, and simple permission guards.

## Features

- User CRUD (with DTOs and response shaping)
- Product CRUD example
- JWT authentication with access + refresh tokens stored as HTTP-only cookies
- Permission-based authorization using a `@Privileges(...)` decorator and a guard
- Prisma ORM for Postgres

## Quickstart (local)

1. Install dependencies

```bash
npm install
```

2. Create a `.env` in the project root (a sample is already present).
	 Required vars:

- `DATABASE_URL` — Postgres connection string
- `JWT_SECRET` — secret for access tokens
- `JWT_REFRESH_SECRET` — secret for refresh tokens

Example `.env`:

Note: DATABASE_URL must be literaly like the example.

```properties
DATABASE_URL="postgres://root:password@localhost:5431/database"
JWT_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
```

3. Run migrations / start Postgres (if you use docker-compose, start the DB)

4. Start in development mode

```bash
npm run start:dev
```

The server listens on port `3000` by default.

## Important endpoints

- `POST /auth/login` — body: `{ "email": "...", "password": "..." }`.
	On success sets `jwt` and `refresh` HTTP-only cookies.
- `POST /auth/refresh` — rotates access token using the `refresh` cookie.
- `GET /auth/profile` — protected endpoint; returns the currently authenticated user.
- `POST /product/create`, `GET /product/all`, `GET /product/byname?name=...`,
	`PATCH /product/update?id=...`, `DELETE /product/delete?id=...` — product endpoints.

## Common troubleshooting

- "secretOrPrivateKey must have a value": ensure `JWT_SECRET` is defined in the
	environment where you start the app. If using `.env`, start the process from the
	project root so ConfigModule loads it.
- "invalid signature" on refresh: make sure `JWT_REFRESH_SECRET` was used to sign
	the refresh token and the same secret is available when verifying.
- Empty or missing fields in requests: ensure requests include `Content-Type: application/json`.

## Notes

- This project uses HTTP-only cookies to store tokens; for local testing set secure flag
	appropriately (in dev it is usually `false`).
- The code includes simple console.log traces for debugging authentication flows —
	remove them in production.

If you want, I can also add example curl commands for the main flows (login/refresh) or
create a small Postman collection. Which would you prefer?
