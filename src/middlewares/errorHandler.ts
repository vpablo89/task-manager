import type { ErrorRequestHandler } from 'express';
import { AppError, InternalServerError } from '../utils/AppError';
import { logger } from '../utils/logger';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const httpErr =
    err instanceof AppError
      ? err
      : new InternalServerError('internal server error', err);

  logger.error(
    {
      code: httpErr.code,
      statusCode: httpErr.statusCode,
    },
    httpErr.message
  );

  return res.status(httpErr.statusCode).json({
    message: httpErr.message,
    code: httpErr.code,
  });
};

