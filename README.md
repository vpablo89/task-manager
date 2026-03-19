# Task Manager API

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
3. Valida rápido:
   - `GET /health`

## Swagger UI (documentación)

La documentación Swagger UI está montada en:

- `http://localhost:3000/api-docs`

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

Nota: si cambias `PORT`, también ajusta `docs/openapi.json` para que Swagger muestre la URL correcta para los “Try it out”.

## Tests

```bash
npm test
```

