import type { UserRow } from '../models/user';
import { query } from '../utils/db';

export interface UserRepository {
  create(email: string, passwordHash: string): Promise<UserRow>;
  findByEmail(email: string): Promise<UserRow | null>;
}

export class PostgresUserRepository implements UserRepository {
  async create(email: string, passwordHash: string): Promise<UserRow> {
    const result = await query<UserRow>(
      'INSERT INTO users(email, password_hash) VALUES ($1, $2) RETURNING id, email, password_hash',
      [email, passwordHash]
    );
    return result.rows[0];
  }

  async findByEmail(email: string): Promise<UserRow | null> {
    const result = await query<UserRow>(
      'SELECT id, email, password_hash FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] ?? null;
  }
}

