import {
  Controller, Post, Patch, Body, Param, ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AddPartDto, CreateQuoteDto, QuoteDecisionDto } from '../dtos/quotes/create-quote.dto';
import { CreateQuoteUseCase } from '../../application/quotes/create-quote.use-case';
import { ApproveQuoteUseCase } from '../../application/quotes/approve-quote.use-case';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../../core/domain/enums/role.enum';
import { Public } from '../decorators/public.decorator';

@ApiTags('Quotes')
@ApiBearerAuth()
@Controller('api/quotes')
export class QuotesController {
  constructor(
    private readonly createQuoteUseCase: CreateQuoteUseCase,
    private readonly approveQuoteUseCase: ApproveQuoteUseCase,
  ) {}

  @Post(':orderId')
  @Roles(Role.TECHNICIAN, Role.ADMIN)
  @ApiOperation({ summary: 'Tạo/cập nhật báo giá cho đơn' })
  async createQuote(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() dto: CreateQuoteDto,
  ) {
    return this.createQuoteUseCase.execute(orderId, dto.totalLaborCost, dto.notes);
  }

  @Post(':orderId/parts')
  @Roles(Role.TECHNICIAN, Role.ADMIN)
  @ApiOperation({ summary: 'Thêm linh kiện vào báo giá' })
  async addPart(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() dto: AddPartDto,
  ) {
    await this.createQuoteUseCase.addPart(orderId, dto.partId, dto.quantity);
    return { message: 'Thêm linh kiện thành công.' };
  }

  @Patch(':trackingCode/approve')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Khách hàng chấp nhận báo giá (không cần đăng nhập)' })
  async approve(
    @Param('trackingCode') trackingCode: string,
    @Body() dto: QuoteDecisionDto,
  ) {
    await this.approveQuoteUseCase.approve(trackingCode, dto.phone);
    return { message: 'Báo giá đã được chấp nhận.' };
  }

  @Patch(':trackingCode/reject')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Khách hàng từ chối báo giá (không cần đăng nhập)' })
  async reject(
    @Param('trackingCode') trackingCode: string,
    @Body() dto: QuoteDecisionDto,
  ) {
    await this.approveQuoteUseCase.reject(trackingCode, dto.phone);
    return { message: 'Báo giá đã bị từ chối.' };
  }
}
