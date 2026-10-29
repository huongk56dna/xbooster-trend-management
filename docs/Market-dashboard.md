# Dashboard Xu hướng thị trường — v27

## Sử dụng

- Mở Trend Management → Xu hướng thị trường, chọn từ ngày/đến ngày và các bộ lọc. Ô tên/mã/thương hiệu hoặc Sales áp dụng bằng nút Tìm kiếm/Enter.
- Xếp hạng theo khách riêng biệt có chủ đề Mẫu mã / xu hướng hoặc Nhu cầu mua hàng. Các khảo sát giá/chất lượng vẫn góp số tồn đã ghi nhận.
- Bấm nhóm gạch → đặc tính → mã/thương hiệu để xem ảnh, số tồn từng khách, ngày ghi nhận và khảo sát nguồn. Nút xuất CSV lấy đúng các nhóm từ kết quả API đang hiển thị.
- Tồn công ty/đối thủ ở kho khách là số Sales ghi nhận. Chỉ lấy quan sát mới nhất trong kỳ của cùng khách–sản phẩm; không cộng lặp giữa Sales. Ngày quan sát ưu tiên trước thời điểm tạo/chỉnh sửa. Số 0 hợp lệ, ô trống không lấy lại số cũ. Nếu cùng mã đổi đặc tính, số tồn chỉ góp vào nhóm chứa quan sát mới nhất.
- Tồn vận hành công ty hiển thị riêng trong chi tiết mã công ty khớp danh mục và thương hiệu. Yêu cầu đáp ứng chỉ xuất hiện với Sales Admin, mã hợp lệ và nhu cầu khảo sát đủ điều kiện lớn hơn tồn vận hành. Tách theo khu vực để giữ điều kiện nguồn của luồng đáp ứng.

## Quyền và dữ liệu

`GET /api/trends/dashboard` kiểm tra tài khoản, lọc khảo sát bằng `canViewSurvey` trước mọi phép tính, kể cả gợi ý, danh sách bộ lọc và tồn khách. Không lấy dữ liệu `sample`, ảnh `sample`, nháp hoặc khảo sát cần bổ sung. Chấp nhận trạng thái Đã lưu/Đã gửi/Đã kiểm tra để tương thích bản cũ. Các bản ghi cũ thiếu phạm vi giữ nguyên quy tắc chỉ người tạo/chủ hệ thống/CEO/CFO xem.

Nhóm theo loại gạch → vân/kích thước/bề mặt → mã/thương hiệu/phân loại. Khi thiếu mã dùng tên và đặc tính; thiếu nhận diện thì không cộng tồn, hiển thị số bản ghi bị bỏ qua. Chuẩn hóa khoảng trắng/chữ hoa thường và `x`/`×`, kích thước không ghi đơn vị được xem là cm. Không gộp ngữ nghĩa bằng AI. Không sửa dữ liệu khảo sát hoặc danh mục.

`POST /api/trends/insights` chỉ nhận `filters`, `horizon`, `version`; không tin số liệu hoặc danh sách ứng viên từ trình duyệt. Máy chủ tính lại theo quyền, kiểm tra phiên bản cả trước/sau khi AI chạy. Tối đa 3 yêu cầu/người/phút; dữ liệu sử dụng API được xóa sau 1 giờ. Không có lịch tự chạy hoặc cache dùng chung giữa tài khoản. Client loại nhận xét cũ khi phiên bản, quyền, bộ lọc hoặc mốc gợi ý thay đổi.

## Gợi ý và AI

- 3/6/12 tháng dùng cửa sổ lịch sử 3/6/12 tháng kết thúc vào Đến ngày, độc lập với Từ ngày báo cáo.
- Chuẩn hóa min–max về 0–100; nếu mọi ứng viên bằng nhau thì chỉ số đó là 50. Trọng số phổ biến/động lượng/độ bền: 50/30/20, 40/25/35, 30/20/50.
- Phổ biến là số khách riêng biệt; động lượng là `(khách nửa sau - khách nửa đầu) / khách nửa đầu`; khi nửa đầu bằng 0, có khách mới dùng tín hiệu khởi đầu 1, không diễn giải thành tăng phần trăm. Độ bền = tháng có quan tâm / tổng tháng lịch giao với cửa sổ (kể cả tháng đầu/cuối chưa trọn).
- Thiếu độ dài hoặc độ phủ 6/12/24 tháng có dữ liệu thì ghi Gợi ý sớm. Điểm không phải xác suất, sản lượng hoặc doanh số tương lai. Tồn không tham gia điểm.
- AI chỉ nhận tổng hợp đặc tính và số khách/tồn; không nhận mã khảo sát, khách, Sales, ghi chú, ảnh, GPS hoặc dữ liệu tài chính. Dùng Responses API và OPENAI_API_KEY/OPENAI_VISION_MODEL hiện có, store:false.
- AI chọn căn cứ hợp lệ và hành động thận trọng cho từng ứng viên. Máy chủ kiểm tra ID, căn cứ phù hợp số liệu và hành động cho phép, sau đó dựng nhận xét tiếng Việt bằng số liệu thật; không cho AI tự sinh số hoặc sản phẩm mới.
- Kiểm thử API thật ngày 26/10/2026 trả `billing_not_active`: cần kích hoạt thanh toán OpenAI. Dashboard và xếp hạng vẫn hoạt động; không đánh dấu AI đã nghiệm thu thành công. Giữ hạn dùng khóa đã cấu hình trước đó (7 ngày từ lúc tạo), không tạo khóa mới.

