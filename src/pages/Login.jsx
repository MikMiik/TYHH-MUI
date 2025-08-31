import { useNavigate, useSearchParams, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import loginSchema from '@/schemas/loginSchema'
import config from '@/routes/config'
import { getCurrentUser } from '@/features/auth/authAsync'
import authService from '@/services/authService'
import { Box, Button, Container, Typography, Divider, Stack, InputAdornment } from '@mui/material'
import LogoIcon from '@/components/LogoIcon'
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined'
import PasswordIcon from '@mui/icons-material/Password'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import Form from '@/components/Form'
import TextInput from '@/components/TextInput'
import MuiLink from '@/components/MuiLink'

function Login() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.auth.currentUser)

  if (currentUser) {
    return <Navigate to={params.get('continue') || config.routes.home} />
  }

  const onSubmit = async (data) => {
    try {
      const res = await authService.login(data)
      localStorage.setItem('token', res.data.access_token)
      localStorage.setItem('refresh_token', res.data.refresh_token)
      dispatch(getCurrentUser())
      navigate(params.get('continue') || config.routes.home)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 3,
        }}
      >
        <Form
          schema={loginSchema}
          defaultValues={{
            email: '',
            password: '',
          }}
          onSubmit={onSubmit}
        >
          <Typography variant="h6" fontWeight={700}>
            Đăng nhập vào tài khoản của bạn
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
            <Button
              sx={{
                mt: 2,
                padding: 1,
                boxShadow: '0 2px 0 rgba(0, 0, 0, .015)',
                border: '1px solid #d9d9d9',
                color: 'rgba(0, 0, 0, 0.65)',
                touchAction: 'manipulation',
                transition: 'all .3s cubic-bezier(.645,.045,.355,1)',
                '&:hover': {
                  background: '#fff',
                  color: 'secondary.light',
                  borderColor: 'secondary.light',
                },
              }}
              disableRipple
              fullWidth
              variant="outlined"
              startIcon={<LogoIcon mr={1} size={24} src="./src/assets/images/googleIcon.png" />}
            >
              <Typography>Đăng nhập bằng Google</Typography>
            </Button>
            <Divider
              sx={{
                fontSize: 14,
                '& .MuiDivider-wrapper': {
                  px: 3,
                },
              }}
            >
              OR
            </Divider>

            <TextInput
              name="email"
              placeholder="Tên TK/Email"
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
            <TextInput
              name="password"
              type="password"
              placeholder="Mật khẩu"
              fullWidth
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PasswordIcon sx={{ fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <VisibilityOffIcon sx={{ fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            ></TextInput>

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
            >
              ĐĂNG NHẬP
            </Button>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
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
              <MuiLink to={config.routes.register}>Đăng ký</MuiLink>
              <MuiLink to="">Quên mật khẩu?</MuiLink>
            </Box>
          </Stack>
        </Form>
      </Box>
    </Container>
  )
}

export default Login
