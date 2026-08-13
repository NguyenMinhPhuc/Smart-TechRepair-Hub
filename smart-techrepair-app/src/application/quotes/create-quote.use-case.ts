import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { QuoteEntity } from '../../core/domain/entities/quote.entity';
import { IQuoteRepository, QUOTE_REPOSITORY } from '../../core/interfaces/repositories/quote.repository.interface';
import { IServiceOrderRepository, SERVICE_ORDER_REPOSITORY } from '../../core/interfaces/repositories/service-order.repository.interface';

import { RealtimeGateway } from '../../infrastructure/gateways/realtime.gateway';

@Injectable()
export class CreateQuoteUseCase {
  constructor(
    @Inject(QUOTE_REPOSITORY)
    private readonly quoteRepo: IQuoteRepository,
    @Inject(SERVICE_ORDER_REPOSITORY)
    private readonly orderRepo: IServiceOrderRepository,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async execute(
    orderId: string,
    totalLaborCost: number,
    notes?: string,
  ): Promise<QuoteEntity> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new NotFoundException('Đơn hàng không tồn tại.');
    const quote = await this.quoteRepo.createOrUpdate(orderId, totalLaborCost, notes);

    this.realtimeGateway.emitQuoteUpdated({
      trackingCode: order.trackingCode,
      quoteStatus: 'Pending',
      orderStatus: 'Quoted',
      actionBy: 'Technician',
      message: `Đã có Báo Giá mới cho đơn ${order.trackingCode}!`,
    });

    return quote;
  }

  async addPart(orderId: string, partId: string, quantity: number): Promise<void> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new NotFoundException('Đơn hàng không tồn tại.');
    await this.quoteRepo.addPart(orderId, partId, quantity);
  }
}
