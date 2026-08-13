import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceOrderEntity } from '../../../core/domain/entities/service-order.entity';
import { OrderStatus } from '../../../core/domain/enums/order-status.enum';
import {
  CreateOrderParams,
  IServiceOrderRepository,
} from '../../../core/interfaces/repositories/service-order.repository.interface';
import { SpCallerService } from '../sp-caller.service';
import { ServiceOrderOrmEntity } from '../typeorm/entities/service-order.orm-entity';

@Injectable()
export class ServiceOrderRepository implements IServiceOrderRepository {
  constructor(
    @InjectRepository(ServiceOrderOrmEntity)
    private readonly repo: Repository<ServiceOrderOrmEntity>,
    private readonly sp: SpCallerService,
  ) {}

  async create(params: CreateOrderParams): Promise<{ orderId: string; trackingCode: string }> {
    const result = await this.sp.executeWithOutput<{ OutTrackingCode: string }>(
      'sp_CreateServiceOrder',
      {
        CustomerId: params.customerId,
        DeviceId: params.deviceId ?? null,
        IssueDescription: params.issueDescription,
        PhotoUrl: params.photoUrl,
      },
      ['OutTrackingCode'],
    );
    const order = await this.repo.findOne({
      where: { trackingCode: result.OutTrackingCode },
    });
    return { orderId: order!.orderId, trackingCode: result.OutTrackingCode };
  }

  async findById(orderId: string): Promise<ServiceOrderEntity | null> {
    const entity = await this.repo.findOne({ where: { orderId, isDeleted: false } });
    return entity ? this.toEntity(entity) : null;
  }

  async findByTrackingCode(trackingCode: string): Promise<ServiceOrderEntity | null> {
    const entity = await this.repo.findOne({ where: { trackingCode, isDeleted: false } });
    return entity ? this.toEntity(entity) : null;
  }

  async findAll(filters: {
    status?: OrderStatus;
    technicianId?: string;
    page: number;
    limit: number;
  }): Promise<{ data: ServiceOrderEntity[]; total: number }> {
    const qb = this.repo
      .createQueryBuilder('so')
      .where('so.isDeleted = :deleted', { deleted: false });

    if (filters.status) qb.andWhere('so.status = :status', { status: filters.status });
    if (filters.technicianId) qb.andWhere('so.technicianId = :tech', { tech: filters.technicianId });

    const [data, total] = await qb
      .orderBy('so.createdAt', 'DESC')
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit)
      .getManyAndCount();

    return { data: data.map((e) => this.toEntity(e)), total };
  }

  async updateStatus(
    orderId: string,
    newStatus: OrderStatus,
    userId: string,
    note?: string,
  ): Promise<void> {
    await this.sp.execute('sp_UpdateOrderStatus', {
      OrderId: orderId,
      NewStatus: newStatus,
      UserId: userId,
      Note: note ?? null,
    });
  }

  async assignTechnician(orderId: string, technicianId: string): Promise<void> {
    // Direct update via query — only for assignment (not a business state mutation)
    await this.repo.update({ orderId }, { technicianId, updatedAt: new Date() });
  }

  async softDelete(orderId: string): Promise<void> {
    await this.sp.execute('sp_SoftDeleteEntity', { EntityType: 'Order', EntityId: orderId });
  }

  private toEntity(orm: ServiceOrderOrmEntity): ServiceOrderEntity {
    const entity = new ServiceOrderEntity();
    entity.orderId = orm.orderId;
    entity.trackingCode = orm.trackingCode;
    entity.customerId = orm.customerId;
    entity.deviceId = orm.deviceId ?? undefined;
    entity.technicianId = orm.technicianId ?? undefined;
    entity.issueDescription = orm.issueDescription;
    entity.status = orm.status as OrderStatus;
    entity.isDeleted = orm.isDeleted;
    entity.createdAt = orm.createdAt;
    entity.updatedAt = orm.updatedAt;
    return entity;
  }
}
