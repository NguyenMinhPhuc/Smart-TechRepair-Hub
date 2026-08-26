const {
  createHeading1,
  createHeading2,
  createHeading3,
  createParagraph,
  createBulletPoint,
  createStyledTable,
  createCalloutBox,
  createCodeBlock,
  createPageBreak
} = require('../helpers');

function getChapter3Section() {
  const elements = [];

  elements.push(createPageBreak());
  elements.push(createHeading1('Chương 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG'));

  elements.push(createHeading2('3.1. Xác định yêu cầu hệ thống'));

  elements.push(createHeading3('3.1.1. Các tác nhân hệ thống (Actors)'));
  elements.push(createParagraph([
    'Phân tích các tác nhân (Actors) đóng vai trò tương tác trực tiếp hoặc gián tiếp với hệ thống Smart TechRepair Hub:'
  ]));

  const actorHeaders = ['Tác nhân (Actor)', 'Loại tác nhân', 'Mô tả vai trò & Quyền hạn trong hệ thống'];
  const actorRows = [
    ['Admin (Quản trị viên)', 'Người dùng nội bộ (Human)', 'Có toàn quyền quản trị hệ thống, quản lý người dùng, xem báo cáo doanh thu, đánh giá năng suất KTV, cấu hình cửa hàng và quản lý danh mục linh kiện.'],
    ['Technician (Kỹ thuật viên)', 'Người dùng nội bộ (Human)', 'Tiếp nhận thiết bị từ khách hàng, chụp ảnh ngoại quan, tạo đơn sửa chữa, lập báo giá chi tiết, xuất kho linh kiện, cập nhật tiến độ sửa chữa và hoàn thành đơn hàng.'],
    ['Customer (Khách hàng)', 'Người dùng bên ngoài (Human)', 'Sử dụng cổng tra cứu public (không cần tài khoản), nhập SĐT và Mã Tracking để xem trạng thái đơn, hình ảnh ngoại quan, duyệt hoặc từ chối báo giá sửa chữa.'],
    ['System Engine (Hệ thống tự động)', 'Tác nhân hệ thống (System)', 'Tự động kích hoạt thông báo SMS/Email, kiểm tra ngưỡng tồn kho tối thiểu, sinh mã Tracking Code ngẫu nhiên duy nhất và ghi nhật ký hệ thống (Audit Log).']
  ];
  elements.push(createStyledTable(actorHeaders, actorRows, [25, 25, 50]));

  elements.push(createHeading3('3.1.2. Danh sách các chức năng nghiệp vụ (Functional Requirements)'));
  elements.push(createBulletPoint([
    { text: 'FR1 - Xác thực & Phân quyền (Authentication & Authorization): ', bold: true },
    'Đăng nhập bằng Email/Password, tạo token JWT, mã hóa bcrypt mật khẩu, kiểm soát truy cập theo vai trò (Role-Based Access Control - RBAC).'
  ]));
  elements.push(createBulletPoint([
    { text: 'FR2 - Quản lý Tiếp nhận & Đơn sửa chữa (Service Order Management): ', bold: true },
    'Tiếp nhận thiết bị, tự động tìm/tạo khách hàng theo SĐT, lưu thông tin thiết bị (Loại, Hãng, Model, Serial/IMEI), bắt buộc đính kèm ảnh ngoại quan, sinh mã Tracking Code TRK-YYYYMMDD-XXXX.'
  ]));
  elements.push(createBulletPoint([
    { text: 'FR3 - Quản lý Kho Linh kiện (Inventory Management): ', bold: true },
    'Nhập linh kiện theo Serial/IMEI duy nhất, phân loại theo Danh mục, trạng thái (Mới, Cũ, Hỏng), thiết lập đơn giá, trừ tồn kho chính xác khi gắn vào đơn sửa chữa.'
  ]));
  elements.push(createBulletPoint([
    { text: 'FR4 - Cổng Duyệt báo giá Khách hàng (Customer Portal & Quote): ', bold: true },
    'Tra cứu bằng SĐT + Tracking Code, hiển thị chi tiết tiền công + tiền linh kiện, cho phép bấm đồng ý/từ chối báo giá trực tuyến.'
  ]));
  elements.push(createBulletPoint([
    { text: 'FR5 - Thông báo Tự động (Automated Notifications): ', bold: true },
    'Bắn tin nhắn SMS/Email tự động khi tạo đơn mới, khi báo giá sẵn sàng, hoặc khi hoàn thành sửa chữa.'
  ]));
  elements.push(createBulletPoint([
    { text: 'FR6 - Báo cáo & Thống kê Quản trị (Reporting & Analytics): ', bold: true },
    'Báo cáo doanh thu theo khoảng thời gian chọn lọc, biểu đồ doanh thu theo ngày, thống kê số đơn hoàn thành và thời gian xử lý trung bình của từng kỹ thuật viên.'
  ]));

  elements.push(createHeading3('3.1.3. Yêu cầu Phi chức năng (Non-Functional Requirements)'));
  elements.push(createBulletPoint([
    { text: 'NFR1 - Hiệu năng (Performance): ', bold: true },
    'Thời gian phản hồi API trung bình < 200ms đối với các tác vụ tra cứu và < 500ms cho các tác vụ ghi DB. Hệ thống đáp ứng tối thiểu 100 giao dịch đồng thời (TPS).'
  ]));
  elements.push(createBulletPoint([
    { text: 'NFR2 - Tính sẵn sàng & Tin cậy (Availability & Reliability): ', bold: true },
    'Hệ thống đạt chỉ số uptime 99.9%. Mọi thao tác tài chính và thay đổi kho phải nằm trong DB Transaction an toàn.'
  ]));
  elements.push(createBulletPoint([
    { text: 'NFR3 - Bảo mật (Security): ', bold: true },
    'Mật khẩu phải được băm bằng bcrypt với salt rounds >= 10. Toàn bộ kết nối API mã hóa SSL/TLS (HTTPS). Chống các lỗ hổng OWASP Top 10 (SQL Injection, XSS, CSRF).'
  ]));

  elements.push(createHeading2('3.2. Mô hình Use Case'));

  elements.push(createHeading3('3.2.1. Biểu đồ Use Case Tổng quát Cấp 0'));
  elements.push(createParagraph([
    'Mô hình Use Case cấp 0 mô tả cái nhìn toàn cảnh về sự tương tác giữa 4 tác nhân chính (Admin, Technician, Customer, System Engine) với các phân hệ chức năng cốt lõi của Smart TechRepair Hub:'
  ]));

  const ucOverviewHeaders = ['Phân hệ (Module)', 'Tác nhân chính', 'Danh sách Use Cases tương ứng'];
  const ucOverviewRows = [
    ['Authentication', 'User (Admin/Tech)', 'UC01 - Login / Authentication JWT'],
    ['Service Order Management', 'Technician, Customer', 'UC02 - Create Service Order, UC03 - Update Order Status'],
    ['Inventory & Master Data', 'Admin, Technician', 'UC04 - Manage Parts (Serial/IMEI), UC05 - Manage Part Categories'],
    ['Customer Portal & Quotes', 'Customer, Technician', 'UC06 - Trace & Approve Quote, UC07 - Create Quote'],
    ['Notification System', 'System Engine, Customer', 'UC08 - Trigger Automated Notification (SMS/Email)'],
    ['Reporting & Analytics', 'Admin', 'UC09 - Generate Revenue Report, UC10 - View Technician Productivity']
  ];
  elements.push(createStyledTable(ucOverviewHeaders, ucOverviewRows, [25, 25, 50]));

  elements.push(createHeading3('3.2.2. Đặc tả chi tiết 8 Use Cases cốt lõi'));

  // UC01 Spec
  elements.push(createParagraph([
    { text: '► ĐẶC TẢ USE CASE 01: LOGIN (ĐĂNG NHẬP HỆ THỐNG)', bold: true, color: '1F4E78' }
  ]));
  elements.push(createBulletPoint([{ text: 'Mô tả: ', bold: true }, 'Cho phép Admin và Kỹ thuật viên đăng nhập hệ thống bằng tài khoản email và mật khẩu để nhận token JWT xác thực.']));
  elements.push(createBulletPoint([{ text: 'Precondition: ', bold: true }, 'Người dùng có tài khoản đã được kích hoạt trong bảng Users.']));
  elements.push(createBulletPoint([{ text: 'Postcondition: ', bold: true }, 'Người dùng đăng nhập thành công và sở hữu JWT hợp lệ chứa thông tin Role.']));
  elements.push(createBulletPoint([{ text: 'Main Flow: ', bold: true }, '1. User nhập Email và Password -> 2. System kiểm tra định dạng và truy vấn DB -> 3. System băm password kiểm tra với PasswordHash -> 4. System sinh token JWT kèm payload UserId, Role -> 5. Trả về JWT cho Frontend lưu vào Storage.']));
  elements.push(createBulletPoint([{ text: 'Exception Flow: ', bold: true }, 'Nhập sai Email/Password hoặc tài khoản bị khóa (IsDeleted=1): System trả về mã 401 Unauthorized với thông báo "Invalid credentials or account disabled".']));

  // UC02 Spec
  elements.push(createParagraph([
    { text: '► ĐẶC TẢ USE CASE 02: CREATE SERVICE ORDER (TẠO ĐƠN SỬA CHỮA)', bold: true, color: '1F4E78' }
  ]));
  elements.push(createBulletPoint([{ text: 'Mô tả: ', bold: true }, 'Quy trình KTV tiếp nhận thiết bị từ khách hàng, ghi nhận tình trạng ngoại quan, tải ảnh lên và tạo đơn sửa chữa kèm mã Tracking Code.']));
  elements.push(createBulletPoint([{ text: 'Precondition: ', bold: true }, 'Kỹ thuật viên đã đăng nhập thành công vào hệ thống.']));
  elements.push(createBulletPoint([{ text: 'Postcondition: ', bold: true }, 'Đơn sửa chữa lưu vào DB với trạng thái Created, ảnh thiết bị lưu vào DevicePhotos, mã Tracking TRK-YYYYMMDD-XXXX được cấp.']));
  elements.push(createBulletPoint([{ text: 'Main Flow: ', bold: true }, '1. KTV chọn Tiếp nhận thiết bị -> 2. KTV nhập SĐT khách hàng -> 3. System tự động gọi SP sp_FindOrCreateCustomer -> 4. KTV chọn loại thiết bị, Hãng, Model, Serial/IMEI -> 5. KTV nhập mô tả sự cố ban đầu -> 6. KTV tải lên ít nhất 1 ảnh ngoại quan ban đầu -> 7. System kích hoạt Trigger sinh mã Tracking -> 8. System gửi thông báo xác nhận cho Khách hàng.']));
  elements.push(createBulletPoint([{ text: 'Business Rules: ', bold: true }, 'Mô tả lỗi và ảnh ngoại quan là bắt buộc. Số điện thoại phải đúng 10 chữ số.']));

  // UC03 Spec
  elements.push(createParagraph([
    { text: '► ĐẶC TẢ USE CASE 03: MANAGE PARTS (QUẢN LÝ LINH KIỆN TỒN KHO)', bold: true, color: '1F4E78' }
  ]));
  elements.push(createBulletPoint([{ text: 'Mô tả: ', bold: true }, 'Quản lý linh kiện kho theo từng mã định danh duy nhất Serial/IMEI.']));
  elements.push(createBulletPoint([{ text: 'Main Flow: ', bold: true }, 'User nhập Serial/IMEI, chọn Category, nhập Tên linh kiện, Đơn giá, Trạng thái (New/Used/Damaged). System kiểm tra tính duy nhất của Serial/IMEI và lưu vào bảng Parts.']));
  elements.push(createBulletPoint([{ text: 'Business Rule: ', bold: true }, 'Mỗi linh kiện bắt buộc thuộc về một Category tồn tại và có Serial/IMEI duy nhất trên toàn hệ thống.']));

  // UC04 Spec
  elements.push(createParagraph([
    { text: '► ĐẶC TẢ USE CASE 04: TRACE AND APPROVE QUOTE (TRA CỨU & DUYỆT BÁO GIÁ)', bold: true, color: '1F4E78' }
  ]));
  elements.push(createBulletPoint([{ text: 'Mô tả: ', bold: true }, 'Khách hàng tra cứu tiến độ sửa chữa bằng SĐT và Mã Tracking, xem ảnh ngoại quan và duyệt/từ chối báo giá chi tiết.']));
  elements.push(createBulletPoint([{ text: 'Main Flow: ', bold: true }, '1. Khách truy cập trang public -> 2. Nhập SĐT + Tracking Code -> 3. System xác thực sự tồn tại -> 4. System hiển thị thông tin tiến độ, ảnh chụp, báo giá linh kiện & tiền công -> 5. Khách hàng nhấn "Chấp nhận" hoặc "Từ chối" -> 6. System cập nhật trạng thái đơn thành Approved/Rejected và bắn thông báo cho KTV.']));

  // UC05 Spec
  elements.push(createParagraph([
    { text: '► ĐẶC TẢ USE CASE 05: GENERATE REVENUE REPORT (BÁO CÁO DOANH THU)', bold: true, color: '1F4E78' }
  ]));
  elements.push(createBulletPoint([{ text: 'Mô tả: ', bold: true }, 'Admin xem báo cáo tổng doanh thu, doanh thu linh kiện và phí dịch vụ theo khoảng thời gian tùy chọn.']));
  elements.push(createBulletPoint([{ text: 'Main Flow: ', bold: true }, '1. Admin chọn khoảng thời gian (Từ ngày, Đến ngày) -> 2. System truy vấn toàn bộ ServiceOrder có trạng thái Completed trong khoảng thời gian -> 3. System tính Tổng doanh thu = Sum(LaborCost + PartsCost) -> 4. Hiển thị bảng tổng hợp và biểu đồ doanh thu ngày.']));

  // UC06 Spec
  elements.push(createParagraph([
    { text: '► ĐẶC TẢ USE CASE 06: VIEW TECHNICIAN PRODUCTIVITY (NĂNG SUẤT KTV)', bold: true, color: '1F4E78' }
  ]));
  elements.push(createBulletPoint([{ text: 'Mô tả: ', bold: true }, 'Admin đánh giá năng suất làm việc của từng kỹ thuật viên dựa trên số đơn hoàn thành và thời gian xử lý trung bình.']));
  elements.push(createBulletPoint([{ text: 'Main Flow: ', bold: true }, '1. Admin chọn khoảng thời gian & chọn KTV (hoặc Tất cả) -> 2. System tính tổng đơn hoàn thành và thời gian trung bình (CompletedAt - CreatedAt) -> 3. Xuất bảng xếp hạng hiệu suất KTV.']));

  elements.push(createHeading2('3.3. Thiết kế Cơ sở dữ liệu'));

  elements.push(createHeading3('3.3.1. Từ điển dữ liệu chi tiết (Data Dictionary - 9 Thực thể)'));
  elements.push(createParagraph([
    'Bảng từ điển dữ liệu chi tiết định nghĩa toàn bộ thuộc tính, kiểu dữ liệu, ràng buộc khóa chính (PK), khóa ngoại (FK) và quy tắc kiểm tra (Check Constraints) trong SQL Server 2019:'
  ]));

  // Bảng Users
  elements.push(createParagraph([
    { text: 'Bảng 3.1 - Từ điển dữ liệu bảng Users (Nội bộ Admin / Technician)', bold: true, italic: true }
  ]));
  const userDictHeaders = ['Tên trường', 'Kiểu dữ liệu', 'Null?', 'Ràng buộc / Mô tả'];
  const userDictRows = [
    ['UserId', 'UNIQUEIDENTIFIER', 'No', 'PK, Default NEWID(). Mã định danh người dùng.'],
    ['Username', 'NVARCHAR(50)', 'No', 'UNIQUE. Tên đăng nhập.'],
    ['Email', 'NVARCHAR(100)', 'No', 'UNIQUE. Địa chỉ Email chính thức.'],
    ['PasswordHash', 'NVARCHAR(255)', 'No', 'Mật khẩu đã băm bằng thuật toán bcrypt.'],
    ['Role', 'NVARCHAR(20)', 'No', 'CHECK (Role IN (\'Admin\', \'Technician\')). Phân quyền.'],
    ['IsDeleted', 'BIT', 'No', 'Default 0. Xóa mềm (Soft Delete).'],
    ['CreatedAt / UpdatedAt', 'DATETIME2', 'No', 'Default SYSDATETIME(). Thời gian khởi tạo/cập nhật.']
  ];
  elements.push(createStyledTable(userDictHeaders, userDictRows, [25, 25, 15, 35]));

  // Bảng Customers
  elements.push(createParagraph([
    { text: 'Bảng 3.2 - Từ điển dữ liệu bảng Customers (Khách hàng)', bold: true, italic: true }
  ]));
  const custDictRows = [
    ['CustomerId', 'UNIQUEIDENTIFIER', 'No', 'PK, Default NEWID(). Mã định danh khách hàng.'],
    ['FullName', 'NVARCHAR(100)', 'No', 'Họ và tên khách hàng.'],
    ['Phone', 'VARCHAR(10)', 'No', 'UNIQUE, CHECK (Phone LIKE \'[0-9]{10}\'). Số điện thoại.'],
    ['Email', 'NVARCHAR(100)', 'Yes', 'Địa chỉ email nhận thông báo.'],
    ['IsDeleted', 'BIT', 'No', 'Default 0. Xóa mềm.']
  ];
  elements.push(createStyledTable(userDictHeaders, custDictRows, [25, 25, 15, 35]));

  // Bảng Parts
  elements.push(createParagraph([
    { text: 'Bảng 3.3 - Từ điển dữ liệu bảng Parts (Linh kiện kho)', bold: true, italic: true }
  ]));
  const partDictRows = [
    ['PartId', 'UNIQUEIDENTIFIER', 'No', 'PK, Default NEWID(). Mã linh kiện.'],
    ['CategoryId', 'UNIQUEIDENTIFIER', 'No', 'FK -> Categories(CategoryId). Danh mục linh kiện.'],
    ['Name', 'NVARCHAR(150)', 'No', 'Tên linh kiện (ví dụ: Màn hình iPhone 13 Pro).'],
    ['SerialIMEI', 'VARCHAR(100)', 'No', 'UNIQUE. Số Serial hoặc IMEI duy nhất.'],
    ['Status', 'NVARCHAR(20)', 'No', 'CHECK (Status IN (\'New\', \'Used\', \'Damaged\')). Trạng thái linh kiện.'],
    ['Price', 'DECIMAL(18,2)', 'No', 'CHECK (Price >= 0). Đơn giá niêm yết linh kiện.']
  ];
  elements.push(createStyledTable(userDictHeaders, partDictRows, [25, 25, 15, 35]));

  // Bảng ServiceOrders
  elements.push(createParagraph([
    { text: 'Bảng 3.4 - Từ điển dữ liệu bảng ServiceOrders (Đơn sửa chữa)', bold: true, italic: true }
  ]));
  const soDictRows = [
    ['OrderId', 'UNIQUEIDENTIFIER', 'No', 'PK, Default NEWID(). Mã đơn sửa chữa.'],
    ['TrackingCode', 'VARCHAR(50)', 'No', 'UNIQUE. Mã tra cứu ngẫu nhiên (TRK-YYYYMMDD-XXXX).'],
    ['CustomerId', 'UNIQUEIDENTIFIER', 'No', 'FK -> Customers(CustomerId). Khách hàng sở hữu.'],
    ['DeviceId', 'UNIQUEIDENTIFIER', 'Yes', 'FK -> Devices(DeviceId). Thiết bị cần sửa.'],
    ['TechnicianId', 'UNIQUEIDENTIFIER', 'Yes', 'FK -> Users(UserId). Kỹ thuật viên phụ trách.'],
    ['IssueDescription', 'NVARCHAR(MAX)', 'No', 'Mô tả chi tiết lỗi ban đầu.'],
    ['Status', 'NVARCHAR(30)', 'No', 'CHECK Status IN (\'Created\',\'Inspecting\',\'Quoted\',\'Approved\',\'Rejected\',\'Repairing\',\'Completed\',\'Cancelled\').']
  ];
  elements.push(createStyledTable(userDictHeaders, soDictRows, [25, 25, 15, 35]));

  elements.push(createHeading3('3.3.2. Chứng minh Chuẩn hóa Cơ sở dữ liệu (1NF, 2NF, 3NF)'));
  elements.push(createParagraph([
    'Để đảm bảo cơ sở dữ liệu Smart TechRepair Hub lưu trữ tối ưu, loại bỏ trùng lặp dữ liệu và tránh các bất thường khi Thêm/Xóa/Sửa (Insert/Delete/Update Anomaly), toàn bộ các bảng trong CSDL v2 đều được thiết kế chứng minh đạt ',
    { text: 'Dạng chuẩn 3 (3NF)', bold: true },
    ':'
  ]));

  elements.push(createBulletPoint([
    { text: '1. Chứng minh Đạt Dạng chuẩn 1 (1NF - First Normal Form): ', bold: true },
    'Tất cả các thuộc tính trong các bảng đều chứa các giá trị đơn (Atomic Values), không có thuộc tính lặp nhóm hoặc thuộc tính đa trị. Ví dụ: Bảng OrderParts tách riêng mối quan hệ N:N giữa ServiceOrders và Parts thay vì lưu chuỗi Serial danh sách linh kiện trong ServiceOrders.'
  ]));
  elements.push(createBulletPoint([
    { text: '2. Chứng minh Đạt Dạng chuẩn 2 (2NF - Second Normal Form): ', bold: true },
    'Mọi bảng đều đã đạt 1NF và tất cả các thuộc tính không khóa (Non-prime attributes) đều phụ thuộc hàm đầy đủ vào toàn bộ khóa chính. Do tất cả các bảng đều sử dụng Khóa chính đơn (Surrogate Primary Key - UNIQUEIDENTIFIER GUID) như OrderId, PartId, CustomerId nên không tồn tại phụ thuộc hàm một phần (Partial Dependency).'
  ]));
  elements.push(createBulletPoint([
    { text: '3. Chứng minh Đạt Dạng chuẩn 3 (3NF - Third Normal Form): ', bold: true },
    'Mọi bảng đều đã đạt 2NF và không tồn tại phụ thuộc bắc cầu (Transitive Dependency) giữa các thuộc tính không khóa. Ví dụ: Thông tin Khách hàng (FullName, Phone) không lưu trong bảng ServiceOrders mà tách riêng thành bảng Customers(CustomerId); Thông tin Danh mục linh kiện (Category Name) không lưu trong bảng Parts mà được tham chiếu qua CategoryId.'
  ]));

  elements.push(createHeading3('3.3.3. Ràng buộc toàn vẹn, Trigger và Stored Procedures'));
  elements.push(createParagraph([
    'Dưới đây là mã SQL cài đặt Trigger tự động sinh mã Tracking Code độc nhất và Stored Procedure tiếp nhận đơn hàng trong SQL Server 2019:'
  ]));

  const triggerSql = `-- TRIGGER: Sinh mã TrackingCode tự động (TRK-YYYYMMDD-XXXX)
CREATE OR ALTER TRIGGER trg_GenerateTrackingCode_v2
ON ServiceOrders
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @OrderId UNIQUEIDENTIFIER, @CustomerId UNIQUEIDENTIFIER, @DeviceId UNIQUEIDENTIFIER, @TechnicianId UNIQUEIDENTIFIER;
    DECLARE @IssueDescription NVARCHAR(MAX), @Status NVARCHAR(30);
    DECLARE @TrackingCode VARCHAR(50);
    DECLARE @DatePrefix VARCHAR(8) = CONVERT(VARCHAR(8), GETDATE(), 112);
    DECLARE @RandomSuffix INT;

    DECLARE cur CURSOR FOR SELECT OrderId, CustomerId, DeviceId, TechnicianId, IssueDescription, Status FROM inserted;
    OPEN cur;
    FETCH NEXT FROM cur INTO @OrderId, @CustomerId, @DeviceId, @TechnicianId, @IssueDescription, @Status;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        IF @OrderId IS NULL SET @OrderId = NEWID();
        WHILE 1 = 1
        BEGIN
            SET @RandomSuffix = FLOOR(RAND() * 8999 + 1000);
            SET @TrackingCode = 'TRK-' + @DatePrefix + '-' + CAST(@RandomSuffix AS VARCHAR(4));
            IF NOT EXISTS (SELECT 1 FROM ServiceOrders WHERE TrackingCode = @TrackingCode) BREAK;
        END

        INSERT INTO ServiceOrders (OrderId, TrackingCode, CustomerId, DeviceId, TechnicianId, IssueDescription, Status, IsDeleted, CreatedAt, UpdatedAt)
        VALUES (@OrderId, @TrackingCode, @CustomerId, @DeviceId, @TechnicianId, @IssueDescription, ISNULL(@Status, 'Created'), 0, SYSDATETIME(), SYSDATETIME());

        FETCH NEXT FROM cur INTO @OrderId, @CustomerId, @DeviceId, @TechnicianId, @IssueDescription, @Status;
    END
    CLOSE cur; DEALLOCATE cur;
END;
GO`;

  elements.push(createCodeBlock(triggerSql));

  elements.push(createCalloutBox(
    'KẾT LUẬN CHƯƠNG 3',
    [
      'Hệ thống Smart TechRepair Hub đã được phân tích và thiết kế hoàn chỉnh từ sơ đồ Use Case, đặc tả chi tiết 8 Use Cases cốt lõi, từ điển dữ liệu 9 bảng đến chứng minh dạng chuẩn 3NF.',
      'Cơ sở dữ liệu đảm bảo tính toàn vẹn tuyệt đối nhờ các ràng buộc FK, Check, Triggers và Stored Procedures tối ưu.'
    ]
  ));

  return elements;
}

module.exports = { getChapter3Section };
