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

function getChapter1Section() {
  const elements = [];

  elements.push(createPageBreak());
  elements.push(createHeading1('Chương 1. TỔNG QUAN ĐỀ TÀI VÀ KHẢO SÁT HỆ THỐNG'));

  elements.push(createHeading2('1.1. Đặt vấn đề và tình hình ứng dụng công nghệ trong quản lý dịch vụ sửa chữa'));

  elements.push(createHeading3('1.1.1. Tình hình ứng dụng trong nước'));
  elements.push(createParagraph([
    'Tại Việt Nam, ngành dịch vụ bảo hành và sửa chữa thiết bị công nghệ điện tử phát triển với tốc độ nhanh chóng nhờ vào sự phổ biến của các dòng sản phẩm di động thông minh, laptop cá nhân và thiết bị gia dụng điện tử. Hầu hết các trung tâm lớn như Điện Máy Xanh, FPT Shop, CellphoneS (Snet) đều đã đầu tư các hệ thống phần mềm quản lý bảo hành chuyên biệt được tích hợp sẵn với hệ thống ERP tổng thể của doanh nghiệp.'
  ]));
  elements.push(createParagraph([
    'Tuy nhiên, phân khúc thị trường với hàng nghìn cửa hàng, chuỗi trung tâm sửa chữa vừa và nhỏ (SME) lại đang gặp khủng hoảng về giải pháp chuyển đổi số. Theo khảo sát thực tế tại các tuyến đường tập trung dịch vụ phần cứng điện tử tại TP.HCM và Hà Nội, hơn 75% cửa hàng vẫn sử dụng các phương thức ghi nhận truyền thống:'
  ]));
  elements.push(createBulletPoint([
    { text: 'Sổ biên nhận giấy và hóa đơn viết tay: ', bold: true },
    'Dễ gây thất lạc thông tin, sai sót mã thiết bị, và không thể tra cứu khi biên nhận bị rách hoặc mất.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Sử dụng phần mềm bán hàng POS thông thường (KiotViet, Sapo): ', bold: true },
    'Các phần mềm POS thương mại chỉ tập trung vào nghiệp vụ bán lẻ lẻ sản phẩm có sẵn, hoàn toàn không hỗ trợ quy trình sửa chữa đa bước (Tiếp nhận -> Chẩn đoán -> Báo giá -> Duyệt giá -> Thay thế linh kiện -> Kiểm tra chất lượng -> Bàn giao).'
  ]));
  elements.push(createBulletPoint([
    { text: 'Tra cứu tiến độ qua cuộc gọi trực tiếp: ', bold: true },
    'Tốn kém nhân lực tư vấn, gia tăng áp lực cho bộ phận CSKH và làm chậm trễ tiến độ làm việc của kỹ thuật viên.'
  ]));

  elements.push(createHeading3('1.1.2. Tình hình ứng dụng ngoài nước'));
  elements.push(createParagraph([
    'Tại các quốc gia phát triển như Mỹ, Châu Âu, Nhật Bản và Singapore, ngành công nghiệp sửa chữa thiết bị (Right to Repair Industry) đã áp dụng triệt để các nền tảng SaaS (Software as a Service) chuyên biệt dành riêng cho việc quản lý cửa hàng sửa chữa (Computer & Phone Repair Shop Software). Các hệ thống này cho phép:'
  ]));
  elements.push(createBulletPoint([
    { text: 'Tự động hóa hoàn toàn quy trình giao tiếp khách hàng: ', bold: true },
    'Gửi tin nhắn SMS và Email cập nhật từng bước trạng thái của thiết bị.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Quản lý kho linh kiện theo số Serial/IMEI từng đơn vị (Unit-level Serial Tracking): ', bold: true },
    'Đảm bảo truy xuất nguồn gốc chính xác của linh kiện từ nhà cung cấp đến thiết bị của khách hàng.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Tích hợp chữ ký điện tử (E-signature) và duyệt báo giá trực tuyến: ', bold: true },
    'Khách hàng xác thực điều khoản sửa chữa và đồng ý chi phí ngay trên smartphone.'
  ]));

  elements.push(createHeading2('1.2. Khảo sát các hệ thống / phần mềm liên quan'));

  elements.push(createHeading3('1.2.1. Khảo sát các hệ thống thương mại quốc tế'));
  elements.push(createParagraph([
    'Qua quá trình nghiên cứu, nhóm phát triển đã tiến hành phân tích chuyên sâu 3 giải pháp quản lý trung tâm sửa chữa hàng đầu thế giới bao gồm: ',
    { text: 'RepairShopr', bold: true },
    ', ',
    { text: 'RepairDesk', bold: true },
    ' và ',
    { text: 'ServiceM8', bold: true },
    '.'
  ]));

  const surveyHeaders = ['Tiêu chí so sánh', 'RepairShopr', 'RepairDesk', 'KiotViet / Sapo (POS VN)'];
  const surveyRows = [
    ['Mô hình quản lý đơn', 'Đơn sửa chữa (Ticket)', 'Đơn sửa chữa (Repair Order)', 'Đơn hàng bán lẻ (Sales Order)'],
    ['Quản lý kho Serial/IMEI', 'Hỗ trợ chi tiết theo từng mã', 'Hỗ trợ nâng cao theo SKU/IMEI', 'Chỉ quản lý số lượng tồn chung'],
    ['Cổng duyệt báo giá KH', 'Có (Client Portal)', 'Có (Customer Portal)', 'Không có'],
    ['Theo dõi ngoại quan (Ảnh)', 'Tải ảnh đính kèm đơn', 'Tải ảnh + Ghi chú lỗi', 'Không có'],
    ['Chi phí sử dụng', 'Rất cao ($99 - $299/tháng)', 'Rất cao ($75 - $190/tháng)', 'Trung bình (200k-500k/tháng)'],
    ['Phù hợp nghiệp vụ VN', 'Không (Chưa hỗ trợ Tiếng Việt)', 'Không (Thiếu tích hợp SMS VN)', 'Một phần (Chỉ phần thu chi)']
  ];

  elements.push(createStyledTable(surveyHeaders, surveyRows, [25, 25, 25, 25]));

  elements.push(createHeading3('1.2.2. Khảo sát các nền tảng quản trị nội bộ tổng hợp'));
  elements.push(createParagraph([
    'Bên cạnh các phần mềm chuyên biệt quốc tế, nhiều doanh nghiệp tại Việt Nam đã cố gắng tùy biến các hệ thống ERP mở như Odoo, ERPNext hoặc viết các phần mềm quản lý nội bộ riêng bằng Excel/Google Sheets. Tuy nhiên, việc tùy biến ERP đòi hỏi chi phí triển khai vô cùng đắt đỏ, trong khi Excel hoàn toàn thất bại khi số lượng đơn sửa chữa vượt quá 1,000 đơn/tháng do thiếu tính nhất quán dữ liệu và khả năng truy cập đồng thời.'
  ]));

  elements.push(createHeading2('1.3. Phân tích ưu và nhược điểm của các hệ thống hiện có'));

  elements.push(createHeading3('1.3.1. Ưu điểm'));
  elements.push(createBulletPoint([
    { text: 'Đối với hệ thống quốc tế (RepairShopr, RepairDesk): ', bold: true },
    'Quy trình nghiệp vụ rất chuẩn hóa, đầy đủ các tính năng nâng cao như tạo hóa đơn tự động, quản lý lịch hẹn kỹ thuật viên và tích hợp nhiều cổng thanh toán quốc tế.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Đối với phần mềm POS nội địa (KiotViet, Sapo): ', bold: true },
    'Giao diện thân thiện tiếng Việt, chi phí hàng tháng rẻ, dễ sử dụng cho nhân viên thu ngân.'
  ]));

  elements.push(createHeading3('1.3.2. Nhược điểm và khuyết điểm'));
  elements.push(createBulletPoint([
    { text: 'Rào cản ngôn ngữ và chi phí đắt đỏ: ', bold: true },
    'Các hệ thống chuyên nghiệp quốc tế có mức giá từ $1,000 đến $3,600/năm, vượt quá khả năng tài chính của đa số trung tâm sửa chữa vừa và nhỏ tại Việt Nam. Đồng thời không hỗ trợ ngôn ngữ tiếng Việt và quy trình hóa đơn VAT theo quy định pháp luật Việt Nam.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Thiếu tính năng chuyên biệt sửa chữa ở phần mềm nội địa: ', bold: true },
    'Các phần mềm POS Việt Nam không thể lưu trữ lịch sử trạng thái đơn sửa chữa, không có chức năng chụp ảnh biên nhận ngoại quan trước khi tháo máy, và không cung cấp link tra cứu minh bạch cho khách hàng.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Rủi ro bảo mật dữ liệu khách hàng: ', bold: true },
    'Nhiều cửa hàng nhỏ dùng các phần mềm bẻ khóa (crack) hoặc lưu dữ liệu trên bảng tính công khai, dẫn đến nguy cơ rò rỉ thông tin cá nhân của khách hàng.'
  ]));

  elements.push(createHeading2('1.4. Đề xuất giải pháp Smart-TechRepair-Hub và kết luận'));
  elements.push(createParagraph([
    'Từ kết quả khảo sát và phân tích thực trạng trên, dự án ',
    { text: 'Smart TechRepair Hub', bold: true },
    ' được đề xuất xây dựng nhằm mang lại một giải pháp phần mềm toàn diện, khắc phục hoàn toàn các nhược điểm của các phần mềm hiện có.'
  ]));
  elements.push(createParagraph([
    'Hệ thống Smart TechRepair Hub được thiết kế tập trung vào các giá trị cốt lõi:'
  ]));
  elements.push(createBulletPoint([
    { text: 'Minh bạch tối đa với Khách hàng (Customer Transparence): ', bold: true },
    'Cung cấp cổng tra cứu không cần đăng nhập, xem rõ ảnh ngoại quan ban đầu và nút duyệt báo giá 1-click.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Chặt chẽ trong Quản lý Kho (Strict Inventory Control): ', bold: true },
    'Quản lý linh kiện chính xác theo mã Serial/IMEI, loại bỏ nguy cơ thất thoát kho.'
  ]));
  elements.push(createBulletPoint([
    { text: 'Tối ưu hiệu suất Kỹ thuật viên & Quản trị (Productivity & Analytics): ', bold: true },
    'Tự động hóa thông báo, cấp mã Tracking độc nhất và cung cấp báo cáo hiệu suất chi tiết.'
  ]));

  elements.push(createCalloutBox(
    'KẾT LUẬN CHƯƠNG 1',
    [
      'Khảo sát thực tế cho thấy nhu cầu xây dựng một phần mềm quản lý trung tâm sửa chữa chuyên nghiệp, giá thành hợp lý và tối ưu cho thị trường Việt Nam là vô cùng cấp thiết.',
      'Giải pháp Smart TechRepair Hub chính là câu trả lời toàn diện đáp ứng đầy đủ các yêu cầu nghiệp vụ và công nghệ hiện đại.'
    ]
  ));

  return elements;
}

module.exports = { getChapter1Section };
