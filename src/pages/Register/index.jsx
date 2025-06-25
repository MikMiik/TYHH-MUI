import { Form, TextInput } from '@/components/Forms'

import loginSchema from '@/schemas/loginSchema'
import { Box, Button, Container, Typography, Stack, InputAdornment } from '@mui/material'
import CustomLink from '@/components/CustomLink'
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined'
import PasswordIcon from '@mui/icons-material/Password'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined'
import config from '@/config'

function Register() {
  const onSubmit = async (data) => {
    try {
      console.log('send', data)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 3,
      }}
    >
      <Container disableGutters sx={{ textAlign: 'center', mx: 60 }}>
        <Form
          schema={loginSchema}
          defaultValues={{
            email: '',
            password: '',
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
            {/* confirm_password */}
            <TextInput
              name="password"
              type="password"
              placeholder="Nhập lại mật khẩu"
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
              ĐĂNG KÝ
            </Button>
            <Box
              sx={{
                textAlign: 'center',
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
              <span style={{ color: 'rgba(0, 0, 0, 0.65)' }}>Đã có tài khoản.</span>
              <CustomLink to={config.routes.login}> Đăng nhập</CustomLink>
            </Box>
          </Stack>
        </Form>
      </Container>
    </Box>
  )
}

export default Register
