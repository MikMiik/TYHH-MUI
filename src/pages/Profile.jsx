import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  Container,
  Stack,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import Form from '../components/Form'
import TextInput from '../components/TextInput'
import BreadCrumbsPath from '@/components/BreadCrumbsPath'

const defaultValues = {
  username: 'minhthnd123',
  email: 'minh0936532430@gmail.com',
  fullName: 'Phạm Văn Minh',
  phone: '0936532430',
  facebook: 'https://www.facebook.com/profile.php?id=100076426977250',
  birthYear: '2006',
  city: 'Hải Phòng',
  school: 'THPT Lý Thường Kiệt',
}

import { useState } from 'react'

const Profile = () => {
  const [changePassword, setChangePassword] = useState(false)
  const handleSubmit = (data) => {
    // Xử lý submit
    console.log(data)
  }

  return (
    <Container>
      <Box mt={2}>
        <BreadCrumbsPath />
        <Typography mt={4} variant="subtitle1" color="text.secondary" fontWeight={500}>
          Thông tin cá nhân
        </Typography>
        <Box maxWidth={800} mx="auto">
          <Stack flexDirection="column" alignItems="center" mb={6}>
            <Box position="relative" display="inline-block">
              <Avatar
                sx={{ width: 120, height: 120, bgcolor: 'tertiary.main', fontSize: 40, fontWeight: 600 }}
              ></Avatar>
              <IconButton size="small" sx={{ position: 'absolute', right: 8, top: 8, bgcolor: '#fff', boxShadow: 1 }}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
          </Stack>
          <Form defaultValues={defaultValues} onSubmit={handleSubmit}>
            <Stack
              flexDirection="column"
              spacing={4}
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
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'secondary.main', // màu khi focus
                },
                '& .MuiInputLabel-root.MuiFormLabel-filled': {
                  color: 'secondary.main', // màu khi đã có value (label nằm trên)
                },
              }}
            >
              <TextInput size="small" name="username" label="Tài khoản" required fullWidth />
              <TextInput size="small" name="email" label="Thư điện tử" required fullWidth />
              <TextInput size="small" name="fullName" label="Họ và tên" required fullWidth />
              <TextInput size="small" name="phone" label="Số điện thoại" required fullWidth />
              <TextInput size="small" name="facebook" label="Link Facebook" fullWidth />
              <TextInput size="small" name="birthYear" label="Năm sinh" fullWidth />
              <TextInput size="small" name="city" label="Tỉnh thành" fullWidth />
              <TextInput size="small" name="school" label="Trường học" required fullWidth />
            </Stack>
            <Box my={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={changePassword}
                    onChange={(e) => setChangePassword(e.target.checked)}
                    color="secondary"
                  />
                }
                label={
                  <Typography fontWeight={500} color="text.main" fontSize={16}>
                    Thay đổi mật khẩu
                  </Typography>
                }
              />
            </Box>
            {changePassword && (
              <Stack flexDirection="column" spacing={3} mb={2}>
                <TextInput
                  name="oldPassword"
                  label="Mật khẩu cũ"
                  type="password"
                  required
                  fullWidth
                  placeholder="Mật khẩu cũ"
                />
                <TextInput
                  name="newPassword"
                  label="Mật khẩu mới"
                  type="password"
                  required
                  fullWidth
                  placeholder="Mật khẩu mới"
                />
                <TextInput
                  name="confirmPassword"
                  label="Nhập lại mật khẩu"
                  type="password"
                  required
                  fullWidth
                  placeholder="Nhập lại mật khẩu"
                />
              </Stack>
            )}
            <Box mt={3} display="flex" alignItems="center">
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ bgcolor: 'secondary.dark', fontWeight: 600, fontSize: 18 }}
              >
                Lưu
              </Button>
            </Box>
          </Form>
        </Box>
      </Box>
    </Container>
  )
}

export default Profile
