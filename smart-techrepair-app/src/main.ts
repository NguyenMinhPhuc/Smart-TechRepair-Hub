import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import hbs from 'hbs';
import { AppModule } from './app.module';
import { globalValidationPipe } from './shared/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ── Middleware ──────────────────────────────────────────────────────────────
  app.use(cookieParser());

  // ── Validation ──────────────────────────────────────────────────────────────
  app.useGlobalPipes(globalValidationPipe);

  // ── Static Files ─────────────────────────────────────────────────────────────
  app.useStaticAssets(path.join(process.cwd(), 'public'), { prefix: '/' });

  // ── Handlebars (SSR Views) ───────────────────────────────────────────────────
  app.setBaseViewsDir(path.join(process.cwd(), 'views'));
  app.setViewEngine('hbs');
  app.set('view options', { layout: 'layouts/main' });
  hbs.registerPartials(path.join(process.cwd(), 'views', 'partials'));

  // Handlebars helpers
  hbs.registerHelper('eq', function (a: unknown, b: unknown, options: any) {
    if (options && typeof options.fn === 'function') {
      return a === b ? options.fn(this) : options.inverse(this);
    }
    return a === b;
  });
  hbs.registerHelper('neq', function (a: unknown, b: unknown, options: any) {
    if (options && typeof options.fn === 'function') {
      return a !== b ? options.fn(this) : options.inverse(this);
    }
    return a !== b;
  });
  hbs.registerHelper('partConditionLabel', (status: string) => {
    if (status === 'New' || status === 'Mới') return 'Mới 100%';
    if (status === 'Used' || status === 'Đã dùng') return 'Đã qua sử dụng';
    if (status === 'Damaged' || status === 'Hỏng') return 'Linh kiện cũ/Hỏng';
    return status || 'Mới 100%';
  });
  hbs.registerHelper('partConditionBadge', (status: string) => {
    if (status === 'New' || status === 'Mới') return 'badge-success';
    if (status === 'Used' || status === 'Đã dùng') return 'badge-warning';
    if (status === 'Damaged' || status === 'Hỏng') return 'badge-danger';
    return 'badge-success';
  });
  hbs.registerHelper('formatDate', (date: Date | string) => {
    if (!date) return '';
    return new Date(date).toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
    });
  });
  hbs.registerHelper('formatCurrency', (amount: number) => {
    if (amount == null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  });
  hbs.registerHelper('statusBadge', (status: string) => {
    const badges: Record<string, string> = {
      Created: 'badge-primary',
      Inspecting: 'badge-info',
      Quoted: 'badge-warning',
      Approved: 'badge-success',
      Rejected: 'badge-danger',
      Repairing: 'badge-purple',
      Completed: 'badge-success',
      Cancelled: 'badge-secondary',
    };
    return badges[status] ?? 'badge-secondary';
  });
  hbs.registerHelper('statusLabel', (status: string) => {
    const labels: Record<string, string> = {
      Created: 'Đã tiếp nhận',
      Inspecting: 'Đang kiểm tra',
      Quoted: 'Chờ xác nhận báo giá',
      Approved: 'Báo giá được duyệt',
      Rejected: 'Từ chối báo giá',
      Repairing: 'Đang sửa chữa',
      Completed: 'Hoàn thành',
      Cancelled: 'Đã hủy',
    };
    return labels[status] ?? status;
  });
  hbs.registerHelper('add', (a: number, b: number) => a + b);
  hbs.registerHelper('subtract', (a: number, b: number) => a - b);
  hbs.registerHelper('json', (context: unknown) => JSON.stringify(context));

  // ── Swagger (API Docs) ────────────────────────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Smart TechRepair Hub API')
    .setDescription('Hệ thống Quản lý Sửa chữa & Bảo hành Thiết bị Điện tử')
    .setVersion('2.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // ── Root redirect ─────────────────────────────────────────────────────────────
  app.getHttpAdapter().get('/', (_req, res) => {
    (res as { redirect: (url: string) => void }).redirect('/dashboard');
  });

  // ── Listen ────────────────────────────────────────────────────────────────────
  const port = process.env['PORT'] ?? 3000;
  await app.listen(port);
  console.log(`🚀 Smart TechRepair Hub running at: http://localhost:${port}`);
  console.log(`📚 Swagger API Docs: http://localhost:${port}/api/docs`);
  console.log(`🔍 Public Tracking: http://localhost:${port}/tracking`);
}

bootstrap();
