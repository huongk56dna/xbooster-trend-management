# DEMO PLAN X-BOOSTER — CÁC LUỒNG CHÍNH

**Thời lượng: 25–30 phút.** Demo theo luồng nghiệp vụ; đổi vai tại bước bàn giao. Các chức năng còn lại chỉ giới thiệu.

Website: https://x-booster-operations.fairypixie14.chatgpt.site/

## 1. Chuẩn bị

- Một khách hàng đã có địa chỉ, vùng, hợp đồng/kỳ hạn và đủ ứng trước hoặc hạn mức.
- Hai mã gạch đủ tồn để tạo đơn A; một mã công ty có nhu cầu vượt tồn để minh họa phiếu đáp ứng B.
- Ảnh sản phẩm, ảnh xe/hàng và thông tin kho, lô, sắc độ cho diễn tập.
- Các vai và phạm vi đã được cấp; chuẩn bị sẵn hồ sơ tại những bước cần bàn giao để không mất thời gian nhập dài.
- Dùng môi trường diễn tập cho bước ghi dữ liệu, xác nhận tiền hoặc xuất hàng. Nếu chưa có, dùng hồ sơ đã lưu để trình bày các bước này.

## 2. Bốn luồng thực hiện demo

### Luồng 1 — Lưu khảo sát tại điểm bán · 4 phút

**Module:** Trend Management → Khảo sát.

**Vai:** Sales.

1. Tạo khảo sát, chụp/tải ảnh sản phẩm.
2. Kiểm tra thông tin sản phẩm; chọn khách hàng, nội dung trao đổi; nhập nhu cầu và tồn tại điểm bán.
3. Bấm **Lưu khảo sát**, xác nhận và xem toast thành công.
4. Mở bản ghi trong danh sách để xem hoặc chỉnh sửa.

**Kết quả:** khảo sát lưu đúng khách và người tạo; luồng kết thúc tại đây. **Không gửi cho bộ phận khác, không duyệt khảo sát, không tự tạo đơn.**

### Luồng 2 — Tạo và duyệt đơn nhiều sản phẩm · 7 phút

**Module:** E-Ordering → Đơn đặt hàng / Phê duyệt DOA.

**Vai:** Sales → Giám đốc Thương mại → Sales Admin → Kế toán khi cần đối chiếu.

1. **Sales:** chọn khách, thêm hai mã và số lượng. Hệ thống tự hiển thị giá, tồn và kết quả kiểm tra; bấm **Gửi duyệt**.
2. **Giám đốc Thương mại:** phê duyệt đơn hàng.
3. **Sales Admin:** xác nhận tồn và lịch khi đủ điều kiện.
4. **Kế toán:** đối chiếu thanh toán/tín dụng trên hồ sơ đã chuẩn bị nếu quy trình yêu cầu.

**Kết quả:** một đơn có nhiều dòng, được Giám đốc Thương mại duyệt và đủ điều kiện nhận hàng. Lịch sử ghi rõ vai thực hiện.

**Không nằm trong khảo sát:** tạo đơn, gửi duyệt đơn và xử lý giao hàng đều thuộc E-Ordering.

### Luồng 3 — Giao nhận qua 5 trạm · 6 phút

**Module:** E-Ordering → Điều hành 5 trạm.

| Trạm | Vai thực hiện | Thao tác chính |
|---|---|---|
| 1. Cổng vào | Bảo vệ | Chọn đơn, ghi thông tin xe và ảnh vào cổng |
| 2. Sales Admin | Sales Admin | Đối chiếu thông tin đơn và điều kiện nhận hàng |
| 3. Kho | Thủ kho | Kiểm tra mã, lượng hàng, vị trí, lô và sắc độ |
| 4. Xếp hàng | Xe nâng | Ghi số thực xếp, xác nhận hoàn tất |
| 5. Cổng ra | Bảo vệ | Đối chiếu hàng/thiết bị, bổ sung ảnh và xác nhận ra cổng |

**Kết quả:** xe hoàn tất đúng thứ tự, có chứng từ và mốc thời gian; tồn được cập nhật tại bước xuất hàng theo quy trình.

### Luồng 4 — Phối hợp đáp ứng nhu cầu thiếu hàng · 6 phút

**Module xử lý:** E-Ordering → Kho & nguồn hàng → Yêu cầu đáp ứng.

**Vai:** Sales Admin → Kho → Kế hoạch sản xuất → Mua hàng → Kế hoạch sản xuất → Sales.

1. **Sales Admin:** mở phiếu B đã chuẩn bị, có nguồn từ nhu cầu khảo sát hợp lệ của mã công ty vượt tồn.
2. **Kho:** ghi lượng thành phẩm có thể đáp ứng và phần còn thiếu.
3. **Kế hoạch sản xuất:** đánh giá phần cần sản xuất, gửi nguyên liệu cần kiểm tra.
4. **Mua hàng:** phản hồi lượng nguyên liệu có/thiếu và ngày dự kiến bổ sung.
5. **Kế hoạch sản xuất:** chốt phương án và lịch dự kiến.
6. **Sales:** ghi kết quả trao đổi khách; chọn đồng ý để hoàn tất phiếu.

**Kết quả:** có phương án đáp ứng và lịch sử phối hợp. **Phiếu không tự tăng tồn, xác nhận đơn hoặc tạo lệnh sản xuất.**

Lưu ý: không cố tạo đơn mới vượt tồn để mở luồng này; biểu mẫu đơn sẽ chặn gửi. Dùng phiếu nguồn khảo sát đã chuẩn bị. **Kho** xử lý phiếu đáp ứng; **Thủ kho** xử lý trạm giao nhận.

## 3. Chỉ giới thiệu, không thao tác demo

| Nội dung | Vai giới thiệu | Điểm cần nói |
|---|---|---|
| Dashboard và phân quyền đội/vùng/toàn quốc | Trưởng phòng, Giám đốc vùng, CEO, CFO | Dữ liệu hiển thị theo phạm vi được giao |
| Dự báo 3/6/12 tháng và đề xuất R&D | Quản lý, R&D | Có căn cứ khảo sát; không tự quyết định sản xuất |
| QR, khoản thu, hóa đơn, sổ và lãi | Kế toán, Kế Toán Trưởng | Ngân hàng xác minh thủ công; lãi đơn 8%, tách gốc; mở hồ sơ có sẵn nếu cần minh họa |
| Thiết lập và phân quyền | Chủ hệ thống, Kế Toán Trưởng | Cấu hình tài khoản, phạm vi và điều kiện thanh toán |
| Nháp offline, AI, đổi mẫu, giữ xe, hủy/đánh giá lại | Người dẫn | Nêu khả năng và điều kiện; không chạy thêm nhánh ngoại lệ |

Dành khoảng 3–5 phút cho phần giới thiệu và tổng kết. Không nhập liệu dài, không chạy lại chốt lãi hoặc gọi AI chỉ để kéo dài demo.

## 4. Câu kết

“X-Booster kết nối ghi nhận thị trường, đơn hàng, giao nhận và phối hợp nguồn hàng. Mỗi bước có người chịu trách nhiệm, phạm vi quyền và kết quả để bộ phận tiếp theo tiếp tục xử lý.”
