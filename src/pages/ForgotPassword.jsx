import authService from '@/services/authService'
import config from '@/routes/config'
import { Box, Button, Container, Typography, Stack } from '@mui/material'
import Form from '@/components/Form'
import TextInput from '@/components/TextInput'
import MuiLink from '@/components/MuiLink'
import { useState } from 'react'

import forgotPasswordSchema from '@/schemas/forgotPasswordSchema'

function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const res = await authService.sendForgotEmail(data)
      if (res.success) {
        setIsSubmitted(true)
      } else {
        setSubmitError('Failed to send email. Please try again.')
      }
    } catch {
      setSubmitError('Failed to send email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <Container>
        <Box mx="auto" maxWidth={500} textAlign="center" py={5}>
          <Typography color="info" variant="h6" fontWeight={700} mb={2}>
            Kiểm tra email của bạn
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.
          </Typography>
          <MuiLink to={config.routes.login}>
            <Button variant="contained" color="secondary" fullWidth>
              Quay về đăng nhập
            </Button>
          </MuiLink>
        </Box>
      </Container>
    )
  }

  return (
    <Container>
      <Box mx="auto" maxWidth={500} textAlign="center" py={5}>
        <Form
          schema={forgotPasswordSchema}
          defaultValues={{
            email: '',
          }}
          onSubmit={onSubmit}
        >
          <Typography variant="h6" fontWeight={700}>
            Quên mật khẩu?
          </Typography>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 3 }}>
            Nhập email của bạn và chúng tôi sẽ gửi đường dẫn đặt lại mật khẩu đến email của bạn.
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
            <TextInput name="email" placeholder="Email" fullWidth size="small" autoComplete="email" />
            {submitError && (
              <Typography variant="body2" color="error">
                {submitError}
              </Typography>
            )}
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
              {isLoading ? 'ĐANG GỬI...' : 'XÁC NHẬN'}
            </Button>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: 14,
                color: 'secondary.light',
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

export default ForgotPassword
