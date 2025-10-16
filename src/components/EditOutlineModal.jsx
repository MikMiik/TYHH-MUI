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
import { useUpdateCourseOutlineMutation } from '@/features/api/courseApi'
import { toast } from 'react-toastify'

const EditOutlineModal = ({ open, onClose, onOutlineUpdated, outline }) => {
  const [outlineTitle, setOutlineTitle] = useState('')
  const [updateCourseOutline, { isLoading: isUpdating }] = useUpdateCourseOutlineMutation()

  // Preserve scroll position
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    if (open) {
      setScrollPosition(window.scrollY)
    }
  }, [open])

  // Populate form when outline changes
  useEffect(() => {
    if (outline) {
      setOutlineTitle(outline.title || '')
    }
  }, [outline])

  const handleSubmit = async () => {
    if (!outlineTitle.trim()) {
      toast.error('Vui lòng nhập tiêu đề outline')
      return
    }

    if (!outline?.id) {
      toast.error('Không tìm thấy outline để cập nhật')
      return
    }

    try {
      await updateCourseOutline({
        id: outline.id,
        title: outlineTitle.trim(),
      }).unwrap()

      toast.success('Cập nhật outline thành công!')
      onOutlineUpdated()
    } catch (error) {
      toast.error(error?.data?.message || 'Có lỗi xảy ra khi cập nhật outline')
    }
  }

  const handleClose = () => {
    if (!isUpdating) {
      setOutlineTitle('')
      // Restore scroll position after modal closes
      setTimeout(() => {
        window.scrollTo(0, scrollPosition)
      }, 100)
      onClose()
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableRestoreFocus
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxWidth: 500,
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 3, pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600} color="primary.main">
            Chỉnh Sửa Outline
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            disabled={isUpdating}
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
            Cập nhật tiêu đề cho outline này.
          </Typography>

          <TextField
            autoFocus={false}
            label="Tiêu đề outline"
            fullWidth
            variant="outlined"
            value={outlineTitle}
            onChange={(e) => setOutlineTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isUpdating}
            placeholder="Ví dụ: Giới thiệu cơ bản"
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
        <Button onClick={handleClose} disabled={isUpdating} color="inherit" sx={{ borderRadius: 2 }}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isUpdating || !outlineTitle.trim() || outlineTitle.trim().length < 3}
          sx={{
            borderRadius: 2,
            minWidth: 100,
          }}
        >
          {isUpdating ? 'Đang cập nhật...' : 'Cập Nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditOutlineModal
