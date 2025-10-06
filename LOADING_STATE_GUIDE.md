# LoadingState Component - Hướng dẫn sử dụng

## Tổng quan

`LoadingState` là component chung để xử lý các trạng thái loading, error và empty data trong dự án TYHH MUI. Component được thiết kế để tương thích hoàn toàn với Material-UI design system và có thể sử dụng với RTK Query.

## Component chính

### 1. LoadingState

Component cơ bản để hiển thị các trạng thái khác nhau.

```jsx
import LoadingState from '@/components/LoadingState'

function MyComponent() {
  return (
    <LoadingState
      isLoading={isLoading}
      error={error}
      hasData={hasData}
      loadingText="Đang tải dữ liệu..."
      emptyText="Không có dữ liệu"
      variant="section"
      onRetry={handleRetry}
    >
      {/* Nội dung chính khi có dữ liệu */}
      <div>Content goes here</div>
    </LoadingState>
  )
}
```

### 2. useLoadingState Hook

Hook tiện ích để sử dụng với RTK Query.

```jsx
import { useLoadingState } from '@/components/withLoadingState'
import { useGetCoursesQuery } from '@/features/api/courseApi'

function CoursesPage() {
  const queryResult = useGetCoursesQuery()
  const { data: courses, LoadingStateComponent } = useLoadingState(queryResult, {
    variant: 'page',
    loadingText: 'Đang tải khóa học...',
    emptyText: 'Chưa có khóa học nào',
    dataKey: 'courses',
    skeletonType: 'card',
  })

  return (
    <LoadingStateComponent>
      {/* Render courses */}
      {courses?.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </LoadingStateComponent>
  )
}
```

## Props của LoadingState

| Prop             | Type     | Default               | Mô tả                     |
| ---------------- | -------- | --------------------- | ------------------------- |
| `isLoading`      | boolean  | false                 | Trạng thái đang loading   |
| `error`          | object   | null                  | Object lỗi từ API         |
| `hasData`        | boolean  | true                  | Có dữ liệu hay không      |
| `loadingText`    | string   | "Đang tải dữ liệu..." | Text hiển thị khi loading |
| `emptyText`      | string   | "Không có dữ liệu..." | Text khi không có dữ liệu |
| `variant`        | string   | 'section'             | Kiểu hiển thị             |
| `skeletonType`   | string   | 'text'                | Loại skeleton             |
| `skeletonCount`  | number   | 3                     | Số lượng skeleton         |
| `onRetry`        | function | null                  | Callback khi retry        |
| `containerProps` | object   | {}                    | Props cho container       |

## Các variant

### 1. `page` - Cho toàn trang

```jsx
<LoadingState variant="page" />
```

- Sử dụng Container wrapper
- Chiều cao tối thiểu lớn hơn
- Phù hợp cho trang chính

### 2. `section` - Cho phần nội dung

```jsx
<LoadingState variant="section" />
```

- Không wrapper
- Chiều cao vừa phải
- Phù hợp cho sections, cards

### 3. `inline` - Cho nội dung nhỏ

```jsx
<LoadingState variant="inline" />
```

- Kích thước nhỏ gọn
- Loading spinner nhỏ hơn
- Phù hợp cho buttons, small widgets

### 4. `skeleton` - Skeleton loading

```jsx
<LoadingState variant="skeleton" skeletonType="card" />
```

- Hiển thị skeleton thay vì spinner
- Mô phỏng cấu trúc nội dung thực

## Các loại Skeleton

### 1. `text` - Skeleton text

```jsx
<LoadingState variant="skeleton" skeletonType="text" skeletonCount={5} />
```

### 2. `card` - Skeleton card

```jsx
<LoadingState variant="skeleton" skeletonType="card" skeletonCount={3} />
```

### 3. `list` - Skeleton list item

```jsx
<LoadingState variant="skeleton" skeletonType="list" skeletonCount={4} />
```

## Options cho useLoadingState Hook

