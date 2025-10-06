import { Box, CircularProgress, Typography, Alert, Stack, Button, Skeleton, Container } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

/**
 * Component xử lý các trạng thái loading, error và empty data
 * @param {boolean} isLoading - Trạng thái đang tải
 * @param {object} error - Object lỗi từ RTK Query
 * @param {boolean} hasData - Có dữ liệu hay không
 * @param {string} loadingText - Text hiển thị khi loading
 * @param {string} emptyText - Text hiển thị khi không có dữ liệu
 * @param {function} onRetry - Callback khi nhấn retry
 * @param {string} variant - Kiểu hiển thị: 'page', 'section', 'inline', 'skeleton'
 * @param {number} skeletonCount - Số lượng skeleton items
 * @param {string} skeletonType - Loại skeleton: 'text', 'card', 'list'
 * @param {ReactNode} children - Nội dung chính khi có dữ liệu
 */
function LoadingState({
  isLoading = false,
  error = null,
  hasData = true,
  loadingText = 'Đang tải dữ liệu...',
  emptyText = 'Không có dữ liệu để hiển thị',
  onRetry = null,
  variant = 'section', // 'page', 'section', 'inline', 'skeleton'
  skeletonCount = 3,
  skeletonType = 'text', // 'text', 'card', 'list'
  children,
  containerProps = {},
}) {
  // Skeleton Loading Components
  const renderSkeleton = () => {
    const skeletonItems = Array.from({ length: skeletonCount }, (_, index) => {
      switch (skeletonType) {
        case 'card':
          return (
            <Box key={index} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 2 }}>
              <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2 }} />
              <Skeleton variant="text" sx={{ fontSize: '1.2rem', mb: 1 }} />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
            </Box>
          )
        case 'list':
          return (
            <Stack
              key={index}
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}
            >
              <Skeleton variant="rectangular" width={80} height={80} sx={{ borderRadius: 1 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" sx={{ fontSize: '1.1rem', mb: 0.5 }} width="70%" />
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="text" width="40%" />
              </Box>
            </Stack>
          )
        default: // text
          return (
            <Stack key={index} spacing={1} sx={{ mb: 2 }}>
              <Skeleton variant="text" sx={{ fontSize: '1.2rem' }} width="60%" />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="40%" />
            </Stack>
          )
      }
    })

    return <Box sx={{ width: '100%', ...containerProps }}>{skeletonItems}</Box>
  }

  // Loading Component
  const renderLoading = () => {
    const content = (
      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{
          py: variant === 'inline' ? 2 : 4,
          minHeight: variant === 'page' ? '50vh' : 'auto',
        }}
      >
        <CircularProgress size={variant === 'inline' ? 24 : 40} thickness={4} sx={{ color: 'primary.main' }} />
        <Typography variant={variant === 'inline' ? 'body2' : 'body1'} color="text.secondary" sx={{ fontWeight: 500 }}>
          {loadingText}
        </Typography>
      </Stack>
    )

    if (variant === 'page') {
      return <Container maxWidth="lg">{content}</Container>
    }

    return <Box sx={{ width: '100%', ...containerProps }}>{content}</Box>
  }

  // Error Component
  const renderError = () => {
    const errorMessage = error?.message || error?.data?.message || 'Đã xảy ra lỗi khi tải dữ liệu'
    const isNetworkError = error?.status === 'FETCH_ERROR' || error?.name === 'NetworkError'

    const content = (
      <Stack
        alignItems="center"
        spacing={3}
        sx={{
          py: variant === 'inline' ? 2 : 4,
          minHeight: variant === 'page' ? '50vh' : 'auto',
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'error.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 40, color: 'error.main' }} />
        </Box>

        <Stack alignItems="center" spacing={1}>
          <Typography variant="h6" color="error.main" textAlign="center" fontWeight={600}>
            {isNetworkError ? 'Lỗi kết nối' : 'Lỗi tải dữ liệu'}
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 400 }}>
            {isNetworkError
              ? 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet của bạn.'
              : errorMessage}
          </Typography>
        </Stack>

        {onRetry && (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            sx={{
              borderRadius: 2,
              px: 3,
              '&:hover': {
                bgcolor: 'primary.light',
                color: 'white',
              },
            }}
          >
            Thử lại
          </Button>
        )}

        {!onRetry && (
          <Alert severity="error" sx={{ maxWidth: 500 }}>
            {errorMessage}
          </Alert>
        )}
      </Stack>
    )

    if (variant === 'page') {
      return <Container maxWidth="lg">{content}</Container>
    }

    return <Box sx={{ width: '100%', ...containerProps }}>{content}</Box>
  }

  // Empty State Component
  const renderEmpty = () => {
    const content = (
      <Stack
        alignItems="center"
        spacing={2}
        sx={{
          py: variant === 'inline' ? 2 : 4,
          minHeight: variant === 'page' ? '30vh' : 'auto',
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            bgcolor: 'grey.100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
          }}
        >
          <Typography variant="h4" color="text.disabled">
            📁
          </Typography>
        </Box>

        <Typography
          variant={variant === 'inline' ? 'body2' : 'body1'}
          color="text.secondary"
          textAlign="center"
          sx={{ fontWeight: 500 }}
        >
          {emptyText}
        </Typography>
      </Stack>
    )

    if (variant === 'page') {
      return <Container maxWidth="lg">{content}</Container>
    }

    return <Box sx={{ width: '100%', ...containerProps }}>{content}</Box>
  }

  // Render logic
  if (isLoading) {
    return variant === 'skeleton' ? renderSkeleton() : renderLoading()
  }

  if (error) {
    return renderError()
  }

  if (!hasData) {
    return renderEmpty()
  }

  return children
}

export default LoadingState
