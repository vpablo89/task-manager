import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import {
  deleteTask,
  getTasks,
  postTasks,
  putTask,
} from '../controllers/tasksController';

export const tasksRouter = Router();

tasksRouter.use(requireAuth);

tasksRouter.get('/tasks', getTasks);
tasksRouter.post('/tasks', postTasks);
tasksRouter.put('/tasks/:id', putTask);
tasksRouter.delete('/tasks/:id', deleteTask);

