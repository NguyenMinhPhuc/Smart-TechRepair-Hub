import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('ServiceOrders')
export class ServiceOrderOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'OrderId' })
  orderId: string;

  @Column({ name: 'TrackingCode', length: 50 })
  trackingCode: string;

  @Column({ name: 'CustomerId' })
  customerId: string;

  @Column({ name: 'DeviceId', type: 'uniqueidentifier', nullable: true })
  deviceId: string | null;

  @Column({ name: 'TechnicianId', type: 'uniqueidentifier', nullable: true })
  technicianId: string | null;

  @Column({ name: 'IssueDescription', type: 'nvarchar', length: 'max' })
  issueDescription: string;

  @Column({ name: 'Status', length: 30, default: 'Created' })
  status: string;

  @Column({ name: 'IsDeleted', type: 'bit', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt: Date;
}
