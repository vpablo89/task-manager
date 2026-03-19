import { Pool } from 'pg';
import { config } from '../config';
import { mapPostgresError } from './mapPostgresError';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: config.databaseUrl,
      // In tests, let Node exit even if pool has idle clients.
      allowExitOnIdle: process.env.NODE_ENV === 'test',
    });
  }
  return pool;
}

export async function query<T = unknown>(
  text: string,
  params?: unknown[]
): Promise<{ rows: T[] }> {
  try {
    const result = await getPool().query(text, params as unknown[]);
    return { rows: result.rows as T[] };
  } catch (err) {
    throw mapPostgresError(err);
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

