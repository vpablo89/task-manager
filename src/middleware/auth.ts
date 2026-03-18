import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

type JwtPayload = {
  sub: string;
  email: string;
};

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const auth = req.header('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice('Bearer '.length) : null;

  if (!token) {
    res.status(401).json({ message: 'unauthorized' });
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
    const userId = Number(payload.sub);
    if (!userId || Number.isNaN(userId)) {
      res.status(401).json({ message: 'unauthorized' });
      return;
    }
    (req as Request & { userId: number; email: string }).userId = userId;
    (req as Request & { userId: number; email: string }).email = payload.email;
    next();
  } catch {
    res.status(401).json({ message: 'unauthorized' });
  }
}

