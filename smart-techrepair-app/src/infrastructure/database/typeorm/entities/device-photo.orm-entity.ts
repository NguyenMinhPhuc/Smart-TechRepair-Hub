import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('DevicePhotos')
export class DevicePhotoOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'PhotoId' })
  photoId: string;

  @Column({ name: 'OrderId' })
  orderId: string;

  @Column({ name: 'PhotoUrl', length: 500 })
  photoUrl: string;

  @Column({ name: 'PhotoType', length: 20, default: 'Before' })
  photoType: string;

  @CreateDateColumn({ name: 'UploadedAt' })
  uploadedAt: Date;
}