## Kiểm tra

- `node --test tests/*.test.mjs`: 45 kiểm thử gồm 10 kiểm thử dashboard mới.
- `node tests/trends-api.smoke.mjs`: chỉ localhost:5173, tạo khảo sát QA cục bộ; kiểm tra API, loại minh họa, phiên bản lỗi, ngày lỗi và giữ nguyên sản phẩm/đơn/kế toán/phiếu đáp ứng.
- Trình duyệt: xem nhóm → đặc tính → mã → nguồn, mốc 3/6/12 tháng, tồn chi tiết, lỗi AI, màn hình 320/390/768px và desktop.
- Không đưa dữ liệu QA lên production. Không đổi chế độ chia sẻ.

## Bản v28 — ngôn ngữ ngành gạch và dữ liệu trình diễn

- Dùng các nhãn: Nhóm sản phẩm; Mẫu vân, quy cách và bề mặt; Tồn gạch công ty/đối thủ tại đại lý; Tồn thành phẩm khả dụng; Mẫu gạch tiềm năng; Độ phủ khách hàng, đà tăng quan tâm và mức quan tâm duy trì.
- Tham khảo cách gọi quy cách, vân gạch và bề mặt men trong catalogue chính hãng Đồng Tâm: https://dongtam.com.vn/e-catalogue/ và https://dongtam.com.vn/wp-content/uploads/2023/08/Brochure-gach-Dong-Van.pdf . Không đưa tuyên bố về chất lượng/chống trượt hoặc mã hàng của hãng thật vào dữ liệu giả lập.
- Chủ hệ thống có bộ chọn Dữ liệu trình diễn / Khảo sát thực tế; mặc định trình diễn cho lần mở đầu sau bản v28, ghi nhớ lựa chọn riêng theo tài khoản. Người dùng khác chỉ xem khảo sát thực tế theo quyền hiện tại.
- Bộ trình diễn xác định theo ngày hiện tại: 5.439 lượt khảo sát ở mốc 26/10/2026, 72 khách, 12 mã công ty, 5 nhóm, 3 miền, 24 kỳ tháng. Có xu hướng tăng/giảm, nhiều quy cách/bề mặt, công ty/đối thủ/chưa xác định, ô tồn trống và số 0.
- Dữ liệu được sinh trong bộ nhớ cho API owner-only, không ghi app_state, không thêm danh mục vận hành, không trộn khảo sát thực tế. Ảnh bề mặt dùng tài sản minh họa sẵn có, không phải ảnh chụp thị trường.
- Banner trình diễn luôn hiển thị; CSV trình diễn có tiền tố TRINH-DIEN. Chi tiết khảo sát trình diễn chỉ đọc; không có sửa hay yêu cầu đáp ứng. API AI từ chối mode=demo trước khi gọi OpenAI; client khóa nút AI trong chế độ này.
- `node tests/presentation-api.smoke.mjs` chỉ localhost: kiểm tra dữ liệu phong phú, tách hai chế độ, chặn AI demo và trạng thái tập trung không thay đổi. Tổng 47 kiểm thử nghiệp vụ.

## Bản v29 — dashboard rút gọn

Theo đánh dấu giao diện: bỏ dòng giải thích quyền, banner trình diễn lớn, mô tả dưới 4 KPI, mô tả và nút nguồn ở bảng nhóm sản phẩm, nút breadcrumb cấp gốc, hai khối biểu đồ diễn biến và tồn chi tiết khỏi trang chính. Giữ bộ chọn chế độ xem và các thao tác xem chi tiết mã gạch; cấp sâu có nút quay lại.

Thay toàn bộ khối nhận định dài bằng 3 biểu đồ donut cho 3/6/12 tháng, mỗi biểu đồ liệt kê tối đa 3 nhóm mẫu vân–quy cách–bề mặt đứng đầu theo điểm đã tính ở máy chủ. Diện tích cung dùng điểm tương đối của top 3, không hiển thị tỷ lệ phần trăm và không diễn giải thành thị phần hoặc xác suất. Không gọi AI khi xem biểu đồ. Không thay đổi phép tính, phân quyền hoặc tách dữ liệu trình diễn/thực tế.
