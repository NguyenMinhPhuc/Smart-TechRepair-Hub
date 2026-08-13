import { Injectable, BadRequestException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ICustomerRepository, CUSTOMER_REPOSITORY } from '../../core/interfaces/repositories/customer.repository.interface';
import { IServiceOrderRepository, SERVICE_ORDER_REPOSITORY } from '../../core/interfaces/repositories/service-order.repository.interface';

export interface CreateOrderInput {
  phone: string;
  fullName?: string;
  email?: string;
  deviceType: string;
  brand: string;
  model: string;
  serialIMEI?: string;
  issueDescription: string;
  photoUrl: string;
}

export interface CreateOrderResult {
  orderId: string;
  trackingCode: string;
  customerId: string;
  isNewCustomer: boolean;
}

import { RealtimeGateway } from '../../infrastructure/gateways/realtime.gateway';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
    @Inject(SERVICE_ORDER_REPOSITORY)
    private readonly orderRepo: IServiceOrderRepository,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async execute(input: CreateOrderInput): Promise<CreateOrderResult> {
    if (!input.photoUrl) {
      throw new BadRequestException('Bắt buộc phải có ít nhất 1 ảnh ngoại quan thiết bị.');
    }

    // 1. Find or create customer
    const { customer, isNew } = await this.customerRepo.findOrCreate(
      input.phone,
      input.fullName,
      input.email,
    );

    // 2. Create order (device info embedded in issueDescription for now, DeviceId via SP)
    const { orderId, trackingCode } = await this.orderRepo.create({
      customerId: customer.customerId,
      issueDescription: input.issueDescription,
      photoUrl: input.photoUrl,
    });

    this.realtimeGateway.emitNewOrderCreated({
      trackingCode,
      customerName: customer.fullName || input.phone,
      deviceInfo: `${input.brand} ${input.model}`,
      createdAt: new Date().toISOString(),
    });

    return {
      orderId,
      trackingCode,
      customerId: customer.customerId,
      isNewCustomer: isNew,
    };
  }
}
