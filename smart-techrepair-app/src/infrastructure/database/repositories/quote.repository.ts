import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuoteEntity } from '../../../core/domain/entities/quote.entity';
import { QuoteStatus } from '../../../core/domain/enums/quote-status.enum';
import { IQuoteRepository } from '../../../core/interfaces/repositories/quote.repository.interface';
import { SpCallerService } from '../sp-caller.service';
import { QuoteOrmEntity } from '../typeorm/entities/quote.orm-entity';

@Injectable()
export class QuoteRepository implements IQuoteRepository {
  constructor(
    @InjectRepository(QuoteOrmEntity)
    private readonly repo: Repository<QuoteOrmEntity>,
    private readonly sp: SpCallerService,
  ) {}

  async createOrUpdate(
    orderId: string,
    totalLaborCost: number,
    notes?: string,
  ): Promise<QuoteEntity> {
    await this.sp.execute('sp_CreateOrUpdateQuote', {
      OrderId: orderId,
      TotalLaborCost: totalLaborCost,
      Notes: notes ?? null,
    });
    const quote = await this.repo.findOne({ where: { orderId } });
    return this.toEntity(quote!);
  }

  async addPart(
    orderId: string,
    partId: string,
    quantity: number,
  ): Promise<void> {
    await this.repo.manager.transaction(async (manager) => {
      const orderRows = await manager.query(
        `SELECT OrderId FROM ServiceOrders WHERE OrderId = @0 AND IsDeleted = 0`,
        [orderId],
      );

      if (!orderRows[0]) {
        throw new BadRequestException('Đơn sửa chữa không tồn tại.');
      }

      const partRows = await manager.query(
        `SELECT PartId, Status, Price FROM Parts WHERE PartId = @0 AND IsDeleted = 0`,
        [partId],
      );
      const part = partRows[0];

      if (!part) {
        throw new BadRequestException(
          'Không tìm thấy linh kiện phù hợp trong kho.',
        );
      }

      if (!['New', 'Used'].includes(part.Status)) {
        throw new BadRequestException(
          'Chỉ có thể thêm linh kiện ở trạng thái Mới hoặc Đã qua sử dụng.',
        );
      }

      const quoteRows = await manager.query(
        `SELECT QuoteId FROM Quotes WHERE OrderId = @0`,
        [orderId],
      );

      if (!quoteRows[0]) {
        await manager.query(
          `INSERT INTO Quotes (OrderId, TotalLaborCost, TotalPartsCost, Status)
           VALUES (@0, 0.00, 0.00, 'Pending')`,
          [orderId],
        );
        await manager.query(
          `UPDATE ServiceOrders SET Status = 'Quoted', UpdatedAt = SYSDATETIME() WHERE OrderId = @0`,
          [orderId],
        );
      }

      await manager.query(
        `INSERT INTO OrderParts (OrderId, PartId, Quantity) VALUES (@0, @1, @2)`,
        [orderId, partId, quantity],
      );

      if (part.Status === 'New') {
        await manager.query(
          `UPDATE Parts SET Status = 'Used', UpdatedAt = SYSDATETIME() WHERE PartId = @0`,
          [partId],
        );
      }

      await manager.query(
        `UPDATE Quotes
         SET TotalPartsCost = (
           SELECT ISNULL(SUM(P.Price * OP.Quantity), 0.00)
           FROM OrderParts OP
           INNER JOIN Parts P ON OP.PartId = P.PartId
           WHERE OP.OrderId = @0
         ), UpdatedAt = SYSDATETIME()
         WHERE OrderId = @0`,
        [orderId],
      );
    });
  }

  async approveOrReject(
    trackingCode: string,
    phone: string,
    action: 'Approve' | 'Reject',
  ): Promise<void> {
    await this.sp.execute('sp_ApproveOrRejectQuote', {
      TrackingCode: trackingCode,
      Phone: phone,
      Action: action,
    });
  }

  async findByOrderId(orderId: string): Promise<QuoteEntity | null> {
    const entity = await this.repo.findOne({ where: { orderId } });
    return entity ? this.toEntity(entity) : null;
  }

  private toEntity(orm: QuoteOrmEntity): QuoteEntity {
    const e = new QuoteEntity();
    e.quoteId = orm.quoteId;
    e.orderId = orm.orderId;
    e.totalLaborCost = Number(orm.totalLaborCost);
    e.totalPartsCost = Number(orm.totalPartsCost);
    e.status = orm.status as QuoteStatus;
    e.notes = orm.notes ?? undefined;
    e.createdAt = orm.createdAt;
    e.updatedAt = orm.updatedAt;
    return e;
  }
}
