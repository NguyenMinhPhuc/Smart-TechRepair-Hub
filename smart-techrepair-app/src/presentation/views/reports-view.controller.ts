import { Controller, Get, Post, Body, Render, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RevenueReportUseCase } from '../../application/reports/revenue-report.use-case';
import { TechnicianProductivityUseCase } from '../../application/reports/technician-productivity.use-case';
import { DataSource } from 'typeorm';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsViewController {
  constructor(
    private readonly revenueReport: RevenueReportUseCase,
    private readonly productivityReport: TechnicianProductivityUseCase,
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  @Render('reports/index')
  async index(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const now = new Date();
    const fromDate = from ? new Date(from) : new Date(now.getFullYear(), now.getMonth(), 1);
    const toDate = to ? new Date(to) : now;

    const [revenue, productivity, technicians] = await Promise.all([
      this.revenueReport.execute(fromDate, toDate),
      this.productivityReport.execute(fromDate, toDate),
      this.dataSource.query(`SELECT UserId, Username FROM Users WHERE Role = 'Technician' AND IsDeleted = 0`),
    ]);

    return {
      title: 'Báo cáo & Thống kê',
      revenue,
      productivity,
      technicians,
      fromDate: fromDate.toISOString().split('T')[0],
      toDate: toDate.toISOString().split('T')[0],
    };
  }
}
