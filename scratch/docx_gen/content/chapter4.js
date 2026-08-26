const {
  createHeading1,
  createHeading2,
  createHeading3,
  createParagraph,
  createBulletPoint,
  createStyledTable,
  createCodeBlock,
  createCalloutBox,
  createPageBreak
} = require('../helpers');

function getChapter4Section() {
  const elements = [];

  elements.push(createPageBreak());
  elements.push(createHeading1('Chương 4. TRIỂN KHAI ỨNG DỤNG HỆ THỐNG'));

  elements.push(createHeading2('4.1. Kiến trúc mã nguồn Clean Architecture trong dự án'));
  elements.push(createParagraph([
    'Mã nguồn hệ thống Backend NestJS của dự án ',
    { text: 'Smart TechRepair Hub', bold: true },
    ' được tổ chức cây thư mục chuẩn hóa theo các tầng của Clean Architecture tại đường dẫn ',
    { text: 'smart-techrepair-app/src', bold: true },
    ':'
  ]));

  const folderStructureText = `smart-techrepair-app/src/
├── core/                        # Tầng Trung tâm (Domain Core & Interfaces)
│   ├── domain/                  # Các Thực thể và Enum nghiệp vụ thuần túy
│   │   ├── entities/
│   │   │   ├── category.entity.ts
│   │   │   ├── customer.entity.ts
│   │   │   ├── device.entity.ts
│   │   │   ├── notification.entity.ts
│   │   │   ├── part.entity.ts
│   │   │   ├── quote.entity.ts
│   │   │   ├── service-order.entity.ts
│   │   │   └── user.entity.ts
│   │   └── enums/
│   │       ├── order-status.enum.ts
│   │       ├── part-status.enum.ts
│   │       ├── quote-status.enum.ts
│   │       └── role.enum.ts
│   └── interfaces/              # Các Hợp đồng Repositories & Services
│       └── repositories/
│           ├── customer.repository.interface.ts
│           ├── inventory.repository.interface.ts
│           ├── quote.repository.interface.ts
│           └── service-order.repository.interface.ts
├── application/                 # Tầng Kịch bản Nghiệp vụ (Use Cases)
│   ├── auth/                    # LoginUseCase
│   ├── inventory/               # ManageInventoryUseCase
│   ├── notifications/           # NotificationUseCase
│   ├── quotes/                  # ApproveQuoteUseCase, CreateQuoteUseCase
│   ├── reports/                 # RevenueReportUseCase, TechnicianProductivityUseCase
│   └── service-orders/          # CreateOrderUseCase, GetOrderUseCase, UpdateStatusUseCase
└── infrastructure/              # Tầng Hạ tầng & Giao tiếp Bên ngoài
    ├── controllers/             # REST Controllers (Express/NestJS)
    ├── database/                # TypeORM Entities & Repository Implementations
    └── services/                # MailerService, JwtStrategy, BcryptPasswordHasherService`;

  elements.push(createCodeBlock(folderStructureText));

  elements.push(createHeading2('4.2. Triển khai Module Tiếp nhận và Tạo Đơn sửa chữa (Service Order Intake)'));
  elements.push(createParagraph([
    'Module Tiếp nhận quản lý toàn bộ quy trình từ lúc khách hàng mang thiết bị tới trung tâm. Kỹ thuật viên kiểm tra, chụp ảnh ngoại quan và kích hoạt quy trình tạo đơn. Mã nguồn TypeScript minh họa cho ',
    { text: 'CreateOrderUseCase', bold: true },
    ' như sau:'
  ]));

  const createOrderCode = `// src/application/service-orders/create-order.use-case.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { IServiceOrderRepository } from '../../core/interfaces/repositories/service-order.repository.interface';
import { ICustomerRepository } from '../../core/interfaces/repositories/customer.repository.interface';
import { OrderStatus } from '../../core/domain/enums/order-status.enum';

export interface CreateOrderDto {
  customerPhone: string;
  customerName?: string;
  deviceType: string;
  brand: string;
  model: string;
  serialImei?: string;
  issueDescription: string;
  photoUrls: string[];
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly orderRepo: IServiceOrderRepository,
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(dto: CreateOrderDto, technicianId: string) {
    if (!dto.photoUrls || dto.photoUrls.length === 0) {
      throw new BadRequestException('Bắt buộc phải tải lên ít nhất 1 ảnh ngoại quan thiết bị.');
    }

    // 1. Tìm hoặc khởi tạo Khách hàng
    let customer = await this.customerRepo.findByPhone(dto.customerPhone);
    if (!customer) {
      if (!dto.customerName) {
        throw new BadRequestException('Cần nhập Tên khách hàng đối với SĐT mới.');
      }
      customer = await this.customerRepo.create({
        fullName: dto.customerName,
        phone: dto.customerPhone,
      });
    }

    // 2. Lưu thông tin Đơn sửa chữa & Thiết bị
    const order = await this.orderRepo.createServiceOrder({
      customerId: customer.customerId,
      technicianId: technicianId,
      deviceType: dto.deviceType,
      brand: dto.brand,
      model: dto.model,
      serialImei: dto.serialImei,
      issueDescription: dto.issueDescription,
      status: OrderStatus.CREATED,
      photoUrls: dto.photoUrls,
    });

    return {
      message: 'Tạo đơn sửa chữa thành công',
      trackingCode: order.trackingCode,
      orderId: order.orderId,
    };
  }
}`;

  elements.push(createCodeBlock(createOrderCode));

  elements.push(createHeading2('4.3. Triển khai Module Cổng tra cứu và Duyệt báo giá Khách hàng (Customer Portal)'));
  elements.push(createParagraph([
    'Cổng tra cứu công khai cho phép khách hàng chủ động theo dõi tiến độ sửa chữa realtime và phê duyệt báo giá mà không cần mật khẩu. Mã nguồn triển khai ',
    { text: 'ApproveQuoteUseCase', bold: true },
    ' xử lý logic cập nhật trạng thái đơn hàng dựa trên quyết định của khách hàng:'
  ]));

  const approveQuoteCode = `// src/application/quotes/approve-quote.use-case.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IQuoteRepository } from '../../core/interfaces/repositories/quote.repository.interface';
import { IServiceOrderRepository } from '../../core/interfaces/repositories/service-order.repository.interface';
import { OrderStatus } from '../../core/domain/enums/order-status.enum';
import { QuoteStatus } from '../../core/domain/enums/quote-status.enum';

@Injectable()
export class ApproveQuoteUseCase {
  constructor(
    private readonly quoteRepo: IQuoteRepository,
    private readonly orderRepo: IServiceOrderRepository,
  ) {}

  async execute(trackingCode: string, customerPhone: string, isApproved: boolean) {
    // 1. Xác thực đơn hàng theo TrackingCode và SĐT
    const order = await this.orderRepo.findByTrackingAndPhone(trackingCode, customerPhone);
    if (!order) {
      throw new NotFoundException('Thông tin không khớp hoặc đơn hàng không tồn tại.');
    }

    if (order.status !== OrderStatus.QUOTED) {
      throw new BadRequestException('Đơn hàng hiện tại không ở trạng thái chờ duyệt báo giá.');
    }

    // 2. Cập nhật trạng thái Báo giá & Đơn hàng
    const quote = await this.quoteRepo.findByOrderId(order.orderId);
    if (!quote) {
      throw new NotFoundException('Không tìm thấy bản ghi báo giá.');
    }

    if (isApproved) {
      await this.quoteRepo.updateStatus(quote.quoteId, QuoteStatus.APPROVED);
      await this.orderRepo.updateStatus(order.orderId, OrderStatus.APPROVED);
    } else {
      await this.quoteRepo.updateStatus(quote.quoteId, QuoteStatus.REJECTED);
      await this.orderRepo.updateStatus(order.orderId, OrderStatus.REJECTED);
    }

    return {
      success: true,
      newStatus: isApproved ? OrderStatus.APPROVED : OrderStatus.REJECTED,
      message: isApproved ? 'Đã chấp nhận báo giá. Đơn hàng chuyển sang sửa chữa.' : 'Đã từ chối báo giá.',
    };
  }
}`;

  elements.push(createCodeBlock(approveQuoteCode));

  elements.push(createHeading2('4.4. Triển khai Module Báo cáo và Thống kê Quản trị (Reporting & Analytics)'));
  elements.push(createParagraph([
    'Báo cáo doanh thu được tính toán tự động bằng cách tổng hợp chi phí linh kiện và phí dịch vụ từ tất cả các đơn sửa chữa hoàn thành (Status = Completed) trong khoảng thời gian chỉ định:'
  ]));

  const reportCode = `// src/application/reports/revenue-report.use-case.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { IServiceOrderRepository } from '../../core/interfaces/repositories/service-order.repository.interface';

@Injectable()
export class RevenueReportUseCase {
  constructor(private readonly orderRepo: IServiceOrderRepository) {}

  async execute(fromDateStr: string, toDateStr: string) {
    const fromDate = new Date(fromDateStr);
    const toDate = new Date(toDateStr);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime()) || fromDate > toDate) {
      throw new BadRequestException('Khoảng thời gian báo cáo không hợp lệ.');
    }

    const completedOrders = await this.orderRepo.findCompletedOrdersInPeriod(fromDate, toDate);

    let totalPartsRevenue = 0;
    let totalLaborRevenue = 0;

    completedOrders.forEach(order => {
      if (order.quote) {
        totalPartsRevenue += Number(order.quote.totalPartsCost || 0);
        totalLaborRevenue += Number(order.quote.totalLaborCost || 0);
      }
    });

    const grandTotalRevenue = totalPartsRevenue + totalLaborRevenue;

    return {
      period: { from: fromDateStr, to: toDateStr },
      totalCompletedOrders: completedOrders.length,
      totalPartsRevenue,
      totalLaborRevenue,
      grandTotalRevenue,
      details: completedOrders.map(o => ({
        trackingCode: o.trackingCode,
        completedAt: o.updatedAt,
        partsCost: o.quote?.totalPartsCost,
        laborCost: o.quote?.totalLaborCost,
        totalCost: Number(o.quote?.totalPartsCost || 0) + Number(o.quote?.totalLaborCost || 0),
      })),
    };
  }
}`;

  elements.push(createCodeBlock(reportCode));

  elements.push(createCalloutBox(
    'KẾT LUẬN CHƯƠNG 4',
    [
      'Toàn bộ các phân hệ chức năng từ Tiếp nhận, Cổng khách hàng, Báo giá đến Báo cáo Quản trị đã được triển khai hoàn chỉnh bằng TypeScript trong NestJS Framework.',
      'Việc tuân thủ nghiêm ngặt Clean Architecture giúp mã nguồn có tính đóng gói cao, độc lập giữa logic nghiệp vụ và hạ tầng cơ sở dữ liệu.'
    ]
  ));

  return elements;
}

module.exports = { getChapter4Section };
