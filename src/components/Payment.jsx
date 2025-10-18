import { Modal, IconButton, Fade, Backdrop, Typography, Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import LocalImageLazy from './LocalImageLazy'
function PaymentModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      disablePortal
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 300 } }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Fade in={open} timeout={300}>
        <Box
          sx={{
            position: 'relative',
            background: (theme) => theme.palette.background.default,
            boxShadow: 24,
            borderRadius: 2,
            outline: 'none',
            maxWidth: 600,
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            p: 3,
            // Custom scrollbar styling
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: (theme) => theme.palette.primary.main,
              borderRadius: '10px',
              '&:hover': {
                background: (theme) => theme.palette.primary.dark,
              },
            },
            // Firefox scrollbar
            scrollbarWidth: 'thin',
            scrollbarColor: (theme) =>
              `${theme.palette.primary.main} ${
                theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
              }`,
          }}
        >
          <IconButton
            color="primary"
            onClick={onClose}
            sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Box textAlign="center" pt={1}>
            <Typography variant="subtitle1" color="primary" fontWeight={700} mb={2}>
              THÔNG TIN CHUYỂN KHOẢN
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                '& img': {
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 1,
                },
              }}
            >
              <img src="transfer-info.jpg" />
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

export default PaymentModal
