import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index';
import { UnauthorizedError } from '../utils/AppError';

type JwtPayload = {
  sub: string;
  email: string;
};

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const auth = req.header('authorization');
  const token =
    typeof auth === 'string' && auth.startsWith('Bearer ')
      ? auth.slice('Bearer '.length)
      : null;

  if (!token) throw new UnauthorizedError();

  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
    const userId = Number(payload.sub);

    if (!userId || Number.isNaN(userId)) throw new UnauthorizedError();

    (req as Request & { userId: number }).userId = userId;
    next();
  } catch {
    throw new UnauthorizedError();
  }
}

