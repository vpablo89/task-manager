import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

export function registerSwagger(app: Express): void {
  const openApiEsPath = path.join(process.cwd(), 'docs', 'openapi.json');
  const openApiEnPath = path.join(process.cwd(), 'docs', 'openapi.en.json');

  const hasEs = fs.existsSync(openApiEsPath);
  const hasEn = fs.existsSync(openApiEnPath);
  if (!hasEs && !hasEn) return;

  const esSpec = hasEs ? JSON.parse(fs.readFileSync(openApiEsPath, 'utf-8')) : null;
  const enSpec = hasEn ? JSON.parse(fs.readFileSync(openApiEnPath, 'utf-8')) : null;

  // Serve language-specific Swagger UIs.
  if (esSpec) {
    app.use('/api-docs/es', swaggerUi.serve, swaggerUi.setup(esSpec));
  }
  if (enSpec) {
    app.use('/api-docs/en', swaggerUi.serve, swaggerUi.setup(enSpec));
  }

  // Default landing page with a language toggle button.
  app.get('/api-docs', (_req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Task Manager API - Swagger</title>
    <style>
      body { margin: 0; font-family: Arial, sans-serif; }
      .topbar { padding: 10px 14px; display: flex; gap: 8px; align-items: center; border-bottom: 1px solid #eee; }
      button { cursor: pointer; padding: 8px 12px; border: 1px solid #ddd; background: #fff; border-radius: 6px; }
      iframe { width: 100%; height: calc(100vh - 56px); border: 0; }
    </style>
  </head>
  <body>
    <div class="topbar">
      <button onclick="setLang('es')" type="button">ES</button>
      <button onclick="setLang('en')" type="button">EN</button>
    </div>
    <iframe id="swaggerFrame" src="" aria-label="Swagger UI" />
    <script>
      const frame = document.getElementById('swaggerFrame');
      const params = new URLSearchParams(window.location.search);
      const lang = (params.get('lang') === 'en') ? 'en' : 'es';
      function setLang(nextLang) {
        frame.src = '/api-docs/' + nextLang;
      }
      setLang(lang);
    </script>
  </body>
</html>`;
    res.end(html);
  });
}

