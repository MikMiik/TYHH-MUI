import { Box, Button, Container, Typography, Stack, InputAdornment } from '@mui/material'
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined'
import config from '@/routes/config'
import Form from '@/components/Form'
import TextInput from '@/components/TextInput'
import MuiLink from '@/components/MuiLink'
import registerSchema from '@/schemas/registerSchema'
import authService from '@/services/authService'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Register() {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState(null)

  const onSubmit = async (data) => {
    try {
      const res = await authService.register(data)
      if (res.success) {
        navigate('/login', {
          replace: true,
          state: {
            message: 'Đăng kí thành công. Vui lòng kiểm tra email để xác thực tài khoản.',
          },
        })
      } else {
        setSubmitError(res.message || 'Đăng ký không thành công. Vui lòng thử lại sau.')
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Container>
      <Box mx="auto" maxWidth={500} textAlign="center" py={2}>
        <Form
          schema={registerSchema}
          defaultValues={{
            name: '',
            username: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
          }}
          onSubmit={onSubmit}
        >
          <Typography variant="h6" fontWeight={700}>
            Tạo tài khoản của bạn
          </Typography>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 3 }}>
            Học tập và giao lưu với hàng triệu học viên trên mọi miền đất nước
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
            {/* name */}
            <TextInput
              name="name"
              placeholder="Họ và tên"
              fullWidth
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PermIdentityOutlinedIcon sx={{ fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            ></TextInput>
            {/* username */}
            <TextInput
              name="username"
              placeholder="Tên tài khoản"
              fullWidth
              size="small"
              autoComplete="username"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PermIdentityOutlinedIcon sx={{ fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            ></TextInput>
            {/* email */}
            <TextInput
              name="email"
              placeholder="Email"
              fullWidth
              autoComplete="email"
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            ></TextInput>
            {/* phone */}
            <TextInput
              name="phone"
              placeholder="Số điện thoại"
              fullWidth
              autoComplete="tel"
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalPhoneOutlinedIcon sx={{ fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            ></TextInput>
            {/* passowrd */}
            <TextInput name="password" type="password" placeholder="Mật khẩu" fullWidth size="small"></TextInput>
            {/* confirm_password */}
            <TextInput
              name="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu"
              fullWidth
              size="small"
            ></TextInput>
          </Stack>
          {submitError && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {submitError}
            </Typography>
          )}
          <Button
            disableElevation
            color="secondary"
            sx={{
              p: 1,
              my: 2,
              transition: 'all .3s cubic-bezier(.645,.045,.355,1)',
              '&:hover': {
                bgcolor: 'secondary.light',
              },
            }}
            fullWidth
            variant="contained"
            type="submit"
          >
            ĐĂNG KÝ
          </Button>
          <Box
            sx={{
              textAlign: 'center',
              fontSize: 14,
              '& .MuiLink-root': {
                transition: 'all 0.1s',
                '&:hover': {
                  color: 'secondary.main',
                },
              },
            }}
          >
            <span>Đã có tài khoản.</span>
            <MuiLink color="secondary.light" to={config.routes.login}>
              {' '}
              Đăng nhập
            </MuiLink>
          </Box>
        </Form>
      </Box>
    </Container>
  )
}

export default Register
