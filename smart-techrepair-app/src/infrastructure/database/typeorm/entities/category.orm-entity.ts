import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('Categories')
export class CategoryOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'CategoryId' })
  categoryId: string;

  @Column({ name: 'Name', length: 100 })
  name: string;

  @Column({ name: 'Description', type: 'nvarchar', length: 500, nullable: true })
  description: string | null;

  @Column({ name: 'IsDeleted', type: 'bit', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt: Date;
}
