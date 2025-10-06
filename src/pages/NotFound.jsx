import { Box, Container, Typography, Button, Stack, Paper } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SearchIcon from '@mui/icons-material/Search'

const NotFound = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            width: '100%',
            maxWidth: 600,
          }}
        >
          <Stack spacing={4} alignItems="center">
            {/* Error Code */}
            <Box>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '6rem', md: '8rem' },
                  fontWeight: 700,
                  color: 'primary.main',
                  lineHeight: 1,
                  mb: 1,
                }}
              >
                404
              </Typography>
              <Box
                sx={{
                  width: 100,
                  height: 4,
                  bgcolor: 'tertiary.main',
                  borderRadius: 2,
                  mx: 'auto',
                }}
              />
            </Box>

            {/* Error Message */}
            <Stack spacing={2} alignItems="center">
              <Typography
                variant="h4"
                fontWeight={600}
                color="text.primary"
                sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
              >
                Trang không tồn tại
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  maxWidth: 400,
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                }}
              >
                Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Vui lòng kiểm tra lại đường dẫn
                hoặc quay về trang chủ.
              </Typography>
            </Stack>

            {/* Illustration */}
            <Box
              sx={{
                fontSize: '4rem',
                color: 'grey.300',
                my: 2,
              }}
            >
              🔍📄
            </Box>

            {/* Action Buttons */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', maxWidth: 400 }}>
              <Button
                component={RouterLink}
                to="/"
                variant="contained"
                size="large"
                startIcon={<HomeIcon />}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  flex: 1,
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                Về trang chủ
              </Button>

              <Button
                onClick={handleGoBack}
                variant="outlined"
                size="large"
                startIcon={<ArrowBackIcon />}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  flex: 1,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    bgcolor: 'primary.light',
                    color: 'white',
                  },
                }}
              >
                Quay lại
              </Button>
            </Stack>

            {/* Popular Links */}
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                Hoặc bạn có thể truy cập:
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                justifyContent="center"
                alignItems="center"
                flexWrap="wrap"
              >
                <Button
                  component={RouterLink}
                  to="/courses"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  Khóa học
                </Button>
                <Typography color="text.disabled">•</Typography>
                <Button
                  component={RouterLink}
                  to="/document"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  Tài liệu
                </Button>
                <Typography color="text.disabled">•</Typography>
                <Button
                  component={RouterLink}
                  to="/liveschedule"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  Lịch livestream
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Container>
  )
}

export default NotFound
