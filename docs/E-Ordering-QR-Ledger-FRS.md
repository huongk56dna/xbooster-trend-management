# E-Ordering, DOA, VietQR và sổ hai chiều

Chính sách người dùng chốt ngày 27/10/2026: lãi đơn 8%/năm cho cả hai chiều, 365 ngày; lãi nợ chỉ từ ngày sau hạn thanh toán. Chưa kết nối ngân hàng; Kế toán xác minh thủ công. Không phát sinh chuyển tiền thật.

## Bắt đầu sử dụng

1. Chủ hệ thống cấp vai **Giám đốc Thương mại** và gán vùng cho **Giám đốc vùng** (cấp duyệt Trưởng vùng). Vai không được tự nâng cấp qua giao diện hay API.
2. Kế toán / Kế Toán Trưởng: **Nguồn dữ liệu → Hợp đồng / Kỳ hạn / Bảng giá**. Nhập hợp đồng, kỳ hạn và giá riêng nếu có. Giá không cấu hình dùng danh mục; quy cách lấy từ mã gạch.
3. Kế Toán Trưởng: bổ sung BIN NAPAS đúng của ngân hàng cho tài khoản nhận chính thức. Không suy đoán BIN từ tên viết tắt hoặc số tài khoản.
4. Đối soát hết đơn đã giao chưa lập hóa đơn trước khi chuyển sổ. **Khởi tạo sổ mới** chụp số dư ứng trước gốc trừ công nợ hiện tại, bắt đầu ngày khởi tạo. Không tự ghi lại lịch sử. Dư nợ đầu kỳ chưa có ngày đến hạn được cảnh báo, chưa tính lãi nợ.
5. Hợp đồng/số tài khoản thật và mốc chuyển sổ do bộ phận nghiệp vụ kiểm tra trước khi nhập. Bản triển khai không tự tạo dữ liệu ngân hàng, hợp đồng hoặc ghi sổ thật trên website.

## Luồng đơn

Tạo nhiều dòng bằng nhập tay hoặc ảnh JPG/PNG ≤5 MB → kiểm tra mã, đơn vị m², khách, giá khách hàng, tồn và tín dụng tại máy chủ → Chờ Trưởng vùng duyệt → Chờ Giám đốc Thương mại duyệt → Chờ Sales Admin xác nhận tồn & lịch → vận hành 5 trạm cũ.

Mỗi cấp được phê duyệt/từ chối/yêu cầu sửa, bắt buộc ghi ý kiến. Chỉ người tạo sửa đơn yêu cầu sửa; gửi lại quay về cấp đầu và giữ lịch sử. Mỗi lần duyệt kiểm tra lại tồn và tín dụng. Không giữ tồn tại bước gửi duyệt; Sales Admin xác nhận mới giữ. Đơn cũ vẫn giữ quy trình và chứng từ cũ; khi sổ mới đã kích hoạt không tạo mới bằng lệnh orderCreate cũ.

Giá được chụp tại lúc gửi đơn, kỳ hạn được chụp theo hợp đồng; không tin giá/stock/credit từ trình duyệt. Hạn mức đã chờ duyệt cũng được tính khi kiểm tra đơn mới. Khoản thiếu tồn bị chặn theo FRS; luồng phiếu đáp ứng cũ tiếp tục dùng cho các đơn hiện hữu và khảo sát.

## OCR

POST /api/orders/analyze kiểm tra đăng nhập, quyền Sales/Sales Admin, kích thước và chữ ký ảnh. OpenAI chỉ đọc nội dung hiển thị; mã và khách phải đối chiếu chính xác danh mục. Không tự quy đổi hộp/viên/pallet thành m², không lấy giá hoặc hạn mức từ ảnh. Kết quả đến muộn không ghi đè biểu mẫu đã sửa. API giới hạn 5 lần/phút/tài khoản; secret không ra trình duyệt. Nếu AI chưa thanh toán/hết hạn/lỗi, có thể nhập tay. Khóa đã được cấu hình trước đó; lần kiểm tra trước báo billing_not_active. Không tuyên bố OCR đã nghiệm thu thực tế khi chưa có lần gọi thành công.

## QR

Chỉ tạo sau hai cấp duyệt, theo toàn bộ giá trị đơn và nội dung hợp đồng + mã đơn. Tạo lặp dẫn về yêu cầu đang mở. VietQR EMV/NAPAS + CRC16 được tạo nội bộ; qrcode-generator 1.4.4 (MIT) chỉ tạo hình từ chuỗi, không gửi tài khoản/số tiền cho dịch vụ ảnh bên ngoài.

Các trạng thái thật: Chờ khách chuyển khoản → Chờ Kế toán đối chiếu khi khai báo chứng từ → Đã xác minh ngân hàng khi Kế toán đối chiếu. Không có trạng thái giả “đã quét”. Mã giao dịch ngân hàng chống trùng; khoản thu QR phải khớp khách, số tiền, tài khoản nhận. Chỉ khoản đã xác minh ảnh hưởng số dư.

## Sổ và lãi

POST /api/command cho khởi tạo, lập hóa đơn, tất toán, ghi lãi; dùng CAS phiên bản và requestId hiện có để chống gửi trùng/cập nhật đồng thời. GET /api/commerce/ledger chỉ cho Kế toán/Kế Toán Trưởng ở vai đang chọn, kể cả Excel. Thông tin sổ chi tiết bị loại khỏi state của vai khác; Sales chỉ cần quick-info và các QR được phép.

Hóa đơn sau giao trừ ứng trước FIFO và tạo dư nợ phần còn thiếu, đến hạn theo kỳ hạn đã chụp. Giao dịch cuối ngày quyết định dư Có/Nợ. Lãi trả khách tính trên dư Có dương; lãi nợ tính trên dư nợ quá hạn chưa thanh toán, giới hạn bởi dư Nợ cuối ngày, từ ngày sau hạn. Không nhập lãi vào gốc. Tiền lãi được làm tròn VNĐ tại mức tổng kỳ/chứng từ; bảng từng ngày giữ số lẻ để kiểm tra.

Tất toán yêu cầu khoản thu đã xác minh đủ gốc + lãi tính lại ở ngày xử lý; chưa đủ không đóng chứng từ. Tiền lãi thực thu được ghi riêng, không tự sinh lãi kép. Ghi lãi định kỳ là bước kế toán bấm xác nhận, khóa khoảng đã ghi, chặn giao dịch lùi vào khoảng đã khóa, không cho ghi trùng. Tính toán cập nhật khi xem; không có tác vụ chạy nền tự ghi sổ hay chuyển tiền.

## Kiểm chứng

- tests/commerce.test.mjs: tồn/giá/credit, sai vai/cấp/vùng, sửa/từ chối, biến động dư Có/Nợ, ngày đến hạn, 8% đơn, tất toán, khóa kỳ và CRC QR.
- tests/commerce-api.smoke.mjs: chỉ localhost, dữ liệu giả, duyệt hai cấp, QR, upload chứng từ, xác minh, 5 trạm, hóa đơn, số dư bằng 0, Excel ZIP hợp lệ, 401/403. Không chạy trên website sản xuất.
- Giao diện kiểm tra desktop và 320/390/768 px; khóa OpenAI/billing không cản tạo đơn thủ công.
