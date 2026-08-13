import {
  Controller, Get, Post, Patch, Param, Body, Query, UseInterceptors,
  UploadedFile, ParseUUIDPipe, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { multerConfig, getPhotoUrl } from '../../shared/utils/file-upload.util';
import { CreateOrderDto } from '../dtos/service-orders/create-order.dto';
import { UpdateStatusDto } from '../dtos/service-orders/update-status.dto';
import { CreateOrderUseCase } from '../../application/service-orders/create-order.use-case';
import { UpdateStatusUseCase } from '../../application/service-orders/update-status.use-case';
import { GetOrderUseCase } from '../../application/service-orders/get-order.use-case';
import { CurrentUser, CurrentUserData } from '../decorators/current-user.decorator';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../../core/domain/enums/role.enum';
import { OrderStatus } from '../../core/domain/enums/order-status.enum';
import { IServiceOrderRepository, SERVICE_ORDER_REPOSITORY } from '../../core/interfaces/repositories/service-order.repository.interface';
import { Inject } from '@nestjs/common';

@ApiTags('Service Orders')
@ApiBearerAuth()
@Controller('api/service-orders')
export class ServiceOrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly updateStatusUseCase: UpdateStatusUseCase,
    private readonly getOrderUseCase: GetOrderUseCase,
    @Inject(SERVICE_ORDER_REPOSITORY)
    private readonly orderRepo: IServiceOrderRepository,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.TECHNICIAN)
  @ApiOperation({ summary: 'Tạo đơn sửa chữa mới' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo', multerConfig))
  async create(
    @Body() dto: CreateOrderDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: CurrentUserData,
  ) {
    if (!file) throw new Error('Bắt buộc phải tải lên ít nhất 1 ảnh ngoại quan thiết bị.');
    const photoUrl = getPhotoUrl(file.filename);
    return this.createOrderUseCase.execute({
      ...dto,
      photoUrl,
      deviceType: '',
      brand: '',
      model: '',
    });
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách đơn sửa chữa' })
  async findAll(
    @Query('status') status?: OrderStatus,
    @Query('technicianId') technicianId?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.orderRepo.findAll({ status, technicianId, page: Number(page), limit: Number(limit) });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết đơn sửa chữa' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getOrderUseCase.executeById(id);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.TECHNICIAN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatusDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    await this.updateStatusUseCase.execute(id, dto.status, user.userId, dto.note);
    return { message: 'Cập nhật trạng thái thành công.' };
  }

  @Post(':id/photos')
  @Roles(Role.ADMIN, Role.TECHNICIAN)
  @ApiOperation({ summary: 'Upload thêm ảnh cho đơn' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo', multerConfig))
  async uploadPhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Query('type') type: 'Before' | 'After' = 'After',
  ) {
    if (!file) throw new Error('Chưa có file ảnh.');
    const photoUrl = getPhotoUrl(file.filename);
    // Direct insert via SP or query for photo upload
    return { photoUrl, type, orderId: id };
  }

  @Patch(':id/assign')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gán kỹ thuật viên cho đơn' })
  async assignTechnician(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('technicianId') technicianId: string,
  ) {
    await this.orderRepo.assignTechnician(id, technicianId);
    return { message: 'Gán kỹ thuật viên thành công.' };
  }
}
