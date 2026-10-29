> Bản lưu để tham khảo. Kế hoạch hiện hành theo 16 vai: [Demo plan theo vai X-Booster](Demo-plan-theo-vai-X-Booster.md), cập nhật 27/10/2026.

# Kịch bản demo toàn hệ thống X Booster

**Bản trình diễn đầy đủ 45 phút · Bản rút gọn 15 phút**

Tài liệu dành cho người dẫn demo và người thao tác X-Booster. Mỗi cảnh ghi rõ màn hình, vai sử dụng, thao tác, lời dẫn và kết quả cần đối chiếu. Kịch bản bao gồm cả phiếu kiểm tra khả năng đáp ứng vừa triển khai.

Website: https://x-booster-operations.fairypixie14.chatgpt.site/

## 1 Câu chuyện và lịch trình

Sales đến điểm bán, ghi nhận khách quan tâm hai dòng gạch. Quản lý kiểm tra bằng chứng và xem xu hướng thị trường. Một khách đặt lô nhỏ có sẵn, ứng trước tiền, nhận hàng qua năm trạm và được đối trừ theo FIFO. Sau đó một khách công trình đặt lượng lớn vượt tồn; Kho, Kế hoạch sản xuất và Mua hàng phối hợp trả lời khả năng đáp ứng. Cuối buổi, Kế toán và Kế Toán Trưởng trình diễn đối soát một tháng đã kết thúc.

Hai đơn được tách riêng: **đơn A đủ tồn** đi hết luồng giao hàng; **đơn B thiếu tồn** dùng để trình diễn phiếu phối hợp. Đơn B tiếp tục chờ xác nhận sau khi phiếu hoàn tất, vì lịch dự kiến không tự làm tăng tồn hoặc xác nhận đơn.

| Cảnh | Nội dung | Thời gian |
|---|---|---:|
| 1 | Cổng X-Booster và các vai | 2 phút |
| 2 | Sales tạo và gửi khảo sát | 5 phút |
| 3 | Kiểm tra khảo sát và Xu hướng thị trường | 4 phút |
| 4 | Khai báo và xác minh ứng trước | 4 phút |
| 5 | Tạo đơn A gồm nhiều sản phẩm | 3 phút |
| 6 | Vận hành xe qua năm trạm | 7 phút |
| 7 | Đối trừ FIFO và xem KPI | 4 phút |
| 8 | Đơn B thiếu hàng và phiếu đáp ứng | 9 phút |
| 9 | Đối soát tháng và lãi | 5 phút |
| 10 | Kết thúc và trao đổi | 2 phút |
| Tổng | Toàn bộ hệ thống | 45 phút |

## 2 Chuẩn bị trước buổi trình diễn

### Tài khoản và thiết bị

Dùng tài khoản quản trị đã được cấp các vai cần demo, hoặc nhiều tài khoản đã phân công đúng bộ phận. Khi đổi vai trên cùng một tài khoản, người thực hiện vẫn là cùng một người; chỉ phạm vi thao tác thay đổi.

| Vai | Phần việc sẽ trình diễn |
|---|---|
| Sales | Tạo khảo sát, tạo đơn, ghi nhận kết quả trao đổi khách |
| Sales Admin | Kiểm tra khảo sát, xem xu hướng, xác nhận tồn và phê duyệt bán hàng tại trạm 2 |
| Kế toán | Xác minh khoản thu, đối chiếu thanh toán, đối trừ và lập bảng đối soát |
| Kế Toán Trưởng | Cấu hình tài khoản nhận tiền, kiểm tra chính sách lãi, phê duyệt và chốt tháng |
| Bảo vệ | Đăng ký xe, cổng vào và cổng ra |
| Kho | Kiểm tra thành phẩm trên phiếu đáp ứng, bàn giao kho và lô ở trạm 3 |
| Thủ kho | Xếp và kiểm hàng ở trạm 4 |
| Kế hoạch sản xuất | Đánh giá phần cần sản xuất, yêu cầu kiểm tra nguyên liệu và chốt phương án dự kiến |
| Mua hàng | Phản hồi nguyên liệu đã đối chiếu, phần thiếu và ngày dự kiến bổ sung |

Chuẩn bị máy tính để trình bày và điện thoại để thao tác khảo sát qua HTTPS. Có sẵn 1–3 ảnh JPG, PNG hoặc WebP, mỗi ảnh tối đa 5 MB. Ưu tiên ảnh có nhãn sản phẩm đọc được; chuẩn bị ảnh tải lên dự phòng nếu camera không được cấp quyền.

Chuẩn bị hai chứng từ chuyển tiền minh họa cho cảnh 4, định dạng PDF hoặc ảnh, mỗi tệp tối đa 5 MB. Kế Toán Trưởng cấu hình tài khoản nhận tiền của bộ dữ liệu thử tại **Nguồn dữ liệu → + Tài khoản nhận tiền**. Dữ liệu tài khoản và chứng từ phải thể hiện rõ là dữ liệu trình diễn.

