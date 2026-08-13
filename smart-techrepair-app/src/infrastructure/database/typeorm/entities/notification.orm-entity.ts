import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('Notifications')
export class NotificationOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'NotifId' })
  notifId: string;

  @Column({ name: 'OrderId' })
  orderId: string;

  @Column({ name: 'Type', length: 10 })
  type: string;

  @Column({ name: 'Content', type: 'nvarchar', length: 'max' })
  content: string;

  @Column({ name: 'Status', length: 20, default: 'Pending' })
  status: string;

  @Column({ name: 'SentAt', type: 'datetime2', nullable: true })
  sentAt: Date | null;

  @Column({ name: 'RetryCount', type: 'int', default: 0 })
  retryCount: number;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt: Date;
}
