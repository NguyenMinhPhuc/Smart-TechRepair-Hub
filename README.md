# Smart-TechRepair-Hub

Hệ thống Quản lý Chuỗi Cửa hàng Sửa chữa & Bảo hành Thiết bị Điện tử (Smart TechRepair Hub)Chủ đề này tập trung chuyên sâu vào quy trình nghiệp vụ thực tế tại các trung tâm sửa chữa máy tính, điện thoại, thiết bị công nghệ (như Điện Thoại Vui, Bệnh Viện Máy Tính...). 

Đề tài giải quyết bài toán minh bạch hóa chi phí, quản lý linh kiện chính xác và theo dõi tiến độ sửa chữa theo thời gian thực.
## Chức năng cốt lõi
### Dành cho Khách hàng (Chủ thiết bị): 
- Đặt lịch hẹn sửa chữa/bảo dưỡng trước để không phải chờ đợi.
- Tra cứu tiến độ (Live Tracking): Nhập số điện thoại/Mã biên nhận để xem thiết bị đang ở giai đoạn nào (Đang kiểm tra $\rightarrow$ Báo giá $\rightarrow$ Đang thay linh kiện $\rightarrow$ Đã test xong $\rightarrow$ Chờ nhận). 
- Chấp nhận hoặc từ chối báo giá sửa chữa trực tuyến sau khi kỹ thuật viên kiểm tra xong.
### Dành cho Kỹ thuật viên (Technician): 
- Nhận máy, chụp ảnh tình trạng ngoại quan (vết trầy xước) và ghi nhận lỗi ban đầu.
- Tải lên biên bản kiểm tra chi tiết, đề xuất danh mục linh kiện cần thay kèm báo giá.
- Cập nhật trạng thái sửa chữa và ghi nhận thời gian bảo hành cho linh kiện mới thay.
### Dành cho Chủ cửa hàng / Quản lý (Admin):
- Quản lý Kho linh kiện: Theo dõi tồn kho linh kiện (Màn hình, RAM, SSD, Pin...), tự động trừ kho khi kỹ thuật viên hoàn thành đơn.
- Quản lý Bảo hành: Tra cứu lịch sử sửa chữa/bảo hành dựa trên Serial Number/IMEI của thiết bị.
- Báo cáo doanh thu, năng suất làm việc của từng kỹ thuật viên.Điểm nhấn kỹ thuật cho Đồ án
- Theo dõi tiến độ bằng mã Tracking/Mã QR: Tự động tạo mã QR trên phiếu tiếp nhận. Khách hàng quét mã là xem ngay toàn bộ nhật ký quá trình sửa chữa kèm ảnh chụp thiết bị bị hỏng.
- Quy trình Xác nhận Báo giá trực tuyến (Quote Approval Workflow): Khi KTV phát hiện thêm lỗi, hệ thống gửi thông báo (SMS/Email/Web Notification) kèm link báo giá. Khách chỉ cần bấm "Đồng ý" trên web thì KTV mới được phép tiến hành thay thế.
- Trừ kho linh kiện tự động (Inventory Sync): Khóa tạm thời linh kiện trong kho khi lập báo giá và tự động xuất kho ngay khi đơn sửa chữa hoàn tất.
### Tech Stack gợi ý 
- Frontend: React.js + TailwindCSS.
- Backend: Node.js (NestJS / Express) hoặc C# (.NET Core).
- Database: Microsoft SQL Server (cho dữ liệu quan hệ) 