**Môi trường thao tác:** các bước xác minh tiền, xác nhận đơn, xuất cổng và chốt tháng sẽ lưu thay đổi. Thực hiện trên bộ dữ liệu thử riêng đã chuẩn bị. Với dữ liệu vận hành, trình bày bằng chứng từ đã có ở những bước không được phép ghi thử. Tài liệu này không yêu cầu chuyển tiền thật hoặc mua nguyên liệu thật.

### Khách hàng và ngày demo

Quy ước **D** là ngày thực tế trình diễn theo giờ Việt Nam; **D+1, D+3, D+5** là các ngày tương ứng. Thay bằng ngày cụ thể trước buổi demo, không thay đồng hồ hệ thống.

Sales Admin tạo hai khách riêng tại **Nguồn dữ liệu → + Khách hàng**:

- **Đại lý An Phúc [phiên]**: dùng cho khảo sát, ứng trước và đơn A đủ tồn.
- **Công trình Hưng Phát [phiên]**: dùng cho đơn B thiếu hàng và phiếu đáp ứng.

Mỗi phiên dùng tên khách và tham chiếu giao dịch mới. Không dùng khách đã có số dư hoặc đơn đang giữ tiền để trình diễn các kết quả cố định bên dưới.

### Bộ số liệu chuẩn

Trước khi bắt đầu, kiểm tra giá, tồn thực tế và lượng đang giữ của hai mã. Bảng dưới là giả định để tính xuyên suốt; nếu dữ liệu thực tế khác, cập nhật các kết quả liên quan trong phiếu điều phối.

| Thuộc tính | Sản phẩm 1 | Sản phẩm 2 |
|---|---|---|
| Mã | DEMO-P01 | DEMO-P02 |
| Tên | Calacatta Aurora | Urban Ash |
| Brand | Tile Company | Tile Company |
| Kích thước và bề mặt | 60 × 120 cm · Bóng | 60 × 60 cm · Mờ |
| Giá tham khảo | 285.000 đ/m² | 195.000 đ/m² |
| Tồn đầu buổi giả định | 320 m² | 595 m² |
| Đang giữ cho đơn khác | 0 m² | 0 m² |
| Đơn A | 100 m² | 50 m² |
| Tồn sau khi đơn A xuất cổng | 220 m² | 545 m² |
| Đơn B | 1.000 m² | 800 m² |
| Phần thiếu của đơn B | 780 m² | 255 m² |

**Đơn A:** 100 × 285.000 + 50 × 195.000 = **38.250.000 đ**. Nhận hai khoản ứng trước A1 **20.000.000 đ** và A2 **30.000.000 đ**, cùng ngày D, tạo A1 trước A2. Tổng ứng trước **50.000.000 đ**, số dư gốc sau đối trừ **11.750.000 đ**.

**Đơn B:** 1.000 × 285.000 + 800 × 195.000 = **441.000.000 đ**. Không cần tạo khoản thu cho khách B để trình diễn phiếu đáp ứng. Đơn B chưa được xác nhận hoặc đưa xe vào nhận hàng.

Giá trị đơn được đối chiếu theo đơn giá hiện có; kịch bản không tự cộng thêm thuế hoặc chiết khấu chưa được cấu hình. Mã DEMO-P01 và DEMO-P02 là mã danh mục đang có, không phải kết quả nhận diện AI.

### Diễn tập và đối soát tháng

Diễn tập một lượt, ghi mã thực tế do hệ thống sinh. Chuẩn bị biển số giả lập **51C-123.45**, tài xế **Nguyễn Văn An**, thiết bị **10 pallet**, kho **Kho A – A01**, lô **LOT-[phiên]**, sắc độ **A**, người lái xe nâng **Nguyễn Văn Hải**. Đây đều là thông tin cho buổi thử.

Để cảnh 9 có kết quả chốt tháng, chuẩn bị một tháng **M đã kết thúc, chưa chốt**, không trước kỳ đã đóng gần nhất. Không còn đơn giao trong hoặc trước tháng đó đang chờ lập hóa đơn/đối trừ. Dùng khách thứ ba **Khách đối soát [phiên]**, một khoản ứng trước đã xác minh **10.000.000 đ** từ ngày đầu tháng M, chưa sử dụng. Chuẩn bị chứng từ minh họa phù hợp và kiểm tra lãi suất đã khóa của khoản nhận.

Nếu không có tháng đủ điều kiện, chuẩn bị sẵn một bảng kê đã chốt để mở tra cứu. Không hứa trình diễn thao tác chốt thành công trên tháng đang diễn ra hoặc trên kỳ đã chốt.

## 3 Kịch bản thao tác đầy đủ

### Cảnh 1 Cổng X Booster và phân vai

**Thời lượng:** 2 phút. **Vai:** Sales Admin. **Màn hình:** Home.

**Thao tác**
1. Giới thiệu ba module **Trend Management**, **Advance Payment**, **E-Ordering**.
2. Mở Trend Management để giới thiệu danh sách chức năng tương ứng; quay lại cổng khi cần chuyển module.
3. Chỉ ra bộ chọn vai và tài khoản đăng nhập. Giới thiệu thêm Mua hàng và Kế hoạch sản xuất trong luồng chuẩn bị nguồn hàng.
4. Mở nhanh **Sản phẩm** để xem mã, kích thước, giá tham khảo và tồn; mở **Khách hàng** để chỉ ra danh mục dùng chung và đường vào sổ khách. Các tài khoản nhận tiền và phân vai đã được chuẩn bị tại **Nguồn dữ liệu**.

