const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');

async function createPresentation() {
  console.log('Generating Graduation Defense Presentation (.pptx)...');

  const pres = new pptxgen();
  
  // Explicitly define 13.33 x 7.5 inches Widescreen Layout
  pres.defineLayout({ name: 'WIDE_16_9', width: 13.33, height: 7.5 });
  pres.layout = 'WIDE_16_9';

  // Palette
  const COLOR_NAVY = '1F4E78';
  const COLOR_SLATE = '2F5597';
  const COLOR_DARK = '262626';
  const COLOR_CARD_BG = 'EBF1F5';
  const COLOR_BORDER = 'CCCCCC';
  const COLOR_WHITE = 'FFFFFF';
  const COLOR_ACCENT = 'D9534F';

  // Helper for adding standard header and footer to content slides
  function addHeaderFooter(slide, slideTitle, categoryText = 'BÁO CÁO TỐT NGHIỆP') {
    // Header background bar (y: 0 to 0.75)
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0,
      y: 0,
      w: '100%',
      h: 0.75,
      fill: { color: COLOR_NAVY }
    });

    // Category / Top Tag
    slide.addText(categoryText.toUpperCase(), {
      x: 0.5,
      y: 0.06,
      w: 8,
      h: 0.22,
      fontSize: 9,
      fontFace: 'Arial',
      color: 'B0C4DE',
      bold: true
    });

    // Slide Title
    slide.addText(slideTitle, {
      x: 0.5,
      y: 0.28,
      w: 12,
      h: 0.38,
      fontSize: 17,
      fontFace: 'Arial',
      color: COLOR_WHITE,
      bold: true
    });

    // Footer line (y: 6.85) and footer text (y: 6.9)
    slide.addShape(pres.shapes.LINE, {
      x: 0.5,
      y: 6.85,
      w: 12.33,
      h: 0,
      line: { color: COLOR_BORDER, width: 1 }
    });

    slide.addText('Hệ thống Quản lý & Điều hành Trung tâm Sửa chữa Smart TechRepair Hub', {
      x: 0.5,
      y: 6.9,
      w: 9,
      h: 0.25,
      fontSize: 9,
      fontFace: 'Arial',
      color: '777777',
      italic: true
    });
  }

  // ==========================================
  // SLIDE 1: TRANG BÌA (Title Slide)
  // ==========================================
  const slide1 = pres.addSlide();
  slide1.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: '100%', h: '100%',
    fill: { color: COLOR_NAVY }
  });

  slide1.addText('TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN\nKHOA KỸ THUẬT PHẦN MỀM / HỆ THỐNG THÔNG TIN', {
    x: 1.0, y: 0.5, w: 11.33, h: 0.7,
    fontSize: 14, fontFace: 'Arial', color: 'B0C4DE', align: 'center', bold: true
  });

  slide1.addShape(pres.shapes.RECTANGLE, {
    x: 1.0, y: 1.4, w: 11.33, h: 2.9,
    fill: { color: COLOR_WHITE },
    line: { color: '4682B4', width: 2 }
  });

  slide1.addText('BÁO CÁO TỐT NGHIỆP', {
    x: 1.2, y: 1.55, w: 10.93, h: 0.35,
    fontSize: 15, fontFace: 'Arial', color: COLOR_ACCENT, align: 'center', bold: true
  });

  slide1.addText('HỆ THỐNG QUẢN LÝ VÀ ĐIỀU HÀNH TRUNG TÂM SỬA CHỮA THIẾT BỊ CÔNG NGHỆ THÔNG MINH\n(SMART TECHREPAIR HUB)', {
    x: 1.2, y: 2.0, w: 10.93, h: 2.0,
    fontSize: 20, fontFace: 'Arial', color: COLOR_NAVY, align: 'center', bold: true
  });

  slide1.addText([
    { text: 'Sinh viên thực hiện: ', options: { bold: true, color: COLOR_WHITE } },
    { text: 'Nguyen Minh Phuc (MSSV: 20268888)\n', options: { color: 'E0E0E0' } },
    { text: 'Giảng viên hướng dẫn: ', options: { bold: true, color: COLOR_WHITE } },
    { text: 'TS. Nguyễn Văn A', options: { color: 'E0E0E0' } }
  ], {
    x: 1.0, y: 4.65, w: 11.33, h: 1.2,
    fontSize: 13.5, fontFace: 'Arial', align: 'center'
  });

  slide1.addText('TP. HỒ CHÍ MINH - NĂM 2026', {
    x: 1.0, y: 6.4, w: 11.33, h: 0.35,
    fontSize: 11, fontFace: 'Arial', color: 'B0C4DE', align: 'center', italic: true
  });


  // ==========================================
  // SLIDE 2: NỘI DUNG TRÌNH BÀY (Agenda)
  // ==========================================
  const slide2 = pres.addSlide();
  addHeaderFooter(slide2, '1. NỘI DUNG TRÌNH BÀY (AGENDA)');

  const agendaItems = [
    { num: '01', title: 'Đặt vấn đề & Mục tiêu nghiên cứu', desc: 'Thực trạng ngành sửa chữa & 4 mục tiêu cốt lõi' },
    { num: '02', title: 'Phương pháp & Công nghệ', desc: 'Clean Architecture, NestJS, SQL Server & Next.js' },
    { num: '03', title: 'Phân tích & Thiết kế Hệ thống', desc: 'Sơ đồ Use Case, ERD 9 bảng & Chuẩn hóa 3NF' },
    { num: '04', title: 'Kết quả Triển khai Chức năng', desc: 'Intake, Customer Portal, Kho Serial & Analytics' },
    { num: '05', title: 'Kiểm thử Hệ thống', desc: 'Ma trận 22 Testcases nghiệp vụ trọng yếu' },
    { num: '06', title: 'Đánh giá & Hướng phát triển', desc: 'Ưu/Nhược điểm & Roadmap tích hợp AI/IoT' }
  ];

  agendaItems.forEach((item, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.6 + col * 6.1;
    const y = 1.0 + row * 1.85;

    slide2.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: 5.8, h: 1.6,
      fill: { color: COLOR_CARD_BG },
      line: { color: COLOR_SLATE, width: 1.2 },
      rectRadius: 0.08
    });

    slide2.addShape(pres.shapes.OVAL, {
      x: x + 0.25, y: y + 0.35, w: 0.9, h: 0.9,
      fill: { color: COLOR_NAVY }
    });

    slide2.addText(item.num, {
      x: x + 0.25, y: y + 0.35, w: 0.9, h: 0.9,
      fontSize: 15, fontFace: 'Arial', color: COLOR_WHITE, bold: true, align: 'center'
    });

    slide2.addText(item.title, {
      x: x + 1.35, y: y + 0.2, w: 4.2, h: 0.45,
      fontSize: 12.5, fontFace: 'Arial', color: COLOR_NAVY, bold: true
    });

    slide2.addText(item.desc, {
      x: x + 1.35, y: y + 0.7, w: 4.2, h: 0.75,
      fontSize: 10, fontFace: 'Arial', color: COLOR_DARK
    });
  });


  // ==========================================
  // SLIDE 3: MỤC TIÊU NGHIÊN CỨU (Objectives)
  // ==========================================
  const slide3 = pres.addSlide();
  addHeaderFooter(slide3, '2. MỤC TIÊU & PHẠM VI NGHIÊN CỨU');

  // Left Card: Thực trạng
  slide3.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 0.95, w: 5.8, h: 5.6,
    fill: { color: 'FFF5F5' },
    line: { color: COLOR_ACCENT, width: 1.2 }
  });

  slide3.addText('THỰC TRẠNG & BẤT CẬP HIỆN NAY', {
    x: 0.8, y: 1.1, w: 5.4, h: 0.35,
    fontSize: 12.5, fontFace: 'Arial', color: COLOR_ACCENT, bold: true, align: 'center'
  });

  const problems = [
    { title: 'Quản lý thủ công & Thiếu minh bạch:', body: 'Ghi sổ tay, thiếu kênh tra cứu khiến khách hàng lo lắng bị tráo đổi linh kiện.' },
    { title: 'Thất thoát kho linh kiện:', body: 'Không quản lý chính xác từng Serial/IMEI, gây tổn thất tài chính và tồn kho ảo.' },
    { title: 'Thiếu đo lường KPI & Báo cáo:', body: 'Quản lý không nắm được doanh thu realtime và năng suất làm việc của KTV.' }
  ];

  problems.forEach((p, i) => {
    slide3.addText([
      { text: `• ${p.title}\n`, options: { bold: true, color: COLOR_DARK } },
      { text: `  ${p.body}`, options: { color: '555555' } }
    ], {
      x: 0.9, y: 1.55 + i * 1.65, w: 5.2, h: 1.5,
      fontSize: 10, fontFace: 'Arial'
    });
  });

  // Right Card: 4 Mục tiêu
  slide3.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 0.95, w: 5.9, h: 5.6,
    fill: { color: 'F0F7FF' },
    line: { color: COLOR_SLATE, width: 1.2 }
  });

  slide3.addText('4 MỤC TIÊU CỐT LÕI CỦA DỰ ÁN', {
    x: 7.0, y: 1.1, w: 5.5, h: 0.35,
    fontSize: 12.5, fontFace: 'Arial', color: COLOR_NAVY, bold: true, align: 'center'
  });

  const objectives = [
    'Minh bạch với Khách hàng (Customer Portal): Tra cứu realtime qua SĐT + Tracking Code, xem ảnh ngoại quan & duyệt báo giá 1-click.',
    'Quản lý Kho chặt chẽ: Kiểm soát chính xác linh kiện theo mã Serial/IMEI duy nhất.',
    'Tự động hóa Thông báo: Gửi SMS/Email tự động theo từng bước chuyển trạng thái đơn.',
    'Phân tích & Thống kê Quản trị: Dashboard báo cáo doanh thu & xếp hạng năng suất KTV.'
  ];

  objectives.forEach((obj, i) => {
    slide3.addText(`✔  ${obj}`, {
      x: 7.0, y: 1.55 + i * 1.25, w: 5.4, h: 1.15,
      fontSize: 10, fontFace: 'Arial', color: COLOR_NAVY
    });
  });


  // ==========================================
  // SLIDE 4: PHƯƠNG PHÁP THỰC HIỆN & CÔNG NGHỆ
  // ==========================================
  const slide4 = pres.addSlide();
  addHeaderFooter(slide4, '3. PHƯƠNG PHÁP THỰC HIỆN & CÔNG NGHỆ SỬ DỤNG');

  // Box 1: Agile/Scrum
  slide4.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 0.95, w: 3.8, h: 5.6,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_SLATE, width: 1.2 }
  });
  slide4.addText('QUẢN LÝ DỰ ÁN\nAGILE / SCRUM', {
    x: 0.7, y: 1.1, w: 3.6, h: 0.45,
    fontSize: 11.5, fontFace: 'Arial', color: COLOR_NAVY, bold: true, align: 'center'
  });
  slide4.addText([
    { text: '• Sprint 1-2 tuần:\n', options: { bold: true } },
    { text: 'Phát triển tăng trưởng các User Stories có độ ưu tiên cao.\n\n' },
    { text: '• Product Backlog:\n', options: { bold: true } },
    { text: 'Quản lý use cases tiếp nhận, kho, báo giá, báo cáo.\n\n' },
    { text: '• CI/CD & Testing:\n', options: { bold: true } },
    { text: 'Liên tục tích hợp và kiểm thử tự động.' }
  ], {
    x: 0.8, y: 1.65, w: 3.4, h: 4.7,
    fontSize: 10, fontFace: 'Arial', color: COLOR_DARK
  });

  // Box 2: Clean Architecture
  slide4.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 4.76, y: 0.95, w: 3.8, h: 5.6,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_SLATE, width: 1.2 }
  });
  slide4.addText('KIẾN TRÚC MÃ NGUỒN\nCLEAN ARCHITECTURE', {
    x: 4.86, y: 1.1, w: 3.6, h: 0.45,
    fontSize: 11.5, fontFace: 'Arial', color: COLOR_NAVY, bold: true, align: 'center'
  });
  slide4.addText([
    { text: '• Domain Core:\n', options: { bold: true } },
    { text: 'Entities thuần TypeScript (User, Order, Part, Quote).\n\n' },
    { text: '• Use Cases:\n', options: { bold: true } },
    { text: 'Kịch bản xử lý độc lập với DB và Framework.\n\n' },
    { text: '• Infrastructure:\n', options: { bold: true } },
    { text: 'TypeORM, Controllers, Mailer Gateway.' }
  ], {
    x: 4.96, y: 1.65, w: 3.4, h: 4.7,
    fontSize: 10, fontFace: 'Arial', color: COLOR_DARK
  });

  // Box 3: Tech Stack
  slide4.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 8.93, y: 0.95, w: 3.8, h: 5.6,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_SLATE, width: 1.2 }
  });
  slide4.addText('CÔNG NGHỆ CHỌN LỌC\nTECH STACK', {
    x: 9.03, y: 1.1, w: 3.6, h: 0.45,
    fontSize: 11.5, fontFace: 'Arial', color: COLOR_NAVY, bold: true, align: 'center'
  });
  slide4.addText([
    { text: '• Backend:\n', options: { bold: true, color: COLOR_NAVY } },
    { text: 'Node.js, NestJS Framework\n\n' },
    { text: '• ORM & DB:\n', options: { bold: true, color: COLOR_NAVY } },
    { text: 'TypeORM + SQL Server 2019 (Triggers, SPs)\n\n' },
    { text: '• Frontend:\n', options: { bold: true, color: COLOR_NAVY } },
    { text: 'Next.js App Router, React, Tailwind CSS\n\n' },
    { text: '• Deployment:\n', options: { bold: true, color: COLOR_NAVY } },
    { text: 'Docker Containers, Nginx Proxy' }
  ], {
    x: 9.13, y: 1.65, w: 3.4, h: 4.7,
    fontSize: 10, fontFace: 'Arial', color: COLOR_DARK
  });


  // ==========================================
  // SLIDE 5: KẾT QUẢ - MÔ HÌNH USE CASE
  // ==========================================
  const slide5 = pres.addSlide();
  addHeaderFooter(slide5, '4. KẾT QUẢ THỰC HIỆN - MÔ HÌNH USE CASE HỆ THỐNG');

  slide5.addText('CÁC TÁC NHÂN HỆ THỐNG (ACTORS)', {
    x: 0.6, y: 0.9, w: 5.8, h: 0.3,
    fontSize: 11.5, fontFace: 'Arial', color: COLOR_NAVY, bold: true
  });

  const actorRows = [
    [{ text: 'Admin', options: { bold: true } }, 'Quản trị hệ thống, xem báo cáo doanh thu, đánh giá năng suất KTV'],
    [{ text: 'Technician', options: { bold: true } }, 'Tiếp nhận thiết bị, chụp ảnh ngoại quan, tạo đơn, báo giá, xuất kho'],
    [{ text: 'Customer', options: { bold: true } }, 'Tra cứu progress realtime qua SĐT + Tracking Code, duyệt/từ chối báo giá'],
    [{ text: 'System', options: { bold: true } }, 'Tự động gửi SMS/Email, sinh TrackingCode duy nhất, cảnh báo tồn kho']
  ];

  slide5.addTable([
    [{ text: 'Actor', options: { fill: COLOR_NAVY, color: COLOR_WHITE, bold: true } }, { text: 'Nhiệm vụ chính', options: { fill: COLOR_NAVY, color: COLOR_WHITE, bold: true } }],
    ...actorRows
  ], {
    x: 0.6, y: 1.25, w: 5.8, h: 5.3,
    colW: [1.3, 4.5],
    fontSize: 9.0, fontFace: 'Arial',
    border: { pt: 1, color: COLOR_BORDER }
  });

  slide5.addText('CÁC PHÂN HỆ USE CASE CỐT LÕI (8 CORE USE CASES)', {
    x: 6.8, y: 0.9, w: 5.9, h: 0.3,
    fontSize: 11.5, fontFace: 'Arial', color: COLOR_NAVY, bold: true
  });

  const ucRows = [
    ['UC01 - Login', 'Đăng nhập JWT, băm bcrypt, phân quyền RBAC'],
    ['UC02 - Create Order', 'Tiếp nhận, upload ảnh ngoại quan, sinh mã TRK-YYYYMMDD-XXXX'],
    ['UC03 - Manage Parts', 'Quản lý linh kiện tồn kho theo từng Serial/IMEI duy nhất'],
    ['UC04 - Trace Quote', 'Khách tra cứu public, duyệt/từ chối báo giá 1-click'],
    ['UC05 - Notification', 'Bắn SMS/Email tự động khi tạo đơn / có báo giá'],
    ['UC06 - Revenue Report', 'Báo cáo tổng doanh thu linh kiện & tiền công theo giai đoạn'],
    ['UC07 - Tech Productivity', 'Đánh giá số đơn hoàn thành & thời gian xử lý của KTV']
  ];

  slide5.addTable([
    [{ text: 'Use Case', options: { fill: COLOR_SLATE, color: COLOR_WHITE, bold: true } }, { text: 'Mô tả chi tiết', options: { fill: COLOR_SLATE, color: COLOR_WHITE, bold: true } }],
    ...ucRows
  ], {
    x: 6.8, y: 1.25, w: 5.9, h: 5.3,
    colW: [2.1, 3.8],
    fontSize: 9.0, fontFace: 'Arial',
    border: { pt: 1, color: COLOR_BORDER }
  });


  // ==========================================
  // SLIDE 6: KẾT QUẢ - MÔ HÌNH CSDL (ERD & 3NF)
  // ==========================================
  const slide6 = pres.addSlide();
  addHeaderFooter(slide6, '4. KẾT QUẢ THỰC HIỆN - MÔ HÌNH CSDL (ERD & 3NF)');

  slide6.addText('THIẾT KẾ CSDL QUAN HỆ (9 THỰC THỂ NÒNG CỐT)', {
    x: 0.6, y: 0.85, w: 12.13, h: 0.3,
    fontSize: 11.5, fontFace: 'Arial', color: COLOR_NAVY, bold: true
  });

  const entities = [
    { name: 'Users', fields: 'UserId (PK), Username, Email, PasswordHash, Role' },
    { name: 'Customers', fields: 'CustomerId (PK), FullName, Phone (Unique), Email' },
    { name: 'Devices', fields: 'DeviceId (PK), CustomerId (FK), DeviceType, Brand, SerialIMEI' },
    { name: 'ServiceOrders', fields: 'OrderId (PK), TrackingCode (Unique), Status, IssueDesc' },
    { name: 'DevicePhotos', fields: 'PhotoId (PK), OrderId (FK), PhotoUrl, PhotoType' },
    { name: 'Categories', fields: 'CategoryId (PK), Name (Unique), Description' },
    { name: 'Parts', fields: 'PartId (PK), CategoryId (FK), SerialIMEI (Unique), Status, Price' },
    { name: 'Quotes', fields: 'QuoteId (PK), OrderId (FK), TotalLaborCost, TotalPartsCost, Status' },
    { name: 'OrderParts', fields: 'Id (PK), OrderId (FK), PartId (FK), Quantity' }
  ];

  entities.forEach((ent, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = 0.6 + col * 4.15;
    const y = 1.2 + row * 1.15;

    slide6.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: 3.9, h: 1.05,
      fill: { color: COLOR_CARD_BG },
      line: { color: COLOR_SLATE, width: 1.0 }
    });

    slide6.addText(`📌 ${ent.name}`, {
      x: x + 0.1, y: y + 0.06, w: 3.7, h: 0.22,
      fontSize: 10, fontFace: 'Arial', color: COLOR_NAVY, bold: true
    });

    slide6.addText(ent.fields, {
      x: x + 0.1, y: y + 0.3, w: 3.7, h: 0.68,
      fontSize: 8.5, fontFace: 'Arial', color: COLOR_DARK
    });
  });

  // Bottom Callout for 3NF & Trigger
  slide6.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.8, w: 12.13, h: 1.85,
    fill: { color: 'F0F7FF' },
    line: { color: COLOR_NAVY, width: 1 }
  });
  slide6.addText([
    { text: '✔ Chuẩn hóa CSDL Dạng chuẩn 3 (3NF):\n', options: { bold: true, color: COLOR_NAVY } },
    { text: '• 1NF: Tất cả thuộc tính mang giá trị đơn atomic. 2NF: Khóa chính surrogate GUID loại bỏ phụ thuộc hàm một phần.\n• 3NF: Loại bỏ phụ thuộc hàm bắc cầu giữa các thuộc tính không khóa.\n' },
    { text: '✔ Trigger & Stored Procedures:\n', options: { bold: true, color: COLOR_NAVY } },
    { text: '• INSTEAD OF INSERT Trigger trg_GenerateTrackingCode_v2 sinh mã TRK-YYYYMMDD-XXXX ngẫu nhiên duy nhất.' }
  ], {
    x: 0.8, y: 4.85, w: 11.7, h: 1.75,
    fontSize: 9.5, fontFace: 'Arial'
  });


  // ==========================================
  // SLIDE 7: CHỨC NĂNG THỰC HIỆN ĐƯỢC
  // ==========================================
  const slide7 = pres.addSlide();
  addHeaderFooter(slide7, '4. KẾT QUẢ THỰC HIỆN - CÁC CHỨC NĂNG CHÍNH');

  const features = [
    { title: '1. Phân hệ Tiếp nhận & Cấp mã Tracking', desc: '• Tự động nhận diện khách hàng cũ/mới theo SĐT.\n• Bắt buộc đính kèm ảnh ngoại quan thực tế.\n• Cấp mã định danh tra cứu độc nhất TRK-YYYYMMDD-XXXX.' },
    { title: '2. Cổng tra cứu Khách hàng (Customer Portal)', desc: '• Tra cứu không cần mật khẩu qua SĐT + Tracking Code.\n• Hiển thị tiến độ, ảnh ngoại quan & bảng giá chi tiết.\n• Nút duyệt / từ chối báo giá 1-click trực tuyến.' },
    { title: '3. Phân hệ Quản lý Kho Serial/IMEI', desc: '• Nhập kho linh kiện theo số Serial/IMEI duy nhất.\n• Tự động trừ kho chính xác khi gắn vào đơn sửa chữa.\n• Cảnh báo tồn kho tối thiểu cho quản lý.' },
    { title: '4. Báo cáo Doanh thu & Năng suất KTV', desc: '• Báo cáo tổng doanh thu linh kiện & phí dịch vụ realtime.\n• Thống kê chi tiết số đơn hoàn thành của từng KTV.\n• Đo lường thời gian xử lý trung bình mỗi đơn.' }
  ];

  features.forEach((feat, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.6 + col * 6.2;
    const y = 1.05 + row * 2.8;

    slide7.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: 5.9, h: 2.55,
      fill: { color: COLOR_WHITE },
      line: { color: COLOR_SLATE, width: 1.2 }
    });

    slide7.addShape(pres.shapes.RECTANGLE, {
      x: x, y: y, w: 5.9, h: 0.42,
      fill: { color: COLOR_NAVY }
    });

    slide7.addText(feat.title, {
      x: x + 0.2, y: y + 0.05, w: 5.5, h: 0.32,
      fontSize: 11, fontFace: 'Arial', color: COLOR_WHITE, bold: true
    });

    slide7.addText(feat.desc, {
      x: x + 0.3, y: y + 0.5, w: 5.3, h: 1.95,
      fontSize: 10, fontFace: 'Arial', color: COLOR_DARK
    });
  });


  // ==========================================
  // SLIDE 8: KIỂM THỬ HỆ THỐNG (Testing Matrix)
  // ==========================================
  const slide8 = pres.addSlide();
  addHeaderFooter(slide8, '5. KIỂM THỬ HỆ THỐNG (SYSTEM TESTING)');

  slide8.addText('KẾT QUẢ THỰC THI 22 TESTCASES NGHIỆP VỤ TRỌNG YẾU', {
    x: 0.6, y: 0.85, w: 12.13, h: 0.3,
    fontSize: 11.5, fontFace: 'Arial', color: COLOR_NAVY, bold: true
  });

  const testMatrixRows = [
    ['TC-AUTH-01/02', 'Authentication JWT', 'Đăng nhập đúng/sai credentials, băm bcrypt, phân quyền RBAC', 'PASSED'],
    ['TC-INTK-01..04', 'Service Order Intake', 'Tạo đơn mới với SĐT cũ/mới, bắt buộc ảnh ngoại quan, validate SĐT', 'PASSED'],
    ['TC-PART-01..03', 'Parts Inventory', 'Thêm mới linh kiện theo Serial/IMEI, validate trùng lặp, đổi status', 'PASSED'],
    ['TC-QUOT-01', 'Quote Creation', 'Tạo báo giá tiền linh kiện + tiền công dịch vụ', 'PASSED'],
    ['TC-PORT-01..04', 'Customer Portal', 'Tra cứu bằng TrackingCode + SĐT, duyệt / từ chối báo giá 1-click', 'PASSED'],
    ['TC-NOTI-01/02', 'Automated Notification', 'Tự động gửi SMS/Email, retry khi gateway gián đoạn', 'PASSED'],
    ['TC-REPT-01/02', 'Revenue Report', 'Báo cáo doanh thu khoảng thời gian, validate FromDate <= ToDate', 'PASSED'],
    ['TC-PROD-01', 'Tech Productivity', 'Thống kê số đơn hoàn thành & thời gian trung bình của KTV', 'PASSED'],
    ['TC-SECU/PERF', 'Security & Load Test', 'Chống truy cập không Token JWT, tải đồng thời 100 VUs (p95 < 180ms)', 'PASSED']
  ];

  slide8.addTable([
    [
      { text: 'Mã Test Case', options: { fill: COLOR_NAVY, color: COLOR_WHITE, bold: true } },
      { text: 'Phân hệ kiểm thử', options: { fill: COLOR_NAVY, color: COLOR_WHITE, bold: true } },
      { text: 'Kịch bản & Dữ liệu kiểm thử', options: { fill: COLOR_NAVY, color: COLOR_WHITE, bold: true } },
      { text: 'Kết quả', options: { fill: COLOR_NAVY, color: COLOR_WHITE, bold: true } }
    ],
    ...testMatrixRows.map(r => [
      { text: r[0], options: { bold: true } },
      r[1],
      r[2],
      { text: r[3], options: { bold: true, color: '008000', align: 'center' } }
    ])
  ], {
    x: 0.6, y: 1.2, w: 12.13, h: 5.4,
    colW: [1.8, 2.2, 6.73, 1.4],
    fontSize: 8.5, fontFace: 'Arial',
    border: { pt: 1, color: COLOR_BORDER }
  });


  // ==========================================
  // SLIDE 9: ĐÁNH GIÁ KẾT QUẢ (Evaluation)
  // ==========================================
  const slide9 = pres.addSlide();
  addHeaderFooter(slide9, '6. ĐÁNH GIÁ KẾT QUẢ ĐẠT ĐƯỢC');

  // Left Box: Ưu điểm
  slide9.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 0.95, w: 5.8, h: 5.6,
    fill: { color: 'F0FFF4' },
    line: { color: '2E7D32', width: 1.2 }
  });

  slide9.addText('ƯU ĐIỂM NỔI BẬT CỦA HỆ THỐNG', {
    x: 0.8, y: 1.1, w: 5.4, h: 0.35,
    fontSize: 12.5, fontFace: 'Arial', color: '2E7D32', bold: true, align: 'center'
  });

  const pros = [
    { title: 'Đáp ứng 100% mục tiêu ban đầu:', body: 'Hoàn thiện toàn bộ các phân hệ từ tiếp nhận, quản lý kho, báo giá đến analytics.' },
    { title: 'Minh bạch tối đa với khách hàng:', body: 'Cổng tra cứu không cần tài khoản, duyệt báo giá trực tuyến loại bỏ tâm lý nghi ngờ.' },
    { title: 'Kiến trúc Clean Architecture bài bản:', body: 'Mã nguồn tổ chức lớp rõ ràng, bảo mật cao và dễ bảo trì mở rộng.' },
    { title: 'Giao diện Web Responsive hiện đại:', body: 'Tương thích mượt mà trên cả Desktop, Tablet và Mobile.' }
  ];

  pros.forEach((p, i) => {
    slide9.addText([
      { text: `✔  ${p.title}\n`, options: { bold: true, color: '2E7D32' } },
      { text: `    ${p.body}`, options: { color: COLOR_DARK } }
    ], {
      x: 0.9, y: 1.55 + i * 1.25, w: 5.2, h: 1.15,
      fontSize: 9.5, fontFace: 'Arial'
    });
  });

  // Right Box: Hạn chế
  slide9.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 0.95, w: 5.9, h: 5.6,
    fill: { color: 'FFF5F5' },
    line: { color: COLOR_ACCENT, width: 1.2 }
  });

  slide9.addText('HẠN CHẾ CẦN CẢI THIỆN', {
    x: 7.0, y: 1.1, w: 5.5, h: 0.35,
    fontSize: 12.5, fontFace: 'Arial', color: COLOR_ACCENT, bold: true, align: 'center'
  });

  const cons = [
    { title: 'Chưa hỗ trợ thiết bị chẩn đoán phần cứng tự động:', body: 'Kỹ thuật viên vẫn phải chẩn đoán và nhập mô tả lỗi thủ công.' },
    { title: 'Chưa tích hợp thanh toán trực tuyến:', body: 'Chi phí sửa chữa hiện vẫn phụ thuộc vào tiền mặt/chuyển khoản tại cửa hàng.' },
    { title: 'Chưa có ứng dụng di động Native:', body: 'Hiện tại hệ thống mới hỗ trợ phiên bản Web App (Responsive).' }
  ];

  cons.forEach((c, i) => {
    slide9.addText([
      { text: `✖  ${c.title}\n`, options: { bold: true, color: COLOR_ACCENT } },
      { text: `    ${c.body}`, options: { color: COLOR_DARK } }
    ], {
      x: 7.0, y: 1.65 + i * 1.65, w: 5.4, h: 1.5,
      fontSize: 9.5, fontFace: 'Arial'
    });
  });


  // ==========================================
  // SLIDE 10: HƯỚNG PHÁT TRIỂN & KẾT LUẬN
  // ==========================================
  const slide10 = pres.addSlide();
  addHeaderFooter(slide10, '7. HƯỚNG PHÁT TRIỂN TƯƠNG LAI & KẾT LUẬN');

  // Top Cards: 3 Future Roadmaps
  const roadmaps = [
    { title: 'Ứng dụng AI Chẩn đoán lỗi', desc: 'Dùng AI phân tích hình ảnh bo mạch/màn hình hỏng, gợi ý nguyên nhân và linh kiện thay thế.' },
    { title: 'Tích hợp Thanh toán & Hóa đơn', desc: 'Kết nối VNPay, ZaloPay, MoMo và xuất hóa đơn điện tử tự động (MISA/meInvoice).' },
    { title: 'Phát triển App cho KTV', desc: 'Xây dựng Mobile App (React Native) tích hợp quét mã vạch IMEI siêu tốc & Push Notifications.' }
  ];

  roadmaps.forEach((r, i) => {
    const x = 0.6 + i * 4.15;
    slide10.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 0.95, w: 3.9, h: 2.5,
      fill: { color: COLOR_CARD_BG },
      line: { color: COLOR_SLATE, width: 1.2 }
    });

    slide10.addText(r.title, {
      x: x + 0.1, y: 1.1, w: 3.7, h: 0.35,
      fontSize: 11.5, fontFace: 'Arial', color: COLOR_NAVY, bold: true, align: 'center'
    });

    slide10.addText(r.desc, {
      x: x + 0.2, y: 1.5, w: 3.5, h: 1.8,
      fontSize: 10, fontFace: 'Arial', color: COLOR_DARK
    });
  });

  // Bottom Box: Conclusion & Q&A
  slide10.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 3.65, w: 12.13, h: 2.9,
    fill: { color: COLOR_NAVY }
  });

  slide10.addText('TỔNG KẾT & CẢM ƠN', {
    x: 0.8, y: 3.85, w: 11.73, h: 0.35,
    fontSize: 15, fontFace: 'Arial', color: 'B0C4DE', bold: true, align: 'center'
  });

  slide10.addText('Hệ thống Smart TechRepair Hub sẵn sàng để đưa vào vận hành thực tế tại các trung tâm sửa chữa.\nEm xin chân thành cảm ơn Hội đồng và các Thầy Cô giáo đã lắng nghe!', {
    x: 0.8, y: 4.35, w: 11.73, h: 1.0,
    fontSize: 12.5, fontFace: 'Arial', color: COLOR_WHITE, align: 'center', italic: true
  });

  slide10.addText('Q & A - HỘI ĐỒNG XIN CHO Ý KIẾN ĐÓNG GÓP', {
    x: 0.8, y: 5.55, w: 11.73, h: 0.45,
    fontSize: 14, fontFace: 'Arial', color: 'FFD700', bold: true, align: 'center'
  });


  // Write file
  const outputPath = path.join(__dirname, '../../docs/Smart_TechRepair_Hub_BaoCaoTotNghiep.pptx');
  await pres.writeFile({ fileName: outputPath });
  console.log(`Presentation successfully created at: ${outputPath}`);
}

createPresentation().catch(err => {
  console.error('Error generating presentation:', err);
  process.exit(1);
});
