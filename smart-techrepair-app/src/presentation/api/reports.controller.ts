import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../../core/domain/enums/role.enum';
import { RevenueReportUseCase } from '../../application/reports/revenue-report.use-case';
import { TechnicianProductivityUseCase } from '../../application/reports/technician-productivity.use-case';

@ApiTags('Reports')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('api/reports')
export class ReportsController {
  constructor(
    private readonly revenueReport: RevenueReportUseCase,
    private readonly productivityReport: TechnicianProductivityUseCase,
  ) {}

  @Get('revenue')
  @ApiOperation({ summary: 'Báo cáo doanh thu theo khoảng ngày' })
  async revenue(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return this.revenueReport.execute(fromDate, toDate);
  }

  @Get('technician-productivity')
  @ApiOperation({ summary: 'Báo cáo năng suất kỹ thuật viên' })
  async technicianProductivity(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('technicianId') technicianId?: string,
  ) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return this.productivityReport.execute(fromDate, toDate, technicianId);
  }
}
