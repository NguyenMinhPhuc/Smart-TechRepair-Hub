import { ServiceOrderEntity } from '../../domain/entities/service-order.entity';
import { OrderStatus } from '../../domain/enums/order-status.enum';

export interface CreateOrderParams {
  customerId: string;
  deviceId?: string;
  issueDescription: string;
  photoUrl: string;
}

export interface IServiceOrderRepository {
  create(params: CreateOrderParams): Promise<{ orderId: string; trackingCode: string }>;
  findById(orderId: string): Promise<ServiceOrderEntity | null>;
  findByTrackingCode(trackingCode: string): Promise<ServiceOrderEntity | null>;
  findAll(filters: { status?: OrderStatus; technicianId?: string; page: number; limit: number }): Promise<{ data: ServiceOrderEntity[]; total: number }>;
  updateStatus(orderId: string, newStatus: OrderStatus, userId: string, note?: string): Promise<void>;
  assignTechnician(orderId: string, technicianId: string): Promise<void>;
  addPhoto(orderId: string, photoUrl: string, photoType?: string): Promise<void>;
  softDelete(orderId: string): Promise<void>;
}

export const SERVICE_ORDER_REPOSITORY = 'IServiceOrderRepository';
