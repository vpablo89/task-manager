/**
 * Unit test de ejemplo: validación de POST /tasks.
 * No toca DB: mockea el módulo db.
 */
import request from 'supertest';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? 'postgres://user:pass@localhost:5432/db';

jest.mock('../src/db', () => ({
  query: jest.fn(async () => ({ rows: [] })),
}));

import { app } from '../src/app';

describe('POST /tasks (unit)', () => {
  it('returns 401 if missing Authorization', async () => {
    await request(app).post('/tasks').send({ title: 't' }).expect(401);
  });

  it('returns 400 if missing title', async () => {
    const token = jwt.sign({ sub: '1', email: 'u@example.com' }, process.env.JWT_SECRET as string);
    await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(400);
  });
});

