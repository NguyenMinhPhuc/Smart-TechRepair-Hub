import { NotificationEntity } from '../../domain/entities/notification.entity';

export interface INotificationRepository {
  findPending(limit: number): Promise<NotificationEntity[]>;
  markSent(notifId: string): Promise<void>;
  markFailed(notifId: string): Promise<void>;
  incrementRetry(notifId: string): Promise<void>;
}

export const NOTIFICATION_REPOSITORY = 'INotificationRepository';
