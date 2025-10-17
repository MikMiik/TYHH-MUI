import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box, Stack, Paper } from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  itemName = '',
  loading = false,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableRestoreFocus
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
          },
        },
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: 'error.light',
              color: 'error.main',
            }}
          >
            <WarningAmberIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {title || 'Xác nhận xóa'}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" color="text.secondary" mb={2}>
          {message || 'Bạn có chắc chắn muốn xóa item này?'}
        </Typography>

        {itemName && (
          <Paper
            sx={{
              p: 2,
              borderRadius: 1,
            }}
            elevation={3}
          >
            <Typography variant="body2" color="text.primary" gutterBottom>
              Tên khóa học:
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              {itemName}
            </Typography>
          </Paper>
        )}

        <Typography variant="body2" color="error.main" mt={2}>
          <strong>Lưu ý:</strong> Hành động này không thể hoàn tác.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Stack direction="row" spacing={2} width="100%">
          <Button
            variant="outlined"
            onClick={onClose}
            fullWidth
            disabled={loading}
            sx={{
              borderRadius: 2,
              py: 1.5,
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onConfirm}
            fullWidth
            disabled={loading}
            sx={{
              borderRadius: 2,
              py: 1.5,
            }}
          >
            {loading ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
