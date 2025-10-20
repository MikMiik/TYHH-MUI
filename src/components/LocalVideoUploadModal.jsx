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

const LocalVideoUploadModal = ({ open, onClose, onUploadSuccess, livestream }) => {
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleFileSelect = (file, uploadFile) => {
    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error('Vui lòng chọn file video')
      return
    }

    // Validate file size (max 500MB for video)
    const maxSize = 4 * 1024 * 1024 * 1024 // 4GB
    if (file.size > maxSize) {
      toast.error('Video phải nhỏ hơn 4GB')
      return
    }

    // Create preview URL
    const preview = URL.createObjectURL(file)
    setPreviewUrl(preview)

    // Upload file
    uploadFile(file, {
      fileName: `${livestream?.slug || 'video'}-${Date.now()}.mp4`,
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { height: '80vh' },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <VideoIcon />
        Upload Video cho {livestream?.title || 'Livestream'}
        <IconButton onClick={handleClose} sx={{ ml: 'auto' }} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <LocalUploader
          onUploadSuccess={(response) => {
            clearPreview()
            toast.success('Upload video thành công!')
            onUploadSuccess?.(response)
            handleClose()
          }}
          onUploadError={(error) => {
            clearPreview()
            toast.error(`Lỗi upload: ${error.message}`)
          }}
        >
          {({ uploadFile, isUploading, progress, error, resetError }) => (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
              {/* Upload Area */}
              <Card sx={{ flex: 1 }}>
                <CardContent sx={{ height: '100%', p: 3 }}>
                  {isUploading ? (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        height: '100%',
                        justifyContent: 'center',
                      }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <UploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                          Đang upload video...
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Vui lòng không đóng cửa sổ này
                        </Typography>
                      </Box>

                      <Box sx={{ px: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Tiến độ upload</Typography>
                          <Typography variant="body2">{Math.round(progress)}%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
                      </Box>
                    </Box>
                  ) : previewUrl ? (
                    <Box sx={{ height: '100%', position: 'relative' }}>
                      <video
                        src={previewUrl}
                        controls
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          borderRadius: 8,
                        }}
                      />
                      <IconButton
                        onClick={clearPreview}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'background.paper',
                          '&:hover': { bgcolor: 'background.paper' },
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        height: '100%',
                        border: '2px dashed',
                        borderColor: 'grey.300',
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'action.hover',
                        },
                      }}
                      component="label"
                    >
                      <UploadIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                      <Typography variant="h6" color="text.secondary">
                        Chọn video để upload
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Hỗ trợ MP4, MOV, AVI. Tối đa 4GB
                      </Typography>
                      <Button variant="contained" component="span" startIcon={<UploadIcon />}>
                        Chọn File
                      </Button>
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
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={handleClose} variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LocalVideoUploadModal
