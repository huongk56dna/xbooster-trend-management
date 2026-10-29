# Rà soát không gian vận hành X-Booster

Ngày: 27/10/2026.

## Thay đổi

- Trang chủ, menu và đường dẫn trực tiếp theo vai đang làm việc. Chuyển vai tải lại phạm vi dữ liệu tại máy chủ; tài khoản có nhiều vai không dùng chung dữ liệu tài chính giữa các vai.
- Đơn hàng, điều hành cổng–kho, hiệu suất giao nhận, Advance Payment và xu hướng dùng hồ sơ đã lưu. Các bộ trình diễn tự sinh không còn ghép vào số liệu làm việc. Không xóa hồ sơ hay danh mục cũ.
- Khảo sát chính thức và CSV không cộng khảo sát đánh dấu mẫu. Dashboard dùng cùng nguồn khảo sát và quyền tại máy chủ.
- Tồn khả dụng giữ đúng toàn bộ lượng đã giữ bởi các đơn khác, kể cả đơn không nằm trong phạm vi xem của Sales. Kiểm tra đơn dùng lại quy tắc gửi duyệt, không tạo đơn hoặc ghi sổ trong lúc nhập.
- Khách hàng và tồn kho có tìm kiếm, lọc và phân trang. Danh mục chỉ hiển thị ảnh sản phẩm có nguồn; không thay ảnh thiếu bằng mẫu vân suy đoán.
- Nút nghiệp vụ theo vai, nhãn thống nhất bằng tiếng Việt, thời gian theo Việt Nam; nhật ký hiển thị tên nghiệp vụ.
- Rời màn hình khảo sát hoặc đổi vai lưu nháp trên thiết bị trước. Nếu ghi nháp thất bại, giữ nguyên màn hình và báo lỗi. Không tự gửi khảo sát chính thức.
- Thiết lập hiển thị trạng thái cấu hình thực tế của lưu trữ, AI và ngân hàng. Không hiển thị trạng thái tích hợp tự động khi chưa triển khai.

## Xác minh

- Kiểm thử nghiệp vụ: khảo sát, phân cấp quyền, tồn kho, đáp ứng nguồn hàng, phê duyệt, lãi đơn, đối trừ, QR và logistics.
- Bổ sung kiểm thử vai đang chọn cho chủ hệ thống và tài khoản nhiều vai; dữ liệu tài chính của R&D; lượng giữ của đơn bị ẩn; thao tác kiểm tra không sửa dữ liệu.
- Kiểm tra API trạng thái, vai không được cấp và quyền truy cập thiết lập; đối chiếu phiên bản và dữ liệu trước/sau các lệnh đọc.
- Kiểm tra giao diện trang chủ, khảo sát, xu hướng, khách hàng, đơn hàng, kho, hiệu suất giao nhận, Advance Payment và thiết lập.
- Kiểm tra form khảo sát ở 320/390/768 px; lưu nháp, rời màn hình và mở lại nháp. Không mô phỏng lại ngắt mạng vật lý trong lần rà soát này.

## Điều kiện vận hành thực tế

- Ngân hàng: cần tài khoản nhận tiền chính thức, BIN QR và Kế toán xác minh giao dịch; chưa có webhook ngân hàng.
- AI: có cấu hình không đồng nghĩa có hạn mức thanh toán; vẫn cần tài khoản OpenAI có hạn mức. Nhập tay tiếp tục hoạt động khi dịch vụ không phản hồi. Lần rà soát giao diện này không gọi AI có tính phí.
- ERP: danh mục và tồn kho vẫn cập nhật qua nghiệp vụ/nhập liệu, chưa đồng bộ ERP tự động.
- Sổ lãi 8%: Kế Toán Trưởng thiết lập mốc đầu kỳ theo sổ thực tế trước khi ghi lãi. Không tự tạo khoản thu, bút toán hoặc chốt kỳ trong quá trình cập nhật giao diện.

Giữ nguyên phạm vi chia sẻ riêng tư của website.
