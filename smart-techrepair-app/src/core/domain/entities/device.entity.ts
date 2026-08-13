export class DeviceEntity {
  deviceId: string;
  customerId: string;
  deviceType: string;
  brand: string;
  model: string;
  serialIMEI?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
