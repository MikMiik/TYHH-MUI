import * as React from 'react'
import Popover from '@mui/material/Popover'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import DescriptionIcon from '@mui/icons-material/Description'
import { useNavigate } from 'react-router-dom'

const menuItems = [
  { label: 'Đăng xuất', icon: <LogoutIcon />, action: 'logout' },
  { label: 'Thông tin cá nhân', icon: <PersonIcon />, route: '/profile' },
  { label: 'Khoá học của tôi', icon: <BookmarkIcon />, route: '/my-courses' },
  { label: 'Thanh toán', icon: <AccountBalanceIcon />, route: '/payment' },
  { label: 'Kích hoạt khoá học', icon: <VpnKeyIcon />, route: '/activate' },
  { label: 'Tài liệu VIP', icon: <DescriptionIcon />, route: '/vip-documents' },
]

export default function PopoverMenu({ anchorEl, open, onClose }) {
  const navigate = useNavigate()

  const handleItemClick = (item) => {
    if (item.action === 'logout') {
      // TODO: Add logout logic
      onClose()
      return
    }
    if (item.route) {
      navigate(item.route)
      onClose()
    }
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      slotProps={{ paper: { sx: { minWidth: 220, p: 1, borderRadius: 2 }, elevation: 2 } }}
      disableScrollLock
    >
      <List disablePadding>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.label}
            onClick={() => handleItemClick(item)}
            sx={{ color: 'primary.dark', cursor: 'pointer' }}
          >
            <ListItemIcon sx={{ color: 'primary.dark', minWidth: 32 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} slotProps={{ primary: { fontWeight: 500 } }} />
          </ListItem>
        ))}
      </List>
    </Popover>
  )
}
