import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';

export interface TechnicianProductivityRow {
  technicianId: string;
  technicianName: string;
  email: string;
  totalCompletedOrders: number;
  avgProcessingHours: number;
}

@Injectable()
export class TechnicianProductivityUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute(
    fromDate: Date,
    toDate: Date,
    technicianId?: string,
  ): Promise<TechnicianProductivityRow[]> {
    if (fromDate > toDate) {
      throw new BadRequestException('Khoảng thời gian không hợp lệ.');
    }

    const results = await this.dataSource.query(
      `EXEC sp_GetTechnicianProductivity @FromDate = @0, @ToDate = @1, @TechnicianId = @2`,
      [fromDate.toISOString(), toDate.toISOString(), technicianId ?? null],
    );

    return results.map((r: Record<string, unknown>) => ({
      technicianId: r['TechnicianId'] as string,
      technicianName: r['TechnicianName'] as string,
      email: r['Email'] as string,
      totalCompletedOrders: Number(r['TotalCompletedOrders'] ?? 0),
      avgProcessingHours: Number(r['AvgProcessingHours'] ?? 0),
    }));
  }
}
