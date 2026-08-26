import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceOrderOrmEntity } from '../infrastructure/database/typeorm/entities/service-order.orm-entity';
import { QuoteOrmEntity } from '../infrastructure/database/typeorm/entities/quote.orm-entity';
import { PartOrmEntity } from '../infrastructure/database/typeorm/entities/part.orm-entity';
import { CategoryOrmEntity } from '../infrastructure/database/typeorm/entities/category.orm-entity';
import { UserOrmEntity } from '../infrastructure/database/typeorm/entities/user.orm-entity';
import { CustomerOrmEntity } from '../infrastructure/database/typeorm/entities/customer.orm-entity';
import { ServiceOrderRepository } from '../infrastructure/database/repositories/service-order.repository';
import { UserRepository } from '../infrastructure/database/repositories/user.repository';
import { CustomerRepository } from '../infrastructure/database/repositories/customer.repository';
import { QuoteRepository } from '../infrastructure/database/repositories/quote.repository';
import { SpCallerService } from '../infrastructure/database/sp-caller.service';
import { SERVICE_ORDER_REPOSITORY } from '../core/interfaces/repositories/service-order.repository.interface';
import { USER_REPOSITORY } from '../core/interfaces/repositories/user.repository.interface';
import { CUSTOMER_REPOSITORY } from '../core/interfaces/repositories/customer.repository.interface';
import { QUOTE_REPOSITORY } from '../core/interfaces/repositories/quote.repository.interface';
import { GetOrderUseCase } from '../application/service-orders/get-order.use-case';
import { ApproveQuoteUseCase } from '../application/quotes/approve-quote.use-case';
import { RevenueReportUseCase } from '../application/reports/revenue-report.use-case';
import { TechnicianProductivityUseCase } from '../application/reports/technician-productivity.use-case';
import { DashboardController } from '../presentation/views/dashboard.controller';
import { TrackingViewController } from '../presentation/views/tracking-view.controller';
import { ServiceOrdersViewController } from '../presentation/views/service-orders-view.controller';
import { InventoryViewController } from '../presentation/views/inventory-view.controller';
import { ReportsViewController } from '../presentation/views/reports-view.controller';
import { InventoryRepository } from '../infrastructure/database/repositories/inventory.repository';
import { INVENTORY_REPOSITORY } from '../core/interfaces/repositories/inventory.repository.interface';

import { SystemSettingOrmEntity } from '../infrastructure/database/typeorm/entities/system-setting.orm-entity';
import { SystemSettingsRepository } from '../infrastructure/database/repositories/system-settings.repository';
import { SYSTEM_SETTINGS_REPOSITORY } from '../core/interfaces/repositories/system-settings.repository.interface';
import { ManageSettingsUseCase } from '../application/settings/manage-settings.use-case';
import { SettingsViewController } from '../presentation/views/settings-view.controller';
import { ManageUsersUseCase } from '../application/users/manage-users.use-case';
import { UsersViewController } from '../presentation/views/users-view.controller';
import { AuthViewController } from '../presentation/views/auth-view.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceOrderOrmEntity,
      QuoteOrmEntity,
      PartOrmEntity,
      CategoryOrmEntity,
      UserOrmEntity,
      CustomerOrmEntity,
      SystemSettingOrmEntity,
    ]),
  ],
  providers: [
    SpCallerService,
    { provide: SERVICE_ORDER_REPOSITORY, useClass: ServiceOrderRepository },
    { provide: USER_REPOSITORY, useClass: UserRepository },
    { provide: CUSTOMER_REPOSITORY, useClass: CustomerRepository },
    { provide: QUOTE_REPOSITORY, useClass: QuoteRepository },
    { provide: INVENTORY_REPOSITORY, useClass: InventoryRepository },
    { provide: SYSTEM_SETTINGS_REPOSITORY, useClass: SystemSettingsRepository },
    ServiceOrderRepository,
    UserRepository,
    CustomerRepository,
    QuoteRepository,
    InventoryRepository,
    SystemSettingsRepository,
    GetOrderUseCase,
    ApproveQuoteUseCase,
    RevenueReportUseCase,
    TechnicianProductivityUseCase,
    ManageUsersUseCase,
    ManageSettingsUseCase,
  ],
  controllers: [
    AuthViewController,
    DashboardController,
    TrackingViewController,
    ServiceOrdersViewController,
    InventoryViewController,
    ReportsViewController,
    UsersViewController,
    SettingsViewController,
  ],
})
export class ViewsModule {}
