import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

export function registerSwagger(app: Express): void {
  const openApiPath = path.join(process.cwd(), 'docs', 'openapi.json');
  if (!fs.existsSync(openApiPath)) return;

  const spec = JSON.parse(fs.readFileSync(openApiPath, 'utf-8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
}

