import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db';
import { config } from '../config';

export const usersRouter = Router();

type UserRow = { id: number; email: string; password_hash: string };

usersRouter.post('/users', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  try {
    const passwordHash = await bcrypt.hash(String(password), 10);
    const result = await query<{ id: number; email: string }>(
      'INSERT INTO users(email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, passwordHash]
    );

    const user = result.rows[0];
    return res.status(201).json({ id: user.id, email: user.email });
  } catch (e: any) {
    // unique_violation
    if (e?.code === '23505') {
      return res.status(409).json({ message: 'user already exists' });
    }
    throw e;
  }
});

usersRouter.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const result = await query<UserRow>(
    'SELECT id, email, password_hash FROM users WHERE email = $1',
    [email]
  );

  const user = result.rows[0];
  const ok =
    user && (await bcrypt.compare(String(password), String(user.password_hash)));
  if (!ok) {
    return res.status(401).json({ message: 'invalid credentials' });
  }

  const token = jwt.sign({ sub: String(user.id), email: user.email }, config.jwtSecret, {
    expiresIn: '1h',
  });
  return res.json({ token });
});

