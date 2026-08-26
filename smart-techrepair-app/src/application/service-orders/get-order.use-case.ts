import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ServiceOrderEntity } from '../../core/domain/entities/service-order.entity';
import {
  IServiceOrderRepository,
  SERVICE_ORDER_REPOSITORY,
} from '../../core/interfaces/repositories/service-order.repository.interface';
import { OrderStatus } from '../../core/domain/enums/order-status.enum';

export interface OrderDetailResult {
  order: ServiceOrderEntity;
  photos: {
    photoId: string;
    photoUrl: string;
    photoType: string;
    uploadedAt: Date;
  }[];
  quote: {
    totalLaborCost: number;
    totalPartsCost: number;
    status: string;
    notes?: string;
  } | null;
  parts: {
    partId: string;
    name: string;
    serialIMEI: string;
    price: number;
    quantity: number;
    status: string;
  }[];
  customer: {
    customerId: string;
    fullName: string;
    phone: string;
    email?: string;
  };
  device?: {
    deviceId: string;
    deviceType: string;
    brand: string;
    model: string;
    serialIMEI?: string;
  };
}

@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject(SERVICE_ORDER_REPOSITORY)
    private readonly orderRepo: IServiceOrderRepository,
    private readonly dataSource: DataSource,
  ) {}

  async executeById(orderId: string): Promise<OrderDetailResult> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new NotFoundException('Đơn hàng không tồn tại.');
    return this.buildDetail(order);
  }

  async executeByTrackingAndPhone(
    trackingCode: string,
    phone: string,
  ): Promise<OrderDetailResult> {
    const rows = await this.dataSource.query(
      `SELECT SO.*, C.Phone FROM ServiceOrders SO
       INNER JOIN Customers C ON SO.CustomerId = C.CustomerId
       WHERE SO.TrackingCode = @0 AND C.Phone = @1 AND SO.IsDeleted = 0`,
      [trackingCode, phone],
    );
    if (!rows || rows.length === 0) {
      throw new NotFoundException(
        'Thông tin không khớp hoặc đơn hàng không tồn tại.',
      );
    }
    const order = await this.orderRepo.findByTrackingCode(trackingCode);
    return this.buildDetail(order!);
  }

  private async buildDetail(
    order: ServiceOrderEntity,
  ): Promise<OrderDetailResult> {
    const [photos, quote, parts, customer, device] = await Promise.all([
      this.dataSource.query(
        `SELECT PhotoId, PhotoUrl, PhotoType, UploadedAt FROM DevicePhotos WHERE OrderId = '${order.orderId}'`,
      ),
      this.dataSource.query(
        `SELECT TotalLaborCost, TotalPartsCost, Status, Notes FROM Quotes WHERE OrderId = '${order.orderId}'`,
      ),
      this.dataSource.query(
        `SELECT P.PartId, P.Name, P.SerialIMEI, P.Price, P.Status, OP.Quantity
         FROM OrderParts OP INNER JOIN Parts P ON OP.PartId = P.PartId
         WHERE OP.OrderId = '${order.orderId}'`,
      ),
      this.dataSource.query(
        `SELECT CustomerId, FullName, Phone, Email FROM Customers WHERE CustomerId = '${order.customerId}'`,
      ),
      order.deviceId
        ? this.dataSource.query(
            `SELECT DeviceId, DeviceType, Brand, Model, SerialIMEI FROM Devices WHERE DeviceId = '${order.deviceId}'`,
          )
        : Promise.resolve([]),
    ]);

    return {
      order,
      photos: photos.map((p: Record<string, unknown>) => ({
        photoId: (p['PhotoId'] || p['photoId']) as string,
        photoUrl: (p['PhotoUrl'] || p['photoUrl']) as string,
        photoType: (p['PhotoType'] || p['photoType']) as string,
        uploadedAt: (p['UploadedAt'] || p['uploadedAt']) as Date,
        PhotoId: (p['PhotoId'] || p['photoId']) as string,
        PhotoUrl: (p['PhotoUrl'] || p['photoUrl']) as string,
        PhotoType: (p['PhotoType'] || p['photoType']) as string,
        UploadedAt: (p['UploadedAt'] || p['uploadedAt']) as Date,
      })),
      quote: quote[0]
        ? {
            totalLaborCost: Number(quote[0]['TotalLaborCost']),
            totalPartsCost: Number(quote[0]['TotalPartsCost']),
            status: quote[0]['Status'] as string,
            notes: quote[0]['Notes'] as string | undefined,
          }
        : null,
      parts: parts.map((p: Record<string, unknown>) => ({
        partId: p['PartId'] as string,
        name: p['Name'] as string,
        serialIMEI: p['SerialIMEI'] as string,
        price: Number(p['Price']),
        quantity: p['Quantity'] as number,
        status: p['Status'] as string,
      })),
      customer: {
        customerId: customer[0]['CustomerId'] as string,
        fullName: customer[0]['FullName'] as string,
        phone: customer[0]['Phone'] as string,
        email: customer[0]['Email'] as string | undefined,
      },
      device: device[0]
        ? {
            deviceId: device[0]['DeviceId'] as string,
            deviceType: device[0]['DeviceType'] as string,
            brand: device[0]['Brand'] as string,
            model: device[0]['Model'] as string,
            serialIMEI: device[0]['SerialIMEI'] as string | undefined,
          }
        : undefined,
    };
  }
}
