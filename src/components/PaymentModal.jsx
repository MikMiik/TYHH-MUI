import { Modal, Box as MuiBox, IconButton, Fade, Backdrop, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ImageLazy from './ImageLazy'
function PaymentModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 300 } }}
      sx={{
        overflowY: 'auto',
      }}
    >
      <Fade in={open} timeout={300}>
        <MuiBox
          transition={{ duration: 0.3 }}
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 1,
            outline: 'none',
          }}
        >
          <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }} aria-label="close">
            <CloseIcon />
          </IconButton>
          <MuiBox textAlign="center" mt={2}>
            <Typography variant="h6" color="primary" fontWeight={700} mb={2}>
              THÔNG TIN CHUYỂN KHOẢN
            </Typography>
            <ImageLazy src="transfer-info.jpg" w="100%" />
          </MuiBox>
        </MuiBox>
      </Fade>
    </Modal>
  )
}

export default PaymentModal
