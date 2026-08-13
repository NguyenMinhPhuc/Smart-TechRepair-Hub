import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { DatabaseConfig } from './infrastructure/config/database.config';
import { AuthModule } from './modules/auth.module';
import { ServiceOrdersModule } from './modules/service-orders.module';
import { QuotesModule } from './modules/quotes.module';
import { InventoryModule } from './modules/inventory.module';
import { ReportsModule } from './modules/reports.module';
import { NotificationsModule } from './modules/notifications.module';
import { UsersModule } from './modules/users.module';
import { SettingsModule } from './modules/settings.module';
import { RealtimeModule } from './modules/realtime.module';
import { ViewsModule } from './modules/views.module';

import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { RolesGuard } from './presentation/guards/roles.guard';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import { ResponseTransformInterceptor } from './shared/interceptors/response-transform.interceptor';

@Module({
  imports: [
    // Config (global — available everywhere)
    ConfigModule.forRoot({ isGlobal: true }),

    // Database (TypeORM — read-only queries; writes via SPs)
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),

    // Real-Time WebSockets
    RealtimeModule,

    // Feature Modules
    AuthModule,
    ServiceOrdersModule,
    QuotesModule,
    InventoryModule,
    ReportsModule,
    NotificationsModule,
    UsersModule,
    SettingsModule,
    ViewsModule,
  ],
  providers: [
    // Global Guards
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },

    // Global Exception Filter
    { provide: APP_FILTER, useClass: AllExceptionsFilter },

    // Global Interceptor (wrap /api/* responses)
    { provide: APP_INTERCEPTOR, useClass: ResponseTransformInterceptor },
  ],
})
export class AppModule {}
