import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material'
import { useCreateNotificationMutation } from '@/features/api/notificationApi'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import notificationSchema from '@/schemas/notificationSchema'

const CreateNotificationModal = ({ open, onClose, onNotificationCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
  })

  const [createNotification, { isLoading, error }] = useCreateNotificationMutation()
  const currentUser = useCurrentUser()

  // Validation state
  const [validationErrors, setValidationErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: null,
      }))
    }
  }

  const validateForm = async () => {
    try {
      await notificationSchema.validate(formData, { abortEarly: false })
      setValidationErrors({})
      return true
    } catch (error) {
      const errors = {}
      error.inner.forEach((err) => {
        errors[err.path] = err.message
      })
      setValidationErrors(errors)
      return false
    }
  }

  const handleSubmit = async () => {
    try {
      const isValid = await validateForm()
      if (!isValid) return

      const result = await createNotification({
        title: formData.title,
        message: formData.message,
        teacherId: currentUser?.id,
      }).unwrap()

      // Reset form
      setFormData({
        title: '',
        message: '',
      })
      setValidationErrors({})

      if (onNotificationCreated) {
        onNotificationCreated(result)
      }

      onClose()
    } catch (error) {
      console.error('Error creating notification:', error)
    }
  }

  const handleClose = () => {
    setFormData({
      title: '',
      message: '',
    })
    setValidationErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Tạo thông báo mới</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {error && <Alert severity="error">{error?.data?.message || 'Có lỗi xảy ra khi tạo thông báo'}</Alert>}

          <TextField
            label="Tiêu đề"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            error={!!validationErrors.title}
            helperText={validationErrors.title}
            fullWidth
            required
            placeholder="Nhập tiêu đề thông báo..."
          />

          <TextField
            label="Nội dung"
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            error={!!validationErrors.message}
            helperText={validationErrors.message}
            fullWidth
            multiline
            rows={4}
            placeholder="Nhập nội dung thông báo..."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading && <CircularProgress size={20} />}
        >
          {isLoading ? 'Đang tạo...' : 'Tạo thông báo'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateNotificationModal
