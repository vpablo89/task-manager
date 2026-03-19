# Supabase DB setup via MCP

This project is connected to Supabase through MCP and schema was applied remotely.

## What was done with MCP

- Verified project URL (`get_project_url`)
- Applied DB schema migration (`apply_migration`)
- Verified DB connection (`execute_sql`)
- Verified tables exist (`list_tables`)

Tables created in Supabase:

- `public.users`
- `public.tasks`

## Local backend configuration

1. Copy `.env.example` to `.env`
2. Set `DATABASE_URL` (and optionally `DATABASE_URL_TEST`) using your Supabase Postgres connection string from:
   - Supabase Dashboard -> Project Settings -> Database -> Connection string
3. Set `JWT_SECRET`
4. Start API:

```bash
npm run dev
```

