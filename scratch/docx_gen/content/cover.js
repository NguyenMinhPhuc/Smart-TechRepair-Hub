const { TableOfContents } = require('docx');
const {
  createTitle,
  createSubtitle,
  createHeading1,
  createHeading2,
  createParagraph,
  createBulletPoint,
  createCalloutBox,
  createPageBreak
} = require('../helpers');

function getCoverSection() {
  const elements = [];

  // Cover Page Elements
  elements.push(createParagraph('BỘ GIÁO DỤC VÀ ĐÀO TẠO', { alignment: 'CENTER', bold: true, size: 24, spaceAfter: 40 }));
  elements.push(createParagraph('TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN', { alignment: 'CENTER', bold: true, size: 26, spaceAfter: 200 }));
  
  elements.push(createParagraph('---------------------------------------', { alignment: 'CENTER', bold: true, size: 20, spaceAfter: 400 }));

  elements.push(createTitle('BÁO CÁO PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG'));
  elements.push(createSubtitle('ĐỀ TÀI: HỆ THỐNG QUẢN LÝ VÀ ĐIỀU HÀNH TRUNG TÂM SỬA CHỮA THIẾT BỊ CÔNG NGHỆ THÔNG MINH (SMART TECHREPAIR HUB)'));

  elements.push(createParagraph(' ', { spaceAfter: 400 }));

  elements.push(createParagraph('Ngành: Công nghệ Thông tin / Kỹ thuật Phần mềm', { alignment: 'CENTER', bold: true, size: 24, spaceAfter: 80 }));
  elements.push(createParagraph('Chuyên ngành: Phát triển Hệ thống Thông tin & Ứng dụng Web', { alignment: 'CENTER', italic: true, size: 22, spaceAfter: 400 }));

  elements.push(createParagraph('Sinh viên thực hiện: Nguyen Minh Phuc', { alignment: 'CENTER', bold: true, size: 24, spaceAfter: 60 }));
  elements.push(createParagraph('Mã số sinh viên: 20268888', { alignment: 'CENTER', size: 22, spaceAfter: 60 }));
  elements.push(createParagraph('Giảng viên hướng dẫn: TS. Nguyễn Văn A', { alignment: 'CENTER', bold: true, size: 24, spaceAfter: 400 }));

  elements.push(createParagraph('TP. HỒ CHÍ MINH - NĂM 2026', { alignment: 'CENTER', bold: true, size: 22, spaceAfter: 200 }));

  elements.push(createPageBreak());

  // MỤC LỤC (3 LEVELS)
  elements.push(createHeading1('MỤC LỤC'));
  elements.push(new TableOfContents('MỤC LỤC BÁO CÁO', {
    hyperlink: true,
    headingStyleRange: '1-3'
  }));

  elements.push(createPageBreak());

  // LỜI MỞ ĐẦU
  elements.push(createHeading1('LỜI MỞ ĐẦU'));
  
  elements.push(createHeading2('1. Lý do chọn đề tài'));
  elements.push(createParagraph([
    'Trong kỷ nguyên chuyển đổi số hiện nay, các thiết bị công nghệ như điện thoại thông minh (smartphone), máy tính xách tay (laptop), máy tính bảng (tablet) và các thiết bị phần cứng điện tử đã trở thành vật dụng thiết yếu không thể thiếu trong hoạt động sinh hoạt, học tập và làm việc hàng ngày của hàng triệu người dùng. Sự gia tăng vượt bậc về số lượng thiết bị công nghệ kéo theo nhu cầu bảo hành, bảo trì và sửa chữa thiết bị ngày càng tăng cao.'
  ]));
  elements.push(createParagraph([
    'Tuy nhiên, thực trạng quản lý tại đa số các cửa hàng và trung tâm sửa chữa thiết bị công nghệ vừa và nhỏ tại Việt Nam hiện nay vẫn gặp phải nhiều bất cập lớn:'
  ]));
  elements.push(createBulletPoint([
    { text: 'Quản lý thủ công và thiếu minh bạch: ', bold: true },
    'Quy trình tiếp nhận thiết bị, chẩn đoán sự cố và báo giá thường được thực hiện qua sổ sách thủ công hoặc các công cụ chat rời rạc. Khách hàng không thể chủ động theo dõi tiến độ sửa chữa, dễ dẫn đến tâm lý nghi ngờ về việc tráo đổi linh kiện (luộc đồ) hoặc báo giá không chính xác.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Thất thoát và khó kiểm soát linh kiện tồn kho: ', bold: true },
    'Linh kiện điện tử (màn hình, pin, RAM, bo mạch, camera) có giá trị cao và mã định danh phức tạp (Serial/IMEI). Việc quản lý kho thiếu công cụ theo dõi chính xác từng Serial/IMEI khiến trung tâm dễ rơi vào tình trạng thất thoát linh kiện, tồn kho ảo hoặc thiếu hụt linh kiện khi cần thay thế.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Thiếu công cụ đo lường hiệu suất và báo cáo doanh thu: ', bold: true },
    'Người quản lý (Admin/Manager) gặp khó khăn trong việc đánh giá chính xác năng suất làm việc của đội ngũ kỹ thuật viên (thời gian xử lý trung bình mỗi đơn, số đơn hoàn thành), cũng như không có báo cáo doanh thu tổng hợp theo thời gian thực để đưa ra các quyết định kinh doanh chiến lược.'
  ]));
  elements.push(createParagraph([
    'Xuất phát từ những lý do thực tiễn cấp thiết trên, đề tài ',
    { text: 'Smart TechRepair Hub', bold: true },
    ' (Hệ thống Quản lý và Điều hành Trung tâm Sửa chữa Thiết bị Công nghệ Thông minh) được nghiên cứu và phát triển nhằm cung cấp một giải pháp phần mềm toàn diện, hiện đại hóa toàn bộ quy trình vận hành từ tiếp nhận, chẩn đoán, báo giá, xuất kho linh kiện, đến tra cứu minh bạch cho khách hàng và phân tích báo cáo doanh thu quản trị.'
  ]));

  elements.push(createHeading2('2. Mục tiêu nghiên cứu'));
  elements.push(createParagraph([
    'Mục tiêu tổng quát của đề tài là xây dựng một hệ thống phần mềm quản lý trung tâm sửa chữa thiết bị công nghệ theo mô hình kiến trúc ',
    { text: 'Clean Architecture', bold: true },
    ' tiên tiến, đảm bảo khả năng mở rộng, tính bảo mật cao và vận hành tin cậy.'
  ]));
  elements.push(createParagraph('Mục tiêu cụ thể bao gồm:'));
  elements.push(createBulletPoint([
    { text: 'Chuẩn hóa quy trình tiếp nhận và theo dõi: ', bold: true },
    'Thiết lập quy trình ghi nhận thông tin khách hàng, tình trạng thiết bị ban đầu (kèm hình ảnh ngoại quan chụp thực tế) và cấp mã định danh tra cứu độc nhất Tracking Code (TRK-YYYYMMDD-XXXX).'
  ]));
  elements.push(createBulletPoint([
    { text: 'Cổng tra cứu & duyệt báo giá công khai cho khách hàng (Customer Portal): ', bold: true },
    'Cho phép khách hàng tự tra cứu tiến độ sửa chữa realtime qua SĐT và Mã đơn, xem ảnh chụp thiết bị, duyệt hoặc từ chối báo giá chi tiết trực tiếp trên giao diện web mà không cần đăng ký tài khoản phức tạp.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Quản lý kho linh kiện chặt chẽ theo Serial/IMEI: ', bold: true },
    'Ghi nhận chi tiết từng linh kiện theo mã Serial/IMEI duy nhất, tự động trừ kho khi gắn vào đơn sửa chữa và đưa ra cảnh báo tồn kho tối thiểu.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Hệ thống thông báo tự động (Automated Notifications): ', bold: true },
    'Gửi thông báo SMS/Email tự động cho khách hàng ngay khi có thay đổi trạng thái đơn hàng hoặc khi báo giá mới được tạo.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Hệ thống báo cáo và phân tích thông minh (Reporting & Analytics): ', bold: true },
    'Cung cấp Dashboard quản trị trực quan với biểu đồ doanh thu theo khoảng thời gian tùy chỉnh và bảng thống kê năng suất chi tiết của từng kỹ thuật viên.'
  ]));

  elements.push(createHeading2('3. Đối tượng và phạm vi nghiên cứu'));
  elements.push(createParagraph([
    { text: 'Đối tượng nghiên cứu: ', bold: true },
    'Quy trình nghiệp vụ vận hành trung tâm sửa chữa thiết bị phần cứng điện tử; các công nghệ phát triển phần mềm hiện đại như Node.js (NestJS Framework), React/Next.js, Hệ quản trị cơ sở dữ liệu SQL Server 2019, các mẫu thiết kế Clean Architecture, DDD (Domain-Driven Design), RESTful API và JWT Authentication.'
  ]));
  elements.push(createParagraph([
    { text: 'Phạm vi nghiên cứu: ', bold: true },
    'Hệ thống tập trung giải quyết các bài toán vận hành nội bộ trung tâm sửa chữa và tương tác tra cứu của khách hàng. Không bao gồm các nghiệp vụ kế toán chuyên sâu hoặc quản lý nhân sự lương thưởng phức tạp ngoài phạm vi năng suất sửa chữa.'
  ]));

  elements.push(createHeading2('4. Phương pháp nghiên cứu'));
  elements.push(createBulletPoint([
    { text: 'Phương pháp nghiên cứu lý thuyết: ', bold: true },
    'Tìm hiểu các tài liệu chuyên ngành về thiết kế kiến trúc phần mềm Clean Architecture, các nguyên lý SOLID, mô hình dữ liệu quan hệ RDBMS và các chuẩn bảo mật web API.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Phương pháp khảo sát thực tế: ', bold: true },
    'Khảo sát quy trình làm việc thực tế tại các trung tâm sửa chữa điện thoại/máy tính uy tín, ghi nhận các lỗi thường gặp trong quản lý kho và giao tiếp với khách hàng.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Phương pháp phát triển phần mềm Agile/Scrum: ', bold: true },
    'Chia nhỏ quá trình phát triển thành các Sprint ngắn, liên tục tích hợp và kiểm thử các tính năng cốt lõi.'
  ]));

  elements.push(createCalloutBox(
    'TỔNG QUAN TÀI LIỆU BÁO CÁO',
    [
      'Tài liệu này được biên soạn theo đúng quy chuẩn báo cáo khoa học / đồ án tốt nghiệp.',
      'Nội dung bao gồm 5 chương phân tích chi tiết từ tổng quan thị trường, cơ sở công nghệ, phân tích thiết kế Use Case & Database, triển khai mã nguồn Clean Architecture đến kiểm thử thực nghiệm.'
    ]
  ));

  return elements;
}

module.exports = { getCoverSection };
