# Use Case: Generate Revenue Report

**Description:** Admin xem báo cáo doanh thu theo khoảng thời gian

**Precondition:** Admin đã đăng nhập vào hệ thống.

**Postcondition:** Hệ thống hiển thị báo cáo doanh thu chi tiết theo khoảng thời gian đã chọn cho Admin.

## Actors
- **Admin**

## Data Entities
- **RevenueReport**
- **ServiceOrder**

## Flows
### EXCEPTION: Invalid Date Range
Admin chọn khoảng thời gian không hợp lệ (Ví dụ: 'Đến ngày' trước 'Từ ngày').
Hệ thống hiển thị thông báo lỗi 'Khoảng thời gian không hợp lệ'.
Admin điều chỉnh lại khoảng thời gian.

### MAIN: Main Flow
Admin đăng nhập vào hệ thống và chọn mục 'Báo cáo doanh thu'.
Admin chọn khoảng thời gian báo cáo (Từ ngày, Đến ngày).
Admin nhấn nút 'Xem báo cáo'.
Hệ thống truy vấn tất cả ServiceOrder có trạng thái 'Completed' trong khoảng thời gian đã chọn.
Hệ thống tính tổng doanh thu bằng cách cộng tổng [Chi phí linh kiện + Phí dịch vụ] của tất cả các đơn hàng đã lọc.
Hệ thống hiển thị kết quả báo cáo bao gồm: Tổng doanh thu, số lượng đơn hoàn thành, và biểu đồ doanh thu theo ngày.

## Business Rules
- Hệ thống phải tự động tính toán tổng doanh thu dựa trên chi phí linh kiện và phí dịch vụ.
- Báo cáo phải cho phép lọc theo khoảng thời gian (Từ ngày - Đến ngày).
- Doanh thu chỉ được tính từ các đơn hàng có trạng thái 'Completed' (Hoàn thành) và đã thanh toán.

