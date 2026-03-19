# Task Manager API

REST API built with **Node.js + Express + TypeScript + PostgreSQL (Supabase)**.

## Requirements

- Node.js (compatible with your current installation)
- A Supabase project with PostgreSQL enabled (including the **transaction pooler**)
- Environment variables in `.env` (use `.env.example` as a template)

## Setup

1. Create the `.env` file based on `.env.example`.
2. Make sure you configure:
   - `PORT`
   - `DATABASE_URL` and `DATABASE_URL_TEST`
   - `JWT_SECRET`

## Run the server

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start in development mode:
   ```bash
   npm run dev
   ```
3. Quick health check:
   - `GET /health`

## Swagger UI (documentation)

Swagger UI is served at:

- `http://localhost:3000/api-docs`

It includes language toggle (ES/EN) with a button:

- `http://localhost:3000/api-docs/es`
- `http://localhost:3000/api-docs/en`

Steps to open it in the browser:

1. Run the server with `npm run dev`
2. Open `http://localhost:3000/api-docs`
3. In Swagger, use the endpoints:
   - `POST /users`
   - `POST /login`
   - `GET /tasks`
   - `POST /tasks`
   - `PUT /tasks/:id`
   - `DELETE /tasks/:id`

Note: if you change `PORT`, update the server URL in the OpenAPI specs (see `docs/openapi.json` and `docs/openapi.en.json`) so Swagger “Try it out” uses the correct base URL.

## Tests

### Postman (manual endpoint testing)

The Postman collection is at:

- `postman/task-manager.postman_collection.json`

Steps:
1. Run the server (default `PORT=3000`): `npm run dev`
2. Open Postman
3. Import the collection: `File -> Import -> Upload Files` and select `postman/task-manager.postman_collection.json`
4. In the collection you will see variables:
   - `baseUrl` (default `http://localhost:3000`)
   - `token` (set by `POST /login`)
   - `taskId` (set by `POST /tasks (sets taskId)`)
5. Run in this order to test the full flow:
   - `POST /users`
   - `POST /login (sets token)`
   - `POST /tasks (sets taskId)`
   - `GET /tasks`

### Jest (unit/e2e)

```bash
npm test
```

