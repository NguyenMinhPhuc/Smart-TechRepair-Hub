import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Devices')
export class DeviceOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'DeviceId' })
  deviceId: string;

  @Column({ name: 'CustomerId' })
  customerId: string;

  @Column({ name: 'DeviceType', length: 50 })
  deviceType: string;

  @Column({ name: 'Brand', length: 100 })
  brand: string;

  @Column({ name: 'Model', length: 150 })
  model: string;

  @Column({ name: 'SerialIMEI', type: 'nvarchar', length: 100, nullable: true })
  serialIMEI: string | null;

  @Column({ name: 'Notes', type: 'nvarchar', length: 'max', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt: Date;
}
