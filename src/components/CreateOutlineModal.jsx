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
import { useCreateCourseOutlineMutation } from '@/features/api/courseApi'
import { toast } from 'react-toastify'

const CreateOutlineModal = ({ open, onClose, onOutlineCreated, courseId }) => {
  const [outlineTitle, setOutlineTitle] = useState('')
  const [createCourseOutline, { isLoading: isCreating }] = useCreateCourseOutlineMutation()

  // Preserve scroll position
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    if (open) {
      setScrollPosition(window.scrollY)
    }
  }, [open])

  const handleSubmit = async () => {
    if (!outlineTitle.trim()) {
      toast.error('Vui lòng nhập tiêu đề outline')
      return
    }

    try {
      await createCourseOutline({
        title: outlineTitle.trim(),
        courseId: courseId,
      }).unwrap()

      toast.success('Tạo outline thành công!')
      setOutlineTitle('')
      onOutlineCreated()
    } catch (error) {
      toast.error(error?.data?.message || 'Có lỗi xảy ra khi tạo outline')
    }
  }

  const handleClose = () => {
    if (!isCreating) {
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
          <Typography variant="h6" fontWeight={600} color="primary.light">
            Tạo Outline Mới
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
            Nhập tiêu đề cho outline mới của khóa học này.
          </Typography>

          <TextField
            autoFocus={false}
            label="Tiêu đề outline"
            fullWidth
            variant="outlined"
            value={outlineTitle}
            onChange={(e) => setOutlineTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isCreating}
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
        <Button onClick={handleClose} disabled={isCreating} color="inherit" sx={{ borderRadius: 2 }}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isCreating || !outlineTitle.trim() || outlineTitle.trim().length < 3}
          sx={{
            borderRadius: 2,
            minWidth: 100,
          }}
        >
          {isCreating ? 'Đang tạo...' : 'Tạo Outline'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateOutlineModal
