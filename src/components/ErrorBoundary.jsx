import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { Box, Button, Typography, Container } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Container>
      <Box
        mx="auto"
        maxWidth={500}
        textAlign="center"
        my={8}
        p={4}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h5" fontWeight={700} color="error.main" mb={1}>
          Đã xảy ra lỗi!
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          {error?.message || 'Có lỗi không xác định xảy ra. Vui lòng thử lại.'}
        </Typography>
        <Button variant="contained" color="secondary" onClick={resetErrorBoundary}>
          Thử lại
        </Button>
      </Box>
    </Container>
  )
}

export default function ErrorBoundary({ children }) {
  return <ReactErrorBoundary FallbackComponent={ErrorFallback}>{children}</ReactErrorBoundary>
}
