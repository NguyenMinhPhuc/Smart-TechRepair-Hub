import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Quotes')
export class QuoteOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'QuoteId' })
  quoteId: string;

  @Column({ name: 'OrderId' })
  orderId: string;

  @Column({ name: 'TotalLaborCost', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalLaborCost: number;

  @Column({ name: 'TotalPartsCost', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalPartsCost: number;

  @Column({ name: 'Status', length: 20, default: 'Pending' })
  status: string;

  @Column({ name: 'Notes', type: 'nvarchar', length: 'max', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt: Date;
}
