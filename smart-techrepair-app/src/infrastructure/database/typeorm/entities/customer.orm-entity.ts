import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Customers')
export class CustomerOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'CustomerId' })
  customerId: string;

  @Column({ name: 'FullName', length: 100 })
  fullName: string;

  @Column({ name: 'Phone', length: 10 })
  phone: string;

  @Column({ name: 'Email', type: 'nvarchar', length: 100, nullable: true })
  email: string | null;

  @Column({ name: 'IsDeleted', type: 'bit', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt: Date;
}
