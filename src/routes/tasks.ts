import { Router } from 'express';
import { query } from '../db';
import { requireAuth } from '../middleware/auth';

export const tasksRouter = Router();

tasksRouter.use(requireAuth);

type TaskRow = {
  id: number;
  user_id: number;
  title: string;
  completed: boolean;
};

tasksRouter.get('/tasks', async (req, res) => {
  const userId = (req as unknown as { userId: number }).userId;
  const result = await query<TaskRow>(
    'SELECT id, user_id, title, completed FROM tasks WHERE user_id = $1 ORDER BY id ASC',
    [userId]
  );

  const tasks = result.rows.map((t) => ({
    id: t.id,
    userId: t.user_id,
    title: t.title,
    completed: t.completed,
  }));

  return res.json(tasks);
});

tasksRouter.post('/tasks', async (req, res) => {
  const userId = (req as unknown as { userId: number }).userId;
  const { title } = req.body ?? {};

  if (!title) {
    return res.status(400).json({ message: 'title is required' });
  }

  const result = await query<TaskRow>(
    'INSERT INTO tasks(user_id, title) VALUES ($1, $2) RETURNING id, user_id, title, completed',
    [userId, title]
  );

  const task = result.rows[0];
  return res.status(201).json({
    id: task.id,
    userId: task.user_id,
    title: task.title,
    completed: task.completed,
  });
});

tasksRouter.put('/tasks/:id', async (req, res) => {
  const userId = (req as unknown as { userId: number }).userId;
  const id = Number(req.params.id);

  const { title, completed } = req.body ?? {};
  const hasTitle = typeof title === 'string';
  const hasCompleted = typeof completed === 'boolean';

  if (!hasTitle && !hasCompleted) {
    return res.status(400).json({ message: 'nothing to update' });
  }

  const result = await query<TaskRow>(
    `UPDATE tasks
     SET title = COALESCE($3, title),
         completed = COALESCE($4, completed)
     WHERE id = $1 AND user_id = $2
     RETURNING id, user_id, title, completed`,
    [id, userId, hasTitle ? title : null, hasCompleted ? completed : null]
  );

  const task = result.rows[0];
  if (!task) {
    return res.status(404).json({ message: 'task not found' });
  }

  return res.json({
    id: task.id,
    userId: task.user_id,
    title: task.title,
    completed: task.completed,
  });
});

tasksRouter.delete('/tasks/:id', async (req, res) => {
  const userId = (req as unknown as { userId: number }).userId;
  const id = Number(req.params.id);

  const result = await query<{ id: number }>(
    'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'task not found' });
  }

  return res.status(204).send();
});

