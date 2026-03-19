import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PostgresUserRepository, type UserRepository } from '../repositories';
import { config } from '../config/index';
import {
  createUserDTO,
  loginDTO,
  type CreateUserDTO,
  type LoginDTO,
} from '../models/dtos';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../utils/AppError';

export interface CreateUserResult {
  id: number;
  email: string;
}

export class UsersService {
  private repo: UserRepository;

  constructor(repo: UserRepository = new PostgresUserRepository()) {
    this.repo = repo;
  }

  async createUser(input: unknown): Promise<CreateUserResult> {
    const parsed = createUserDTO.safeParse(input);
    if (!parsed.success) throw new BadRequestError('invalid input');

    return this.createUserFromDTO(parsed.data);
  }

  private async createUserFromDTO(data: CreateUserDTO): Promise<CreateUserResult> {
    const passwordHash = await bcrypt.hash(data.password, 10);
    try {
      const user = await this.repo.create(data.email, passwordHash);
      return { id: user.id, email: user.email };
    } catch (err) {
      if (err instanceof ConflictError) {
        throw new ConflictError('user already exists');
      }
      throw err;
    }
  }

  async login(input: unknown): Promise<{ token: string }> {
    const parsed = loginDTO.safeParse(input);
    if (!parsed.success) throw new BadRequestError('invalid input');

    return this.loginFromDTO(parsed.data);
  }

  private async loginFromDTO(data: LoginDTO): Promise<{ token: string }> {
    const user = await this.repo.findByEmail(data.email);
    if (!user) throw new UnauthorizedError('invalid credentials');

    const ok = await bcrypt.compare(data.password, user.password_hash);
    if (!ok) throw new UnauthorizedError('invalid credentials');

    const token = jwt.sign(
      { sub: String(user.id), email: user.email },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    return { token };
  }
}

