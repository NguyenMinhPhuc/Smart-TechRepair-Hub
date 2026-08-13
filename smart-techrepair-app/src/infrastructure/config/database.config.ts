import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { UserOrmEntity } from '../database/typeorm/entities/user.orm-entity';
import { CustomerOrmEntity } from '../database/typeorm/entities/customer.orm-entity';
import { DeviceOrmEntity } from '../database/typeorm/entities/device.orm-entity';
import { ServiceOrderOrmEntity } from '../database/typeorm/entities/service-order.orm-entity';
import { QuoteOrmEntity } from '../database/typeorm/entities/quote.orm-entity';
import { PartOrmEntity } from '../database/typeorm/entities/part.orm-entity';
import { CategoryOrmEntity } from '../database/typeorm/entities/category.orm-entity';
import { NotificationOrmEntity } from '../database/typeorm/entities/notification.orm-entity';
import { DevicePhotoOrmEntity } from '../database/typeorm/entities/device-photo.orm-entity';
import { SystemSettingOrmEntity } from '../database/typeorm/entities/system-setting.orm-entity';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  private getNumber(key: string, fallback: number): number {
    const value = this.config.get<string>(key);
    const parsed = value ? Number(value) : Number.NaN;

    return Number.isFinite(parsed) ? parsed : fallback;
  }

  private getBoolean(key: string, fallback: boolean): boolean {
    const value = this.config.get<string>(key);

    if (value === undefined) {
      return fallback;
    }

    return value.toLowerCase() === 'true';
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const useWindowsAuth = this.getBoolean('USE_WINDOWS_AUTH', false);

    const baseOptions: TypeOrmModuleOptions = {
      type: 'mssql',
      host: this.config.get<string>('DB_HOST') ?? 'localhost',
      port: this.getNumber('DB_PORT', 1433),
      database: this.config.get<string>('DB_DATABASE') ?? 'SmartTechRepairDB_v2',
      entities: [
        UserOrmEntity,
        CustomerOrmEntity,
        DeviceOrmEntity,
        ServiceOrderOrmEntity,
        QuoteOrmEntity,
        PartOrmEntity,
        CategoryOrmEntity,
        NotificationOrmEntity,
        DevicePhotoOrmEntity,
        SystemSettingOrmEntity,
      ],
      synchronize: false, // NEVER true in production — DB managed via SQL scripts
      logging: this.config.get<string>('NODE_ENV') === 'development',
      options: {
        encrypt: this.getBoolean('DB_ENCRYPT', false),
        trustServerCertificate: this.getBoolean('DB_TRUST_SERVER_CERTIFICATE', true),
        enableArithAbort: true,
      },
    };

    if (useWindowsAuth) {
      return {
        ...baseOptions,
        extra: {
          trustedConnection: true,
          integratedSecurity: true,
        },
      } as TypeOrmModuleOptions;
    }

    return {
      ...baseOptions,
      username: this.config.get<string>('DB_USERNAME') ?? 'sa',
      password: this.config.get<string>('DB_PASSWORD') ?? '',
    };
  }
}
