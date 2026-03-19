# Task Manager API

Este README está en español.

English version: `README.en.md`

API REST en **Node.js + Express + TypeScript + PostgreSQL (Supabase)**.

## Requisitos

- Node.js (compatible con tu instalación actual)
- Un proyecto en Supabase con PostgreSQL habilitado (incluyendo el **transaction pooler**)
- Variables en `.env` (usa `.env.example` como plantilla)

## Configuración

1. Crea el archivo `.env` basado en `.env.example`.
2. Asegúrate de tener configurado:
   - `PORT`
   - `DATABASE_URL` y `DATABASE_URL_TEST`
   - `JWT_SECRET`

## Ejecutar el servidor

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Levanta en modo desarrollo:
   ```bash
   npm run dev
   ```
3. Verificación rápida:
   - `GET /health`

## Swagger UI (documentación)

La documentación Swagger UI está montada en:

- `http://localhost:3000/api-docs`

Incluye alternancia de idioma (ES/EN) con un botón:

- `http://localhost:3000/api-docs/es`
- `http://localhost:3000/api-docs/en`

Pasos para verla en el navegador:

1. Ejecuta el servidor con `npm run dev`
2. Abre `http://localhost:3000/api-docs`
3. Dentro de Swagger, usa los endpoints:
   - `POST /users`
   - `POST /login`
   - `GET /tasks`
   - `POST /tasks`
   - `PUT /tasks/:id`
   - `DELETE /tasks/:id`

Nota: si cambias `PORT`, también ajusta la URL base en los specs de OpenAPI (ver `docs/openapi.json` y `docs/openapi.en.json`) para que Swagger “Try it out” use la URL correcta.

## Tests

### Postman (probar endpoints manualmente)

La colección de Postman está en:

- `postman/task-manager.postman_collection.json`

Pasos:
1. Ejecuta el servidor (por defecto `PORT=3000`): `npm run dev`
2. Abre Postman
3. Importa la colección: `File -> Import -> Upload Files` y selecciona `postman/task-manager.postman_collection.json`
4. En la colección verás las variables:
   - `baseUrl` (por defecto `http://localhost:3000`)
   - `token` (se setea al correr `POST /login`)
   - `taskId` (se setea al correr `POST /tasks (sets taskId)`)
5. Ejecuta en este orden para el flujo completo:
   - `POST /users`
   - `POST /login (sets token)`
   - `POST /tasks (sets taskId)`
   - `GET /tasks`

### Jest (unit/e2e)

```bash
npm test
```

