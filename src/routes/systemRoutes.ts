import type { Express } from 'express';

export function registerSystemRoutes(app: Express): void {
  app.get('/', (_req, res) => {
    res.json({ name: 'Task Manager API', version: '1.0.0' });
  });

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });
}

