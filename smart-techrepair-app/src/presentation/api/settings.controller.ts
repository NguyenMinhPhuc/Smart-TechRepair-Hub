import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../../core/domain/enums/role.enum';
import { ResetSystemDataDto, UpdateSettingsDto } from '../dtos/settings/setting.dto';
import { ManageSettingsUseCase } from '../../application/settings/manage-settings.use-case';
import { CurrentUser, CurrentUserData } from '../decorators/current-user.decorator';

@ApiTags('Settings')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('api/settings')
export class SettingsController {
  constructor(private readonly settingsUseCase: ManageSettingsUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Lấy cấu hình thông tin cửa hàng' })
  async getSettings() {
    return this.settingsUseCase.getSettings();
  }

  @Post()
  @ApiOperation({ summary: 'Cập nhật thông tin cấu hình cửa hàng (Admin)' })
  async updateSettings(@Body() dto: UpdateSettingsDto) {
    return this.settingsUseCase.updateSettings(dto);
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa toàn bộ dữ liệu hệ thống sau khi xác thực lại mật khẩu Admin' })
  async resetData(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: ResetSystemDataDto,
  ) {
    await this.settingsUseCase.resetData(user.userId, dto.adminPassword);
    return { message: 'Đã xóa toàn bộ dữ liệu hệ thống! Chỉ giữ lại Danh mục và Tài khoản Admin.' };
  }

  @Post('seed-demo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tạo 20 bộ dữ liệu demo hoàn chỉnh' })
  async seedDemo() {
    return this.settingsUseCase.seedDemoData();
  }
}
