import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GetOrderUseCase } from '../../application/service-orders/get-order.use-case';
import { Public } from '../decorators/public.decorator';

@ApiTags('Tracking')
@Controller('api/tracking')
export class TrackingController {
  constructor(private readonly getOrderUseCase: GetOrderUseCase) {}

  @Get(':code')
  @Public()
  @ApiOperation({ summary: 'Tra cứu tiến độ sửa chữa bằng TrackingCode + SĐT (không cần đăng nhập)' })
  async track(
    @Param('code') code: string,
    @Query('phone') phone: string,
  ) {
    if (!phone) throw new NotFoundException('Vui lòng cung cấp số điện thoại để tra cứu.');
    return this.getOrderUseCase.executeByTrackingAndPhone(code, phone);
  }
}
