import {
  Button,
  Chip,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material'
import KeyIcon from '@mui/icons-material/Key'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import LoginIcon from '@mui/icons-material/Login'

import { Link, useNavigate } from 'react-router-dom'
import config from '@/routes/config'
import useResponsive from '@/hooks/useResponsive'
import DropAvatar from './DropAvatar'
import NotiDrop from './NotiDrop'
import { useCurrentUser } from '@/utils/useCurrentUser'
import authService from '@/services/authService'
import { useDispatch } from 'react-redux'
import { removeCurrentUser } from '@/features/auth/authSlice'
import { useState } from 'react'

function HeaderActions() {
  const { isDesktop, isLaptop } = useResponsive()
  const [openActivate, setOpenActivate] = useState(false)
  const [keyValue, setKeyValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const dispatch = useDispatch()
  const currentUser = useCurrentUser()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      dispatch(removeCurrentUser())
      await authService.logout()
      navigate('/')
    } catch (error) {
      // Even if logout API fails, user is logged out from frontend
      console.error('Logout error:', error)
      navigate('/')
    }
  }

  const handleActivate = async () => {
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')
    try {
      const res = await authService.checkKey(keyValue)
      // res.data: { success, message, activeKey }
      if (res?.data?.activeKey) {
        setSuccessMsg(res.data.message || 'Kích hoạt thẻ thành công!')
        setErrorMsg('')
        setTimeout(() => {
          setOpenActivate(false)
          setSuccessMsg('')
          window.location.reload()
        }, 1500)
      } else {
        setErrorMsg(res?.data?.message || 'Mã kích hoạt không hợp lệ hoặc đã được sử dụng.')
        setSuccessMsg('')
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Kích hoạt thất bại')
    }
    setLoading(false)
  }

  if (isDesktop || isLaptop) {
    return (
      <>
        {isDesktop ? (
          <Stack
            sx={{
              '& .MuiButtonBase-root': {
                fontSize: '0.875rem',
                '& .MuiButton-icon': {
                  fontWeight: '100',
                  margin: '0 4px 0 0',
                },
              },
            }}
            direction="row"
            spacing={2}
          >
            {!currentUser?.activeKey ? (
              <>
                <Button
                  disableElevation
                  startIcon={<KeyIcon />}
                  sx={{
                    backgroundColor: '#ec971f',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#e08e0b',
                    },
                  }}
                  onClick={() => setOpenActivate(true)}
                >
                  Kích hoạt thẻ
                </Button>
                <Dialog open={openActivate} onClose={() => setOpenActivate(false)}>
                  <DialogTitle>Kích hoạt thẻ VIP</DialogTitle>
                  <DialogContent>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="Nhập mã kích hoạt"
                      fullWidth
                      value={keyValue}
                      onChange={(e) => setKeyValue(e.target.value)}
                      disabled={loading}
                    />
                    {errorMsg && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        {errorMsg}
                      </Alert>
                    )}
                    {successMsg && (
                      <Alert severity="success" sx={{ mt: 2 }}>
                        {successMsg}
                      </Alert>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setOpenActivate(false)} disabled={loading}>
                      Đóng
                    </Button>
                    <Button
                      onClick={handleActivate}
                      disabled={loading || !keyValue}
                      variant="contained"
                      color="primary"
                    >
                      {loading ? <CircularProgress size={20} /> : 'Xác nhận'}
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            ) : (
              <Chip label="VIP" color="tertiary" variant="contained" />
            )}
            {currentUser ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <DropAvatar bgcolor="tertiary.main" width={32} height={32} />
                <NotiDrop />
              </Stack>
            ) : (
              <Button
                component={Link}
                to={config.routes.register}
                disableElevation
                startIcon={<PersonAddAltIcon />}
                sx={{
                  backgroundColor: '#1890ff',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#40a9ff',
                  },
                }}
              >
                Đăng ký
              </Button>
            )}
            {currentUser ? (
              <Button
                onClick={handleLogout}
                disableElevation
                startIcon={<ExitToAppIcon />}
                sx={{
                  backgroundColor: '#ff4d4f',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#ff7875',
                  },
                }}
              >
                Đăng xuất
              </Button>
            ) : (
              <Button
                component={Link}
                to={config.routes.login}
                disableElevation
                startIcon={<LoginIcon />}
                sx={{
                  backgroundColor: '#1890ff',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#40a9ff',
                  },
                }}
              >
                Đăng nhập
              </Button>
            )}
          </Stack>
        ) : (
          <Stack
            sx={{
              '& .MuiButtonBase-root': {
                borderRadius: '100%',
                height: '34px',
                width: '34px',
                minWidth: '0',
                padding: '0',
              },
            }}
            direction="row"
            spacing={2}
          >
            {!currentUser?.activeKey && (
              <IconButton
                sx={{
                  backgroundColor: '#ec971f',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#e08e0b',
                  },
                }}
                onClick={() => setOpenActivate(true)}
              >
                <KeyIcon fontSize="small" />
              </IconButton>
            )}
            <Dialog open={openActivate} onClose={() => setOpenActivate(false)}>
              <DialogTitle>Kích hoạt thẻ VIP</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Nhập mã kích hoạt"
                  fullWidth
                  value={keyValue}
                  onChange={(e) => setKeyValue(e.target.value)}
                  disabled={loading}
                />
                {errorMsg && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {errorMsg}
                  </Alert>
                )}
                {successMsg && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    {successMsg}
                  </Alert>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenActivate(false)} disabled={loading}>
                  Đóng
                </Button>
                <Button onClick={handleActivate} disabled={loading || !keyValue} variant="contained" color="primary">
                  {loading ? <CircularProgress size={20} /> : 'Xác nhận'}
                </Button>
              </DialogActions>
            </Dialog>
            {currentUser ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <DropAvatar bgcolor="tertiary.main" width={32} height={32} />
                <NotificationsOutlinedIcon fontSize="medium" />
                <IconButton
                  onClick={handleLogout}
                  component={Link}
                  to={config.routes.login}
                  sx={{
                    backgroundColor: '#ff4d4f',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#ff7875',
                    },
                  }}
                >
                  <ExitToAppIcon fontSize="small" />
                </IconButton>
              </Stack>
            ) : (
              <>
                <IconButton
                  component={Link}
                  to={config.routes.register}
                  sx={{
                    backgroundColor: '#1890ff',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#40a9ff',
                    },
                  }}
                >
                  <PersonAddAltIcon fontSize="small" />
                </IconButton>
                <IconButton
                  component={Link}
                  to={config.routes.login}
                  sx={{
                    backgroundColor: '#1890ff',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#40a9ff',
                    },
                  }}
                >
                  <LoginIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </Stack>
        )}
      </>
    )
  }
}

export default HeaderActions
