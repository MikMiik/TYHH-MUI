# NotFound Page Documentation

## 📄 Tổng quan

Component `NotFound` là trang lỗi 404 được thiết kế phù hợp với UI của dự án TYHH MUI. Trang này sẽ được hiển thị khi người dùng truy cập vào một URL không tồn tại.

## 🎨 Thiết kế

### Visual Elements

- **Số 404** lớn với màu primary
- **Divider line** với màu tertiary
- **Emoji icons** minh họa (🔍📄)
- **Paper container** với shadow và rounded corners
- **Responsive design** cho mobile và desktop

### Color Scheme

- Primary color cho số 404 và buttons
- Tertiary color cho divider
- Text colors tuân theo theme MUI

## 🔧 Tính năng

### Navigation Actions

1. **Về trang chủ** - Button chính dẫn về "/"
2. **Quay lại** - Button phụ sử dụng `navigate(-1)`

### Quick Links

- Khóa học (/courses)
- Tài liệu (/document)
- Lịch livestream (/liveschedule)

### Responsive Behavior

- Button layout: Column trên mobile, Row trên desktop
- Typography scaling theo breakpoints
- Container max-width điều chỉnh theo màn hình

## 🚀 Cách hoạt động

### Routing Configuration

1. **Route Config** (`src/routes/config.js`):

```javascript
notFound: '*' // Catch-all route
```

2. **Route Definition** (`src/routes/index.js`):

```javascript
{
  path: config.routes.notFound,
  component: NotFound,
}
```

3. **AppRoutes** (`src/components/AppRoutes.jsx`):

- NotFound route được đặt cuối cùng để catch tất cả routes không match
- Sử dụng React Router's wildcard pattern `*`

### Component Structure

```
NotFound
├── Container (maxWidth="md")
├── Box (minHeight="80vh", centered)
├── Paper (elevation=3, rounded)
└── Stack (spacing=4)
    ├── Error Code (404)
    ├── Error Message
    ├── Illustration (Emojis)
    ├── Action Buttons
    └── Quick Links
```

## 📱 Responsive Design

### Breakpoints

- **xs (0px+)**: Single column layout, smaller typography
- **sm (768px+)**: Row layout for buttons and links
- **md (992px+)**: Larger typography, optimal spacing

### Typography Scaling

```javascript
fontSize: { xs: '6rem', md: '8rem' }  // 404 number
fontSize: { xs: '1.5rem', md: '2rem' } // Error title
```

## 🎯 UX Considerations

### User Journey

1. **Error Recognition** - Clear 404 display
2. **Context Understanding** - Friendly error message in Vietnamese
3. **Recovery Options** - Multiple navigation choices
4. **Quick Access** - Popular links readily available

### Accessibility

- Semantic HTML structure
- Clear focus indicators
- Descriptive alt texts
- Proper heading hierarchy

## 🔧 Customization

### Styling

Thay đổi colors, spacing, hoặc layout trong component:

```javascript
sx={{
  bgcolor: 'primary.main',      // Thay đổi màu
  borderRadius: 3,              // Thay đổi bo góc
  p: 6                          // Thay đổi padding
}}
```

### Content

Cập nhật text, links, hoặc emoji trong JSX:

```javascript
// Thay đổi emoji
🔍📄 → 😕🚧

// Thay đổi message
"Trang không tồn tại" → "Oops! Page not found"

// Thêm/bớt quick links
<Button component={RouterLink} to="/new-page">
  New Page
</Button>
```

### Navigation

Thêm logic navigation phức tạp:

```javascript
const handleCustomAction = () => {
  // Custom logic
  navigate('/custom-path')
}
```

## 🚨 Lưu ý quan trọng

1. **Route Order**: NotFound route phải được đặt cuối cùng trong routing configuration
2. **Catch-all Pattern**: Sử dụng `*` để catch tất cả unmatched routes
3. **Layout Integration**: NotFound vẫn sử dụng DefaultLayout để giữ consistency
4. **Performance**: Component được import lazily nếu cần thiết

## 🔍 Testing

### Manual Testing

1. Truy cập URL không tồn tại: `/random-page-123`
2. Kiểm tra responsive trên các device
3. Test navigation buttons
4. Verify quick links hoạt động

### URL Examples

- `/this-page-does-not-exist`
- `/courses/invalid-slug`
- `/random/nested/path`

## 📊 Analytics (Optional)

Có thể thêm tracking cho 404 errors:

```javascript
useEffect(() => {
  // Track 404 page views
  analytics.track('404_page_view', {
    path: window.location.pathname,
    referrer: document.referrer,
  })
}, [])
```

---

Component NotFound giờ đã được tích hợp hoàn chỉnh vào hệ thống routing và sẵn sàng handle tất cả các trường hợp URL không hợp lệ!
