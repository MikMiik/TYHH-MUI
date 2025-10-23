import * as React from 'react'
import Popover from '@mui/material/Popover'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { useNavigate } from 'react-router-dom'
import config from '@/routes/config'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useUserRole } from '@/hooks/useUserRole'
import authService from '@/services/authService'
import { removeCurrentUser } from '@/features/auth/authSlice'

const menuItems = [
  { label: 'Đăng xuất', icon: <LogoutIcon />, action: 'logout' },
  { label: 'Thông tin cá nhân', icon: <PersonIcon />, route: '/profile' },
  { label: 'Khoá học của tôi', icon: <BookmarkIcon />, route: '/my-courses' },
  { label: 'Kích hoạt VIP', icon: <VpnKeyIcon />, action: 'activate' },
]

export default function PopoverMenu({ anchorEl, open, onClose, additionalItems = [], onPaymentClick }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useCurrentUser()
  const userRole = useUserRole()
  const isTeacher = userRole?.includes('teacher')

  const filteredMenuItems = React.useMemo(() => {
    // Start with base menu and remove activate if user already has an activeKey
    let items = menuItems.filter((item) => !(item.action === 'activate' && currentUser?.activeKey))
    // If user is a teacher, add the "Khóa học đã tạo" route if it's not already present
    if (isTeacher) {
      const exists = items.some((it) => it.route === '/created-courses')
      if (!exists) {
        items = [...items, { label: 'Khóa học đã tạo', icon: <CreateOutlinedIcon />, route: '/created-courses' }]
      }
    }
    return items
  }, [currentUser, isTeacher])
  const [openActivate, setOpenActivate] = useState(false)
  const [keyValue, setKeyValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleLogout = async () => {
    try {
      dispatch(removeCurrentUser())
      await authService.logout()
      onClose()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
      onClose()
      navigate('/')
    }
  }

  const handleActivate = async () => {
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')
    try {
      const res = await authService.checkKey(keyValue)
      if (res?.data?.activeKey) {
        setSuccessMsg(res.data.message || 'Kích hoạt khoá học thành công!')
        setErrorMsg('')
        setTimeout(() => {
          setOpenActivate(false)
          setSuccessMsg('')
          window.location.reload()
        }, 1200)
      } else {
        setErrorMsg(res?.data?.message || 'Mã kích hoạt không hợp lệ hoặc đã được sử dụng.')
        setSuccessMsg('')
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Kích hoạt thất bại')
    }
    setLoading(false)
  }

  const handleItemClick = (item) => {
    if (item.action === 'logout') {
      handleLogout()
      return
    }
    if (item.action === 'activate') {
      // open activation dialog
      setOpenActivate(true)
      onClose()
      return
    }
    if (item.action === 'payment') {
      // trigger payment modal
      if (onPaymentClick) {
        onPaymentClick()
      }
      onClose()
      return
    }
    if (item.route) {
      navigate(item.route)
      onClose()
    }
  }

  return (
    <>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: { minWidth: 220, p: 1, borderRadius: 2, background: (theme) => theme.vars.palette.background.light },
            elevation: 2,
          },
        }}
        disableScrollLock
      >
        <List disablePadding>
          {currentUser ? (
            <>
              {additionalItems.map((item) => (
                <ListItem
                  button
                  key={item.label}
                  onClick={() => handleItemClick(item)}
                  sx={{ color: 'primary.light', cursor: 'pointer' }}
                >
                  <ListItemIcon sx={{ color: 'primary.light', minWidth: 32 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} slotProps={{ primary: { fontWeight: 500 } }} />
                </ListItem>
              ))}
              {filteredMenuItems.map((item) => (
                <ListItem
                  button
                  key={item.label}
                  onClick={() => handleItemClick(item)}
                  sx={{ color: 'primary.light', cursor: 'pointer' }}
                >
                  <ListItemIcon sx={{ color: 'primary.light', minWidth: 32 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} slotProps={{ primary: { fontWeight: 500 } }} />
                </ListItem>
              ))}
            </>
          ) : (
            <>
              <ListItem
                button
                onClick={() => {
                  navigate(config.routes.register)
                  onClose()
                }}
                sx={{ color: 'primary.light', cursor: 'pointer' }}
              >
                <ListItemText primary="Đăng ký" slotProps={{ primary: { fontWeight: 500 } }} />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  navigate(config.routes.login)
                  onClose()
                }}
                sx={{ color: 'primary.light', cursor: 'pointer' }}
              >
                <ListItemText primary="Đăng nhập" slotProps={{ primary: { fontWeight: 500 } }} />
              </ListItem>
            </>
          )}
        </List>
      </Popover>

      <Dialog open={openActivate} onClose={() => setOpenActivate(false)}>
        <DialogTitle>Kích hoạt khoá học</DialogTitle>
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
    </>
  )
}
