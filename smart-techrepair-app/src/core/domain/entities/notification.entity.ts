import { NotificationStatus, NotificationType } from '../enums/notification-status.enum';

export class NotificationEntity {
  notifId: string;
  orderId: string;
  type: NotificationType;
  content: string;
  status: NotificationStatus;
  sentAt?: Date;
  retryCount: number;
  createdAt: Date;
}
