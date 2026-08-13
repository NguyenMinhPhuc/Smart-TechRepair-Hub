import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Parts')
export class PartOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'PartId' })
  partId: string;

  @Column({ name: 'CategoryId' })
  categoryId: string;

  @Column({ name: 'Name', length: 150 })
  name: string;

  @Column({ name: 'SerialIMEI', length: 100 })
  serialIMEI: string;

  @Column({ name: 'Status', length: 20, default: 'New' })
  status: string;

  @Column({ name: 'Price', type: 'decimal', precision: 18, scale: 2 })
  price: number;

  @Column({ name: 'IsDeleted', type: 'bit', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt: Date;
}
