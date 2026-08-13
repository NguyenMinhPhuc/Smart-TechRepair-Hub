import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../../core/domain/entities/user.entity';
import {
  IUserRepository,
  USER_REPOSITORY,
  CreateUserParams,
  UpdateUserParams,
} from '../../core/interfaces/repositories/user.repository.interface';

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserInput {
  userId: string;
  username: string;
  email: string;
  role: string;
  password?: string;
}

@Injectable()
export class ManageUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async listUsers(page: number = 1, limit: number = 20) {
    return this.userRepo.findAll(page, limit);
  }

  async createUser(input: CreateUserInput): Promise<UserEntity> {
    const existingEmail = await this.userRepo.findByEmail(input.email);
    if (existingEmail) {
      throw new BadRequestException('Email đã được sử dụng bởi tài khoản khác.');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    return this.userRepo.create({
      username: input.username,
      email: input.email,
      passwordHash,
      role: input.role,
    });
  }

  async updateUser(input: UpdateUserInput): Promise<UserEntity> {
    const existingUser = await this.userRepo.findById(input.userId);
    if (!existingUser) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }

    let passwordHash: string | undefined = undefined;
    if (input.password && input.password.trim() !== '') {
      passwordHash = await bcrypt.hash(input.password, 10);
    }

    return this.userRepo.update({
      userId: input.userId,
      username: input.username,
      email: input.email,
      role: input.role,
      passwordHash,
    });
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }
    await this.userRepo.softDelete(userId);
  }
}
