import { Controller, Get, Post, Body, Render, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public } from '../decorators/public.decorator';
import { GetOrderUseCase } from '../../application/service-orders/get-order.use-case';
import { ApproveQuoteUseCase } from '../../application/quotes/approve-quote.use-case';

@Public()
@Controller('tracking')
export class TrackingViewController {
  constructor(
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly approveQuoteUseCase: ApproveQuoteUseCase,
  ) {}

  @Get()
  async searchPage(
    @Query('code') code?: string,
    @Query('phone') phone?: string,
    @Query('approved') approved?: string,
    @Query('rejected') rejected?: string,
    @Res() res?: Response,
  ) {
    if (code && phone && res) {
      return this.doSearch(code, phone, approved === '1', rejected === '1', res);
    }
    return res?.render('tracking/search', {
      layout: 'layouts/auth',
      title: 'Tra cứu đơn sửa chữa — Smart TechRepair Hub',
      trackingCode: code ?? '',
      phone: phone ?? '',
    });
  }

  @Post('search')
  async search(
    @Body('trackingCode') trackingCode: string,
    @Body('phone') phone: string,
    @Res() res: Response,
  ) {
    return this.doSearch(trackingCode, phone, false, false, res);
  }

  @Post('approve')
  async approveFromView(
    @Body('trackingCode') trackingCode: string,
    @Body('phone') phone: string,
    @Res() res: Response,
  ) {
    try {
      await this.approveQuoteUseCase.approve(trackingCode, phone);
      return res.redirect(`/tracking?code=${encodeURIComponent(trackingCode)}&phone=${encodeURIComponent(phone)}&approved=1`);
    } catch (err: any) {
      return res.render('tracking/search', {
        layout: 'layouts/auth',
        title: 'Tra cứu đơn sửa chữa',
        error: err?.message || 'Có lỗi xảy ra khi chấp nhận báo giá.',
        trackingCode,
        phone,
      });
    }
  }

  @Post('reject')
  async rejectFromView(
    @Body('trackingCode') trackingCode: string,
    @Body('phone') phone: string,
    @Res() res: Response,
  ) {
    try {
      await this.approveQuoteUseCase.reject(trackingCode, phone);
      return res.redirect(`/tracking?code=${encodeURIComponent(trackingCode)}&phone=${encodeURIComponent(phone)}&rejected=1`);
    } catch (err: any) {
      return res.render('tracking/search', {
        layout: 'layouts/auth',
        title: 'Tra cứu đơn sửa chữa',
        error: err?.message || 'Có lỗi xảy ra khi từ chối báo giá.',
        trackingCode,
        phone,
      });
    }
  }

  private async doSearch(
    trackingCode: string,
    phone: string,
    approved: boolean,
    rejected: boolean,
    res: Response,
  ) {
    try {
      const result = await this.getOrderUseCase.executeByTrackingAndPhone(trackingCode, phone);
      const isQuoted = result.order.status === 'Quoted';
      const isApproved = result.order.status === 'Approved';
      const isRejected = result.order.status === 'Rejected';

      return res.render('tracking/result', {
        layout: 'layouts/auth',
        title: `Đơn hàng ${trackingCode}`,
        found: true,
        order: result.order,
        photos: result.photos,
        quote: result.quote,
        parts: result.parts,
        customer: result.customer,
        device: result.device,
        phone,
        trackingCode,
        isQuoted,
        isApproved,
        isRejected,
        approved,
        rejected,
      });
    } catch (err: any) {
      return res.render('tracking/result', {
        layout: 'layouts/auth',
        title: 'Tra cứu đơn sửa chữa',
        found: false,
        error: err?.message || 'Thông tin không khớp hoặc đơn hàng không tồn tại.',
        trackingCode,
        phone,
      });
    }
  }
}
