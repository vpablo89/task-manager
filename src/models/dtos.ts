import { z } from 'zod';

export const createUserDTO = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type CreateUserDTO = z.infer<typeof createUserDTO>;

export const loginDTO = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginDTO = z.infer<typeof loginDTO>;

export const createTaskDTO = z.object({
  title: z.string().min(1),
});

export type CreateTaskDTO = z.infer<typeof createTaskDTO>;

export const updateTaskDTO = z.object({
  title: z.string().min(1).optional(),
  completed: z.boolean().optional(),
});

export type UpdateTaskDTO = z.infer<typeof updateTaskDTO>;