**Lời dẫn:** “X-Booster kết nối thông tin thị trường, số tiền khách ứng trước và quy trình nhận hàng. Khi kho thiếu hàng, các bộ phận phối hợp trên phiếu đáp ứng để Sales có căn cứ trao đổi lại với khách.”

**Kết quả cần thấy:** từng module mở đúng các mục nghiệp vụ; danh mục khách hàng và sản phẩm dùng chung. Không giới thiệu lại các mục Sales Web App, Hành Động hoặc Tổng quan xu hướng đã bỏ.

### Cảnh 2 Sales ghi nhận tại điểm bán

**Thời lượng:** 5 phút. **Vai:** Sales. **Đường dẫn:** Trend Management → Khảo sát → **+ Tạo khảo sát**.

**Thao tác**
1. Chọn **Đại lý An Phúc [phiên]**, khu vực **Miền Nam**. Chỉ ra Sales được gắn từ tài khoản đăng nhập. Có thể bấm **Ghi nhận chuyến thăm** để lưu hoạt động ghé điểm bán; vị trí chỉ ghi nhận khi người dùng chủ động cấp quyền.
2. Tại **Ảnh & sản phẩm**, chụp hoặc tải một ảnh đã chuẩn bị.
3. Nhập thông tin đã đối chiếu với nhãn/danh mục: **DEMO-P01**, **Calacatta Aurora**, **Tile Company**, **60 × 120**, **Bóng**, nhóm **Gạch lát nền**, phân loại **Gạch công ty**.
4. Tích **Tôi đã kiểm tra thông tin sản phẩm…**. Nếu chưa đủ bằng chứng, để trống các trường chưa rõ và dùng **Chưa phân loại**.
5. Tại **Nhu cầu**, chọn **Mẫu mã / xu hướng** và **Nhu cầu mua hàng**; nhập **100 m²**; ghi chú: “Khách muốn lấy 100 m² Calacatta Aurora và xem thêm Urban Ash 50 m².”
6. Bấm **Lưu nháp**, kiểm tra thông báo. Quay lại bước trước rồi tiếp tục để cho thấy dữ liệu còn nguyên; có thể đổi VN/EN trong form để kiểm tra nội dung không mất.
7. Tại **Kiểm tra & gửi**, bấm **Gửi khảo sát**, ghi mã khảo sát mới.

**Lời dẫn:** “Sales lưu hình ảnh và nội dung trao đổi ngay tại điểm bán. Thông tin sản phẩm phải được người thực hiện kiểm tra trước khi gửi; nhu cầu ghi nhận chưa làm phát sinh đơn hoặc giữ tồn.”

**Kết quả cần thấy:** khảo sát có đúng ảnh, khách hàng, Sales, khu vực và nhu cầu 100 m²; tải lại danh sách vẫn thấy bản ghi. Ghi chú về sản phẩm thứ hai chưa tạo thêm một dòng nhu cầu có cấu trúc trong khảo sát này.

**Hiện trạng AI:** AI/OCR chưa kết nối. Người demo nhập tay thông tin đã đối chiếu; không mô tả phần này là AI tự nhận diện mã, brand hoặc kích thước.

### Cảnh 3 Quản lý kiểm tra và xem xu hướng

**Thời lượng:** 4 phút. **Vai:** Sales Admin. **Màn hình:** Khảo sát → Xu hướng thị trường.

**Thao tác**
1. Tìm mã khảo sát vừa tạo → **Xem / Kiểm tra**. Xem ảnh, nhu cầu, người thực hiện; nhập ghi chú và chọn **Xác nhận đã kiểm tra**.
2. Mở **Xu hướng thị trường**, chọn nguồn **Khảo sát đồng bộ**.
3. Chọn từ ngày đầu tháng đến D, Miền Nam, tìm **DEMO-P01** hoặc **Calacatta Aurora**, rồi bấm **Tìm kiếm**.
4. Giới thiệu bộ lọc Sales, nhóm gạch, kích thước và phân loại **All / Gạch công ty / Gạch đối thủ / Chưa phân loại**.
5. Chọn nhóm; xem khách ghi nhận quan tâm, lượt khảo sát hợp lệ, diễn biến theo kỳ, bằng chứng thị trường và tồn khả dụng. Bấm **Xem các khảo sát nguồn** để truy ngược.
6. Kéo xuống báo cáo **Nhu cầu thị trường & giao hàng theo khu vực** và **Hoạt động đội Sales**. Phân biệt nhu cầu khai báo với giao hàng hoàn tất đã ghi nhận trong X-Booster.
7. Bấm **Xuất báo cáo**; dùng **Xóa bộ lọc** để trở lại danh sách rộng.

**Lời dẫn:** “Mỗi tín hiệu xu hướng có thể truy về các khảo sát nguồn. Bộ lọc giúp quản lý biết khách đang quan tâm gì và ở đâu, trước khi đối chiếu khả năng cung ứng.”

