import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  LinearProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material'
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  VideoFile as VideoIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material'
import LocalUploader from './LocalUploader'
import { toast } from 'react-toastify'
import VideoComp from './VideoComp'
import { useEditCourseMutation } from '@/features/api/courseApi'

const IntroVideoUploadModal = ({ open, onClose, onUploadSuccess, course }) => {
  const [previewUrl, setPreviewUrl] = useState(null)
  const [editCourse, { isLoading: isSaving }] = useEditCourseMutation()

  const handleFileSelect = (file, uploadFile) => {
    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error('Vui lòng chọn file video')
      return
    }

    // Validate file size (max 200MB for intro video)
    const maxSize = 2 * 1024 * 1024 * 1024 // 2GB
    if (file.size > maxSize) {
      toast.error('Video giới thiệu phải nhỏ hơn 2GB')
      return
    }

    // Create preview URL
    const preview = URL.createObjectURL(file)
    setPreviewUrl(preview)

    // Upload file
    uploadFile(file, {
      fileName: `${course?.slug || 'course'}-intro-${Date.now()}.mp4`,
      maxSize: maxSize,
    })
  }

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  const handleClose = () => {
    if (isSaving) {
      toast.warning('Đang lưu video, vui lòng đợi...')
      return
    }
    clearPreview()
    onClose()
  }

  const handleUploadSuccess = async (response) => {
    clearPreview()

    if (!response) {
      toast.error('Lỗi: Không thể upload video')
      return
    }

    const relativePath = response.filePath

    try {
      // Chỉ lưu vào database nếu đang edit course có sẵn
      if (course?.id) {
        // Lưu video relative path vào database
        await editCourse({
          id: course.id,
          courseData: {
            introVideo: relativePath, // Sử dụng relative path, không phải full URL
          },
        }).unwrap()

        toast.success('Upload và lưu video giới thiệu thành công!')
      } else {
        // Nếu đang tạo course mới, chỉ thông báo upload thành công
        toast.success('Upload video giới thiệu thành công!')
      }

      onUploadSuccess?.({
        ...response,
        filePath: relativePath,
      })
    } catch (error) {
      console.error('Error saving intro video:', error)
      toast.error('Lỗi khi lưu video vào khóa học: ' + (error?.data?.message || error.message))
      return
    }

    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={isSaving ? () => {} : handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 3, pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600} color="primary.main">
            Upload Video Giới Thiệu
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            disabled={isSaving}
            sx={{
              color: (theme) => theme.palette.icon.button,
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 2 }}>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Upload video giới thiệu cho khóa học: <strong>{course?.title}</strong>
          </Typography>

          <LocalUploader
            onUploadSuccess={handleUploadSuccess}
            onUploadError={(error) => {
              clearPreview()
              toast.error(`Lỗi upload: ${error.message}`)
            }}
          >
            {({ uploadFile, isUploading, progress, error, resetError }) => (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Card variant="outlined">
                  <CardContent sx={{ p: 3 }}>
                    {isUploading || isSaving ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box
                          sx={{
                            width: '100%',
                            height: 200,
                            bgcolor: 'grey.100',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'grey.300',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                          }}
                        >
                          <UploadIcon sx={{ fontSize: 40, color: 'grey.500' }} />
                          <Typography variant="body2" color="text.secondary">
                            {isUploading ? 'Đang upload video giới thiệu...' : 'Đang lưu vào khóa học...'}
                          </Typography>
                        </Box>
                        {isUploading && (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2">Tiến độ upload</Typography>
                              <Typography variant="body2">{Math.round(progress)}%</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={progress} />
                          </Box>
                        )}
                        {isSaving && (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="body2" textAlign="center">
                              Đang lưu video vào khóa học...
                            </Typography>
                            <LinearProgress />
                          </Box>
                        )}
                      </Box>
                    ) : previewUrl ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <VideoComp src={previewUrl} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckIcon sx={{ color: 'success.main' }} />
                          <Typography variant="body2" color="success.main">
                            Video đã sẵn sàng để upload
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          height: 200,
                          bgcolor: 'grey.50',
                          borderRadius: 1,
                          border: '2px dashed',
                          borderColor: 'grey.300',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: 'grey.100',
                            borderColor: 'primary.main',
                          },
                        }}
                        component="label"
                      >
                        <VideoIcon sx={{ fontSize: 48, color: 'grey.400' }} />
                        <Typography variant="body1" color="text.secondary" textAlign="center">
                          Chọn video giới thiệu
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                          Hỗ trợ MP4, AVI, MOV. Tối đa 200MB
                        </Typography>
                        <input
                          type="file"
                          accept="video/*"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              resetError()
                              handleFileSelect(file, uploadFile)
                            }
                          }}
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>

                {/* Error Display */}
                {error && (
                  <Alert severity="error" onClose={resetError}>
                    {error}
                  </Alert>
                )}
              </Box>
            )}
          </LocalUploader>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button onClick={handleClose} color="inherit" sx={{ borderRadius: 2 }}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default IntroVideoUploadModal
