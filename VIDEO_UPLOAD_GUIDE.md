# Video Upload với ImageKit - Implementation Guide

## 🎯 Overview

Hệ thống upload video sử dụng ImageKit cho TYHH MUI với pattern render prop và authentication từ backend.

## 🏗️ Architecture

### 1. ImageKit Authentication Flow

```
Frontend → Backend (/api/imagekit/auth) → ImageKit → Authentication Params → Frontend Upload
```

**Backend Endpoint**: `/api/imagekit/auth`

- Trả về: `{ signature, expire, token, publicKey }`
- Authentication được handle bởi `ImagekitAuth.jsx`

### 2. Upload Process

1. **File Selection**: User chọn video file
2. **Validation**: Check file type, size (max 500MB for video)
3. **Authentication**: Get auth params từ backend
4. **Upload**: Sử dụng ImageKit SDK với progress tracking
5. **Success**: Trả về video URL để cập nhật livestream

## 📁 Component Structure

### ImagekitAuth.jsx (Core Uploader)

```jsx
const ImageKitUploader = ({ children, onUploadSuccess, onUploadError }) => {
  // Render prop pattern
  return children({
    uploadFile, // Function để upload
    isUploading, // Boolean status
    progress, // Number 0-100
    error, // String error message
    resetError, // Function để clear error
  })
}
```

### VideoUploadModal.jsx (UI Component)

```jsx
const VideoUploadModal = ({ open, onClose, onUploadSuccess, livestream }) => {
  // Wrapper around ImageKitUploader với video-specific UI
  // Validate video files, show preview, handle upload flow
}
```

## 🔧 Upload Options Configuration

### For Videos:

```javascript
uploadFile(file, {
  fileName: `${livestream?.slug}-${Date.now()}`,
  folder: '/livestream-videos',
  tags: ['livestream', 'video', livestream?.slug],
  maxSize: 500 * 1024 * 1024, // 500MB
})
```

### For Images:

```javascript
uploadFile(file, {
  fileName: `${course?.slug}-thumbnail`,
  folder: '/course-thumbnails',
  tags: ['course', 'thumbnail'],
  maxSize: 10 * 1024 * 1024, // 10MB
})
```

## 🎮 Usage Examples

### 1. Basic Video Upload

```jsx
<ImageKitUploader
  onUploadSuccess={(response) => {
    console.log('Video URL:', response.url)
    // Update livestream với video URL
  }}
  onUploadError={(error) => {
    toast.error(`Upload failed: ${error.message}`)
  }}
>
  {({ uploadFile, isUploading, progress, error }) => (
    <VideoUploadUI onUpload={uploadFile} loading={isUploading} progress={progress} />
  )}
</ImageKitUploader>
```

### 2. Image Upload (Avatar/Thumbnail)

```jsx
<ImageKitUploader
  onUploadSuccess={(response) => {
    setProfileAvatar(response.url)
  }}
>
  {({ uploadFile, isUploading }) => (
    <input type="file" accept="image/*" onChange={(e) => uploadFile(e.target.files[0])} disabled={isUploading} />
  )}
</ImageKitUploader>
```

## 📊 File Type Support

### Videos:

- **Formats**: MP4, AVI, MOV, MKV
- **Max Size**: 500MB
- **Validation**: `file.type.startsWith('video/')`

### Images:

- **Formats**: JPG, PNG, GIF, WebP
- **Max Size**: 10MB
- **Validation**: `file.type.startsWith('image/')`

### Documents:

- **Formats**: PDF
- **Max Size**: 50MB
- **Validation**: `file.type === 'application/pdf'`

## 🔐 Security Features

1. **Backend Authentication**: All uploads require valid backend session
2. **File Type Validation**: Frontend + ImageKit validation
3. **Size Limits**: Configurable per file type
4. **Folder Organization**: Structured upload paths
5. **Tagging**: Metadata for file organization

## 🚀 API Integration Points

### Current Livestream Update (TODO)

```javascript
// Sau khi upload thành công
const updateLivestreamVideo = async (livestreamId, videoUrl) => {
  await updateLivestream({
    id: livestreamId,
    url: videoUrl,
  }).unwrap()
}
```

### Backend Routes:

- `GET /api/imagekit/auth` - Get upload credentials
- `PUT /api/livestreams/teacher/:id` - Update livestream URL

## 🎨 UI/UX Features

1. **Drag & Drop**: Upload area support drag/drop
2. **Preview**: Video preview before upload
3. **Progress**: Real-time upload progress
4. **Error Handling**: User-friendly error messages
5. **Validation**: Instant file validation feedback

## 🔄 State Management

### Upload States:

- `idle`: No upload in progress
- `uploading`: Upload in progress với progress %
- `success`: Upload completed
- `error`: Upload failed với error message

### UI States:

- **Empty**: Show upload area
- **Preview**: Show selected file
- **Uploading**: Show progress bar
- **Success**: Show success message
- **Error**: Show error with retry option

## 📝 Implementation Notes

1. **Memory Management**: Clear preview URLs with `URL.revokeObjectURL()`
2. **Error Recovery**: Reset error state when selecting new file
3. **Progress Tracking**: Use ImageKit onProgress callback
4. **File Validation**: Multiple layers of validation
5. **Responsive Design**: Modal adapts to screen size

## 🧪 Testing Checklist

- [ ] File type validation (video, image, pdf)
- [ ] File size limits
- [ ] Upload progress tracking
- [ ] Error handling và recovery
- [ ] Preview functionality
- [ ] Authentication flow
- [ ] Success callbacks
- [ ] Memory leak prevention
- [ ] Responsive design
- [ ] Accessibility features