**Kết quả cần thấy:** khảo sát mới được tìm lại và nằm trong phạm vi báo cáo phù hợp. Một khách có thể thuộc nhiều nhóm; không cộng số khách giữa các nhóm rồi gọi là tổng khách duy nhất toàn hệ thống. Không hứa một tỷ lệ tăng trưởng cố định nếu kỳ trước chưa có dữ liệu.

**Nhắc trước cảnh 8:** nhóm gạch công ty có mã trong danh mục, nhu cầu vượt tồn và dùng nguồn khảo sát đồng bộ sẽ có nút gửi yêu cầu kiểm tra đáp ứng. Khảo sát chưa phải đơn đã chốt.

### Cảnh 4 Ghi nhận ứng trước của khách A

**Thời lượng:** 4 phút. **Vai:** Sales hoặc Kế toán để khai báo; Kế toán để xác minh. **Module:** Advance Payment.

**Thao tác**
1. Vào **Khoản thu → Khai báo khoản thu**. Chọn khách A; nhập **20.000.000 đ**, ngày D, mã giao dịch **DEMO-[phiên]-A1**, tài khoản nhận đã chuẩn bị; tải chứng từ A1.
2. Chỉ ra trạng thái **Chờ xác minh**. Chuyển vai Kế toán, mở **Xác minh**, xem chứng từ, nhập tham chiếu đối chiếu và xác nhận theo bộ chứng từ thử.
3. Tạo tiếp khoản **30.000.000 đ**, mã **DEMO-[phiên]-A2**, ngày D; xác minh tương tự.
4. Mở **Tổng hợp → Mở sổ** của khách A hoặc **Sổ khách hàng**; xem từng khoản nhận.

**Lời dẫn:** “Khách khai báo đã chuyển tiền chưa đồng nghĩa số dư ứng trước đã được ghi nhận. Kế toán đối chiếu khoản nhận trước khi xác minh; sổ khách tách tiền gốc và lãi.”

**Kết quả cần thấy:** khách A có hai khoản đã xác minh, tổng gốc **50.000.000 đ**, chưa dùng để đối trừ đơn A. Chỉ đối chiếu số của khách demo, không lấy tổng toàn hệ thống làm số của khách.

**Hiện trạng ngân hàng:** chưa tự đồng bộ giao dịch ngân hàng; bước đối chiếu hiện do Kế toán thực hiện. Chỉ thao tác mô phỏng trên dữ liệu thử đã chuẩn bị.

### Cảnh 5 Tạo đơn A đủ tồn với hai sản phẩm

**Thời lượng:** 3 phút. **Vai:** Sales → Sales Admin → Kế toán. **Đường dẫn:** E-Ordering → Đơn đặt hàng.

**Thao tác**
1. Sales bấm **+ Tạo đơn hàng**, chọn khách A. Chọn ngày lấy hàng **D**, nhập lý do ngoại lệ **Nhận hàng trong ngày để trình diễn quy trình demo**. Bình thường hệ thống yêu cầu đặt trước 1–2 ngày; ngoại lệ giúp chạy hết luồng trong buổi.
2. Chọn **DEMO-P01**, số lượng **100 m²**. Bấm **+ Thêm sản phẩm**, chọn **DEMO-P02**, **50 m²**. Kiểm tra tổng **38.250.000 đ** và lưu; ghi mã đơn A.
3. Sales Admin mở chi tiết → **Xác nhận tồn & lịch**.
4. Kế toán mở đơn → **Kế toán xác nhận thanh toán**, nhập ghi chú đối chiếu với ứng trước 50.000.000 đ.

**Lời dẫn:** “Một đơn có nhiều dòng sản phẩm. Tồn được kiểm tra theo từng mã; điều kiện thanh toán được Kế toán xác nhận riêng trước khi xe đi qua các bước phê duyệt nhận hàng.”

**Kết quả cần thấy:** đơn **Đã xác nhận**, có xác nhận của Kế toán. Tồn thực tế vẫn **320 / 595 m²**, lượng giữ cho đơn A **100 / 50 m²**, tồn khả dụng **220 / 545 m²**. Chưa đối trừ tiền ứng trước ở bước xác nhận.

### Cảnh 6 Xe nhận hàng qua năm trạm

**Thời lượng:** 7 phút. **Đường dẫn:** E-Ordering → Điều hành 5 trạm.

Mỗi trạm bấm **Bắt đầu xử lý** trước khi hoàn tất. Chuyển đúng vai theo trạm; tiếp tục trên cùng mã xe và mã đơn A.

