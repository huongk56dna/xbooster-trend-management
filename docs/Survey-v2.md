# Khảo sát v2

- Một sản phẩm/record, 1–3 ảnh, Save trực tiếp không có bước duyệt.
- Sales và Sales Admin tạo khảo sát; chỉ người tạo sửa bản của mình. Chủ hệ thống xem tất cả nhưng không sửa thay.
- Nháp lưu trong IndexedDB `xbooster-survey-device`, theo ID tài khoản, bao gồm ảnh Blob. Không tự đồng bộ khi có mạng. Không hỗ trợ khởi động website hoàn toàn offline.
- Save dùng popup xác nhận chung, tải tệp rồi gửi command. `clientDraftId` chống tạo trùng, `mutationId` và `revision` bảo vệ cập nhật. Nháp chỉ xóa sau kết quả thành công.
- Có nút nhập nháp từ phiên bản cũ khi online; không ghi đè nháp trên thiết bị đã tồn tại.
- Ảnh online được gửi tạm cho API phân tích; chỉ Save mới tải ảnh vào kho lưu trữ. Khóa API không đến trình duyệt. OpenAI dùng `store:false` và chỉ nhận ảnh sản phẩm, không gửi tên khách hay số tồn.
- `/api/surveys/analyze`: multipart `images` và/hoặc JSON `fileIds`, tối đa 3 ảnh. Chỉ Sales/Sales Admin; ID tệp phải thuộc người gọi. 10 lần/phút/tài khoản. AI lỗi vẫn nhập tay được.
- Biến môi trường: `OPENAI_API_KEY` (secret), `OPENAI_VISION_MODEL` (mặc định `gpt-5.6-terra`). Không lưu giá trị khóa trong mã nguồn. Khóa đã tạo trong phiên này có thời hạn 7 ngày; cần thay trước khi hết hạn.
- Kiểm thử thực tế ngày 26/10/2026 nhận `billing_not_active`; tài khoản OpenAI cần kích hoạt thanh toán trước khi nghiệm thu nhận diện ảnh.

## Cơ cấu và phạm vi

Chủ hệ thống mở Nguồn dữ liệu → Xem danh sách tài khoản → Cập nhật. Khai báo:

- `orgPath`: phòng/đội theo đường dẫn, ví dụ `Sales/Bắc/Hà Nội`; cấp trên ở `Sales/Bắc`.
- `managerEmail`: tài khoản cấp trên đã tồn tại; đường dẫn cấp dưới phải nằm dưới cấp trên, không có chu trình.
- `area`, `region`: địa bàn làm việc tại thời điểm tạo khảo sát.
- `areas`: các khu vực Trưởng phòng được quản lý.
- `regions`: các vùng Giám đốc vùng được quản lý.

Phạm vi được chụp tại lúc tạo. Trưởng phòng hiện phụ trách phòng/đội + khu vực được xem dữ liệu thuộc phạm vi đó; Giám đốc vùng xem theo vùng; CEO/CFO xem tất cả. Không tự gán quyền kế toán.

Bảng `member_scopes` được tạo tương thích bằng CREATE TABLE IF NOT EXISTS. Không sửa cấu trúc bảng nghiệp vụ cũ. Người dùng chưa được khai báo địa bàn vẫn tạo được khảo sát; dữ liệu đó chỉ người tạo và cấp toàn hệ thống xem tới khi quản trị phân bổ địa bàn. Chủ hệ thống có nút “Địa bàn quản trị” để cấu hình bản ghi demo của chính mình.

Khảo sát cũ chưa có phạm vi có nút “Phân bổ địa bàn khảo sát” dành cho chủ hệ thống. Không đoán người tạo từ tên trùng. Giữ nguyên hồ sơ và các trạng thái lịch sử; không còn command kiểm tra/phê duyệt.

## Kiểm tra

- `node --test tests/*.test.mjs`
- `node tests/surveys-api.smoke.mjs` chỉ chạy localhost:5173, tạo dữ liệu QA cục bộ.
- Kiểm tra trình duyệt: upload ảnh → nhập → ngắt máy chủ → Lưu nháp → khôi phục máy chủ → mở nháp → Save → sửa record → xem lịch sử.
- Kiểm tra rộng 320, 390, 768 pixel và desktop. Dữ liệu QA không được đưa vào dữ liệu production.

## Chọn khách hàng và GPS

- Một ô combobox cho phép tìm theo tên/mã (hỗ trợ không dấu), chọn bằng chuột, cảm ứng hoặc phím mũi tên/Enter. Gõ lại sẽ xóa liên kết khách cũ; Save bắt buộc chọn một khách hợp lệ.
- Nút “Lấy vị trí hiện tại” chỉ xin quyền GPS sau thao tác người dùng. Có trạng thái đang xử lý, từ chối quyền, hết thời gian và lựa chọn thủ công.
- GPS được lưu riêng trong nháp/khảo sát và lịch sử chỉnh sửa; không thay địa chỉ, khu vực hoặc tọa độ danh mục. Không gửi tọa độ tới dịch vụ bản đồ bên ngoài.
- Gợi ý gần nhất cần khách hàng trong danh mục có `latitude`/`longitude` hoặc `gps.latitude`/`gps.longitude`; khách chưa có tọa độ vẫn tìm/chọn được. Hiện danh mục cũ chưa có tọa độ nên không suy đoán khoảng cách hoặc tự chọn khách.
- Chưa cấu hình dịch vụ đổi GPS thành địa chỉ đường phố. Địa chỉ hiển thị khi chọn khách vẫn là dữ liệu danh mục.
