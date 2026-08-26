import {
  BadRequestException,
  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { DataSource } from 'typeorm';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../core/interfaces/repositories/user.repository.interface';
import {
  ISystemSettingsRepository,
  SYSTEM_SETTINGS_REPOSITORY,
  SystemStoreSettings,
} from '../../core/interfaces/repositories/system-settings.repository.interface';

@Injectable()
export class ManageSettingsUseCase {
  constructor(
    @Inject(SYSTEM_SETTINGS_REPOSITORY)
    private readonly settingsRepo: ISystemSettingsRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getSettings(): Promise<SystemStoreSettings> {
    return this.settingsRepo.getSettings();
  }

  async updateSettings(
    settings: Partial<SystemStoreSettings>,
  ): Promise<SystemStoreSettings> {
    return this.settingsRepo.updateSettings(settings);
  }

  async resetData(adminUserId: string, adminPassword: string): Promise<void> {
    const adminUser = await this.userRepo.findById(adminUserId);
    if (!adminUser) {
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ.');
    }

    const isMatch = await bcrypt.compare(adminPassword, adminUser.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu Admin không đúng.');
    }

    await this.settingsRepo.resetSystemData();
  }

  async seedDemoData(): Promise<{
    createdOrdersCount: number;
    message: string;
  }> {
    // First reset non-admin operational data
    await this.settingsRepo.resetSystemData();

    // Fetch existing categories & technicians
    const [categories, technicians] = await Promise.all([
      this.dataSource.query(
        `SELECT CategoryId, Name FROM Categories WHERE IsDeleted = 0`,
      ),
      this.dataSource.query(
        `SELECT UserId, Username FROM Users WHERE Role = 'Technician' AND IsDeleted = 0`,
      ),
    ]);

    if (!categories.length) {
      throw new BadRequestException(
        'Cần có ít nhất 1 danh mục trước khi tạo dữ liệu demo.',
      );
    }

    const techId = technicians[0]?.UserId ?? null;

    // 20 Sample Customers & Devices
    const demoCustomers = [
      {
        name: 'Nguyễn Văn An',
        phone: '0912345601',
        email: 'an.nguyen@gmail.com',
        deviceType: 'Điện thoại',
        brand: 'Apple',
        model: 'iPhone 13 Pro Max',
        issue: 'Màn hình bị sọc xanh, liệt cảm ứng',
        status: 'Completed',
        laborCost: 250000,
      },
      {
        name: 'Trần Thị Bình',
        phone: '0912345602',
        email: 'binh.tran@gmail.com',
        deviceType: 'Laptop',
        brand: 'Dell',
        model: 'XPS 13 9310',
        issue: 'Pin chai nặng, sạc không vào điện',
        status: 'Repairing',
        laborCost: 200000,
      },
      {
        name: 'Lê Hoàng Cường',
        phone: '0912345603',
        email: 'cuong.le@gmail.com',
        deviceType: 'Máy tính bảng',
        brand: 'Apple',
        model: 'iPad Air 4',
        issue: 'Chân sạc chập chập, không mở được nguồn',
        status: 'Quoted',
        laborCost: 300000,
      },
      {
        name: 'Phạm Minh Đức',
        phone: '0912345604',
        email: 'duc.pham@gmail.com',
        deviceType: 'Điện thoại',
        brand: 'Samsung',
        model: 'Galaxy S22 Ultra',
        issue: 'Vỡ kính lưng, vỡ kính camera sau',
        status: 'Approved',
        laborCost: 150000,
      },
      {
        name: 'Vũ Thị Em',
        phone: '0912345605',
        email: 'em.vu@gmail.com',
        deviceType: 'Laptop',
        brand: 'Asus',
        model: 'ROG Zephyrus G14',
        issue: 'Quạt tản nhiệt kêu to, máy nóng tắt đột ngột',
        status: 'Inspecting',
        laborCost: 180000,
      },
      {
        name: 'Đặng Quốc Phong',
        phone: '0912345606',
        email: 'phong.dang@gmail.com',
        deviceType: 'Điện thoại',
        brand: 'Xiaomi',
        model: '12 Pro',
        issue: 'Loa trong nhỏ, mic nói bên kia không nghe',
        status: 'Created',
        laborCost: 100000,
      },
      {
        name: 'Hoàng Hải Giang',
        phone: '0912345607',
        email: 'giang.hoang@gmail.com',
        deviceType: 'Đồng hồ thông minh',
        brand: 'Apple',
        model: 'Apple Watch Series 7',
        issue: 'Vỡ màn hình cảm ứng, sạc nóng',
        status: 'Completed',
        laborCost: 350000,
      },
      {
        name: 'Bùi Thanh Hương',
        phone: '0912345608',
        email: 'huong.bui@gmail.com',
        deviceType: 'Laptop',
        brand: 'MacBook',
        model: 'MacBook Pro M1 2020',
        issue: 'Bàn phím bị kẹt phím Space, không gõ được',
        status: 'Repairing',
        laborCost: 250000,
      },
      {
        name: 'Đỗ Hùng Dũng',
        phone: '0912345609',
        email: 'dung.do@gmail.com',
        deviceType: 'Điện thoại',
        brand: 'Samsung',
        model: 'Galaxy Z Fold 4',
        issue: 'Màn hình gập trong bị đốm đen',
        status: 'Quoted',
        laborCost: 500000,
      },
      {
        name: 'Ngô Ngọc Trinh',
        phone: '0912345610',
        email: 'trinh.ngo@gmail.com',
        deviceType: 'Điện thoại',
        brand: 'Apple',
        model: 'iPhone 14 Plus',
        issue: 'Camera sau mờ, không lấy nét được',
        status: 'Approved',
        laborCost: 200000,
      },
      {
        name: 'Dương Văn Khoa',
        phone: '0912345611',
        email: 'khoa.duong@gmail.com',
        deviceType: 'Laptop',
        brand: 'Lenovo',
        model: 'ThinkPad X1 Carbon',
        issue: 'Hỏng ổ cứng SSD, máy treo logo ThinkPad',
        status: 'Completed',
        laborCost: 150000,
      },
      {
        name: 'Lý Mỹ Linh',
        phone: '0912345612',
        email: 'linh.ly@gmail.com',
        deviceType: 'Điện thoại',
        brand: 'Oppo',
        model: 'Reno 8 Pro',
        issue: 'Vỡ kính màn hình ngoài',
        status: 'Rejected',
        laborCost: 200000,
      },
      {
        name: 'Mai Văn Nam',
        phone: '0912345613',
        email: 'nam.mai@gmail.com',
        deviceType: 'Laptop',
        brand: 'HP',
        model: 'Envy 13',
        issue: 'Máy bị dính nước, mất nguồn toàn bộ',
        status: 'Cancelled',
        laborCost: 300000,
      },
      {
        name: 'Trịnh Thị Oanh',
        phone: '0912345614',
        email: 'oanh.trinh@gmail.com',
        deviceType: 'Máy tính bảng',
        brand: 'Samsung',
        model: 'Galaxy Tab S8',
        issue: 'Pin phù đẩy cong màn hình',
        status: 'Completed',
        laborCost: 180000,
      },
      {
        name: 'Phan Văn Phú',
        phone: '0912345615',
        email: 'phu.phan@gmail.com',
        deviceType: 'Điện thoại',
        brand: 'Apple',
        model: 'iPhone 11',
        issue: 'Thay pin dung lượng cao',
        status: 'Completed',
        laborCost: 100000,
      },
      {
        name: 'Quách Thị Quyên',
        phone: '0912345616',
        email: 'quyen.quach@gmail.com',
        deviceType: 'Laptop',
        brand: 'Acer',
        model: 'Nitro 5',
        issue: 'Nâng cấp RAM 16GB & vệ sinh tra keo',
        status: 'Completed',
        laborCost: 120000,
      },
      {
        name: 'Sơn Tùng MTP',
        phone: '0912345617',
        email: 'tung.son@gmail.com',
        deviceType: 'Điện thoại',
        brand: 'Apple',
        model: 'iPhone 15 Pro Max',
        issue: 'Trầy xước kính viền, thay vỏ titan',
        status: 'Repairing',
        laborCost: 400000,
      },
      {
        name: 'Tạ Văn Tuấn',
        phone: '0912345618',
        email: 'tuan.ta@gmail.com',
        deviceType: 'Laptop',
        brand: 'Dell',
        model: 'Inspiron 15',
        issue: 'Hỏng bản lề gập mở',
        status: 'Inspecting',
        laborCost: 150000,
      },
      {
        name: 'Ưng Hoàng Phúc',
        phone: '0912345619',
        email: 'phuc.ung@gmail.com',
        deviceType: 'Điện thoại',
        brand: 'Sony',
        model: 'Xperia 1 IV',
        issue: 'Hỏng cảm biến vân tay',
        status: 'Created',
        laborCost: 150000,
      },
      {
        name: 'Vương Dịch Thuận',
        phone: '0912345620',
        email: 'thuan.vuong@gmail.com',
        deviceType: 'Máy tính bảng',
        brand: 'Apple',
        model: 'iPad Mini 6',
        issue: 'Liệt nút nguồn gạt âm lượng',
        status: 'Completed',
        laborCost: 200000,
      },
    ];

    // Seed Parts into Inventory
    const sampleParts = [
      {
        name: 'Màn hình iPhone 13 Pro Max OLED',
        price: 3200000,
        catName: 'Màn hình',
      },
      {
        name: 'Pin MacBook Pro M1 2020 Chính Hãng',
        price: 1850000,
        catName: 'Pin',
      },
      {
        name: 'Màn hình Samsung Galaxy S22 Ultra',
        price: 3900000,
        catName: 'Màn hình',
      },
      { name: 'SSD NVMe Crucial 512GB', price: 1100000, catName: 'SSD/HDD' },
      {
        name: 'Pin iPhone 11 Pisen Dung Lượng Cao',
        price: 450000,
        catName: 'Pin',
      },
      {
        name: 'RAM Laptop Corsair 16GB DDR4 3200MHz',
        price: 950000,
        catName: 'RAM',
      },
      {
        name: 'Vỏ Titan iPhone 15 Pro Max',
        price: 2100000,
        catName: 'Vỏ/Khung',
      },
      {
        name: 'Module Camera Sau iPhone 14 Plus',
        price: 1200000,
        catName: 'Camera',
      },
    ];

    const insertedPartIds: string[] = [];

    for (let i = 0; i < sampleParts.length; i++) {
      const p = sampleParts[i];
      const cat =
        categories.find((c: { Name: string }) => c.Name === p.catName) ??
        categories[0];
      const partId = randomUUID();
      const serialIMEI = `SN-DEMO-${Date.now()}-${i + 100}`;
      await this.dataSource.query(
        `INSERT INTO Parts (PartId, CategoryId, Name, SerialIMEI, Status, Price)
         VALUES ('${partId}', '${cat.CategoryId}', N'${p.name}', '${serialIMEI}', 'New', ${p.price})`,
      );
      insertedPartIds.push(partId);
    }

    // Insert 20 Orders
    for (let i = 0; i < demoCustomers.length; i++) {
      const c = demoCustomers[i];
      const customerId = randomUUID();
      const deviceId = randomUUID();

      // Insert Customer
      await this.dataSource.query(
        `INSERT INTO Customers (CustomerId, FullName, Phone, Email)
         VALUES ('${customerId}', N'${c.name}', '${c.phone}', '${c.email}')`,
      );

      // Insert Device
      await this.dataSource.query(
        `INSERT INTO Devices (DeviceId, CustomerId, DeviceType, Brand, Model, SerialIMEI)
         VALUES ('${deviceId}', '${customerId}', N'${c.deviceType}', N'${c.brand}', N'${c.model}', 'IMEI-${100000000000000 + i}')`,
      );

      // Create Order via SP to trigger TRK code & notification
      const photoUrl = `/uploads/demo-device-${(i % 4) + 1}.jpg`;
      const spRes = await this.dataSource.query(
        `DECLARE @Code VARCHAR(50);
         EXEC sp_CreateServiceOrder @CustomerId = '${customerId}', @DeviceId = '${deviceId}', @IssueDescription = N'${c.issue}', @PhotoUrl = '${photoUrl}', @OutTrackingCode = @Code OUTPUT;
         SELECT @Code AS Code;`,
      );
      const code = spRes[0]?.Code;

      // Update Order Status & Technician if assigned
      if (c.status !== 'Created' && techId) {
        await this.dataSource.query(
          `UPDATE ServiceOrders SET Status = '${c.status}', TechnicianId = '${techId}' WHERE TrackingCode = '${code}'`,
        );
      }

      // Add Quote & Parts for Quoted/Approved/Repairing/Completed/Rejected orders
      if (
        ['Quoted', 'Approved', 'Repairing', 'Completed', 'Rejected'].includes(
          c.status,
        )
      ) {
        const orderRow = await this.dataSource.query(
          `SELECT OrderId FROM ServiceOrders WHERE TrackingCode = '${code}'`,
        );
        const orderId = orderRow[0]?.OrderId;

        if (orderId) {
          await this.dataSource.query(
            `EXEC sp_CreateOrUpdateQuote @OrderId = '${orderId}', @TotalLaborCost = ${c.laborCost}, @Notes = N'Đã kiểm tra linh kiện thay thế'`,
          );

          // Add a part if available
          const partId = insertedPartIds[i % insertedPartIds.length];
          if (partId) {
            try {
              await this.dataSource.query(
                `EXEC sp_AddOrderPart @OrderId = '${orderId}', @PartId = '${partId}', @Quantity = 1`,
              );
            } catch {
              // Ignore part lock conflict during batch seeder
            }
          }

          // Update Quote status matching order
          const quoteStatus = ['Approved', 'Completed', 'Repairing'].includes(
            c.status,
          )
            ? 'Approved'
            : c.status === 'Rejected'
              ? 'Rejected'
              : 'Pending';
          await this.dataSource.query(
            `UPDATE Quotes SET Status = '${quoteStatus}' WHERE OrderId = '${orderId}'`,
          );
        }
      }
    }

    return {
      createdOrdersCount: demoCustomers.length,
      message: `Đã khởi tạo thành công ${demoCustomers.length} bộ dữ liệu demo hoàn chỉnh!`,
    };
  }
}
