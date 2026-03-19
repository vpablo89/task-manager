import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { usersRouter } from './routes/users';
import { tasksRouter } from './routes/tasks';
import { config } from './config/index';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';
import { NotFoundError } from './utils/AppError';

export const app = express();

app.use(requestLogger);
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

