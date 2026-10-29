# Trend Management — giao diện 3 tab (v30)

## Những lựa chọn đã chốt

- Ba tab nằm trong trang Xu hướng thị trường; mục Khảo sát vẫn riêng trong menu.
- R&D được phân công theo `scope.regions`; không tự cấp cho tài khoản hiện có. Owner có toàn bộ vai để quản trị/demo.
- KPI “Khảo sát có quan tâm” = khảo sát có Mẫu mã/xu hướng hoặc Nhu cầu mua hàng / tổng khảo sát. Không tạo điểm chấm mới.
- Sales/Sales Admin không có vai quản lý tiếp tục xem khảo sát mình tạo. Chưa có dữ liệu tuyến phụ trách nên không tự mở quyền theo tuyến.

## Tab và số liệu

1. Tổng quan: 4 KPI, Top 10 mã/thương hiệu theo lượt khảo sát có quan tâm, thumbnail nguồn. Độ phủ là điểm bán đã khảo sát trong kỳ / điểm bán có lịch sử khảo sát được phép xem theo cùng bộ lọc; không gọi là tỷ lệ hoàn thành tuyến.
2. Tồn kho: chỉ Sales/Sales Admin/Trưởng phòng/Giám đốc vùng/CEO/CFO/owner. Biểu đồ cột nhóm Top 10 điểm bán theo tổng tồn ghi nhận; bảng 20 điểm bán/trang. Click cột mở drawer, mã gạch và thương hiệu đối thủ. Trường tồn đối thủ trên khảo sát gạch công ty không xác định được thương hiệu đối thủ thì giữ “Chưa xác định thương hiệu”. Tỷ trọng chỉ có khi mọi dòng có đủ hai số tồn và tổng lớn hơn 0.
3. Chiến lược: quản lý/CEO/CFO/R&D/owner. Phần ước lượng dùng hồi quy tuyến tính trên 12 tháng hoàn chỉnh trước tháng báo cáo; chỉ ước lượng khi có ít nhất 6 tháng có khảo sát và 3 tháng có quan tâm. Tháng không khảo sát không coi là 0. Giá trị bị chặn không âm và không vượt tập khách đã từng ghi nhận trong phạm vi. Dải ước lượng 95% dựa trên sai số mô hình, không gán độ tin cậy đó cho OpenAI. Công thức tham khảo https://online.stat.psu.edu/stat501/Lesson03 . AI diễn giải số liệu qua endpoint cũ; không tự sinh +35% nhu cầu hoặc tăng 20% công suất.

Bộ lọc nhanh tuần/tháng/quý, vùng, kênh; bộ lọc ngày tùy chọn và đặc tính nằm trong Bộ lọc nâng cao. Kênh dùng `client.channel` distributor/retailer/unknown. Đại lý chưa phân loại không được tự coi là NPP; Showroom đã khai báo loại được xếp retailer. Sales Admin có thể cập nhật kênh qua drawer (`customerChannel`), không sửa tín dụng. Thêm khách có bộ chọn kênh. Dữ liệu trình diễn tách biệt như trước, có kênh giả lập.

## Đề xuất R&D và báo cáo

- Thêm `trendRecommendations` vào trạng thái tập trung; dữ liệu cũ mặc định `[]`.
- `GET/POST /api/trends/recommendations`: chỉ vai chiến lược; tạo từ số liệu máy chủ, bắt buộc 1 vùng, ghi nội dung thủ công, mốc 3/6/12 và snapshot Top 3. Không tạo phiếu sản xuất/mua hàng/đặt hàng.
- Dedupe theo người tạo + clientId; CAS theo phiên bản trạng thái; phản hồi theo revision. R&D được phân vùng hoặc owner cập nhật Chờ tiếp nhận → Đã tiếp nhận → Đang đánh giá → Đã phản hồi; không đi lùi, hoàn tất chỉ đọc; lưu người thực hiện và lịch sử. Creator/manager cùng phạm vi/CEO/CFO/owner đọc; R&D chỉ vùng được phân công. Không email hoặc gửi tin ngoài hệ thống.
- Phạm vi đề xuất được giữ tại thời điểm tạo. Không có thao tác tự gán vai R&D cho người dùng. Cấu hình qua Nguồn dữ liệu → phân công tài khoản, cần vùng cho R&D.
- `GET /api/trends/report`: CEO/CFO/owner, tái tính theo quyền. XLSX thật gồm 4 worksheet; PDF dùng bản xem trước in/Lưu PDF của trình duyệt, UTF-8 tiếng Việt. Báo cáo trình diễn có nhãn và tên file riêng.
- Dashboard API kiểm tra `tab=inventory/strategy` tại máy chủ. R&D không có tab Tồn kho và không được cấp thông tin kế toán/đơn hàng; khảo sát nguồn vẫn theo vùng được phân công.

## Kiểm tra

52 kiểm thử nghiệp vụ; `tests/trend-tabs.test.mjs` kiểm tra vai R&D, phạm vi, kênh, ô tồn trống/số 0, hồi quy khi thiếu lịch sử, proposal idempotency/revision và XLSX/HTML escape.

`node tests/trend-tabs-api.smoke.mjs` chỉ localhost: tạo fixture, gửi/đọc/phản hồi đề xuất, chống gửi trùng, phiên bản cũ, XLSX và bản in. Đã mở workbook bằng openpyxl, đủ 4 sheet. Các kiểm tra không thay đổi khảo sát/tồn/đơn/kế toán sau khi chuẩn bị fixture. Không đưa QA lên website thật.

OpenAI lần kiểm tra trước trả billing_not_active; không tuyên bố nhận xét AI đã nghiệm thu. Đường ước lượng từ số liệu và đề xuất nội bộ hoạt động độc lập.
