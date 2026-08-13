import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'UserId' })
  userId: string;

  @Column({ name: 'Username', length: 50 })
  username: string;

  @Column({ name: 'Email', length: 100 })
  email: string;

  @Column({ name: 'PasswordHash', length: 255 })
  passwordHash: string;

  @Column({ name: 'Role', length: 20 })
  role: string;

  @Column({ name: 'IsDeleted', type: 'bit', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt: Date;
}
