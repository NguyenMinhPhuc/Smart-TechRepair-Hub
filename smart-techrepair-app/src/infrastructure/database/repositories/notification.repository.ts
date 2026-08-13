import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from '../../../core/domain/entities/notification.entity';
import { NotificationStatus, NotificationType } from '../../../core/domain/enums/notification-status.enum';
import { INotificationRepository } from '../../../core/interfaces/repositories/notification.repository.interface';
import { NotificationOrmEntity } from '../typeorm/entities/notification.orm-entity';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(NotificationOrmEntity)
    private readonly repo: Repository<NotificationOrmEntity>,
  ) {}

  async findPending(limit: number): Promise<NotificationEntity[]> {
    const entities = await this.repo.find({
      where: { status: NotificationStatus.PENDING },
      order: { createdAt: 'ASC' },
      take: limit,
    });
    return entities.map((e) => this.toEntity(e));
  }

  async markSent(notifId: string): Promise<void> {
    await this.repo.update({ notifId }, { status: NotificationStatus.SENT, sentAt: new Date() });
  }

  async markFailed(notifId: string): Promise<void> {
    await this.repo.update({ notifId }, { status: NotificationStatus.FAILED });
  }

  async incrementRetry(notifId: string): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .update(NotificationOrmEntity)
      .set({ retryCount: () => 'RetryCount + 1', status: NotificationStatus.PENDING })
      .where('NotifId = :id', { id: notifId })
      .execute();
  }

  private toEntity(orm: NotificationOrmEntity): NotificationEntity {
    const e = new NotificationEntity();
    e.notifId = orm.notifId;
    e.orderId = orm.orderId;
    e.type = orm.type as NotificationType;
    e.content = orm.content;
    e.status = orm.status as NotificationStatus;
    e.sentAt = orm.sentAt ?? undefined;
    e.retryCount = orm.retryCount;
    e.createdAt = orm.createdAt;
    return e;
  }
}