| Trạm | Vai | Thao tác chính |
|---|---|---|
| 1 Cổng vào | Bảo vệ | **+ Đăng ký xe vào**, chọn đơn A; nhập 51C-123.45, Nguyễn Văn An, thiết bị **10 pallet**. Bắt đầu rồi **Hoàn tất trạm** |
| 2 Sales Admin | Sales Admin | Bắt đầu, **Mở đơn / phê duyệt** → **Sales Admin phê duyệt DOA**, ghi căn cứ. Đóng chi tiết, hoàn tất trạm |
| 3 Kho | Kho | Bắt đầu, hoàn tất với **Kho A – A01**, **LOT-[phiên]**, sắc độ **A** |
| 4 Xếp và kiểm hàng | Thủ kho | Bắt đầu, nhập Nguyễn Văn Hải là người lái xe nâng; nhập số thực đếm **100 / 50 m²** đúng từng dòng, hoàn tất |
| 5 Cổng ra | Bảo vệ | Bắt đầu, **Kiểm tra & xuất cổng**; đối chiếu **100 / 50 m²** và đúng chuỗi thiết bị **10 pallet**, hoàn tất |

**Lời dẫn:** “Mỗi bộ phận ghi thời điểm xử lý và thông tin bàn giao. Hệ thống chỉ hoàn tất xuất cổng khi kiểm đếm, thiết bị và điều kiện duyệt khớp với đơn.”

**Kết quả cần thấy:** xe đi qua đủ năm trạm, đơn A **Hoàn tất**, có **Chứng từ giao hàng**. Tồn thực tế còn **220 / 545 m²**, lượng giữ của đơn A về 0. Tồn không bị trừ hai lần: lượng đã giữ được thay bằng lượng thực xuất.

**Nhánh giữ xe tùy thời gian:** tại trạm 4 nhập 99 thay vì 100 ở dòng đầu. Hệ thống giữ xe; ghi kết quả xử lý để **Gỡ giữ**, sau đó nhập lại 100 / 50 và hoàn tất. Nếu chỉ có 45 phút, có thể trình bày nhánh này bằng lời.

**Lưu ý thao tác:** DOA chỉ phê duyệt khi xe đến trạm Sales Admin. Không cố đăng ký xe của đơn còn thiếu tồn hoặc chưa tới ngày lấy hàng.

### Cảnh 7 Đối trừ FIFO và xem kết quả vận hành

**Thời lượng:** 4 phút. **Vai:** Kế toán, sau đó Sales Admin.

**Thao tác**
1. Kế toán mở chi tiết đơn A đã hoàn tất → **Lập hóa đơn / đối trừ**. Nhập **HD-[phiên]-A**, xác nhận hóa đơn khớp chứng từ giao hàng, rồi lưu.
2. Mở sổ khách A và kiểm tra phân bổ FIFO.
3. Sales Admin mở **Thời gian & KPI**: xe hoàn tất, từng trạm, thời gian xử lý, thời gian chờ và tổng thời gian. Bấm **Xuất KPI CSV**.

| Khoản nhận | Gốc trước đối trừ | Dùng cho đơn A | Gốc còn lại |
|---|---:|---:|---:|
| A1 tạo trước | 20.000.000 đ | 20.000.000 đ | 0 đ |
| A2 tạo sau | 30.000.000 đ | 18.250.000 đ | 11.750.000 đ |
| Tổng | 50.000.000 đ | 38.250.000 đ | 11.750.000 đ |

**Lời dẫn:** “Khoản ứng trước được phân bổ theo FIFO khi Kế toán xác nhận hóa đơn cho lần giao hoàn tất. Chứng từ, số dư và lịch sử vận hành cùng liên kết với mã đơn.”

**Kết quả cần thấy:** gốc của khách A còn **11.750.000 đ**; không có lần đối trừ thứ hai cho cùng đơn. Hai khoản cùng ngày được sắp theo mã chứng từ tăng dần, nên tạo A1 trước A2. Phần tiền nhận và sử dụng ngay trong ngày có **0 ngày tính lãi**; không trình diễn một số lãi dương cho phần này.

KPI dùng thời gian thực và làm tròn phút. Nếu demo thao tác nhanh, 0–1 phút là bình thường; không giới thiệu số demo là thời gian thực tế của hoạt động kho.

### Cảnh 8 Đơn B thiếu hàng và phối hợp chuẩn bị nguồn

**Thời lượng:** 9 phút. **Vai:** Sales / Sales Admin → Kho → Kế hoạch sản xuất → Mua hàng → Kế hoạch sản xuất → Sales / Sales Admin.

**Tạo đơn và gửi phiếu**
1. Sales tạo đơn B cho **Công trình Hưng Phát [phiên]**, ngày lấy **D+1**, hai dòng **DEMO-P01 1.000 m²**, **DEMO-P02 800 m²**; tổng dự kiến **441.000.000 đ**. Ghi mã đơn B.
2. Sales Admin mở chi tiết; nếu cần, thử **Xác nhận tồn & lịch** để thấy đơn bị chặn do thiếu tồn. Bấm **Yêu cầu kiểm tra đáp ứng**.
3. Kiểm tra tồn khả dụng **220 / 545 m²** và phần thiếu **780 / 255 m²** sau khi đơn A xuất cổng. Chọn ngày cần D+1, ghi yêu cầu và lưu.

**Lời dẫn:** “Hệ thống vẫn tiếp nhận đơn cần kiểm tra, nhưng chưa xác nhận đơn thiếu hàng. Phiếu sẽ chuyển qua các bộ phận để đưa ra phương án có căn cứ.”

