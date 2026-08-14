# Use Case: View Technician Productivity

**Description:** Admin xem hiệu suất làm việc của các kỹ thuật viên

**Precondition:** Admin đã đăng nhập vào hệ thống.

**Postcondition:** Hệ thống hiển thị báo cáo hiệu suất chi tiết của kỹ thuật viên cho Admin.

## Actors
- **Admin**

## Data Entities
- **User**
- **TechnicianProductivityReport**
- **ServiceOrder**

## Flows
### EXCEPTION: No Data Found
Không tìm thấy dữ liệu đơn hàng cho kỹ thuật viên hoặc khoảng thời gian đã chọn.
Hệ thống hiển thị thông báo 'Không có dữ liệu trong khoảng thời gian này'.

### MAIN: Main Flow
Admin đăng nhập vào hệ thống và chọn mục 'Báo cáo hiệu suất kỹ thuật viên'.
Admin chọn khoảng thời gian (Từ ngày, Đến ngày) và kỹ thuật viên (hoặc chọn tất cả).
Admin nhấn nút 'Xem báo cáo'.
Hệ thống truy vấn tất cả ServiceOrder liên quan đến kỹ thuật viên trong khoảng thời gian đã chọn.
Hệ thống tính toán các chỉ số: Tổng số đơn hoàn thành, thời gian trung bình xử lý đơn (từ lúc tiếp nhận đến khi hoàn thành).
Hệ thống hiển thị báo cáo chi tiết bao gồm bảng danh sách các kỹ thuật viên với các chỉ số tương ứng.

## Business Rules
- Báo cáo phải cho phép lọc theo Kỹ thuật viên cụ thể hoặc tất cả kỹ thuật viên.
- Hiệu suất được tính dựa trên số lượng đơn hoàn thành và thời gian trung bình để hoàn thành một đơn hàng.
- Chỉ thống kê các đơn hàng đã được gán cho kỹ thuật viên.

