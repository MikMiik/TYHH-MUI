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
import ImageKitUploader from './ImagekitAuth'
import { toast } from 'react-toastify'

const VideoUploadModal = ({ open, onClose, onUploadSuccess, livestream }) => {
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleFileSelect = (file, uploadFile) => {
    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error('Vui lòng chọn file video')
      return
    }

    // Validate file size (max 500MB for video)
    const maxSize = 500 * 1024 * 1024 // 500MB
    if (file.size > maxSize) {
      toast.error('Video phải nhỏ hơn 500MB')
      return
    }

    // Create preview URL
    const preview = URL.createObjectURL(file)
    setPreviewUrl(preview)

    // Upload file
    uploadFile(file, {
      fileName: `${livestream?.slug || 'video'}-${Date.now()}.mp4`,
      folder: '/livestreams',
      tags: ['livestream', 'video', livestream?.slug || 'unknown'],
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
    clearPreview()
    onClose()
  }

  const handleUploadSuccess = (response) => {
    clearPreview()
    toast.success('Upload video thành công!')

    if (response.url) {
      // Loại bỏ dấu / ở đầu filePath để có đường dẫn tương đối
      const relativePath = response.filePath?.startsWith('/') ? response.filePath.substring(1) : response.filePath

      onUploadSuccess?.({
        ...response,
        filePath: relativePath,
      })
    }
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
            Upload Video cho Livestream
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
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
            Upload video cho livestream: <strong>{livestream?.title}</strong>
          </Typography>

          <ImageKitUploader
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
                    {isUploading ? (
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
                            Đang upload video...
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Tiến độ upload</Typography>
                            <Typography variant="body2">{Math.round(progress)}%</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={progress} />
                        </Box>
                      </Box>
                    ) : previewUrl ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <video
                          src={previewUrl}
                          controls
                          style={{
                            width: '100%',
                            height: 200,
                            borderRadius: 8,
                            backgroundColor: '#000',
                          }}
                        />
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
                          Chọn video để upload
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                          Hỗ trợ MP4, AVI, MOV. Tối đa 500MB
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
          </ImageKitUploader>
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

export default VideoUploadModal
