import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { useCreateLivestreamMutation } from '@/features/api/livestreamApi'

const CreateLivestreamModal = ({ open, onClose, onLivestreamCreated, outline }) => {
  const [livestreamData, setLivestreamData] = useState({
    title: '',
    order: 1,
  })
  const [createLivestream, { isLoading: isCreating }] = useCreateLivestreamMutation()

  useEffect(() => {
    if (open) {
      // Calculate next order value based on existing livestreams
      if (outline?.livestreams?.length > 0) {
        const maxOrder = Math.max(...outline.livestreams.map((stream) => stream.order || 0))
        setLivestreamData((prev) => ({
          ...prev,
          order: maxOrder + 1,
        }))
      } else {
        setLivestreamData((prev) => ({
          ...prev,
          order: 1,
        }))
      }
    }
  }, [open, outline])

  const handleSubmit = async () => {
    if (!livestreamData.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề livestream')
      return
    }

    if (!outline) {
      toast.error('Không tìm thấy thông tin outline')
      return
    }

    try {
      const livestreamPayload = {
        title: livestreamData.title.trim(),
        courseId: outline.courseId,
        courseOutlineId: outline.id,
      }

      if (!livestreamPayload.courseId) {
        toast.error('Không tìm thấy ID khóa học')
        return
      }

      if (!livestreamPayload.courseOutlineId) {
        toast.error('Không tìm thấy ID outline')
        return
      }

      await createLivestream(livestreamPayload).unwrap()

      toast.success('Tạo livestream thành công!')
      handleClose()

      if (onLivestreamCreated) {
        onLivestreamCreated()
      }
    } catch (error) {
      console.error('Error creating livestream:', error)
      const errorMessage = error?.data?.message || 'Có lỗi xảy ra khi tạo livestream'
      toast.error(errorMessage)
    }
  }

  const handleClose = () => {
    if (!isCreating) {
      setLivestreamData({
        title: '',
        order: 1,
      })
      onClose()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Auto-focus management
  useEffect(() => {
    let timeoutId
    if (open) {
      timeoutId = setTimeout(() => {
        const titleInput = document.getElementById('livestream-title-input')
        if (titleInput) {
          titleInput.focus()
        }
      }, 100)
    }
    return () => clearTimeout(timeoutId)
  }, [open])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
            Tạo Livestream Mới
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            disabled={isCreating}
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
          <Typography variant="body2" color="text.secondary" mb={2}>
            Tạo livestream mới cho outline: <strong>{outline?.title}</strong>
          </Typography>

          <TextField
            id="livestream-title-input"
            label="Tiêu đề livestream"
            fullWidth
            variant="outlined"
            value={livestreamData.title}
            onChange={(e) => setLivestreamData((prev) => ({ ...prev, title: e.target.value }))}
            onKeyPress={handleKeyPress}
            disabled={isCreating}
            placeholder="Bài 1"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
            helperText="Tiêu đề phải có từ 3 đến 255 ký tự"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button onClick={handleClose} disabled={isCreating} color="inherit" sx={{ borderRadius: 2 }}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isCreating || !livestreamData.title.trim() || livestreamData.title.trim().length < 3}
          sx={{
            borderRadius: 2,
            minWidth: 100,
          }}
        >
          {isCreating ? 'Đang tạo...' : 'Tạo Livestream'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateLivestreamModal
