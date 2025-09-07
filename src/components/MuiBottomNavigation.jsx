import * as React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import VideocamIcon from '@mui/icons-material/Videocam'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DescriptionIcon from '@mui/icons-material/Description'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import HouseIcon from '@mui/icons-material/House'
import { Paper } from '@mui/material'
import config from '@/routes/config'

import PopoverMenu from './PopoverMenu'

export default function MuiBottomNavigation() {
  const location = useLocation()
  const [popoverAnchor, setPopoverAnchor] = React.useState(null)
  const [hideNav, setHideNav] = React.useState(false)
  const navigate = useNavigate()

  // Map pathname to navigation index
  const getNavValue = React.useCallback(() => {
    const { pathname } = location
    if (pathname === config.routes.home) return 0
    if (pathname === config.routes.topics) return 1
    if (pathname === config.routes.liveSchedule) return 2
    if (pathname === config.routes.documents) return 3
    return -1
  }, [location])

  const value = getNavValue()

  const handleNav = (event, newValue) => {
    switch (newValue) {
      case 0:
        navigate(config.routes.home)
        break
      case 1:
        navigate(config.routes.topics)
        break
      case 2:
        navigate(config.routes.liveSchedule)
        break
      case 3:
        navigate(config.routes.documents)
        break
      case 4:
        setPopoverAnchor(event.currentTarget)
        break
      default:
        break
    }
  }

  const handlePopoverClose = () => {
    setPopoverAnchor(null)
  }

  // Hide nav when scroll to bottom
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      // 10px threshold for floating point errors
      if (scrollY + windowHeight >= docHeight - 10) {
        setHideNav(true)
      } else {
        setHideNav(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (hideNav) return null

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 15 }} elevation={3}>
      <BottomNavigation showLabels value={value} onChange={handleNav}>
        <BottomNavigationAction label="Trang chủ" icon={<HouseIcon />} />
        <BottomNavigationAction label="Học online" icon={<VideocamIcon />} />
        <BottomNavigationAction label="Lịch Live" icon={<CalendarMonthIcon />} />
        <BottomNavigationAction label="Tài liệu" icon={<DescriptionIcon />} />
        <BottomNavigationAction label="Xem thêm" icon={<MoreHorizIcon />} />
      </BottomNavigation>
      <PopoverMenu anchorEl={popoverAnchor} open={Boolean(popoverAnchor)} onClose={handlePopoverClose} />
    </Paper>
  )
}
