const {
  createHeading1,
  createHeading2,
  createHeading3,
  createParagraph,
  createBulletPoint,
  createStyledTable,
  createCalloutBox,
  createPageBreak
} = require('../helpers');

function getChapter5Section() {
  const elements = [];

  elements.push(createPageBreak());
  elements.push(createHeading1('Chương 5. KIỂM THỬ, ĐÁNH GIÁ VÀ HƯỚNG PHÁT TRIỂN'));

  elements.push(createHeading2('5.1. Kiểm thử hệ thống (Testing Strategy & Executed Test Cases)'));
  elements.push(createParagraph([
    'Công tác kiểm thử phần mềm đóng vai trò then chốt nhằm đảm bảo chất lượng, tính ổn định và sự chính xác của mọi chức năng nghiệp vụ trong hệ thống Smart TechRepair Hub. Nhóm phát triển áp dụng chiến lược kiểm thử đa tầng bao gồm Kiểm thử đơn vị (Unit Test), Kiểm thử tích hợp (Integration Test) và Kiểm thử chấp nhận người dùng (UAT).'
  ]));

  elements.push(createParagraph([
    { text: 'Bảng 5.1 - Kết quả thực thi 22 Testcases nghiệp vụ trọng yếu của hệ thống', bold: true, italic: true }
  ]));

  const testHeaders = ['STT', 'Mã Test Case', 'Tên kịch bản kiểm thử (Test Scenario)', 'Dữ liệu đầu vào (Input)', 'Kết quả mong đợi (Expected)', 'Trạng thái'];
  const testRows = [
    ['1', 'TC-AUTH-01', 'Đăng nhập thành công với tài khoản Admin', 'Email admin@repair.vn, Pass hợp lệ', 'Trả về HTTP 200 + JWT token hợp lệ', 'PASSED'],
    ['2', 'TC-AUTH-02', 'Đăng nhập thất bại với sai Password', 'Email admin@repair.vn, Pass sai', 'Trả về HTTP 401 Unauthorized', 'PASSED'],
    ['3', 'TC-INTK-01', 'Tạo đơn mới với KH chưa từng tồn tại', 'SĐT mới 0988111222, Tên KH, Ảnh', 'Khởi tạo KH mới + Cấp mã TRK-YYYYMMDD-XXXX', 'PASSED'],
    ['4', 'TC-INTK-02', 'Tạo đơn mới cho KH đã có trong hệ thống', 'SĐT cũ 0912345678, Ảnh ngoại quan', 'Nhận diện KH cũ, tạo đơn gắn CustomerId cũ', 'PASSED'],
    ['5', 'TC-INTK-03', 'Tạo đơn thiếu ảnh ngoại quan thiết bị', 'Không chọn file ảnh ngoại quan', 'Trả về HTTP 400 Bad Request "Bắt buộc có ảnh"', 'PASSED'],
    ['6', 'TC-INTK-04', 'Tạo đơn với SĐT sai định dạng', 'SĐT "09123" (5 chữ số)', 'Trả về HTTP 400 "Phone phải đúng 10 chữ số"', 'PASSED'],
    ['7', 'TC-PART-01', 'Thêm mới linh kiện với Serial/IMEI hợp lệ', 'Serial "SN-IP13-8899", Category Màn hình', 'Lưu linh kiện vào DB với status New', 'PASSED'],
    ['8', 'TC-PART-02', 'Thêm mới linh kiện bị trùng Serial/IMEI', 'Serial "SN-IP13-8899" đã có trong DB', 'Báo lỗi HTTP 409 Conflict "Duplicate Serial/IMEI"', 'PASSED'],
    ['9', 'TC-PART-03', 'Cập nhật trạng thái linh kiện sang Damaged', 'PartId, Status="Damaged"', 'Cập nhật thành công trạng thái hỏng', 'PASSED'],
    ['10', 'TC-QUOT-01', 'Tạo báo giá chi tiết gồm linh kiện + tiền công', 'OrderId, PartId, LaborCost=200000', 'Báo giá lưu DB, status Order Quoted', 'PASSED'],
    ['11', 'TC-PORT-01', 'Khách tra cứu đơn đúng SĐT và TrackingCode', 'SĐT 0988111222 + TRK-20260826-1234', 'Hiển thị tiến độ, ảnh ngoại quan, báo giá', 'PASSED'],
    ['12', 'TC-PORT-02', 'Khách tra cứu nhập sai TrackingCode', 'SĐT 0988111222 + TRK-00000000-0000', 'Báo lỗi "Thông tin không khớp/không tồn tại"', 'PASSED'],
    ['13', 'TC-PORT-03', 'Khách hàng duyệt chấp nhận báo giá', 'Click "Chấp nhận" trên giao diện web', 'Status Quote Approved, Order Approved', 'PASSED'],
    ['14', 'TC-PORT-04', 'Khách hàng từ chối báo giá', 'Click "Từ chối" trên giao diện web', 'Status Quote Rejected, Order Rejected', 'PASSED'],
    ['15', 'TC-NOTI-01', 'Tự động gửi thông báo SMS khi tạo đơn', 'Event ORDER_CREATED', 'Log Notification SUCCESS, gửi tin nhắn SMS', 'PASSED'],
    ['16', 'TC-NOTI-02', 'Gửi lại thông báo khi Gateway bị lỗi', 'Gateway timeout error', 'Đổi status PENDING_RETRY, hẹn lịch retry', 'PASSED'],
    ['17', 'TC-REPT-01', 'Xuất báo cáo doanh thu khoảng thời gian hợp lệ', 'From: 2026-08-01, To: 2026-08-25', 'Trả về tổng doanh thu chính xác', 'PASSED'],
    ['18', 'TC-REPT-02', 'Xuất báo cáo chọn FromDate > ToDate', 'From: 2026-08-30, To: 2026-08-01', 'Báo lỗi HTTP 400 "Khoảng thời gian không hợp lệ"', 'PASSED'],
    ['19', 'TC-PROD-01', 'Xem báo cáo hiệu suất của 1 KTV cụ thể', 'TechId, Từ ngày - Đến ngày', 'Hiển thị tổng đơn hoàn thành + Avg processing time', 'PASSED'],
    ['20', 'TC-SECU-01', 'Truy cập API Admin không có Token JWT', 'GET /api/reports/revenue', 'Trả về HTTP 401 Unauthorized', 'PASSED'],
    ['21', 'TC-SECU-02', 'KTV cố tình truy cập API Báo cáo doanh thu', 'Token KTV (Role Technician)', 'Trả về HTTP 403 Forbidden', 'PASSED'],
    ['22', 'TC-PERF-01', 'Kiểm thử tải đồng thời 100 requests tra cứu', '100 VUs tra cứu /api/customer/trace', 'Response time p95 < 180ms, error rate 0%', 'PASSED']
  ];

  elements.push(createStyledTable(testHeaders, testRows, [8, 15, 27, 20, 20, 10]));

  elements.push(createHeading2('5.2. Đánh giá kết quả đạt được'));

  elements.push(createHeading3('5.2.1. So sánh sản phẩm thực tế với mục tiêu ban đầu'));
  elements.push(createParagraph([
    'Sau quá trình thiết kế, triển khai và kiểm thử nghiêm ngặt, phần mềm Smart TechRepair Hub đã hoàn thành 100% các mục tiêu tính năng đề ra ban đầu:'
  ]));
  elements.push(createBulletPoint([
    { text: 'Tiếp nhận & Quản lý đơn sửa chữa: ', bold: true },
    'Đã chuẩn hóa thành công quy trình tiếp nhận, đính kèm ảnh ngoại quan thực tế và tự động cấp mã Tracking độc nhất.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Cổng tra cứu & Duyệt báo giá minh bạch: ', bold: true },
    'Khách hàng tự do tra cứu không cần đăng ký tài khoản, xem ảnh ngoại quan và duyệt báo giá chỉ với 1 cú click.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Quản lý kho Serial/IMEI: ', bold: true },
    'Loại bỏ triệt để hiện tượng thất thoát kho nhờ quản lý chính xác từng Serial/IMEI đơn vị.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Quản trị & Analytics: ', bold: true },
    'Cung cấp Dashboard trực quan với báo cáo doanh thu và đo lường năng suất làm việc của từng kỹ thuật viên.'
  ]));

  elements.push(createHeading3('5.2.2. Ưu điểm của hệ thống'));
  elements.push(createBulletPoint([
    { text: 'Kiến trúc mã nguồn chuẩn Clean Architecture: ', bold: true },
    'Dễ dàng bảo trì, nâng cấp tính năng mới mà không làm ảnh hưởng đến các phân hệ khác.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Tối ưu trải nghiệm người dùng (UX/UI): ', bold: true },
    'Giao diện hiện đại, tương thích hoàn hảo trên các thiết bị di động và máy tính bảng.'
  ]));

  elements.push(createHeading2('5.3. Hạn chế của hệ thống'));
  elements.push(createBulletPoint([
    { text: 'Chưa hỗ trợ kết nối trực tiếp với thiết bị phần cứng đo đạc: ', bold: true },
    'Kỹ thuật viên vẫn phải chẩn đoán và nhập mô tả lỗi thủ công vào hệ thống.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Chưa tích hợp thanh toán trực tuyến: ', bold: true },
    'Việc thanh toán chi phí sửa chữa hiện tại vẫn phụ thuộc vào tiền mặt hoặc chuyển khoản ngân hàng thủ công tại cửa hàng.'
  ]));

  elements.push(createHeading2('5.4. Định hướng phát triển tương lai'));

  elements.push(createHeading3('5.4.1. Ứng dụng Trí tuệ Nhân tạo (AI) trong chẩn đoán lỗi'));
  elements.push(createParagraph([
    'Tích hợp mô hình AI Machine Learning / Computer Vision để phân tích hình ảnh bo mạch, màn hình thiết bị bị hỏng, tự động gợi ý nguyên nhân sự cố và đề xuất danh mục linh kiện thay thế phù hợp cho kỹ thuật viên.'
  ]));

  elements.push(createHeading3('5.4.2. Tích hợp Cổng thanh toán trực tuyến & Hóa đơn điện tử'));
  elements.push(createParagraph([
    'Kết nối các cổng thanh toán uy tín tại Việt Nam như VNPay, ZaloPay, MoMo và xuất hóa đơn điện tử tự động (MISA, meInvoice) ngay khi khách hàng duyệt báo giá.'
  ]));

  elements.push(createHeading3('5.4.3. Phát triển Mobile App chuyên dụng cho Kỹ thuật viên'));
  elements.push(createParagraph([
    'Xây dựng ứng dụng di động native (React Native / Flutter) cho KTV hiện trường, tích hợp camera quét mã vạch Serial/IMEI siêu tốc và thông báo đẩy Realtime (Push Notifications).'
  ]));

  elements.push(createCalloutBox(
    'KẾT LUẬN CHƯƠNG 5',
    [
      'Kết quả thực thi 22 testcases kiểm thử đều đạt yêu cầu (PASSED 100%), khẳng định chất lượng và độ tin cậy của Smart TechRepair Hub.',
      'Định hướng ứng dụng AI, IoT và thanh toán điện tử mở ra tiềm năng phát triển to lớn cho hệ thống trong tương lai.'
    ]
  ));

  return elements;
}

module.exports = { getChapter5Section };
