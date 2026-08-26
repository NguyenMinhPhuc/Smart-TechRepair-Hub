const {
  createHeading1,
  createHeading2,
  createHeading3,
  createParagraph,
  createBulletPoint,
  createCalloutBox,
  createStyledTable,
  createCodeBlock,
  createPageBreak
} = require('../helpers');

function getChapter2Section() {
  const elements = [];

  elements.push(createPageBreak());
  elements.push(createHeading1('Chương 2. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ SỬ DỤNG'));

  elements.push(createHeading2('2.1. Cơ sở lý thuyết quản lý dự án và kiến trúc phần mềm'));

  elements.push(createHeading3('2.1.1. Phương pháp luận Agile/Scrum trong quản lý phát triển ứng dụng'));
  elements.push(createParagraph([
    'Phương pháp luận Agile/Scrum là mô hình phát triển phần mềm lặp (iterative) và tăng trưởng (incremental), tập trung vào tính linh hoạt, sự thích ứng nhanh chóng với thay đổi và giao sản phẩm chạy được theo từng chu kỳ ngắn gọi là Sprint (thường kéo dài từ 1 đến 2 tuần).'
  ]));
  elements.push(createParagraph([
    'Trong dự án Smart TechRepair Hub, nhóm phát triển áp dụng mô hình Scrum với các vai trò và quy trình chuẩn hóa:'
  ]));
  elements.push(createBulletPoint([
    { text: 'Product Backlog: ', bold: true },
    'Quản lý danh sách toàn bộ các yêu cầu tính năng (User Stories) của hệ thống như Tiếp nhận thiết bị, Quản lý kho Serial, Tra cứu đơn hàng, Duyệt báo giá, Báo cáo doanh thu.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Sprint Planning: ', bold: true },
    'Lên kế hoạch chọn lọc các User Stories có độ ưu tiên cao nhất để thực thi trong từng Sprint.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Daily Standup: ', bold: true },
    'Họp ngắn hàng ngày 15 phút để rà soát tiến độ, phát hiện vướng mắc kỹ thuật và đồng bộ mã nguồn.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Sprint Review & Retrospective: ', bold: true },
    'Đánh giá kết quả tính năng đã hoàn thành cuối mỗi Sprint và rút kinh nghiệm cải tiến quy trình làm việc.'
  ]));

  elements.push(createHeading3('2.1.2. Mô hình kiến trúc Clean Architecture'));
  elements.push(createParagraph([
    'Để đảm bảo phần mềm có khả năng bảo trì lâu dài, độc lập với các thư viện bên ngoài và dễ dàng mở rộng tính năng, dự án Smart TechRepair Hub tuân thủ nghiêm ngặt mô hình ',
    { text: 'Clean Architecture', bold: true },
    ' do Robert C. Martin (Uncle Bob) đề xuất. Kiến trúc phân tách phần mềm thành 4 lớp đồng tâm với quy tắc phụ thuộc một chiều từ ngoài vào trong (Dependency Rule):'
  ]));

  elements.push(createBulletPoint([
    { text: '1. Lớp Domain Core (Trung tâm): ', bold: true },
    'Chứa các thực thể nghiệp vụ cốt lõi (Entities: User, Customer, Device, ServiceOrder, Part, Quote, Notification) và các quy tắc nghiệp vụ bất biến. Lớp này hoàn toàn thuần túy TypeScript, không phụ thuộc vào bất kỳ framework hay cơ sở dữ liệu nào.'
  ]));
  elements.push(createBulletPoint([
    { text: '2. Lớp Application / Use Cases: ', bold: true },
    'Chứa các kịch bản sử dụng hệ thống (Use Cases: CreateOrderUseCase, ApproveQuoteUseCase, ManageInventoryUseCase, RevenueReportUseCase). Lớp này nhận input từ bên ngoài, gọi các repository interface để thực thi nghiệp vụ và trả về output.'
  ]));
  elements.push(createBulletPoint([
    { text: '3. Lớp Interfaces / Repositories Contract: ', bold: true },
    'Định nghĩa các hợp đồng giao tiếp (Interfaces) cho tầng lưu trữ dữ liệu, dịch vụ thông báo, mã hóa mật khẩu.'
  ]));
  elements.push(createBulletPoint([
    { text: '4. Lớp Infrastructure & Presentation (Ngoài cùng): ', bold: true },
    'Chứa triển khai thực tế của TypeORM Repositories, NestJS Controllers, JWT Strategy, Mailer Gateway và SQL Server Database Driver.'
  ]));

  elements.push(createHeading2('2.2. Các công nghệ Backend và Cơ sở dữ liệu'));

  elements.push(createHeading3('2.2.1. Nền tảng Node.js và Framework NestJS'));
  elements.push(createParagraph([
    { text: 'Node.js', bold: true },
    ' là môi trường thực thi JavaScript bất đồng bộ dựa trên V8 Engine của Google, nổi tiếng với mô hình Event-Driven non-blocking I/O mang lại hiệu năng xử lý cực cao cho các ứng dụng web dạng API Service.'
  ]));
  elements.push(createParagraph([
    { text: 'NestJS', bold: true },
    ' là một Progressive Node.js Framework hàng đầu được viết hoàn toàn bằng TypeScript. NestJS kết hợp các tư tưởng thiết kế xuất sắc từ OOP (Object Oriented Programming), FP (Functional Programming) và FRP (Functional Reactive Programming), kết hợp tính năng Dependency Injection (DI) mạnh mẽ tương tự Spring Boot (Java) hoặc Angular.'
  ]));

  elements.push(createHeading3('2.2.2. ORM (Object-Relational Mapping) với TypeORM'));
  elements.push(createParagraph([
    'TypeORM là công cụ ORM tiên tiến dành cho TypeScript và JavaScript, hỗ trợ mô hình Data Mapper và Active Record. Trong hệ thống Smart TechRepair Hub, TypeORM được sử dụng để:'
  ]));
  elements.push(createBulletPoint([
    { text: 'Ánh xạ Entity sang Bảng cơ sở dữ liệu: ', bold: true },
    'Tự động đồng bộ các class TypeScript với bảng trong SQL Server 2019.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Quản lý Transactions an toàn: ', bold: true },
    'Đảm bảo tính toàn vẹn ACID khi thực hiện các thao tác phức tạp (ví dụ: vừa tạo đơn sửa chữa, vừa tạo thiết bị mới, vừa cập nhật lịch sử).'
  ]));
  elements.push(createBulletPoint([
    { text: 'Tương tác Stored Procedures và Raw Queries: ', bold: true },
    'Cho phép gọi trực tiếp các Stored Procedure tối ưu hóa trong SQL Server khi làm báo cáo doanh thu.'
  ]));

  elements.push(createHeading3('2.3. Các công nghệ Frontend'));

  elements.push(createHeading3('2.3.1. Thư viện / Framework Next.js và React'));
  elements.push(createParagraph([
    { text: 'React.js', bold: true },
    ' là thư viện UI phổ biến nhất thế giới do Meta phát triển, cho phép xây dựng giao diện người dùng theo dạng các Component độc lập, tái sử dụng cao và render hiệu quả nhờ cơ chế Virtual DOM.'
  ]));
  elements.push(createParagraph([
    { text: 'Next.js (App Router)', bold: true },
    ' là React Framework hàng đầu cung cấp khả năng Server-Side Rendering (SSR), Static Site Generation (SSG) và Server Actions, giúp tối ưu hóa SEO cho cổng tra cứu khách hàng và mang lại tốc độ tải trang phản hồi cực nhanh.'
  ]));

  elements.push(createHeading3('2.3.2. CSS Framework (Tailwind CSS)'));
  elements.push(createParagraph([
    'Tailwind CSS là utility-first CSS framework giúp thiết kế giao diện linh hoạt, hiện đại và chuẩn responsive trên mọi kích thước màn hình (Mobile, Tablet, Desktop) mà không cần viết các file CSS tùy chỉnh cồng kềnh.'
  ]));

  elements.push(createHeading2('2.4. Mô hình triển khai hệ thống (Deployment Architecture)'));
  elements.push(createParagraph([
    'Hệ thống Smart TechRepair Hub được thiết kế để triển khai theo mô hình Containerization với ',
    { text: 'Docker', bold: true },
    ' và ',
    { text: 'Docker Compose', bold: true },
    ', giúp đóng gói toàn bộ ứng dụng Backend NestJS, Frontend Next.js và Cơ sở dữ liệu SQL Server vào các Container độc lập.'
  ]));

  const deployHeaders = ['Thành phần', 'Công nghệ đóng gói', 'Cổng (Port)', 'Nhiệm vụ chính'];
  const deployRows = [
    ['Frontend Service', 'Next.js Container', '3000 -> 80/443', 'Giao diện Admin & Cổng tra cứu Khách hàng'],
    ['Backend API Service', 'NestJS Container', '3001', 'Cung cấp RESTful API & Xử lý nghiệp vụ Clean Architecture'],
    ['Database Service', 'SQL Server 2019 Container', '1433', 'Lưu trữ CSDL quan hệ quan trọng, Triggers, SPs'],
    ['Reverse Proxy', 'Nginx Web Server', '80 / 443', 'Cân bằng tải, Cấu hình SSL/TLS Https & Static Media']
  ];

  elements.push(createStyledTable(deployHeaders, deployRows, [25, 25, 15, 35]));

  elements.push(createCalloutBox(
    'KẾT LUẬN CHƯƠNG 2',
    [
      'Tập hợp công nghệ lựa chọn bao gồm NestJS, TypeORM, SQL Server 2019, Next.js và Docker tạo nên một nền tảng kỹ thuật vững chắc, tuân thủ Clean Architecture.',
      'Sự kết hợp này đảm bảo tính hiệu năng, khả năng mở rộng hàng triệu đơn sửa chữa và bảo mật cao cho Smart TechRepair Hub.'
    ]
  ));

  return elements;
}

module.exports = { getChapter2Section };
