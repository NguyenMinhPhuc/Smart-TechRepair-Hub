import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Render,
  UseGuards,
  Req,
  Redirect,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { DataSource } from 'typeorm';
import { Request } from 'express';

import * as QRCode from 'qrcode';

import {
  ISystemSettingsRepository,
  SYSTEM_SETTINGS_REPOSITORY,
} from '../../core/interfaces/repositories/system-settings.repository.interface';
import { Inject } from '@nestjs/common';

@Controller('service-orders')
@UseGuards(JwtAuthGuard)
export class ServiceOrdersViewController {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(SYSTEM_SETTINGS_REPOSITORY)
    private readonly settingsRepo: ISystemSettingsRepository,
  ) {}

  @Get()
  @Render('service-orders/index')
  async index(@Query('status') status?: string, @Query('page') page = 1) {
    const limit = 20;
    const offset = (Number(page) - 1) * limit;
    const statusFilter = status ? `AND SO.Status = '${status}'` : '';

    const [orders, countResult] = await Promise.all([
      this.dataSource.query(
        `SELECT SO.OrderId, SO.TrackingCode, SO.Status, SO.CreatedAt, SO.UpdatedAt,
                C.FullName, C.Phone, U.Username AS TechnicianName,
                D.Brand, D.Model, D.DeviceType
         FROM ServiceOrders SO
         INNER JOIN Customers C ON SO.CustomerId = C.CustomerId
         LEFT JOIN Users U ON SO.TechnicianId = U.UserId
         LEFT JOIN Devices D ON SO.DeviceId = D.DeviceId
         WHERE SO.IsDeleted = 0 ${statusFilter}
         ORDER BY SO.CreatedAt DESC
         OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`,
      ),
      this.dataSource.query(
        `SELECT COUNT(*) AS total FROM ServiceOrders SO WHERE SO.IsDeleted = 0 ${statusFilter}`,
      ),
    ]);

    return {
      title: 'Quản lý Đơn sửa chữa',
      orders,
      total: Number(countResult[0]?.total ?? 0),
      page: Number(page),
      limit,
      currentStatus: status ?? '',
      statuses: [
        'Created',
        'Inspecting',
        'Quoted',
        'Approved',
        'Rejected',
        'Repairing',
        'Completed',
        'Cancelled',
      ],
    };
  }

  @Get(':id')
  @Render('service-orders/detail')
  async detail(@Param('id') id: string) {
    const [order, photos, quote, parts, technicians] = await Promise.all([
      this.dataSource.query(
        `SELECT SO.*, C.FullName, C.Phone, C.Email,
                D.Brand, D.Model, D.DeviceType, D.SerialIMEI AS DeviceSerial,
                U.Username AS TechnicianName
         FROM ServiceOrders SO
         INNER JOIN Customers C ON SO.CustomerId = C.CustomerId
         LEFT JOIN Devices D ON SO.DeviceId = D.DeviceId
         LEFT JOIN Users U ON SO.TechnicianId = U.UserId
         WHERE SO.OrderId = '${id}' AND SO.IsDeleted = 0`,
      ),
      this.dataSource.query(
        `SELECT PhotoId, PhotoUrl, PhotoType, UploadedAt FROM DevicePhotos WHERE OrderId = '${id}' ORDER BY UploadedAt ASC`,
      ),
      this.dataSource.query(
        `SELECT Q.*, 
                (SELECT SUM(P.Price * OP.Quantity) FROM OrderParts OP INNER JOIN Parts P ON OP.PartId = P.PartId WHERE OP.OrderId = '${id}') AS CalculatedPartsCost
         FROM Quotes Q WHERE Q.OrderId = '${id}'`,
      ),
      this.dataSource.query(
        `SELECT P.PartId, P.Name, P.SerialIMEI, P.Price, P.Status, OP.Quantity, CAT.Name AS CategoryName
         FROM OrderParts OP
         INNER JOIN Parts P ON OP.PartId = P.PartId
         INNER JOIN Categories CAT ON P.CategoryId = CAT.CategoryId
         WHERE OP.OrderId = '${id}'`,
      ),
      this.dataSource.query(
        `SELECT UserId, Username FROM Users WHERE Role = 'Technician' AND IsDeleted = 0`,
      ),
    ]);

    if (!order[0]) return { title: 'Không tìm thấy', notFound: true };

    const mappedPhotos = (photos || []).map((p: any) => ({
      PhotoId: p.PhotoId || p.photoId,
      PhotoUrl: p.PhotoUrl || p.photoUrl,
      PhotoType: p.PhotoType || p.photoType,
      UploadedAt: p.UploadedAt || p.uploadedAt,
      photoId: p.PhotoId || p.photoId,
      photoUrl: p.PhotoUrl || p.photoUrl,
      photoType: p.PhotoType || p.photoType,
      uploadedAt: p.UploadedAt || p.uploadedAt,
    }));

    return {
      title: `Đơn ${order[0].TrackingCode}`,
      order: order[0],
      photos: mappedPhotos,
      quote: quote[0] ?? null,
      parts,
      technicians,
    };
  }

  @Get(':id/receipt')
  @Render('service-orders/receipt')
  async receipt(@Param('id') id: string, @Req() req: Request) {
    const [orderRows, settings] = await Promise.all([
      this.dataSource.query(
        `SELECT SO.*, C.FullName, C.Phone, C.Email,
                D.Brand, D.Model, D.DeviceType, D.SerialIMEI AS DeviceSerial,
                U.Username AS TechnicianName
         FROM ServiceOrders SO
         INNER JOIN Customers C ON SO.CustomerId = C.CustomerId
         LEFT JOIN Devices D ON SO.DeviceId = D.DeviceId
         LEFT JOIN Users U ON SO.TechnicianId = U.UserId
         WHERE SO.OrderId = '${id}' AND SO.IsDeleted = 0`,
      ),
      this.settingsRepo.getSettings(),
    ]);

    if (!orderRows[0]) return { title: 'Không tìm thấy đơn hàng' };
    const order = orderRows[0];

    const host = req.headers['host'] ?? 'localhost:3000';
    const protocol = req.protocol ?? 'http';
    const trackingUrl = `${protocol}://${host}/tracking?code=${order.TrackingCode}&phone=${order.Phone}`;

    const qrCodeDataUrl = await QRCode.toDataURL(trackingUrl, {
      margin: 1,
      width: 180,
    });

    return {
      layout: 'layouts/auth',
      title: `Phiếu Tiếp Nhận — ${order.TrackingCode}`,
      order,
      storeSettings: settings,
      qrCodeDataUrl,
      trackingUrl,
    };
  }
}
