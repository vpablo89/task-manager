import { Router } from 'express';
import { postLogin, postUsers } from '../controllers/usersController';

export const usersRouter = Router();

usersRouter.post('/users', postUsers);
usersRouter.post('/login', postLogin);

