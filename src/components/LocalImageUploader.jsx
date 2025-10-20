import { useState } from 'react'
import { Button, Box, Typography, Card, CardContent, LinearProgress, Alert, IconButton } from '@mui/material'
import { PhotoCamera, Upload, Close, CheckCircle } from '@mui/icons-material'
import PropTypes from 'prop-types'
import LocalUploader from './LocalUploader'

const LocalImageUploader = ({
  currentImage,
  onUploadSuccess,
  onUploadError,
  className = '',
  title = 'Thumbnail',
  fileName = 'image',
  height = 200,
}) => {
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleFileSelect = (file, uploadFile) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      onUploadError?.('Vui lòng chọn file ảnh')
      return
    }

    // Create preview URL
    const preview = URL.createObjectURL(file)
    setPreviewUrl(preview)

    // Upload file - file size validation will be handled by LocalUploader
    uploadFile(file, {
      fileName: `${fileName}_${Date.now()}.${file.name.split('.').pop()}`,
      maxSize: 5 * 1024 * 1024, // 5MB limit for images
    })
  }

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  return (
    <Box className={className}>
      <LocalUploader
        onUploadSuccess={(response) => {
          clearPreview()
          if (response.url) {
            onUploadSuccess?.(response)
          }
        }}
        onUploadError={(error) => {
          clearPreview()
          onUploadError?.(error.message)
        }}
      >
        {({ uploadFile, isUploading, progress, error, resetError }) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhotoCamera />
                {title}
              </Typography>
              {!isUploading && (
                <Button
                  variant="outlined"
                  size="small"
                  component="label"
                  startIcon={<Upload />}
                  sx={{ cursor: 'pointer' }}
                >
                  Upload Ảnh
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        resetError()
                        handleFileSelect(file, uploadFile)
                      }
                    }}
                  />
                </Button>
              )}
            </Box>

            {/* Preview Area */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                {isUploading ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: height,
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
                      <Upload sx={{ fontSize: 40, color: 'grey.500' }} />
                      <Typography variant="body2" color="text.secondary">
                        Đang tải lên...
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Tiến độ</Typography>
                        <Typography variant="body2">{Math.round(progress)}%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={progress} />
                    </Box>
                  </Box>
                ) : previewUrl ? (
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={previewUrl}
                      alt="Preview"
                      sx={{
                        width: '100%',
                        height: height,
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'grey.300',
                      }}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={clearPreview}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'background.paper',
                        '&:hover': {
                          bgcolor: 'background.paper',
                        },
                      }}
                    >
                      <Close />
                    </IconButton>
                  </Box>
                ) : currentImage ? (
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={currentImage}
                      alt="Current thumbnail"
                      sx={{
                        width: '100%',
                        height: height,
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'grey.300',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'success.main',
                        color: 'success.contrastText',
                        borderRadius: '50%',
                        p: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CheckCircle sx={{ fontSize: 20 }} />
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: height,
                      bgcolor: 'grey.100',
                      borderRadius: 1,
                      border: '2px dashed',
                      borderColor: 'grey.300',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      backgroundImage: 'url(/placeholder-image.svg)',
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        right: 8,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: 1,
                        p: 1,
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Nhấn "Upload Ảnh" để thêm thumbnail
                      </Typography>
                    </Box>
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
  )
}

LocalImageUploader.propTypes = {
  currentImage: PropTypes.string,
  onUploadSuccess: PropTypes.func,
  onUploadError: PropTypes.func,
  className: PropTypes.string,
  title: PropTypes.string,
  fileName: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default LocalImageUploader
