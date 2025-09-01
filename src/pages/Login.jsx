import { useNavigate, useSearchParams, Navigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import loginSchema from '@/schemas/loginSchema'
import config from '@/routes/config'
import authService, { verifyEmailToken } from '@/services/authService'
import {
  Box,
  Button,
  Container,
  Typography,
  Divider,
  Stack,
  InputAdornment,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import LogoIcon from '@/components/LogoIcon'
import Form from '@/components/Form'
import TextInput from '@/components/TextInput'
import MuiLink from '@/components/MuiLink'
import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/features/auth/authSlice'

function Login() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const [isTokenValid, setIsTokenValid] = useState(null)
  const currentUser = useSelector((state) => state.auth.currentUser)
  const token = params.get('token')

  useEffect(() => {
    if (!token) return
    const verifyToken = async () => {
      try {
        const res = await verifyEmailToken(token)
        if (res.success) {
          setIsTokenValid(true)
          localStorage.setItem('token', res.data.accessToken)
          dispatch(getCurrentUser())
        } else {
          setIsTokenValid(false)
        }
      } catch (err) {
        console.error(err)
        setIsTokenValid(null)
      }
    }

    verifyToken()
  }, [token, dispatch])

  if ((currentUser && localStorage.getItem('token')) || isTokenValid === true) {
    return <Navigate to={params.get('continue') || '/'} />
  }

  const onSubmit = async (data) => {
    try {
      const res = await authService.login(data)
      localStorage.setItem('token', res.data.accessToken)
      localStorage.setItem('refreshToken', res.data.refreshToken)
      dispatch(getCurrentUser())
      navigate(params.get('continue') || config.routes.home)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Container>
      <Box mx="auto" maxWidth={500} textAlign="center" my={2}>
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
            <Typography color="success.light">{location.state?.message}</Typography>
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

            <TextInput name="email" placeholder="Email" fullWidth size="small" autoComplete="email"></TextInput>
            <TextInput
              name="password"
              type="password"
              placeholder="Mật khẩu"
              fullWidth
              size="small"
              autoComplete="current-password"
            ></TextInput>

            <FormControlLabel
              sx={{ '& .MuiButtonBase-root.MuiCheckbox-root': { p: 0, color: 'secondary.dark' } }}
              control={<Checkbox defaultChecked />}
              label="Remember me"
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
