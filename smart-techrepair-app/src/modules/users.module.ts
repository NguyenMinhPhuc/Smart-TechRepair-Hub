import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '../infrastructure/database/typeorm/entities/user.orm-entity';
import { UserRepository } from '../infrastructure/database/repositories/user.repository';
import { SpCallerService } from '../infrastructure/database/sp-caller.service';
import { USER_REPOSITORY } from '../core/interfaces/repositories/user.repository.interface';
import { ManageUsersUseCase } from '../application/users/manage-users.use-case';
import { UsersController } from '../presentation/api/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  providers: [
    SpCallerService,
    { provide: USER_REPOSITORY, useClass: UserRepository },
    UserRepository,
    ManageUsersUseCase,
  ],
  controllers: [UsersController],
  exports: [ManageUsersUseCase, USER_REPOSITORY],
})
export class UsersModule {}
