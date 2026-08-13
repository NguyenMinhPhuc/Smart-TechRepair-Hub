import { Controller, Get, Render, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../../core/domain/enums/role.enum';
import { ManageUsersUseCase } from '../../application/users/manage-users.use-case';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class UsersViewController {
  constructor(private readonly usersUseCase: ManageUsersUseCase) {}

  @Get()
  @Render('users/index')
  async index(@Query('page') page = 1) {
    const limit = 20;
    const { data: users, total } = await this.usersUseCase.listUsers(Number(page), limit);

    return {
      title: 'Quản lý Người dùng',
      users,
      total,
      page: Number(page),
      limit,
    };
  }
}
