import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../../core/domain/enums/role.enum';
import { ManageSettingsUseCase } from '../../application/settings/manage-settings.use-case';

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class SettingsViewController {
  constructor(private readonly settingsUseCase: ManageSettingsUseCase) {}

  @Get()
  @Render('settings/index')
  async index() {
    const storeSettings = await this.settingsUseCase.getSettings();
    return {
      title: 'Cấu hình Hệ thống',
      storeSettings,
    };
  }
}
