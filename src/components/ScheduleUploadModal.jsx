import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Typography,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { useState, useEffect, useRef } from 'react'
import LocalUploader from './LocalUploader'
import { useCreateScheduleMutation, useUpdateScheduleMutation } from '@/features/api/scheduleApi'
import LocalImageLazy from './LocalImageLazy'

function ScheduleUploadModal({ open, onClose, schedule = null }) {
  const [formData, setFormData] = useState({
    target: '',
    url: '',
  })
  const fileInputRef = useRef(null)

  const [createSchedule, { isLoading: isCreating }] = useCreateScheduleMutation()
  const [updateSchedule, { isLoading: isUpdating }] = useUpdateScheduleMutation()

  const isEditMode = !!schedule
  const isLoading = isCreating || isUpdating

  useEffect(() => {
    if (schedule) {
      setFormData({
        target: schedule.target || '',
        url: schedule.url || '',
      })
    } else {
      setFormData({
        target: '',
        url: '',
      })
    }
  }, [schedule])

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    })
  }

  const handleImageUpload = async (file, uploadFile) => {
    if (!file || !uploadFile) return

    const uploadedFile = await uploadFile(file)
    if (uploadedFile) {
      setFormData({
        ...formData,
        url: uploadedFile.filePath,
      })
    }
  }

  const createFileSelectHandler = (uploadFile) => (event) => {
    const file = event.target.files[0]
    if (file) {
      handleImageUpload(file, uploadFile)
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await updateSchedule({ id: schedule.id, ...formData }).unwrap()
      } else {
        await createSchedule(formData).unwrap()
      }
      onClose()
    } catch (error) {
      console.error('Error saving schedule:', error)
    }
  }

  const canSubmit = formData.target.trim() && formData.url.trim()

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{isEditMode ? 'Chỉnh sửa lịch livestream' : 'Thêm lịch livestream mới'}</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={3}>
          <TextField
            label="Tiêu đề lịch *"
            value={formData.target}
            onChange={handleChange('target')}
            fullWidth
            variant="outlined"
            placeholder="Nhập tiêu đề cho lịch livestream"
          />

          <Box>
            <Typography variant="subtitle1" mb={1}>
              Ảnh lịch livestream *
            </Typography>
            <LocalUploader
              onUploadSuccess={(uploadedFile) => {
                setFormData({
                  ...formData,
                  url: uploadedFile.filePath,
                })
              }}
              onUploadError={(error) => {
                console.error('Upload error:', error)
              }}
            >
              {({ uploadFile, isUploading, progress }) => (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={createFileSelectHandler(uploadFile)}
                  />
                  <Box
                    sx={{
                      border: '2px dashed',
                      borderColor: 'grey.300',
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      bgcolor: 'background.paper',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover',
                      },
                    }}
                    onClick={openFileDialog}
                  >
                    {isUploading ? (
                      <Typography>Đang upload... {Math.round(progress)}%</Typography>
                    ) : formData.url ? (
                      <Box>
                        <LocalImageLazy
                          src={formData.url}
                          alt="Preview"
                          style={{
                            maxWidth: '100%',

                            objectFit: 'contain',
                            borderRadius: 8,
                          }}
                        />
                        <Typography variant="body2" color="success.main" mt={1}>
                          Ảnh đã được chọn. Click để thay đổi.
                        </Typography>
                      </Box>
                    ) : (
                      <Typography color="textSecondary">Click để chọn ảnh</Typography>
                    )}
                  </Box>
                </>
              )}
            </LocalUploader>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!canSubmit || isLoading}>
          {isLoading ? 'Đang xử lý...' : isEditMode ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ScheduleUploadModal
