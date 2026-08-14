# Use Case: Trace and Approve Quote

**Description:** Cho phép khách hàng tra cứu tiến độ sửa chữa bằng SĐT và Mã đơn hàng, đồng thời xem báo giá chi tiết và thực hiện xác nhận hoặc từ chối báo giá.

**Precondition:** Đơn hàng đã được tạo trong hệ thống và Kỹ thuật viên đã gửi báo giá.

**Postcondition:** Trạng thái đơn hàng được cập nhật dựa trên quyết định của khách hàng (Approved/Rejected) và hệ thống đã ghi lại thao tác này vào nhật ký đơn hàng.

## Actors
- **Customer**

## Data Entities
- **Quote**
- **ServiceOrder**

## Flows
### ALT: ReadOnly View
1. Nếu đơn hàng không ở trạng thái cần báo giá, hệ thống ẩn nút 'Chấp nhận'/'Từ chối'.
2. Hệ thống hiển thị thông báo trạng thái hiện tại (ví dụ: 'Đang sửa chữa').

### EXCEPTION: Invalid Information
1. Khách hàng nhập sai SĐT hoặc Mã đơn hàng.
2. Hệ thống báo lỗi "Thông tin không khớp hoặc đơn hàng không tồn tại".
3. Hệ thống yêu cầu khách hàng kiểm tra lại.

### MAIN: MAIN
1. Khách hàng truy cập trang tra cứu.
2. Khách hàng nhập 'Số điện thoại' và 'Mã đơn hàng' (Mã Tracking).
3. Hệ thống xác thực sự tồn tại của đơn hàng.
4. Hệ thống hiển thị chi tiết tiến độ: [Trạng thái hiện tại], [Lịch sử thao tác], [Ảnh chụp ngoại quan].
5. Nếu đơn hàng đang ở trạng thái 'Waiting for Quote Approval', hệ thống hiển thị danh sách linh kiện cần thay, giá chi tiết, và tổng tiền.
6. Khách hàng chọn 'Chấp nhận' hoặc 'Từ chối' báo giá.
7. Hệ thống cập nhật trạng thái đơn hàng và gửi thông báo cho Kỹ thuật viên.

## Business Rules
- Khi khách hàng đồng ý, đơn hàng tự động chuyển sang 'Waiting for Repair'.
- Khi khách hàng từ chối báo giá, đơn hàng sẽ chuyển sang trạng thái 'Customer Rejected'.
- Chỉ có thể duyệt hoặc từ chối báo giá khi trạng thái đơn là 'Waiting for Quote Approval'.
- Số điện thoại khách hàng phải khớp với đơn hàng đã đăng ký.
- Mã đơn hàng phải đúng định dạng SO-[YYYYMMDD]-[RANDOM_5_DIGITS].

