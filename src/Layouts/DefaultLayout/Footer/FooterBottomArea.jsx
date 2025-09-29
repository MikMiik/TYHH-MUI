import LogoIcon from '@/components/LogoIcon'
import fbIcon from '@/assets/images/fbIcon.png'
import youtubeIcon from '@/assets/images/youtubeIcon.png'
import tiktokIcon from '@/assets/images/tiktokIcon.png'

import { Box, Button, Stack, Typography, Link } from '@mui/material'
import Form from '@/components/Form'
import TextInput from '@/components/TextInput'

function FooterBottomArea() {
  const onSubmit = async (data) => {
    try {
      console.log('send', data)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Stack
      direction={{
        md: 'row',
        xs: 'column',
      }}
      sx={{ color: 'white' }}
      justifyContent="space-between"
      flexWrap="wrap"
      spacing={2}
      minWidth={{
        xs: '100%',
        sm: '540px',
        md: '880px',
        lg: '1140px',
      }}
    >
      <Box>
        <Form
          defaultValues={{
            email: '',
          }}
          onSubmit={onSubmit}
        >
          <Typography sx={{ mb: 0.4 }}>ĐĂNG KÍ NHẬN BẢN TIN</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextInput
              sx={{
                flex: 1,
                '& .MuiInputBase-input  ': {
                  border: 'none',
                  color: 'white',
                  fontSize: 14,
                  height: '35px',
                  minWidth: '230px',
                  outline: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '2px 10px',
                  '::placeholder  ': {
                    opacity: 1,
                  },
                },
                '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                  outline: 'none',
                },
              }}
              name="email"
              placeholder="Nhập địa chỉ email của bạn"
              fullWidth
              size="small"
            ></TextInput>
            <Button
              sx={{
                ml: 1.4,
                height: '38px',
                p: 1,
                bgcolor: 'secondary.main',
                borderRadius: 0,
                color: 'white',
              }}
            >
              Gửi
            </Button>
          </Box>
        </Form>
      </Box>

      <Stack direction="column" justifyContent="center" alignItems="center">
        <Typography sx={{ mb: 1 }}>© Bản quyền thuộc về (Tyhh.net) | Cung cấp bởi</Typography>
        <Link href="https://www.facebook.com/hoan.phi.79" target="_blank">
          K62CL4TEAM
        </Link>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
        <Link href="https://www.facebook.com/hoctothoahoc" target="_blank">
          <LogoIcon color="white" size={30} src={fbIcon} />
        </Link>
        <Link href="https://www.youtube.com/channel/UCAddta3aiDh6u9B4xCh3w7g" target="_blank">
          <LogoIcon color="white" size={30} src={youtubeIcon} />
        </Link>
        <Link href="https://www.tiktok.com/discover/t%C3%B4i-y%C3%AAu-h%C3%B3a-h%E1%BB%8Dc" target="_blank">
          <LogoIcon color="white" size={32} src={tiktokIcon} />
        </Link>
      </Stack>
    </Stack>
  )
}

export default FooterBottomArea
