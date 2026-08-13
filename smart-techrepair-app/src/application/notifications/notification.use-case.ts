import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { NotificationEntity } from '../../core/domain/entities/notification.entity';
import { NotificationType } from '../../core/domain/enums/notification-status.enum';
import { INotificationRepository, NOTIFICATION_REPOSITORY } from '../../core/interfaces/repositories/notification.repository.interface';

@Injectable()
export class NotificationUseCase {
  private readonly logger = new Logger(NotificationUseCase.name);

  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notifRepo: INotificationRepository,
  ) {}

  /**
   * Process pending notifications — called by cron job
   */
  async processPending(): Promise<void> {
    const pending = await this.notifRepo.findPending(10);

    for (const notif of pending) {
      try {
        await this.sendNotification(notif);
        await this.notifRepo.markSent(notif.notifId);
        this.logger.log(`Notification ${notif.notifId} sent via ${notif.type}`);
      } catch (err) {
        this.logger.error(`Failed to send notification ${notif.notifId}`, err);
        if (notif.retryCount >= 3) {
          await this.notifRepo.markFailed(notif.notifId);
        } else {
          await this.notifRepo.incrementRetry(notif.notifId);
        }
      }
    }
  }

  private async sendNotification(notif: NotificationEntity): Promise<void> {
    // Placeholder: integrate with actual SMS/Email gateway
    if (notif.type === NotificationType.SMS) {
      this.logger.debug(`[SMS] To order ${notif.orderId}: ${notif.content}`);
      // await smsGateway.send(phone, notif.content);
    } else if (notif.type === NotificationType.EMAIL) {
      this.logger.debug(`[Email] To order ${notif.orderId}: ${notif.content}`);
      // await emailGateway.send(email, subject, notif.content);
    }
  }
}
