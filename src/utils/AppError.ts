export type HttpErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNPROCESSABLE_ENTITY'
  | 'INTERNAL_SERVER_ERROR';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: HttpErrorCode;

  constructor(params: {
    statusCode: number;
    code: HttpErrorCode;
    message: string;
    cause?: unknown;
  }) {
    super(params.message);
    this.statusCode = params.statusCode;
    this.code = params.code;
    if (params.cause) (this as unknown as { cause: unknown }).cause = params.cause;
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'bad request') {
    super({ statusCode: 400, code: 'BAD_REQUEST', message });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'unauthorized') {
    super({ statusCode: 401, code: 'UNAUTHORIZED', message });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'forbidden') {
    super({ statusCode: 403, code: 'FORBIDDEN', message });
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'not found') {
    super({ statusCode: 404, code: 'NOT_FOUND', message });
  }
}

export class ConflictError extends AppError {
  constructor(message = 'conflict') {
    super({ statusCode: 409, code: 'CONFLICT', message });
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message = 'unprocessable entity') {
    super({ statusCode: 422, code: 'UNPROCESSABLE_ENTITY', message });
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'internal server error', cause?: unknown) {
    super({
      statusCode: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message,
      cause,
    });
  }
}

