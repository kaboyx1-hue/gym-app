# Gym Log — Google Sheets + Apps Script + GitHub Pages

## 1. Google Sheet + Apps Script (5 phút)
1. Tạo Google Sheet mới → **Tiện ích mở rộng › Apps Script**.
2. Xoá code mẫu, dán toàn bộ `apps-script/Code.gs`. **Đổi `SECRET`** thành mật khẩu của bạn (giữ trong dấu nháy).
3. Chọn hàm `setup` → **Chạy** → cấp quyền (Sheet + Drive để lưu ảnh). Sheet sẽ có đủ các tab.
4. **Triển khai › Tùy chọn triển khai mới › Ứng dụng web**
   - Thực thi dưới dạng: **Tôi**
   - Người có quyền truy cập: **Bất kỳ ai**
5. Copy URL dạng `https://script.google.com/macros/s/…/exec`, dán vào hằng `API` đầu file `app.js`.

> Sửa Code.gs sau này: **Triển khai › Quản lý › Sửa › Phiên bản mới** (URL giữ nguyên).

## 2. GitHub Pages
1. Tạo repo, đẩy mọi file trong thư mục này **trừ** `apps-script/` (có cũng không sao — SECRET đã đổi thì đừng đẩy file đó).
2. Settings › Pages › Deploy from branch › `main` / root.
3. Mở `https://<user>.github.io/<repo>/` trên điện thoại → nhập mật khẩu → **Thêm vào màn hình chính**.

## Ghi chú
- Bài tập + ảnh: [free-exercise-db](https://github.com/yuhonas/free-exercise-db) (876 bài, public domain) tải qua jsDelivr, cache offline sau lần xem đầu. Tên & hướng dẫn bài tập là tiếng Anh; nhóm cơ/dụng cụ đã Việt hoá.
- Dữ liệu lưu trên máy trước, tự đồng bộ lên Sheet khi có mạng (chấm góc phải: xanh = đã đồng bộ, cam = đang chờ, đỏ = lỗi).
- Kỷ lục (PR) tính trực tiếp từ `WorkoutLog`, không cần sheet riêng.
- Số liệu món Việt là ước tính, sửa được trong tab Thư viện món.
- Chạy thử local: `python -m http.server 5173` trong thư mục này → http://localhost:5173.
