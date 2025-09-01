import { useSearchParams } from 'react-router-dom'
import authService from '@/services/authService'
import config from '@/routes/config'
import { Box, Button, Container, Typography, Stack } from '@mui/material'
import Form from '@/components/Form'
import TextInput from '@/components/TextInput'
import MuiLink from '@/components/MuiLink'
import { useState, useEffect } from 'react'

import resetPasswordSchema from '@/schemas/resetPasswordSchema'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const [isTokenValid, setIsTokenValid] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const token = searchParams.get('token')

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await authService.verifyResetToken(token)
        if (res.success) {
          setIsTokenValid(true)
        } else {
          setIsTokenValid(false)
        }
      } catch (error) {
        console.error(error)
        setIsTokenValid(null)
      }
    }

    if (token) {
      verifyToken()
    } else {
      setIsTokenValid(false)
    }
  }, [token])

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      await authService.resetPassword(data, token)
      setIsSuccess(true)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isTokenValid === null) {
    return (
      <Container>
        <Box mx="auto" maxWidth={500} textAlign="center" my={5}>
          <Typography variant="h6" fontWeight={700}>
            Đang xác thực...
          </Typography>
        </Box>
      </Container>
    )
  }

  if (isTokenValid === false) {
    return (
      <Container>
        <Box mx="auto" maxWidth={500} textAlign="center" my={5}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Liên kết không hợp lệ
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Liên kết đặt lại mật khẩu đã hết hạn hoặc không hợp lệ.
          </Typography>
          <MuiLink to={config.routes.forgotPassword}>
            <Button variant="contained" color="secondary" fullWidth>
              Yêu cầu liên kết mới
            </Button>
          </MuiLink>
        </Box>
      </Container>
    )
  }

  if (isSuccess) {
    return (
      <Container>
        <Box mx="auto" maxWidth={500} textAlign="center" my={5}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Đặt lại mật khẩu thành công!
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập với mật khẩu mới.
          </Typography>
          <MuiLink to={config.routes.login}>
            <Button variant="contained" color="secondary" fullWidth>
              Đăng nhập ngay
            </Button>
          </MuiLink>
        </Box>
      </Container>
    )
  }

  return (
    <Container>
      <Box mx="auto" maxWidth={500} textAlign="center" my={5}>
        <Form
          schema={resetPasswordSchema}
          defaultValues={{
            password: '',
            confirmPassword: '',
          }}
          onSubmit={onSubmit}
        >
          <Typography variant="h6" fontWeight={700}>
            Đặt lại mật khẩu
          </Typography>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 3 }}>
            Nhập mật khẩu mới cho tài khoản của bạn
          </Typography>
          <Stack
            sx={{
              '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                transition: 'border-color .3s ease',
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'secondary.light',
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'secondary.light',
                boxShadow: '0 0 0 2px rgba(24, 144, 255, .2)',
                borderWidth: '1px',
                outline: '0',
              },
            }}
            spacing={2.5}
          >
            <TextInput
              name="password"
              type="password"
              placeholder="Mật khẩu mới"
              fullWidth
              size="small"
              autoComplete="new-password"
            />

            <TextInput
              name="confirmPassword"
              type="password"
              placeholder="Xác nhận mật khẩu"
              fullWidth
              size="small"
              autoComplete="new-password"
            />

            <Button
              disableElevation
              color="secondary"
              sx={{
                padding: 1,
                transition: 'all .3s cubic-bezier(.645,.045,.355,1)',
                '&:hover': {
                  bgcolor: 'secondary.light',
                },
              }}
              fullWidth
              variant="contained"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'ĐANG CẬP NHẬT...' : 'ĐẶT LẠI MẬT KHẨU'}
            </Button>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: 14,
                color: 'secondary.dark',
                '& .MuiLink-root': {
                  transition: 'all 0.1s',
                  '&:hover': {
                    color: 'secondary.main',
                  },
                },
              }}
            >
              <MuiLink to={config.routes.login}>Quay về đăng nhập</MuiLink>
            </Box>
          </Stack>
        </Form>
      </Box>
    </Container>
  )
}

export default ResetPassword
