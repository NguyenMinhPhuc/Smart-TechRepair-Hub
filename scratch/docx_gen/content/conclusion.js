const {
  createHeading1,
  createHeading2,
  createParagraph,
  createBulletPoint,
  createCalloutBox,
  createPageBreak
} = require('../helpers');

function getConclusionSection() {
  const elements = [];

  elements.push(createPageBreak());
  elements.push(createHeading1('KẾT LUẬN VÀ TÀI LIỆU THAM KHẢO'));

  elements.push(createHeading2('KẾT LUẬN TỔNG QUAN'));
  elements.push(createParagraph([
    'Trải qua quá trình nghiên cứu lý thuyết, khảo sát thực tế và triển khai xây dựng phần mềm, đề tài ',
    { text: 'Smart TechRepair Hub - Hệ thống Quản lý và Điều hành Trung tâm Sửa chữa Thiết bị Công nghệ Thông minh', bold: true },
    ' đã hoàn thành toàn bộ các mục tiêu nghiên cứu và phát triển được đặt ra ban đầu.'
  ]));

  elements.push(createParagraph([
    'Những đóng góp chính và kết quả nổi bật của đề tài bao gồm:'
  ]));
  elements.push(createBulletPoint([
    { text: '1. Giải quyết triệt để bài toán quản lý minh bạch: ', bold: true },
    'Cổng tra cứu công khai giúp khách hàng tự do theo dõi tiến độ sửa chữa, hình ảnh ngoại quan và duyệt báo giá, xóa bỏ tâm lý lo ngại rò rỉ hoặc tráo đổi linh kiện.'
  ]));
  elements.push(createBulletPoint([
    { text: '2. Chuẩn hóa quản lý kho linh kiện theo Serial/IMEI: ', bold: true },
    'Hệ thống loại bỏ hoàn toàn rủi ro thất thoát kho và tồn kho ảo nhờ cơ chế định danh độc nhất từng linh kiện.'
  ]));
  elements.push(createBulletPoint([
    { text: '3. Áp dụng xuất sắc mô hình kiến trúc Clean Architecture: ', bold: true },
    'Phần mềm được đóng gói bài bản với NestJS, TypeORM, SQL Server 2019 và Next.js, đảm bảo hiệu năng cao, bảo mật vững chắc và tính mở rộng lâu dài.'
  ]));
  elements.push(createBulletPoint([
    { text: '4. Tự động hóa báo cáo & đánh giá năng suất: ', bold: true },
    'Cung cấp công cụ quản trị đắc lực giúp người quản lý đưa ra các quyết định kinh doanh chính xác dựa trên dữ liệu thực tế.'
  ]));

  elements.push(createHeading2('DANH MỤC TÀI LIỆU THAM KHẢO'));

  const references = [
    '1. Martin, R. C. (2017). Clean Architecture: A Craftsman\'s Guide to Software Structure and Design. Prentice Hall.',
    '2. Evans, E. (2003). Domain-Driven Design: Tackling Complexity in the Heart of Software. Addison-Wesley Professional.',
    '3. NestJS Documentation. (2026). Progressive Node.js Framework. Retrieved from https://docs.nestjs.com/',
    '4. Next.js Documentation. (2026). The React Framework for the Web. Retrieved from https://nextjs.org/docs',
    '5. Microsoft Corporation. (2022). SQL Server 2019 Technical Documentation. Microsoft Learn.',
    '6. TypeORM Documentation. (2026). Object-Relational Mapping for TypeScript. Retrieved from https://typeorm.io/',
    '7. Fowler, M. (2002). Patterns of Enterprise Application Architecture. Addison-Wesley Professional.',
    '8. IEEE Standard for Information Technology—System and Software Verification and Validation. (2016). IEEE Std 1012-2016.'
  ];

  references.forEach(ref => {
    elements.push(createParagraph(ref, { spaceBefore: 40, spaceAfter: 60, indent: 360 }));
  });

  elements.push(createCalloutBox(
    'LỜI CẢM ƠN',
    [
      'Em xin chân thành cảm ơn sự hướng dẫn tận tình của các Thầy Cô giáo và sự hỗ trợ của các đồng nghiệp trong suốt quá trình nghiên cứu và thực hiện báo cáo này.',
      'Hệ thống Smart TechRepair Hub sẵn sàng để đưa vào vận hành thực tế và đóng góp tích cực cho sự phát triển của ngành dịch vụ công nghệ.'
    ]
  ));

  return elements;
}

module.exports = { getConclusionSection };
