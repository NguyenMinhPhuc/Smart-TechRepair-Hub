import { Entity, Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('SystemSettings')
export class SystemSettingOrmEntity {
  @PrimaryColumn({ name: 'SettingKey', length: 50 })
  settingKey: string;

  @Column({ name: 'SettingValue', type: 'nvarchar', length: 'max' })
  settingValue: string;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt: Date;
}
