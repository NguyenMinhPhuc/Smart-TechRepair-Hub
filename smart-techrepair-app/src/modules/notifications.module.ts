import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationOrmEntity } from '../infrastructure/database/typeorm/entities/notification.orm-entity';
import { NotificationRepository } from '../infrastructure/database/repositories/notification.repository';
import { NOTIFICATION_REPOSITORY } from '../core/interfaces/repositories/notification.repository.interface';
import { NotificationUseCase } from '../application/notifications/notification.use-case';
import { NotificationScheduler } from '../infrastructure/schedulers/notification.scheduler';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationOrmEntity]),
    ScheduleModule.forRoot(),
  ],
  providers: [
    { provide: NOTIFICATION_REPOSITORY, useClass: NotificationRepository },
    NotificationRepository,
    NotificationUseCase,
    NotificationScheduler,
  ],
})
export class NotificationsModule {}