| Option          | Type     | Default               | Mô tả                           |
| --------------- | -------- | --------------------- | ------------------------------- |
| `dataKey`       | string   | null                  | Key để extract data từ response |
| `hasDataCheck`  | function | null                  | Custom function check có data   |
| `loadingText`   | string   | "Đang tải..."         | Text loading                    |
| `emptyText`     | string   | "Không có dữ liệu..." | Text empty                      |
| `variant`       | string   | 'section'             | Variant hiển thị                |
| `skeletonType`  | string   | 'text'                | Loại skeleton                   |
| `skeletonCount` | number   | 3                     | Số skeleton items               |

## Ví dụ sử dụng

### 1. Trang danh sách với skeleton

```jsx
function DocumentsPage() {
  const queryResult = useGetAllDocumentsQuery({ page: 1 })
  const { data: { documents } = {}, LoadingStateComponent } = useLoadingState(queryResult, {
    variant: 'section',
    loadingText: 'Đang tải tài liệu...',
    emptyText: 'Chưa có tài liệu nào',
    skeletonType: 'list',
    skeletonCount: 5,
    dataKey: 'documents',
    hasDataCheck: (docs) => docs && docs.length > 0,
  })

  return (
    <Box ml={4} width="100%">
      <LoadingStateComponent>
        <List>
          {documents?.map((doc) => (
            <DocumentListItem key={doc.id} doc={doc} />
          ))}
        </List>
      </LoadingStateComponent>
    </Box>
  )
}
```

### 2. Chi tiết một item

```jsx
function CourseDetail() {
  const { slug } = useParams()
  const queryResult = useGetCourseQuery(slug)
  const { data: course, LoadingStateComponent } = useLoadingState(queryResult, {
    variant: 'page',
    loadingText: 'Đang tải thông tin khóa học...',
    emptyText: 'Không tìm thấy khóa học này',
  })

  return (
    <LoadingStateComponent>
      <Container>
        <Typography variant="h4">{course?.title}</Typography>
        <Typography>{course?.description}</Typography>
        {/* ... */}
      </Container>
    </LoadingStateComponent>
  )
}
```

### 3. Với custom retry function

```jsx
function MyComponent() {
  const [refetchTrigger, setRefetchTrigger] = useState(0)
  const queryResult = useGetDataQuery({ trigger: refetchTrigger })

  const handleRetry = () => {
    setRefetchTrigger((prev) => prev + 1)
    queryResult.refetch()
  }

  const { LoadingStateComponent } = useLoadingState(queryResult, {
    onRetry: handleRetry,
  })

  return <LoadingStateComponent>{/* Content */}</LoadingStateComponent>
}
```

## Best Practices

1. **Chọn variant phù hợp**:

   - `page` cho trang chính
   - `section` cho phần nội dung
   - `inline` cho components nhỏ
   - `skeleton` khi muốn UX mượt mà

2. **Sử dụng dataKey cho nested data**:

   ```jsx
   // Khi API trả về: { courses: [...], totalPages: 5 }
   useLoadingState(queryResult, { dataKey: 'courses' })
   ```

3. **Custom hasDataCheck cho logic phức tạp**:

   ```jsx
   useLoadingState(queryResult, {
     hasDataCheck: (data) => data && data.items && data.items.length > 0,
   })
   ```

4. **Text messages phù hợp ngữ cảnh**:
   ```jsx
   {
     loadingText: 'Đang tải khóa học...',
     emptyText: 'Chưa có khóa học nào được tạo'
   }
   ```

## Migration từ code cũ

### Trước:

```jsx
function MyPage() {
  const { data, isLoading, error } = useGetDataQuery()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No data</div>

  return <div>{/* render data */}</div>
}
```

### Sau:

```jsx
function MyPage() {
  const queryResult = useGetDataQuery()
  const { data, LoadingStateComponent } = useLoadingState(queryResult, {
    variant: 'page',
    loadingText: 'Đang tải dữ liệu...',
    emptyText: 'Không có dữ liệu',
  })

  return (
    <LoadingStateComponent>
      <div>{/* render data */}</div>
    </LoadingStateComponent>
  )
}
```
