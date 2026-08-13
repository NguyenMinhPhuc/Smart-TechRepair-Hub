import { Controller, Get, Render, UseGuards, Res, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { DataSource } from 'typeorm';
import { Response, Request } from 'express';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  @Render('dashboard/index')
  async index(@Req() req: Request) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const [pendingOrders, pendingQuotes, revenueToday, lowStockParts] = await Promise.all([
      this.dataSource.query(
        `SELECT COUNT(*) AS count FROM ServiceOrders WHERE Status IN ('Created','Inspecting') AND IsDeleted = 0`,
      ),
      this.dataSource.query(
        `SELECT COUNT(*) AS count FROM ServiceOrders WHERE Status = 'Quoted' AND IsDeleted = 0`,
      ),
      this.dataSource.query(
        `EXEC sp_GetRevenueReport @FromDate = '${startOfDay.toISOString()}', @ToDate = '${endOfDay.toISOString()}'`,
      ),
      this.dataSource.query(
        `SELECT COUNT(*) AS count FROM Parts WHERE Status = 'New' AND IsDeleted = 0`,
      ),
    ]);

    return {
      title: 'Dashboard — Smart TechRepair Hub',
      user: (req as Request & { user?: { username: string; role: string } }).user,
      metrics: {
        pendingOrders: Number(pendingOrders[0]?.count ?? 0),
        pendingQuotes: Number(pendingQuotes[0]?.count ?? 0),
        revenueToday: Number(revenueToday[0]?.TotalGrossRevenue ?? 0),
        availableParts: Number(lowStockParts[0]?.count ?? 0),
      },
    };
  }
}
