import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IQuoteRepository, QUOTE_REPOSITORY } from '../../core/interfaces/repositories/quote.repository.interface';

import { RealtimeGateway } from '../../infrastructure/gateways/realtime.gateway';

@Injectable()
export class ApproveQuoteUseCase {
  constructor(
    @Inject(QUOTE_REPOSITORY)
    private readonly quoteRepo: IQuoteRepository,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async approve(trackingCode: string, phone: string): Promise<void> {
    await this.quoteRepo.approveOrReject(trackingCode, phone, 'Approve');

    this.realtimeGateway.emitQuoteUpdated({
      trackingCode,
      quoteStatus: 'Approved',
      orderStatus: 'Approved',
      actionBy: 'Customer',
      message: `Khách hàng vừa Chấp nhận Báo Giá cho đơn ${trackingCode}!`,
    });
  }

  async reject(trackingCode: string, phone: string): Promise<void> {
    await this.quoteRepo.approveOrReject(trackingCode, phone, 'Reject');

    this.realtimeGateway.emitQuoteUpdated({
      trackingCode,
      quoteStatus: 'Rejected',
      orderStatus: 'Rejected',
      actionBy: 'Customer',
      message: `Khách hàng vừa Từ Chối Báo Giá cho đơn ${trackingCode}. Linh kiện đã hoàn trả về kho.`,
    });
  }
}