**Kho kiểm tra thành phẩm**
4. Chuyển vai Kho → **Kho & nguồn hàng → Yêu cầu đáp ứng → Xem phiếu** → **Ghi kết quả kiểm tra Kho**.
5. Nhập tồn thực tế và lượng thành phẩm có thể đáp ứng **220 / 545 m²**, ngày sẵn sàng D; lượng sắp về/điều chuyển **0**. Ghi đã đối chiếu lô, sắc độ và đơn đang giữ; lưu.
6. Phiếu chuyển **Chờ Kế hoạch đánh giá**. Chỉ ra số tồn do hệ thống ghi tại lúc kiểm tra và kết quả người phụ trách nhập; phiếu chưa sửa tồn danh mục.

**Kế hoạch đánh giá và yêu cầu nguyên liệu**
7. Chuyển vai Kế hoạch sản xuất → mở phiếu → **Đánh giá sản xuất**. Xem phần cần bổ sung **780 / 255 m²**.
8. Ghi: “Có khả năng bố trí sản xuất bổ sung, cần xác nhận nguyên liệu và lịch máy.” Chọn cần Mua hàng kiểm tra; thêm **Bột phối liệu**, đơn vị **kg**, cần **300 kg**; lưu.

300 kg là số giả lập người lập nhập cho tình huống này, không phải định mức kỹ thuật của 1.035 m² gạch. Hệ thống hiện chưa tự tính BOM hoặc lập lệnh sản xuất.

**Mua hàng phản hồi**
9. Chuyển vai Mua hàng → mở phiếu → **Phản hồi nguyên liệu**. Nhập đã đối chiếu **100 kg** khả dụng; phần thiếu có thể mua; ngày về **D+3**. Ghi nguồn đối chiếu và phản hồi tổng hợp.
10. Lưu; kiểm tra hệ thống tính thiếu **200 kg** và chuyển **Chờ chốt phương án**. Đây là kết quả kiểm tra, chưa tạo đơn mua.

**Chốt phương án dự kiến**
11. Chuyển lại Kế hoạch sản xuất → **Chốt phương án dự kiến**; nhập các đợt dưới đây. Dùng **+ Thêm đợt giao** cho phần bổ sung.

| Sản phẩm | Đợt 1 vào D+1 | Đợt 2 vào D+5 | Tổng dự kiến |
|---|---:|---:|---:|
| DEMO-P01 | 220 m² | 780 m² | 1.000 m² |
| DEMO-P02 | 545 m² | 255 m² | 800 m² |

12. Ghi điều kiện: “Đợt 1 từ thành phẩm đã đối chiếu; đợt 2 phụ thuộc nguyên liệu về D+3, lịch máy và kiểm tra chất lượng. Cần kiểm tra lô/sắc độ khi giao.” Lưu; phiếu **Chờ Sales phản hồi**.
13. Sales hoặc Sales Admin chọn **Ghi nhận phản hồi khách → Đồng ý phương án**; ghi người trao đổi và nội dung; lưu.

**Lời dẫn:** “Sales nhận được phương án giao nhiều đợt sau khi các bộ phận phản hồi. Khách đồng ý được ghi lại trên phiếu; lịch trong đơn và việc xác nhận đơn vẫn cần đi qua nghiệp vụ riêng.”

**Kết quả cần thấy:** phiếu **Hoàn tất**, chỉ đọc, còn đủ lịch sử Kho, Kế hoạch, Mua hàng và phản hồi khách. Đơn B vẫn **Chờ xác nhận**, tồn thực tế vẫn **220 / 545 m²** nếu không có giao dịch khác, khách B chưa phát sinh ứng trước hoặc đối trừ. Ngày D+5 trên phiếu không tự nhập thêm hàng.

**Đường vào từ xu hướng:** quay lại **Xu hướng thị trường → Khảo sát đồng bộ**; chọn nhóm **Gạch công ty** có mã trong danh mục và nhu cầu vượt tồn. Giới thiệu nút **Yêu cầu kiểm tra đáp ứng**, mở biểu mẫu để xem nguồn khảo sát rồi đóng nếu không cần tạo thêm. Nguồn minh họa cố định, gạch đối thủ, chưa phân loại hoặc mã chưa có trong danh mục không tạo phiếu này.

**Chỉ ra tiện ích quản lý:** trong tab Yêu cầu đáp ứng, lọc trạng thái, nguồn, từ ngày/đến ngày; tìm theo mã đơn hoặc sản phẩm. Danh sách có 20 phiếu mỗi trang. Gửi lại cùng nguồn đang xử lý sẽ mở phiếu hiện có.

### Cảnh 9 Đối soát một tháng đã kết thúc

**Thời lượng:** 5 phút. **Vai:** Kế toán → Kế Toán Trưởng. **Đường dẫn:** Advance Payment → Đối soát tháng.

**Thao tác**
1. Chọn tháng M đã chuẩn bị, đã kết thúc và chưa chốt. Kế toán bấm **1. Lập / tính lại**.
2. Xem dòng khách đối soát: số dư gốc, lãi đã ghi tại các lần đối trừ, lãi cần ghi thêm cuối tháng và chi tiết từng khoản nhận.
3. Chuyển Kế Toán Trưởng, kiểm tra rồi bấm **2. Phê duyệt** và **3. Chốt kỳ**.
4. Mở bảng kê khách hàng; giới thiệu khả năng in/lưu PDF từ chứng từ.

