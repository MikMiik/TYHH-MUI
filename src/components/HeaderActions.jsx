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
import { useTheme } from '@mui/material/styles'
import KeyIcon from '@mui/icons-material/Key'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import LoginIcon from '@mui/icons-material/Login'

import { Link, useNavigate } from 'react-router-dom'
import config from '@/routes/config'
import useResponsive from '@/hooks/useResponsive'
import DropAvatar from './DropAvatar'
import NotiDrop from './NotiDrop'
import ThemeToggle from './ThemeToggle'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import authService from '@/services/authService'
import { useDispatch } from 'react-redux'
import { removeCurrentUser } from '@/features/auth/authSlice'
import { useState } from 'react'

function HeaderActions() {
  const theme = useTheme()
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
                    backgroundColor: theme.palette.warning.main,
                    color: theme.palette.text.inverse,
                    '&:hover': {
                      backgroundColor: theme.palette.warning.dark,
                    },
                  }}
                  onClick={() => setOpenActivate(true)}
                >
                  Kích hoạt VIP
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
            <ThemeToggle />
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
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.text.inverse,
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.light,
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
                  backgroundColor: theme.palette.error.main,
                  color: theme.palette.text.inverse,
                  '&:hover': {
                    backgroundColor: theme.palette.error.light,
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
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.text.inverse,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
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
                  backgroundColor: theme.palette.warning.main,
                  color: theme.palette.text.inverse,
                  '&:hover': {
                    backgroundColor: theme.palette.warning.dark,
                  },
                }}
                onClick={() => setOpenActivate(true)}
              >
                <KeyIcon fontSize="small" />
              </IconButton>
            )}
            {isLaptop && currentUser?.activeKey && (
              <IconButton
                sx={{
                  backgroundColor: (theme) => theme.palette.tertiary?.main || theme.palette.primary.main,
                  color: (theme) => theme.palette.text.inverse,
                  height: 34,
                  width: 34,
                  minWidth: 0,
                  padding: 0,
                  m: 0,
                }}
                aria-label="VIP"
                disableRipple
              >
                <span style={{ fontWeight: 700, fontSize: 12 }}>V</span>
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
                <ThemeToggle />
                <DropAvatar bgcolor="tertiary.main" width={32} height={32} />
                <NotiDrop />
                <IconButton
                  onClick={handleLogout}
                  component={Link}
                  to={config.routes.login}
                  sx={{
                    backgroundColor: theme.palette.error.main,
                    color: theme.palette.text.inverse,
                    '&:hover': {
                      backgroundColor: theme.palette.error.light,
                    },
                  }}
                >
                  <ExitToAppIcon fontSize="small" />
                </IconButton>
              </Stack>
            ) : (
              <>
                <ThemeToggle />
                <IconButton
                  component={Link}
                  to={config.routes.register}
                  sx={{
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.text.inverse,
                    '&:hover': {
                      backgroundColor: theme.palette.secondary.light,
                    },
                  }}
                >
                  <PersonAddAltIcon fontSize="small" />
                </IconButton>
                <IconButton
                  component={Link}
                  to={config.routes.login}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.text.inverse,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.light,
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
