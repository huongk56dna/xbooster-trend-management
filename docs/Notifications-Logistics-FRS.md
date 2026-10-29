# Chuông thông báo & Logistics cổng–kho

## Phạm vi và quyết định nghiệp vụ

Triển khai trong website hiện tại, không thay đổi chia sẻ/quyền truy cập website. Không cài ứng dụng riêng; Bảo vệ dùng web responsive trên điện thoại. Chủ hệ thống cấp vai **Xe nâng** cho người thực hiện, như các vai hiện có.

Người dùng chốt: phương án thay thế **không tăng giá trị** gửi trực tiếp lại Thủ kho; **tăng giá trị** phải duyệt lại DOA hai cấp. Sau duyệt tăng giá trị, Kế toán kiểm tra lại thanh toán/tín dụng rồi mới quay về Kho. Phương án bị DOA trả về phải sửa và duyệt lại, không dùng quyết định bị từ chối để xuất hàng.

## Chuông

- Góc phải header, dùng được desktop/mobile; badge đỏ là số thông báo chưa đọc của tài khoản **và vai đang chọn**.
- Hộp thư phân Hôm nay/Trước đó, mở trực tiếp đúng đơn/hồ sơ xe/phiếu đáp ứng; kiểm tra lại quyền khi mở.
- GET /api/notifications kiểm tra vai được cấp, phạm vi vùng của cấp duyệt và người tạo đơn của Sales. Đơn phận xử lý nhận hàng đợi tương ứng. Không dùng quyền chủ hệ thống để bỏ qua vai đang chọn trong API chuông.
- POST /api/notifications lưu đã đọc theo (tài khoản, vai, thông báo) trong bảng notification_reads. Đọc của một người không đánh dấu đọc cho cả bộ phận; không làm tăng phiên bản chứng từ hay ghi đè thao tác nghiệp vụ.
- Tự tải mỗi 15 giây khi web đang mở, tải lại khi trở về cửa sổ; có toast cho thông báo mới sau lần tải đầu. Người dùng có thể bấm bật thông báo thiết bị và tự cấp quyền trình duyệt. Không tự xin quyền, không gửi email/SMS, không tuyên bố nhận push khi đã đóng website.
- Thông báo cũ vẫn có thể mở hồ sơ đã hoàn tất để xem trạng thái mới nhất.

## Luồng mới

1. **Bảo vệ / Gate-In:** tìm NPP/retailer, mã đơn hoặc biển số đã biết; nhập biển số thực tế, tài xế, thiết bị; chụp/tải hai ảnh riêng: biển số và khoang xe/hàng lúc vào. JPG/PNG/WebP, tối đa 5 MB mỗi ảnh. Chọn chụp mới mở camera qua trình duyệt. Sau xác nhận, xe vào hàng đợi Sales Admin và có ảnh/hồ sơ.
2. **Sales Admin:** đối chiếu biển số, tài xế, đơn; ghi kết quả. Máy chủ kiểm tra DOA và Kế toán đã xác nhận thanh toán/tín dụng, rồi chuyển Thủ kho.
3. **Thủ kho:** nhập tồn thực tế và vị trí/lô/sắc độ cho **từng mã**. Đủ thực tế và tồn hệ thống mới chuyển lệnh cho Xe nâng. Thiếu hàng phải ghi lý do, giữ ở bước Kho và trả về Sales phụ trách.
4. **Sales đổi mẫu:** ghi nhận khách đã đồng ý; chọn lại mã/số lượng. Giá, tồn, tín dụng được tính lại trên máy chủ; giữ lịch sử trước/sau. Không tăng giá trị → Kho kiểm tra lại. Tăng giá trị → DOA → Kế toán → Kho. Không tự đổi mã hoặc xác nhận thay khách.
5. **Xe nâng:** xem đúng mã, quy cách, lô và số lượng; nhập kiểm đếm và bấm xác nhận đã xếp đủ. Vai khác không dùng API này thay Xe nâng.
6. **Bảo vệ / Gate-Out:** chụp/tải ảnh hàng đã xếp, kiểm đếm từng mã và thiết bị. Chênh lệch giữ xe, báo Kho/Xe nâng, không trừ tồn. Kiểm lại khớp phải ghi kết quả xử lý. Đủ ảnh, đủ kiểm đếm và điều kiện tài chính còn hợp lệ mới phát hành phiếu giao, trừ từng mã đúng một lần và hoàn tất đơn. Tên trạng thái nội bộ vẫn “Hoàn tất” để tương thích hóa đơn; nhãn logistics “Đã hoàn thành giao hàng”.

Thời gian, người thực hiện, ảnh, lý do giữ xe và các lần bàn giao được lưu. Ảnh chỉ cho chủ ảnh/chủ hệ thống và những tài khoản có vai/phạm vi được xem hồ sơ xe. Ảnh nhập/xuất không công khai.

Đơn/xe đã tồn tại trong luồng cũ vẫn có phần xử lý riêng. API đăng ký xe cũ bị chặn cho xe mới để không bỏ qua ảnh; API trạm cũ không được điều khiển xe logistics-v2. KPI và chứng từ cũ được giữ.

## Gợi ý thay thế

GET /api/orders/substitutes chỉ cho Sales phụ trách/Sales Admin khi đơn thực sự được Kho trả về. Tối đa 3 mã cho mỗi dòng: cùng quy cách chuẩn hóa, giá khách hàng ±15%, tồn khả dụng đủ. Xếp theo khách riêng biệt quan tâm và khảo sát hợp lệ trong 90 ngày, cùng phạm vi quyền khảo sát của người xem. Không dùng dữ liệu trình diễn.

Gợi ý hiển thị ngay theo danh mục/số liệu, không giả nhãn là AI. Nút Nhận xét AI gọi POST /api/orders/substitutes bằng OpenAI trên máy chủ; chỉ gửi thông số và số liệu tổng hợp của ứng viên đã lọc. Không gửi tên khách/Sales, ảnh xe, GPS hay ghi chú nguyên văn. Kết quả ngoài danh sách, lặp mã hoặc nhận xét quan tâm không có chứng cứ bị loại. Không tự thay đơn. Khi AI chưa có thanh toán/hết hạn/lỗi, danh mục vẫn dùng được; AI báo lỗi rõ ràng. Chưa nghiệm thu AI thật khi OpenAI chưa kích hoạt thanh toán.

## Kiểm chứng

- tests/logistics.test.mjs: đủ 5 bước, ảnh/role, nhánh thiếu hàng, đổi giảm/tăng giá trị, DOA trả về, Kế toán kiểm lại, chênh lệch cổng ra, tồn trừ một lần, phạm vi thông báo và ứng viên thay thế.
- tests/logistics-api.smoke.mjs: **chỉ localhost**, đơn/ảnh/ngân hàng giả, đọc chuông theo vai, đánh dấu đã đọc, sai vai bị chặn, upload/đọc ảnh, thay mẫu giảm giá, giữ xe khi lệch, xuất lại sau xử lý, hóa đơn/sổ/Excel. Không chạy trên sản xuất.
- tests/commerce-api.smoke.mjs dùng lại luồng tích hợp mới.
- Kiểm tra UI desktop và 320/390/768 px, nút camera/tải ảnh, badge và mở hồ sơ từ chuông. Kiểm tra viewport không thay thế việc thử camera trên điện thoại thật với người dùng tự cấp quyền.
