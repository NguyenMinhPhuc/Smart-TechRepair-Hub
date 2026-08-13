import { OrderStatus } from '../enums/order-status.enum';

export class ServiceOrderEntity {
  orderId: string;
  trackingCode: string;
  customerId: string;
  deviceId?: string;
  technicianId?: string;
  issueDescription: string;
  status: OrderStatus;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
