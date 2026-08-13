import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../../core/domain/enums/role.enum';
import { CreateUserDto, UpdateUserDto } from '../dtos/users/user.dto';
import { ManageUsersUseCase } from '../../application/users/manage-users.use-case';

@ApiTags('Users')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersUseCase: ManageUsersUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách người dùng (Admin)' })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.usersUseCase.listUsers(Number(page), Number(limit));
  }

  @Post()
  @ApiOperation({ summary: 'Tạo tài khoản người dùng mới (Admin)' })
  async create(@Body() dto: CreateUserDto) {
    return this.usersUseCase.createUser(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật tài khoản người dùng (Admin)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersUseCase.updateUser({ userId: id, ...dto });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa mềm tài khoản người dùng (Admin)' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersUseCase.deleteUser(id);
    return { message: 'Đã xóa tài khoản thành công.' };
  }
}
