import type { DatabaseError } from 'pg';
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
} from './AppError';

export function mapPostgresError(err: unknown): Error {
  const e = err as DatabaseError & { code?: string };

  switch (e.code) {
    case '23505':
      return new ConflictError('conflict');
    case '23503':
      return new BadRequestError('bad request');
    case '22P02':
      return new BadRequestError('bad request');
    default:
      return new InternalServerError('internal server error', err);
  }
}

