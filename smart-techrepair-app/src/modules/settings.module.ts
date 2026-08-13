import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemSettingOrmEntity } from '../infrastructure/database/typeorm/entities/system-setting.orm-entity';
import { SystemSettingsRepository } from '../infrastructure/database/repositories/system-settings.repository';
import { SpCallerService } from '../infrastructure/database/sp-caller.service';
import { SYSTEM_SETTINGS_REPOSITORY } from '../core/interfaces/repositories/system-settings.repository.interface';
import { ManageSettingsUseCase } from '../application/settings/manage-settings.use-case';
import { SettingsController } from '../presentation/api/settings.controller';
import { UserOrmEntity } from '../infrastructure/database/typeorm/entities/user.orm-entity';
import { USER_REPOSITORY } from '../core/interfaces/repositories/user.repository.interface';
import { UserRepository } from '../infrastructure/database/repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SystemSettingOrmEntity, UserOrmEntity])],
  providers: [
    SpCallerService,
    { provide: SYSTEM_SETTINGS_REPOSITORY, useClass: SystemSettingsRepository },
    { provide: USER_REPOSITORY, useClass: UserRepository },
    SystemSettingsRepository,
    UserRepository,
    ManageSettingsUseCase,
  ],
  controllers: [SettingsController],
  exports: [ManageSettingsUseCase, SYSTEM_SETTINGS_REPOSITORY],
})
export class SettingsModule {}
