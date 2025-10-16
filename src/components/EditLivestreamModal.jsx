import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Alert,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { useFormik } from 'formik'
import { updateLivestreamSchema } from '@/schemas/livestreamSchema'
import { useUpdateLivestreamMutation } from '@/features/api/livestreamApi'
import { toast } from 'react-toastify'

const EditLivestreamModal = ({ open, onClose, livestream }) => {
  const [updateLivestream, { isLoading, error }] = useUpdateLivestreamMutation()

  const formik = useFormik({
    initialValues: {
      title: livestream?.title || '',
      order: livestream?.order || '',
    },
    validationSchema: updateLivestreamSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const updateData = {
          id: livestream.id,
          title: values.title,
        }

        // Include order if provided (even if it's the same as current)
        if (values.order !== '' && values.order !== null && values.order !== undefined) {
          updateData.order = parseInt(values.order)
        }

        console.log('Updating livestream with data:', updateData)
        await updateLivestream(updateData).unwrap()
        toast.success('Cập nhật livestream thành công!')
        onClose()
      } catch (err) {
        console.error('Error updating livestream:', err)
        const errorMessage = err?.data?.message || 'Có lỗi xảy ra khi cập nhật livestream'
        toast.error(errorMessage)
      }
    },
  })

  const handleClose = () => {
    formik.resetForm()
    onClose()
  }

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
            Chỉnh sửa Livestream
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

      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ px: 3, pb: 2 }}>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Tiêu đề Livestream"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              variant="outlined"
              autoFocus
              disabled={isLoading}
            />

            <TextField
              fullWidth
              id="order"
              name="order"
              label="Thứ tự (tùy chọn)"
              type="number"
              value={formik.values.order}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.order && Boolean(formik.errors.order)}
              helperText={
                formik.touched.order && formik.errors.order ? formik.errors.order : 'Để trống để tự động sắp xếp'
              }
              variant="outlined"
              disabled={isLoading}
              inputProps={{
                min: 1,
                step: 1,
              }}
            />

            {/* Error Display */}
            {error && <Alert severity="error">{error?.data?.message || 'Có lỗi xảy ra khi cập nhật livestream'}</Alert>}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
          <Button onClick={handleClose} color="inherit" sx={{ borderRadius: 2 }} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2 }}
            disabled={isLoading || !formik.isValid}
          >
            {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditLivestreamModal
