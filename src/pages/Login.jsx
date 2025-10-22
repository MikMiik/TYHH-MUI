import { useNavigate, useSearchParams, Navigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import loginSchema from '@/schemas/loginSchema'
import config from '@/routes/config'
import authService from '@/services/authService'
import { Box, Button, Container, Typography, Divider, Stack, Checkbox, FormControlLabel } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import LogoIcon from '@/components/LogoIcon'
import Form from '@/components/Form'
import TextInput from '@/components/TextInput'
import MuiLink from '@/components/MuiLink'
import googleIcon from '@/assets/images/googleIcon.png'
import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/features/auth/authSlice'
import { useGoogleLogin } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID || ''

function Login() {
  const theme = useTheme()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const [isTokenValid, setIsTokenValid] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const currentUser = useSelector((state) => state.auth.currentUser)
  const token = params.get('token')
  const isGoogleLoginAvailable = !!GOOGLE_CLIENT_ID

  useEffect(() => {
    if (!token) return
    const verifyToken = async () => {
      try {
        const res = await authService.verifyEmailToken(token)
        if (res.success) {
          setIsTokenValid(true)
          // Cookies are set automatically by backend, no need to store in localStorage
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

  const handleLoginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const res = await authService.googleLogin(tokenResponse.access_token)
      if (res.success) {
        setSubmitError(null)
        dispatch(getCurrentUser())
        navigate(params.get('continue') || '/')
      } else {
        setSubmitError('Login with Google error')
      }
    },
    onError: () => setSubmitError('Login with Google error'),
  })

  if (currentUser || isTokenValid === true) {
    return <Navigate to={params.get('continue') || '/'} />
  }

  const onSubmit = async (data) => {
    try {
      const res = await authService.login(data)
      if (!res.success) {
        setSubmitError(res.message || 'Đăng nhập không thành công')
        return
      }
      // Cookies are set automatically by backend, no need to store in localStorage
      dispatch(getCurrentUser())
      navigate(params.get('continue') || config.routes.home)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Container>
      <Box mx="auto" maxWidth={500} textAlign="center" py={2}>
        <Form
          schema={loginSchema}
          defaultValues={{
            email: '',
            password: '',
            rememberMe: false,
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
            <Typography color="secondary.light">{location.state?.message}</Typography>
            {isGoogleLoginAvailable ? (
              <Button
                sx={{
                  mt: 2,
                  padding: 1,
                  boxShadow: '0 2px 0 rgba(0, 0, 0, .015)',
                  border: '1px solid #d9d9d9',
                  color: (theme) => theme.vars.palette.text.secondary,
                  touchAction: 'manipulation',
                  transition: 'all .3s cubic-bezier(.645,.045,.355,1)',
                  '&:hover': {
                    background: theme.palette.background.default,
                    color: 'secondary.light',
                    borderColor: 'secondary.light',
                  },
                }}
                onClick={handleLoginWithGoogle}
                disableRipple
                fullWidth
                variant="outlined"
                startIcon={<LogoIcon mr={1} size={24} src={googleIcon} />}
              >
                <Typography>Đăng nhập bằng Google</Typography>
              </Button>
            ) : (
              <Typography
                color="text.secondary"
                variant="body2"
                sx={{
                  mt: 2,
                  p: 2,
                  border: '1px dashed #d9d9d9',
                  borderRadius: 1,
                  bgcolor: 'action.hover',
                }}
              >
                Google login hiện không khả dụng
              </Typography>
            )}
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
              name="rememberMe"
              sx={{ '& .MuiButtonBase-root.MuiCheckbox-root': { p: 0, mr: 1, color: 'secondary.light' } }}
              control={<Checkbox defaultChecked />}
              label="Remember me"
            />

            {submitError && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
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
            >
              ĐĂNG NHẬP
            </Button>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
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
              <MuiLink to={config.routes.register}>Đăng ký</MuiLink>
              <MuiLink to={config.routes.forgotPassword}>Quên mật khẩu?</MuiLink>
            </Box>
          </Stack>
        </Form>
      </Box>
    </Container>
  )
}

export default Login
