import type { TaskRow } from '../models/task';
import { query } from '../utils/db';

export interface TaskRepository {
  listByUserId(userId: number): Promise<TaskRow[]>;
  create(userId: number, title: string): Promise<TaskRow>;
  update(
    userId: number,
    taskId: number,
    updates: { title?: string; completed?: boolean }
  ): Promise<TaskRow | null>;
  delete(userId: number, taskId: number): Promise<boolean>;
}

export class PostgresTaskRepository implements TaskRepository {
  async listByUserId(userId: number): Promise<TaskRow[]> {
    const result = await query<TaskRow>(
      'SELECT id, user_id, title, completed FROM tasks WHERE user_id = $1 ORDER BY id ASC',
      [userId]
    );
    return result.rows;
  }

  async create(userId: number, title: string): Promise<TaskRow> {
    const result = await query<TaskRow>(
      'INSERT INTO tasks(user_id, title) VALUES ($1, $2) RETURNING id, user_id, title, completed',
      [userId, title]
    );
    return result.rows[0];
  }

  async update(
    userId: number,
    taskId: number,
    updates: { title?: string; completed?: boolean }
  ): Promise<TaskRow | null> {
    const hasTitle = typeof updates.title === 'string';
    const hasCompleted = typeof updates.completed === 'boolean';

    const result = await query<TaskRow>(
      `UPDATE tasks
       SET title = COALESCE($3, title),
           completed = COALESCE($4, completed)
       WHERE id = $1 AND user_id = $2
       RETURNING id, user_id, title, completed`,
      [taskId, userId, hasTitle ? updates.title : null, hasCompleted ? updates.completed : null]
    );

    return result.rows[0] ?? null;
  }

  async delete(userId: number, taskId: number): Promise<boolean> {
    const result = await query<{ id: number }>(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [taskId, userId]
    );
    return result.rows.length > 0;
  }
}

