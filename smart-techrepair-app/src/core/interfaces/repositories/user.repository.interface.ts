import { UserEntity } from '../../domain/entities/user.entity';

export interface CreateUserParams {
  username: string;
  email: string;
  passwordHash: string;
  role: string;
}

export interface UpdateUserParams {
  userId: string;
  username: string;
  email: string;
  role: string;
  passwordHash?: string;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(userId: string): Promise<UserEntity | null>;
  findAllTechnicians(): Promise<UserEntity[]>;
  findAll(page: number, limit: number): Promise<{ data: UserEntity[]; total: number }>;
  create(params: CreateUserParams): Promise<UserEntity>;
  update(params: UpdateUserParams): Promise<UserEntity>;
  softDelete(userId: string): Promise<void>;
}

export const USER_REPOSITORY = 'IUserRepository';
