import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSettingOrmEntity } from '../typeorm/entities/system-setting.orm-entity';
import {
  ISystemSettingsRepository,
  SystemStoreSettings,
} from '../../../core/interfaces/repositories/system-settings.repository.interface';
import { SpCallerService } from '../sp-caller.service';

@Injectable()
export class SystemSettingsRepository implements ISystemSettingsRepository {
  constructor(
    @InjectRepository(SystemSettingOrmEntity)
    private readonly repo: Repository<SystemSettingOrmEntity>,
    private readonly sp: SpCallerService,
  ) {}

  async getSettings(): Promise<SystemStoreSettings> {
    await this.ensureSettingsTable();

    const rows = await this.repo.find();
    const map = new Map<string, string>();
    rows.forEach((r) => map.set(r.settingKey, r.settingValue));

    return {
      storeName: map.get('STORE_NAME') ?? 'Smart TechRepair Hub',
      storeAddress:
        map.get('STORE_ADDRESS') ?? '123 Nguyễn Văn Cừ, Q.5, TP.HCM',
      storePhone: map.get('STORE_PHONE') ?? '1900-1234',
      storeEmail: map.get('STORE_EMAIL') ?? 'hotline@smartrepair.vn',
      storeLogoUrl: map.get('STORE_LOGO') ?? '/images/logo.png',
      taxCode: map.get('TAX_CODE') ?? '0312345678',
      receiptFooterNote:
        map.get('RECEIPT_FOOTER_NOTE') ??
        'Cảm ơn quý khách đã tin tưởng dịch vụ của chúng tôi!',
    };
  }

  async updateSettings(
    settings: Partial<SystemStoreSettings>,
  ): Promise<SystemStoreSettings> {
    await this.ensureSettingsTable();

    const keyMap: Record<keyof SystemStoreSettings, string> = {
      storeName: 'STORE_NAME',
      storeAddress: 'STORE_ADDRESS',
      storePhone: 'STORE_PHONE',
      storeEmail: 'STORE_EMAIL',
      storeLogoUrl: 'STORE_LOGO',
      taxCode: 'TAX_CODE',
      receiptFooterNote: 'RECEIPT_FOOTER_NOTE',
    };

    for (const [prop, value] of Object.entries(settings)) {
      const key = keyMap[prop as keyof SystemStoreSettings];
      if (key && value !== undefined) {
        await this.repo.save({ settingKey: key, settingValue: String(value) });
      }
    }

    return this.getSettings();
  }

  async resetSystemData(): Promise<void> {
    await this.repo.query(`
      BEGIN TRY
        BEGIN TRANSACTION;

        DELETE FROM Notifications;
        DELETE FROM OrderParts;
        DELETE FROM Quotes;
        DELETE FROM DevicePhotos;
        DELETE FROM ServiceOrders;
        DELETE FROM Devices;
        DELETE FROM Parts;
        DELETE FROM Customers;
        DELETE FROM Users WHERE Role <> 'Admin';

        COMMIT TRANSACTION;
      END TRY
      BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
      END CATCH;
    `);
  }

  private async ensureSettingsTable(): Promise<void> {
    await this.repo.query(`
      IF OBJECT_ID('SystemSettings', 'U') IS NULL
      BEGIN
        CREATE TABLE SystemSettings (
          SettingKey VARCHAR(50) PRIMARY KEY,
          SettingValue NVARCHAR(MAX) NOT NULL,
          UpdatedAt DATETIME2 DEFAULT SYSDATETIME()
        );
      END;

      IF NOT EXISTS (SELECT 1 FROM SystemSettings)
      BEGIN
        INSERT INTO SystemSettings (SettingKey, SettingValue) VALUES
        ('STORE_NAME', N'Smart TechRepair Hub'),
        ('STORE_ADDRESS', N'123 Nguyen Van Cu, Q.5, TP.HCM'),
        ('STORE_PHONE', N'1900-1234'),
        ('STORE_EMAIL', N'hotline@smartrepair.vn'),
        ('STORE_LOGO', N'/images/logo.png'),
        ('TAX_CODE', N'0312345678'),
        ('RECEIPT_FOOTER_NOTE', N'Cam on quy khach da tin tuong dich vu cua chung toi!');
      END;
    `);
  }
}
