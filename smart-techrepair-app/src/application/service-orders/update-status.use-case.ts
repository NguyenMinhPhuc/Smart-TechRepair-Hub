import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { OrderStatus, VALID_TRANSITIONS } from '../../core/domain/enums/order-status.enum';
import { IServiceOrderRepository, SERVICE_ORDER_REPOSITORY } from '../../core/interfaces/repositories/service-order.repository.interface';

import { RealtimeGateway } from '../../infrastructure/gateways/realtime.gateway';

@Injectable()
export class UpdateStatusUseCase {
  constructor(
    @Inject(SERVICE_ORDER_REPOSITORY)
    private readonly orderRepo: IServiceOrderRepository,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async execute(orderId: string, newStatus: OrderStatus, userId: string, note?: string): Promise<void> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new NotFoundException('Đơn hàng không tồn tại.');

    const allowed = VALID_TRANSITIONS[order.status];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Không thể chuyển từ trạng thái "${order.status}" sang "${newStatus}".`,
      );
    }

    await this.orderRepo.updateStatus(orderId, newStatus, userId, note);

    // Emit Real-Time WebSocket event
    const statusLabels: Record<string, string> = {
      Created: 'Đã tiếp nhận', Inspecting: 'Đang kiểm tra', Quoted: 'Chờ xác nhận báo giá',
      Approved: 'Báo giá được duyệt', Rejected: 'Từ chối báo giá', Repairing: 'Đang sửa chữa',
      Completed: 'Hoàn thành', Cancelled: 'Đã hủy',
    };

    this.realtimeGateway.emitOrderStatusChanged({
      trackingCode: order.trackingCode,
      newStatus,
      newStatusLabel: statusLabels[newStatus] ?? newStatus,
      note,
      updatedAt: new Date().toISOString(),
    });
  }
}
