import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationUseCase } from '../../application/notifications/notification.use-case';

@Injectable()
export class NotificationScheduler {
  private readonly logger = new Logger(NotificationScheduler.name);

  constructor(private readonly notificationUseCase: NotificationUseCase) {}

  @Cron(CronExpression.EVERY_2_HOURS)
  async handlePendingNotifications(): Promise<void> {
    this.logger.log('[Cron] Processing pending notifications...');
    await this.notificationUseCase.processPending();
  }
}
