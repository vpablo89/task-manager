import {
  PostgresTaskRepository,
  type TaskRepository,
} from '../repositories';
import {
  createTaskDTO,
  updateTaskDTO,
  type CreateTaskDTO,
  type UpdateTaskDTO,
} from '../models/dtos';
import { BadRequestError, NotFoundError } from '../utils/AppError';

export interface TaskResult {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export class TasksService {
  private repo: TaskRepository;

  constructor(repo: TaskRepository = new PostgresTaskRepository()) {
    this.repo = repo;
  }

  async listTasks(userId: number): Promise<TaskResult[]> {
    const tasks = await this.repo.listByUserId(userId);
    return tasks.map((t) => ({
      id: t.id,
      userId: t.user_id,
      title: t.title,
      completed: t.completed,
    }));
  }

  async createTask(userId: number, input: unknown): Promise<TaskResult> {
    const parsed = createTaskDTO.safeParse(input);
    if (!parsed.success) throw new BadRequestError('invalid input');

    const task = await this.repo.create(userId, parsed.data.title);
    return {
      id: task.id,
      userId: task.user_id,
      title: task.title,
      completed: task.completed,
    };
  }

  async updateTask(
    userId: number,
    taskId: number,
    input: unknown
  ): Promise<TaskResult> {
    const parsed = updateTaskDTO.safeParse(input);
    if (!parsed.success) throw new BadRequestError('invalid input');

    const data = parsed.data as UpdateTaskDTO;
    if (data.title === undefined && data.completed === undefined) {
      throw new BadRequestError('nothing to update');
    }

    const updated = await this.repo.update(userId, taskId, data);
    if (!updated) throw new NotFoundError('task not found');

    return {
      id: updated.id,
      userId: updated.user_id,
      title: updated.title,
      completed: updated.completed,
    };
  }

  async deleteTask(userId: number, taskId: number): Promise<void> {
    const deleted = await this.repo.delete(userId, taskId);
    if (!deleted) throw new NotFoundError('task not found');
  }
}

