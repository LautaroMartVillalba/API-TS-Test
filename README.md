# Api-TS-Testeo

Minimal NestJS API project with Prisma and JWT authentication.

This repository contains a small TypeScript API built with NestJS. It
demonstrates a Prisma-based model layer, JWT authentication (access + refresh
tokens), cookie-based token storage, and simple permission guards.

## Features

- User CRUD (with DTOs and response shaping)
- Product CRUD example
- JWT authentication with access + refresh tokens stored as HTTP-only cookies
- Permission-based authorization using a `@Privileges(...)` decorator and `@UserGuards(...)`
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

3. Start in development mode

```bash
npm run initdb
```
This command will:
- Execute `npx prisma generate` to generate database models.
- Init docker database container with `docker-compose up -d`.
- Synchronize de contaner with prisma by `npx prisma db push`.
- Insert testing registers with `npx prisma db seed`. You can modify this testing migraitons register by modify /prisma/prisma.seed.ts

```bash
npm run start:dev
```
To init local server on port `3000`.

## Example bodies

### User
If you can create a user, you can put this body model:
```json
{
    "email":"example@gmail.com",
    "password":"example",
    "role": "admin"
}
```
You can change `role` value to another role name. You can get all roles and her categories in /role/all

### Product

If you want to create a product register, you can put this body model:
```json
{
    "name":"Apple",
    "brand":"Juan",
	"category": "FOOD",
    "unitPrice": 10,
    "stock": 100
}
```

### Role
You can create your own role in /role/create sending this body:
```json
{
	"name": "MyOwnRole",
	"privileges": ["READ", "POST", "DELETE"],
	"categories": ["TECHNOLOGY", "SCHOOL", "FOOD", "PHARMACY"],
}
```
You can combine a loot of privileges and categories
For privileges use:
- `READ`
- `POST`
- `PATCH`
- `PUT`
- `DELETE`

For categories use:
- `FOOD`
- `TOOL`
- `SCHOOL`
- `PHARMACY`
- `TECHNOLOGY`

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

