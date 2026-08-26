import { Injectable, OnModuleInit } from '@nestjs/common';
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
export class UserRepository implements IUserRepository, OnModuleInit {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
    private readonly sp: SpCallerService,
  ) {}

  async onModuleInit() {
    try {
      await this.repo.query(`
        IF NOT EXISTS (
          SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'IsActive'
        )
        BEGIN
          ALTER TABLE Users ADD IsActive BIT NOT NULL DEFAULT 1;
        END
      `);
    } catch (err) {
      console.warn('Failed to ensure IsActive column in Users table:', err);
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const entity = await this.repo.findOne({
      where: { email, isDeleted: false },
    });
    return entity ? this.toEntity(entity) : null;
  }

  async findById(userId: string): Promise<UserEntity | null> {
    const entity = await this.repo.findOne({
      where: { userId, isDeleted: false },
    });
    return entity ? this.toEntity(entity) : null;
  }

  async findAllTechnicians(): Promise<UserEntity[]> {
    const entities = await this.repo.find({
      where: { role: Role.TECHNICIAN, isDeleted: false, isActive: true },
      order: { username: 'ASC' },
    });
    return entities.map((e) => this.toEntity(e));
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: UserEntity[]; total: number }> {
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
        isActive: params.isActive ?? true,
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
      if (params.isActive !== undefined) {
        await this.updateStatus(params.userId, params.isActive);
      }
      const user = await this.findById(params.userId);
      return user!;
    } catch (error) {
      const entity = await this.repo.findOne({
        where: { userId: params.userId, isDeleted: false },
      });
      if (!entity) {
        throw error;
      }

      entity.username = params.username;
      entity.email = params.email;
      entity.role = params.role;
      if (params.passwordHash) {
        entity.passwordHash = params.passwordHash;
      }
      if (params.isActive !== undefined) {
        entity.isActive = params.isActive;
      }

      const saved = await this.repo.save(entity);
      return this.toEntity(saved);
    }
  }

  async updateStatus(userId: string, isActive: boolean): Promise<UserEntity> {
    const entity = await this.repo.findOne({
      where: { userId, isDeleted: false },
    });
    if (!entity) {
      throw new Error('Người dùng không tồn tại.');
    }
    entity.isActive = isActive;
    const saved = await this.repo.save(entity);
    return this.toEntity(saved);
  }

  async softDelete(userId: string): Promise<void> {
    try {
      await this.sp.execute('sp_SoftDeleteEntity', {
        EntityType: 'User',
        EntityId: userId,
      });
    } catch (_error) {
      const entity = await this.repo.findOne({
        where: { userId, isDeleted: false },
      });
      if (!entity) {
        return;
      }

      entity.isDeleted = true;
      await this.repo.save(entity);
    }
  }

  private isMissingStoredProcedure(
    error: unknown,
    procedureName: string,
  ): boolean {
    return (
      error instanceof Error &&
      error.message.includes(
        `Could not find stored procedure '${procedureName}'`,
      )
    );
  }

  private toEntity(orm: UserOrmEntity): UserEntity {
    const e = new UserEntity();
    e.userId = orm.userId;
    e.username = orm.username;
    e.email = orm.email;
    e.passwordHash = orm.passwordHash;
    e.role = orm.role as Role;
    e.isActive = orm.isActive ?? true;
    e.isDeleted = orm.isDeleted;
    e.createdAt = orm.createdAt;
    e.updatedAt = orm.updatedAt;
    return e;
  }
}
