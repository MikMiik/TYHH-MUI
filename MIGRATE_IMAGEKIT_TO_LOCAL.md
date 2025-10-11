# Tổng hợp migrate ImageKit sang upload local (TYHH MUI & TYHH BE)

## 1. Mục tiêu & Phạm vi

- Loại bỏ hoàn toàn ImageKit khỏi hệ thống (frontend & backend)
- Chuyển toàn bộ upload, render ảnh/video từ ImageKit sang upload và render trực tiếp từ thư mục local (public/uploads/)
- Đảm bảo dữ liệu lưu vào database là relative filePath, không phải URL
- UI/UX phải đồng nhất, không bị vỡ layout, không còn phụ thuộc ImageKit

## 2. Checklist các bước đã thực hiện

### Frontend (TYHH MUI)

- [x] **Tạo LocalUploader.jsx**: Thay thế hoàn toàn ImagekitAuth, dùng render prop pattern, upload file qua API `/upload`, hỗ trợ progress, error, validate size/type.
- [x] **Tạo LocalImageLazy.jsx**: Thay thế ImageLazy, chỉ dùng `<img>` với lazy loading, object-fit: cover, placeholder, error fallback, props linh hoạt.
- [x] **Tạo LocalImageUploader.jsx**: Thay thế ImageUploader cho các modal upload ảnh (thumbnail, avatar, ...).
- [x] **Tạo LocalVideoUploadModal.jsx**: Thay thế VideoUploadModal, upload video local, validate size/type, preview, callback.
- [x] **Migrate toàn bộ component sử dụng ImageKit**:
  - Đã thay thế mọi import và usage của ImageKit/ImageLazy/ImageUploader bằng các component local mới.
  - Đã migrate các trang: Home.jsx, CreatedCourses.jsx, CreateCourseModal.jsx, Profile.jsx, LiveSchedule.jsx, MenuLayout.jsx, DocumentListItem.jsx, PaymentModal.jsx, ...
  - Đảm bảo mọi nơi render ảnh/video đều dùng LocalImageLazy hoặc `<img>` thường, không còn ImageKit.
- [x] **VideoComp.jsx**: Xử lý src thông minh: nếu là full URL thì giữ nguyên, nếu là path thì tự động thêm VITE_SERVER_URL.
- [x] **CardMedia (VideoCard.jsx)**: Đặt height cố định, objectFit: cover để các card đều nhau, không bị lệch layout.
- [x] **Xóa toàn bộ import, dependency liên quan đến ImageKit** trong code và package.json.
- [x] **Kiểm tra kỹ các chỗ render ảnh/video**: Đảm bảo không còn sử dụng ImageKit/ImageLazy cũ.
- [x] **Test kỹ các case**: Upload ảnh, video, avatar, thumbnail, tài liệu PDF, ... Render ảnh/video ở mọi nơi (danh sách, chi tiết, modal, ...).
- [x] **Fix lỗi course.id null khi upload video intro**: Chỉ gọi API editCourse khi có id, còn lại chỉ upload file.

### Backend (TYHH BE)

- [x] **Middleware upload (handleUpload.js)**: Sử dụng Multer để nhận file upload, lưu vào thư mục public/uploads/, trả về filePath (relative path) cho frontend lưu vào DB.
- [x] **Controller upload**: Xử lý upload, trả về thông tin file (filePath, originalName, size, ...).
- [x] **Model**: Các trường ảnh/video/file chỉ lưu relative path (ví dụ: uploads/abc.jpg), không lưu URL.
- [x] **API trả về đúng filePath** và cho phép truy cập file tĩnh qua public/uploads.
- [x] **Cập nhật getDocumentBySlug**: include đầy đủ các association và field cần thiết cho DocumentDetail (slidenote, url, livestream.view, course.topics, ...).

## 3. Lưu ý quan trọng khi migrate

- **Không lưu full URL vào database**, chỉ lưu relative path (filePath). Khi render, luôn dùng `${VITE_SERVER_URL}/${filePath}`.
- **Xóa sạch mọi dấu vết ImageKit**: import, component, package.json, code cũ, ...
- **UI/UX phải đồng nhất**: CardMedia height cố định, object-fit: cover, tránh lệch layout.
- **Khi upload file mới**: Nếu là edit, lưu luôn vào DB. Nếu là tạo mới (chưa có id), chỉ upload file, lưu path sau khi tạo entity.
- **Test lại toàn bộ luồng upload, render, lưu DB**: Đảm bảo không còn phụ thuộc ImageKit, không lỗi đường dẫn, không lỗi hiển thị.
- **Backend phải trả về đúng filePath, cho phép truy cập file tĩnh**.
- **Kiểm tra kỹ các props truyền vào các modal upload**: Đảm bảo không truyền null/undefined gây lỗi khi gọi API.

## 4. Các vấn đề đã gặp & cách xử lý

- **Lỗi course.id null khi upload video intro**: Đã fix, chỉ gọi API editCourse khi có id, còn lại chỉ upload file.
- **CardMedia bị lệch chiều cao**: Đã fix, đặt height cố định, objectFit: cover.
- **Một số component cũ không dùng nữa**: Đã xóa hoàn toàn ImagekitAuth, ImageUploader, VideoUploadModal cũ.
- **Lỗi render ảnh/video khi thiếu VITE_SERVER_URL**: Đã kiểm tra, fallback hợp lý.

## 5. Checklist cuối cùng

- [x] Đã xóa toàn bộ ImageKit khỏi codebase
- [x] Tất cả upload/render ảnh/video đều qua local
- [x] DB chỉ lưu filePath (không lưu URL)
- [x] UI đồng nhất, không bị lệch card
- [x] Backend trả về đúng filePath, cho phép truy cập file tĩnh
- [x] Đã migrate và test toàn bộ các trang, modal, component liên quan

---

Nếu có vấn đề phát sinh, kiểm tra lại các bước trên hoặc liên hệ dev phụ trách migrate. Đọc kỹ file này trước khi bảo trì hoặc phát triển tiếp các tính năng liên quan upload/render media.
