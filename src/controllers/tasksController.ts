import type { Request, Response } from 'express';
import { TasksService } from '../services/tasksService';

const service = new TasksService();

function getUserId(req: Request): number {
  return (req as Request & { userId: number }).userId;
}

export async function getTasks(req: Request, res: Response): Promise<void> {
  const userId = getUserId(req);
  const tasks = await service.listTasks(userId);
  res.json(tasks);
}

export async function postTasks(req: Request, res: Response): Promise<void> {
  const userId = getUserId(req);
  const task = await service.createTask(userId, req.body);
  res.status(201).json(task);
}

export async function putTask(req: Request, res: Response): Promise<void> {
  const userId = getUserId(req);
  const taskId = Number(req.params.id);
  const updated = await service.updateTask(userId, taskId, req.body);
  res.json(updated);
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  const userId = getUserId(req);
  const taskId = Number(req.params.id);
  await service.deleteTask(userId, taskId);
  res.status(204).send();
}

