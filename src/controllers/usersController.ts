import type { Request, Response } from 'express';
import { UsersService } from '../services/usersService';

const service = new UsersService();

export async function postUsers(req: Request, res: Response): Promise<void> {
  const result = await service.createUser(req.body);
  res.status(201).json(result);
}

export async function postLogin(req: Request, res: Response): Promise<void> {
  const result = await service.login(req.body);
  res.json(result);
}

