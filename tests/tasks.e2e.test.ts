import request from 'supertest';
import { Pool } from 'pg';
import { ensureSchema } from '../src/schema';

const dbUrl = process.env.DATABASE_URL_TEST ?? process.env.DATABASE_URL;

(dbUrl ? describe : describe.skip)('POST /tasks (E2E)', () => {
  let pool: Pool;
  let app: any;

  beforeAll(async () => {
    process.env.DATABASE_URL_TEST = process.env.DATABASE_URL_TEST ?? process.env.DATABASE_URL;
    process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';

    const url = process.env.DATABASE_URL_TEST as string;

    pool = new Pool({ connectionString: url });
    try {
      await ensureSchema(pool);
    } catch (e: any) {
      const msg = e?.code === 'ECONNREFUSED'
        ? 'PostgreSQL no está accesible. Revisa DATABASE_URL_TEST/DATABASE_URL.'
        : 'Error conectando a PostgreSQL para E2E.';
      throw new Error(`${msg} Detalle: ${e?.message ?? String(e)}`);
    }

    // Importar la app después de setear env vars para que `src/config.ts` no falle.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    app = require('../src/app').app;
  });

  beforeEach(async () => {
    await pool.query('TRUNCATE TABLE tasks RESTART IDENTITY CASCADE;');
    await pool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE;');
  });

  afterAll(async () => {
    await pool.end();
  });

  it('create user -> login -> create task -> get tasks', async () => {
    const email = 'test@example.com';
    const password = 'secret123';

    const createUserRes = await request(app)
      .post('/users')
      .send({ email, password })
      .expect(201);

    expect(createUserRes.body).toMatchObject({ email });

    const loginRes = await request(app)
      .post('/login')
      .send({ email, password })
      .expect(200);

    const token: string = loginRes.body.token;
    expect(typeof token).toBe('string');

    const createTaskRes = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My first task' })
      .expect(201);

    expect(createTaskRes.body).toMatchObject({
      title: 'My first task',
      completed: false,
    });

    const getTasksRes = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(getTasksRes.body)).toBe(true);
    expect(getTasksRes.body.length).toBe(1);
    expect(getTasksRes.body[0].title).toBe('My first task');
  });
});

