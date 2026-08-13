import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../core/domain/entities/user.entity';
import { Role } from '../../../core/domain/enums/role.enum';
import { UserOrmEntity } from '../typeorm/entities/user.orm-entity';
import { SpCallerService } from '../sp-caller.service';
import {
  CreateUserParams,
  IUserRepository,
  UpdateUserParams,
} from '../../../core/interfaces/repositories/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
    private readonly sp: SpCallerService,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const entity = await this.repo.findOne({ where: { email, isDeleted: false } });
    return entity ? this.toEntity(entity) : null;
  }

  async findById(userId: string): Promise<UserEntity | null> {
    const entity = await this.repo.findOne({ where: { userId, isDeleted: false } });
    return entity ? this.toEntity(entity) : null;
  }

  async findAllTechnicians(): Promise<UserEntity[]> {
    const entities = await this.repo.find({
      where: { role: Role.TECHNICIAN, isDeleted: false },
      order: { username: 'ASC' },
    });
    return entities.map((e) => this.toEntity(e));
  }

  async findAll(page: number, limit: number): Promise<{ data: UserEntity[]; total: number }> {
    const [data, total] = await this.repo.findAndCount({
      where: { isDeleted: false },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data: data.map((e) => this.toEntity(e)), total };
  }

  async create(params: CreateUserParams): Promise<UserEntity> {
    try {
      const res = await this.sp.executeWithOutput<{ OutUserId: string }>(
        'sp_CreateUser',
        {
          Username: params.username,
          Email: params.email,
          PasswordHash: params.passwordHash,
          Role: params.role,
        },
        ['OutUserId'],
      );
      const user = await this.findById(res.OutUserId);
      return user!;
    } catch (error) {
      if (!this.isMissingStoredProcedure(error, 'sp_CreateUser')) {
        throw error;
      }

      const entity = this.repo.create({
        username: params.username,
        email: params.email,
        passwordHash: params.passwordHash,
        role: params.role,
        isDeleted: false,
      });
      const saved = await this.repo.save(entity);
      return this.toEntity(saved);
    }
  }

  async update(params: UpdateUserParams): Promise<UserEntity> {
    try {
      await this.sp.execute('sp_UpdateUser', {
        UserId: params.userId,
        Username: params.username,
        Email: params.email,
        Role: params.role,
        PasswordHash: params.passwordHash ?? null,
      });
      const user = await this.findById(params.userId);
      return user!;
    } catch (error) {
      if (!this.isMissingStoredProcedure(error, 'sp_UpdateUser')) {
        throw error;
      }

      const entity = await this.repo.findOne({ where: { userId: params.userId, isDeleted: false } });
      if (!entity) {
        throw error;
      }

      entity.username = params.username;
      entity.email = params.email;
      entity.role = params.role;
      if (params.passwordHash) {
        entity.passwordHash = params.passwordHash;
      }

      const saved = await this.repo.save(entity);
      return this.toEntity(saved);
    }
  }

  async softDelete(userId: string): Promise<void> {
    try {
      await this.sp.execute('sp_SoftDeleteEntity', { EntityType: 'User', EntityId: userId });
    } catch (error) {
      if (!this.isMissingStoredProcedure(error, 'sp_SoftDeleteEntity')) {
        throw error;
      }

      const entity = await this.repo.findOne({ where: { userId, isDeleted: false } });
      if (!entity) {
        return;
      }

      entity.isDeleted = true;
      await this.repo.save(entity);
    }
  }

  private isMissingStoredProcedure(error: unknown, procedureName: string): boolean {
    return error instanceof Error && error.message.includes(`Could not find stored procedure '${procedureName}'`);
  }

  private toEntity(orm: UserOrmEntity): UserEntity {
    const e = new UserEntity();
    e.userId = orm.userId;
    e.username = orm.username;
    e.email = orm.email;
    e.passwordHash = orm.passwordHash;
    e.role = orm.role as Role;
    e.isDeleted = orm.isDeleted;
    e.createdAt = orm.createdAt;
    e.updatedAt = orm.updatedAt;
    return e;
  }
}