**Lời dẫn:** “Kế toán lập số liệu đối soát, Kế Toán Trưởng phê duyệt và chốt. Lãi được theo dõi riêng với gốc; việc chốt kỳ kiểm soát mốc ngày để tránh ghi trùng.”

**Ví dụ đối chiếu:** nếu M là tháng 30 ngày, khoản 10.000.000 đ nhận từ ngày đầu tháng, chưa dùng, lãi suất khóa **6%/năm**, cơ sở 365 ngày, thì lãi kỳ đó là **10.000.000 × 6% × 30 / 365 = 49.315 đ** sau làm tròn. Gốc vẫn **10.000.000 đ**; lãi không tự nhập gốc. Nếu số ngày hoặc lãi suất thực tế khác, tính lại theo chi tiết trên màn hình.

**Kết quả cần thấy:** kỳ **Đã chốt**, có bảng kê. Số liệu thay đổi sau khi lập bảng sẽ cần lập lại trước khi phê duyệt/chốt. Không chốt tháng hiện tại hoặc chốt lại một kỳ đã đóng. Chốt tháng áp dụng toàn bộ số liệu kỳ trong bộ dữ liệu, nên phải diễn tập điều kiện trước.

**Phương án dự phòng:** khi không có kỳ đủ điều kiện, mở bảng kê đã chốt và giải thích các cột, không thay đổi ngày hệ thống hoặc ghi lùi chứng từ vào kỳ khóa để ép luồng chạy.

### Cảnh 10 Kết thúc buổi demo

**Thời lượng:** 2 phút. **Vai:** Sales Admin hoặc chủ hệ thống. **Màn hình:** đơn A, phiếu đáp ứng của đơn B, sau đó Home.

Mở lại ba bằng chứng: **đơn A hoàn tất và chứng từ giao hàng**, **sổ khách A còn 11.750.000 đ**, **phiếu đáp ứng đơn B hoàn tất với lịch dự kiến hai đợt**.

**Lời kết:** “Buổi demo đã đi từ ghi nhận tại điểm bán đến kiểm tra xu hướng, ứng trước, đơn nhiều sản phẩm, nhận hàng và đối trừ. Với đơn vượt tồn, các bộ phận có một phiếu phối hợp và lịch sử phản hồi để Sales trao đổi lại với khách. Đơn chỉ tiếp tục khi tồn, lịch và điều kiện nghiệp vụ thực tế được xác nhận.”

Nếu có câu hỏi về tích hợp, trả lời đúng phạm vi: đăng nhập và lưu tập trung theo tài khoản đã có; AI/OCR chưa kết nối, ERP và kho chưa đồng bộ tự động, ngân hàng đang đối chiếu thủ công, phiếu đáp ứng chưa tự mua nguyên liệu hoặc tạo lệnh sản xuất. Tiếng Anh hiện hỗ trợ form khảo sát, chưa phải toàn bộ giao diện.

## 4 Các nhánh ngoại lệ để hỏi đáp

Không chạy toàn bộ nhánh trong một buổi 45 phút; chọn 1–2 tình huống người xem quan tâm.

| Tình huống | Cách demo | Kết quả cần thấy |
|---|---|---|
| Thiếu khách, ảnh, nội dung trao đổi hoặc xác nhận sản phẩm | Thử tiếp tục/gửi khảo sát khi còn thiếu | Báo rõ phần cần bổ sung |
| Không nhận diện được sản phẩm | Để trống thông tin chưa rõ, chọn Chưa phân loại và xác nhận đã kiểm tra | Vẫn ghi nhận thủ công được, không suy đoán mã |
| Thiếu tồn một dòng đơn | Thử xác nhận đơn B | Chặn xác nhận, có đường gửi yêu cầu đáp ứng |
| Thành phẩm đủ sau khi đối chiếu | Trên phiếu thử khác, Kho ghi đủ lượng thành phẩm có thể dùng và căn cứ | Đi thẳng đến Sales phản hồi; không tự nhập kho |
| Không cần kiểm tra mua thêm | Kế hoạch ghi căn cứ, chọn không cần Mua hàng kiểm tra | Chuyển bước chốt phương án |
| Nguyên liệu chưa mua được | Mua hàng chọn chưa mua được; Kế hoạch chọn Không đáp ứng và ghi lý do | Phiếu kết thúc với kết luận rõ ràng |
| Khách yêu cầu đánh giá lại | Sales chọn Yêu cầu đánh giá lại | Quay về Kế hoạch, giữ lịch sử phương án cũ |
| Hủy yêu cầu | Người tạo hoặc Sales Admin hủy phiếu thử, nhập lý do | Phiếu kết thúc và chỉ đọc |
| Phiếu bị gửi trùng | Gửi lại từ nguồn đang có phiếu xử lý | Mở phiếu hiện có |
| Sai kiểm đếm hoặc thiết bị | Thử số đếm không khớp ở trạm 4/cổng ra | Giữ xe, chưa xuất cổng; gỡ giữ sau khi xử lý |
| Trùng tham chiếu khoản thu hoặc đối trừ lặp | Dùng chứng từ thử đã có | Không ghi thêm giao dịch trùng |
| Thay đổi số liệu kỳ sau khi lập bảng | Trên kỳ thử chưa chốt, lập bảng rồi có cập nhật ảnh hưởng kỳ | Cần lập lại bảng trước khi duyệt/chốt |
| Hai người cùng lưu phiên bản dữ liệu cũ | Minh họa bằng phiên diễn tập đã chuẩn bị | Một cập nhật được lưu, cập nhật còn lại yêu cầu tải lại |

