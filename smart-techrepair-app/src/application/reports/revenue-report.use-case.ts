import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';

export interface RevenueReportResult {
  totalCompletedOrders: number;
  totalLaborRevenue: number;
  totalPartsRevenue: number;
  totalGrossRevenue: number;
  fromDate: Date;
  toDate: Date;
}

@Injectable()
export class RevenueReportUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute(fromDate: Date, toDate: Date): Promise<RevenueReportResult> {
    if (fromDate > toDate) {
      throw new BadRequestException('Khoảng thời gian không hợp lệ: "Đến ngày" phải sau "Từ ngày".');
    }

    const results = await this.dataSource.query(
      `EXEC sp_GetRevenueReport @FromDate = @0, @ToDate = @1`,
      [fromDate.toISOString(), toDate.toISOString()],
    );

    const row = results[0] ?? {};
    return {
      totalCompletedOrders: Number(row['TotalCompletedOrders'] ?? 0),
      totalLaborRevenue: Number(row['TotalLaborRevenue'] ?? 0),
      totalPartsRevenue: Number(row['TotalPartsRevenue'] ?? 0),
      totalGrossRevenue: Number(row['TotalGrossRevenue'] ?? 0),
      fromDate,
      toDate,
    };
  }
}
