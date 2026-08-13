import { Module } from '@nestjs/common';
import { RevenueReportUseCase } from '../application/reports/revenue-report.use-case';
import { TechnicianProductivityUseCase } from '../application/reports/technician-productivity.use-case';
import { ReportsController } from '../presentation/api/reports.controller';

@Module({
  providers: [RevenueReportUseCase, TechnicianProductivityUseCase],
  controllers: [ReportsController],
})
export class ReportsModule {}