### Chức năng quản trị giới thiệu khi có câu hỏi

Chủ hệ thống mở **Nguồn dữ liệu** để giới thiệu danh sách tài khoản và phân vai, thêm sản phẩm/khách hàng, nhập danh mục CSV và tải bản sao dữ liệu. Kế toán hoặc Kế Toán Trưởng có thể cập nhật hạn mức/công nợ qua chức năng được phân quyền. Kế Toán Trưởng xem chính sách lãi và ngày hiệu lực. Chỉ thay đổi cấu hình trên dữ liệu thử có chủ đích; không đổi quyền, hạn mức hay lãi suất giữa một luồng demo đang chạy.

## 5 Bản trình diễn rút gọn 15 phút

Để giữ thời lượng, chuẩn bị sẵn đơn A đã hoàn tất, sổ khách sau đối trừ, một phiếu đang chờ Mua hàng và một bảng kê tháng đã chốt. Đây là các bản ghi từ phiên diễn tập; không giới thiệu là vừa tạo trực tiếp trong buổi.

| Phần | Thao tác trình diễn | Thời gian |
|---|---|---:|
| Giới thiệu | Home, ba module và chín vai | 1 phút |
| Sales tại điểm bán | Tạo khảo sát với ảnh đã chuẩn bị, nhập/xác nhận và gửi | 3 phút |
| Quản lý thị trường | Mở khảo sát mới, lọc xu hướng, truy bằng chứng và giới thiệu nút yêu cầu đáp ứng | 2 phút |
| Đơn và ứng trước | Mở đơn A hai dòng, khoản thu và phân bổ FIFO đã có | 2 phút |
| Chuẩn bị nguồn hàng | Mua hàng phản hồi phiếu đã chuẩn bị; Kế hoạch chốt, Sales phản hồi | 4 phút |
| Vận hành và báo cáo | Mở lịch sử năm trạm, chứng từ, KPI và bảng kê đã chốt | 2 phút |
| Kết thúc | Nhắc kết quả hai tình huống và hiện trạng kết nối | 1 phút |
| Tổng |  | 15 phút |

## 6 Phiếu điều phối và điều kiện hoàn tất

In riêng phần này nếu cần một tờ điều phối. Điền mã thực tế sau mỗi cảnh; không lấy mã của phiên trước để thay cho bản ghi vừa thao tác.

### Mã dùng trong phiên

| Mục | Ghi nhận | Mục | Ghi nhận |
|---|---|---|---|
| Ngày D và phiên | _________________ | Người dẫn và thao tác | _________________ |
| Khách A | _________________ | Khách B | _________________ |
| Tồn đầu P01 / P02 | _________________ | Lượng đang giữ | _________________ |
| Khảo sát / chuyến thăm | _________________ | Khoản thu A1 / A2 | _________________ |
| Đơn A / xe / giao hàng | _________________ | Hóa đơn / số dư | _________________ |
| Đơn B / phiếu đáp ứng | _________________ | Ngày cần / nguyên liệu | _________________ |
| Các đợt dự kiến | _________________ | Tháng M / bảng kê | _________________ |

### Kiểm tra trước khi kết thúc

- Khảo sát mới tìm lại được, đúng khách và Sales; ảnh tải được.
- Đơn A có đủ hai dòng, hoàn tất năm trạm, có chứng từ giao và một lần đối trừ.
- Sổ khách A và tồn sau xuất hàng khớp bộ số liệu đã chọn cho phiên.
- Phiếu đáp ứng B có đủ phản hồi bộ phận và kết quả khách; lịch sử cũ không mất khi đánh giá lại.
- Đơn B chưa tự được xác nhận; phiếu không tự tạo đơn mua, lệnh sản xuất, ứng trước hoặc nhập kho.
- Kỳ đối soát được chốt hợp lệ hoặc đã mở bảng kê dự phòng và nói rõ điều kiện.
- Các vai mới chỉ được cấp theo phân công; tài khoản chỉ có vai Mua hàng/Kế hoạch sản xuất không thấy khoản thu, sổ kế toán hoặc tín dụng khách.
- Đóng biểu mẫu chưa lưu và ghi lại mã để người xem có thể mở lại sau buổi trình diễn.

### Ghi nhận sau buổi trình diễn

Câu hỏi cần trả lời thêm: __________________________________________________

Nội dung cần điều chỉnh: __________________________________________________

Người phụ trách và thời hạn phản hồi: _______________________________________
