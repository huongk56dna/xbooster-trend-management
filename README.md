# X-Booster

Hệ thống gồm Trend Management, Advance Payment và E-Ordering. Đây là toàn bộ mã nguồn ứng dụng, bao gồm giao diện và backend.

## Hosting

**GitHub Pages chỉ phục vụ HTML/CSS/JavaScript tĩnh. Không thể chạy đầy đủ ứng dụng này trực tiếp trên GitHub Pages.**

Đăng nhập, phân quyền, lưu khảo sát/đơn hàng, upload ảnh, QR xác nhận trả trước và API AI cần Cloudflare Worker cùng D1 và R2. Chỉ đưa `public/ui` lên Pages sẽ không cung cấp các chức năng máy chủ.

Mã nguồn hiện dùng Vinext/Vite và Cloudflare Workers. Thông tin Sites hiện tại nằm trong `.openai/hosting.json`. Triển khai sang tài khoản Cloudflare riêng cần tạo D1, R2, áp dụng migrations trong `drizzle/`, cấu hình các binding `DB`, `BUCKET` và thiết lập secrets trên máy chủ. Không ghi secrets vào Git.

## Đăng nhập kiểm thử

Đã bổ sung `/login` và `/logout` để đăng nhập bằng tài khoản kiểm thử, không cần tài khoản OpenAI. Máy chủ yêu cầu:

- `TEST_LOGIN_PASSWORD_HASH`: hash PBKDF2 của mật khẩu, không phải mật khẩu gốc.
- `TEST_SESSION_SECRET`: chuỗi ngẫu nhiên dùng ký phiên đăng nhập.

Tên tài khoản kiểm thử cấu hình trong `lib/test-auth.mjs`. Mật khẩu và secret không có trong repository. Phiên đăng nhập hết hạn sau 8 giờ. Tài khoản sử dụng các vai POC, không có quyền chủ hệ thống.

Nếu đổi domain triển khai, cập nhật origin hợp lệ trong `lib/test-auth.mjs` để khớp domain mới. Bản nguồn này không bao gồm dữ liệu D1, ảnh R2 hoặc secrets của website đang hoạt động.

## Chạy và kiểm tra

Yêu cầu Node.js >= 22.13.0.

```sh
npm ci
npm run dev
node --test tests/*.test.mjs
npx tsc --noEmit
npm run build
```

Để sử dụng đầy đủ chức năng ở môi trường mới, cần chuẩn bị database, storage và runtime secrets. AI chỉ hoạt động khi cấu hình OpenAI API và tài khoản API có hạn mức sử dụng.

## Tài liệu

Các luồng POC, nghiệp vụ, phân quyền và hướng dẫn demo nằm trong thư mục `docs/`.
