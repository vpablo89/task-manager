import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { usersRouter } from './routes/users';
import { tasksRouter } from './routes/tasks';
import { registerSystemRoutes } from './routes/systemRoutes';
import { registerSwagger } from './routes/swagger';
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

registerSystemRoutes(app);
registerSwagger(app);

app.use(usersRouter);
app.use(tasksRouter);

// 404 handler
app.use((_req, _res, next) => {
  next(new NotFoundError());
});

// Global error handler
app.use(errorHandler);

