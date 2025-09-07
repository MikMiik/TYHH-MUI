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
  CircularProgress,
} from '@mui/material'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import Form from '../components/Form'
import TextInput from '../components/TextInput'
import AutocompleteField from '../components/AutocompleteField'
import ImageKitUploader from '../components/ImagekitAuth'
import BreadCrumbsPath from '@/components/BreadCrumbsPath'
import { useGetAllCitiesQuery } from '../features/api/cityApi'

import { useState } from 'react'
import { useCurrentUser } from '@/utils/useCurrentUser'
import { useGetOneProfileQuery, useUpdateProfileMutation } from '@/features/api/profileApi'
import profileSchema from '@/schemas/profileSchema'
import { toast } from 'react-toastify'

const Profile = () => {
  const currentUser = useCurrentUser()

  const [changePassword, setChangePassword] = useState(false)

  const {
    data: cities = [],
    isLoading: loading,
    error: citiesError,
  } = useGetAllCitiesQuery({ refetchOnMountOrArgChange: true })
  const { data: profile, error: profileError, isLoading: profileLoading } = useGetOneProfileQuery(currentUser.id)
  const [updateProfile] = useUpdateProfileMutation()

  if (citiesError) {
    console.error('Lỗi khi tải danh sách tỉnh thành:', citiesError)
  }

  if (profileError) {
    console.error('Lỗi khi tải thông tin người dùng:', profileError)
  }

  if (profileLoading) {
    return
  }

  const handleSubmit = async (data) => {
    const userId = profile.id
    const res = await updateProfile({ userId, data }).unwrap()
    if (res.success) {
      toast.success('Cập nhật thông tin thành công!')
    } else {
      toast.error('Cập nhật thông tin thất bại!')
    }
  }

  return (
    <Container>
      <Box my={2}>
        <BreadCrumbsPath />
        <Typography mt={4} variant="subtitle1" color="text.secondary" fontWeight={500}>
          Thông tin cá nhân
        </Typography>
        <Box maxWidth={800} mx="auto">
          <ImageKitUploader
            onUploadSuccess={() => {
              toast.success('Avatar đã được cập nhật thành công!')
            }}
            onUploadError={() => {
              toast.error('Có lỗi xảy ra khi tải lên avatar')
            }}
          >
            {({ uploadFile, isUploading, progress, error }) => (
              <Stack flexDirection="column" alignItems="center" mb={6}>
                <Box position="relative" display="inline-block">
                  <Avatar
                    src={profile.avatar}
                    sx={{ width: 120, height: 120, bgcolor: 'tertiary.main', fontSize: 40, fontWeight: 600 }}
                  ></Avatar>
                  <IconButton
                    size="small"
                    component="label"
                    sx={{ position: 'absolute', right: 8, top: 8, bgcolor: '#fff', boxShadow: 1 }}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <CircularProgress color="secondary" size={16} />
                    ) : (
                      <PhotoCameraIcon fontSize="small" />
                    )}
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files[0]
                        if (file) {
                          uploadFile(file, {
                            fileName: `avatar_${Date.now()}.${file.name.split('.').pop()}`,
                            folder: '/avatars',
                            tags: ['avatar', 'profile'],
                          })
                        }
                      }}
                    />
                  </IconButton>
                </Box>
                {isUploading && (
                  <Box mt={2} width="100%" maxWidth={200}>
                    <Typography variant="caption" color="text.secondary">
                      Đang tải lên... {Math.round(progress)}%
                    </Typography>
                    <Box
                      sx={{
                        width: '100%',
                        height: 4,
                        bgcolor: 'grey.300',
                        borderRadius: 2,
                        overflow: 'hidden',
                        mt: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: `${progress}%`,
                          height: '100%',
                          bgcolor: 'secondary.main',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </Box>
                  </Box>
                )}
                {error && (
                  <Typography variant="caption" color="error" mt={1}>
                    {error}
                  </Typography>
                )}
              </Stack>
            )}
          </ImageKitUploader>
          <Form schema={profileSchema(changePassword)} defaultValues={profile} onSubmit={handleSubmit}>
            <Box
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
              <Stack flexDirection="column" spacing={4}>
                <TextInput size="small" name="username" label="Tài khoản" required fullWidth />
                <TextInput size="small" name="email" label="Thư điện tử" required fullWidth />
                <TextInput size="small" name="name" label="Họ và tên" required fullWidth />
                <TextInput size="small" name="phone" label="Số điện thoại" required fullWidth />
                <TextInput size="small" name="facebook" label="Link Facebook" fullWidth />
                <TextInput size="small" name="yearOfBirth" label="Năm sinh" fullWidth />
                <AutocompleteField
                  name="city"
                  label="Tỉnh thành"
                  size="small"
                  fullWidth
                  options={cities}
                  getOptionLabel={(option) => option?.name || ''}
                  isOptionEqualToValue={(option, value) => option?.id === value?.id}
                  loading={loading}
                  noOptionsText="Không có tỉnh thành nào"
                  loadingText="Đang tải..."
                  valueAs="string"
                  valueKey="name"
                />
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
                    size="small"
                    name="oldPassword"
                    label="Mật khẩu cũ"
                    type="password"
                    required
                    fullWidth
                    placeholder="Mật khẩu cũ"
                    registerOptions={{ disabled: !changePassword }}
                  />
                  <TextInput
                    size="small"
                    name="newPassword"
                    label="Mật khẩu mới"
                    type="password"
                    required
                    fullWidth
                    placeholder="Mật khẩu mới"
                    registerOptions={{ disabled: !changePassword }}
                  />
                  <TextInput
                    size="small"
                    name="confirmPassword"
                    label="Nhập lại mật khẩu"
                    type="password"
                    required
                    fullWidth
                    placeholder="Nhập lại mật khẩu"
                    registerOptions={{ disabled: !changePassword }}
                  />
                </Stack>
              )}
            </Box>

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
