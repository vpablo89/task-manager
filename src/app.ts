import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import pinoHttp from 'pino-http';
import pino from 'pino';
import { usersRouter } from './routes/users';
import { tasksRouter } from './routes/tasks';
import { logger } from './utils/logger';
import { config } from './config/index';
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './utils/AppError';

export const app = express();

app.use(
  pinoHttp({
    logger,
    quietReqLogger: true,
    serializers: {
      // Evita logs gigantes con headers/body; dejamos solo lo esencial.
      req: (req: unknown) => {
        const r = req as { method?: string; url?: string };
        return { method: r.method, url: r.url };
      },
      res: (res: unknown) => {
        const r = res as { statusCode?: number };
        return { statusCode: r.statusCode };
      },
      err: pino.stdSerializers.err,
    },
    customSuccessMessage: (req: unknown, res: unknown, responseTime: number) => {
      const r = req as { method?: string; url?: string };
      const s = res as { statusCode?: number };
      return `${r.method ?? ''} ${r.url ?? ''} ${s.statusCode ?? 0} - ${responseTime}ms`;
    },
    customErrorMessage: (req: unknown, res: unknown, err: unknown) => {
      const r = req as { method?: string; url?: string };
      const s = res as { statusCode?: number };
      const e = err as { type?: string };
      return `${r.method ?? ''} ${r.url ?? ''} ${s.statusCode ?? 0} - ${e.type ?? 'error'}`;
    },
  })
);
app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigin ? config.corsOrigin.split(',') : true,
    credentials: true,
  })
);
app.use(compression());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ name: 'Task Manager API', version: '1.0.0' });
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

const openApiPath = path.join(process.cwd(), 'docs', 'openapi.json');
if (fs.existsSync(openApiPath)) {
  const spec = JSON.parse(fs.readFileSync(openApiPath, 'utf-8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
}

app.use(usersRouter);
app.use(tasksRouter);

// 404 handler
app.use((_req, _res, next) => {
  next(new NotFoundError());
});

// Global error handler
app.use(errorHandler);

