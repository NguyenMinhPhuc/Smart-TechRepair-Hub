# Use Case: Create Service Order

**Description:** Quy trình kỹ thuật viên tiếp nhận thiết bị từ khách hàng, ghi nhận tình trạng và tạo đơn sửa chữa.

**Precondition:** Kỹ thuật viên đã đăng nhập vào hệ thống.

**Postcondition:** Đơn sửa chữa được tạo thành công, thiết bị được ghi nhận tình trạng ban đầu, khách hàng nhận được mã Tracking/QR.

## Actors
- **Customer**
- **Technician**

## Data Entities
- **CustomerProfile**
- **Device**
- **ServiceOrder**

## Flows
### EXCEPTION: Missing Mandatory Info
1. KTV bỏ trống một trong các trường bắt buộc (Số điện thoại, Serial/IMEI, Mô tả lỗi, Ảnh ngoại quan).
2. Hệ thống hiển thị thông báo lỗi chi tiết cho từng trường bị thiếu.
3. KTV bổ sung thông tin và thực hiện lại bước Tạo đơn.

### ALT: Customer Already Exists
1. KTV nhập Số điện thoại.
2. Hệ thống tìm thấy thông tin khách hàng cũ.
3. KTV xác nhận thông tin khách hàng và tiếp tục sang bước nhập thông tin thiết bị (bước 4 của Main Flow).

### MAIN: Main Flow
1. Kỹ thuật viên (KTV) chọn chức năng Tiếp nhận thiết bị.
2. KTV nhập Số điện thoại khách hàng.
3. Hệ thống kiểm tra: Nếu khách hàng chưa tồn tại, KTV nhập Tên khách hàng và Email.
4. KTV nhập thông tin thiết bị: Loại thiết bị, Hãng, Model, Serial/IMEI.
5. KTV nhập Mô tả lỗi ban đầu.
6. KTV chụp ảnh/tải lên các ảnh chụp ngoại quan (trầy xước, móp méo).
7. KTV nhấn nút Tạo đơn.
8. Hệ thống kiểm tra các ràng buộc dữ liệu: IMEI/Serial không trùng lặp, Ảnh đã có.
9. Hệ thống lưu đơn vào cơ sở dữ liệu với trạng thái Đang tiếp nhận.
10. Hệ thống tạo Tracking Code và QR Code cho đơn hàng.
11. Hệ thống gửi thông báo xác nhận (SMS/Email) cho khách hàng kèm link tra cứu.

## Business Rules
- Tracking Code được hệ thống tự động tạo theo định dạng: SO-[YYYYMMDD]-[RANDOM_5_DIGITS].
- Mô tả lỗi ban đầu là bắt buộc.
- Bắt buộc phải tải lên ít nhất 1 ảnh chụp ngoại quan thiết bị (tình trạng ban đầu).
- Số điện thoại khách hàng phải là định dạng hợp lệ (10 chữ số).
- IMEI/Serial Number là bắt buộc và phải là duy nhất trên hệ thống cho thiết bị mới.

