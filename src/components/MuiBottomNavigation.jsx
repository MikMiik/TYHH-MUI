import * as React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import VideocamIcon from '@mui/icons-material/Videocam'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DescriptionIcon from '@mui/icons-material/Description'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import HouseIcon from '@mui/icons-material/House'
import { Box } from '@mui/material'
import config from '@/routes/config'

import Payment from './Payment'
import PaymentIcon from '@mui/icons-material/Payment'
import PopoverMenu from './PopoverMenu'

export default function MuiBottomNavigation() {
  const location = useLocation()
  const [hideNav, setHideNav] = React.useState(false)
  const [popoverAnchor, setPopoverAnchor] = React.useState(null)
  const [openModal, setOpenModal] = React.useState(false)
  const navigate = useNavigate()

  // Map pathname to navigation index
  const getNavValue = React.useCallback(() => {
    const { pathname } = location
    if (pathname === config.routes.home) return 0
    if (pathname === config.routes.courses) return 1
    if (pathname === config.routes.vipDocuments) return 2
    if (pathname === config.routes.documents) return 3
    if (pathname === config.routes.liveSchedule) return 4
    return -1
  }, [location])

  const value = getNavValue()

  const handleNav = (event, newValue) => {
    switch (newValue) {
      case 0:
        navigate(config.routes.home)
        break
      case 1:
        navigate(config.routes.courses)
        break
      case 2:
        navigate(config.routes.vipDocuments)
        break
      case 3:
        navigate(config.routes.documents)
        break
      case 4:
        navigate(config.routes.liveSchedule)
        break
      case 5:
        setOpenModal(true)
        break
      case 6:
        setPopoverAnchor(event.currentTarget)
        break
      default:
        break
    }
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
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 15,
          background: (theme) => theme.vars.palette.background.light,
        }}
        elevation={3}
      >
        <BottomNavigation showLabels value={value} onChange={handleNav}>
          <BottomNavigationAction label="Trang chủ" icon={<HouseIcon />} />
          <BottomNavigationAction label="Học online" icon={<VideocamIcon />} />
          <BottomNavigationAction label="Tài liệu VIP" icon={<DescriptionIcon />} />
          <BottomNavigationAction label="Tài liệu" icon={<DescriptionIcon />} />
          <BottomNavigationAction label="Lịch Live" icon={<CalendarMonthIcon />} />
          <BottomNavigationAction label="Thanh toán" icon={<PaymentIcon />} />
          <BottomNavigationAction label="Xem thêm" icon={<MoreHorizIcon />} />
        </BottomNavigation>
      </Box>

      {/* Popover menu + Payment modal */}
      <PopoverMenu anchorEl={popoverAnchor} open={Boolean(popoverAnchor)} onClose={() => setPopoverAnchor(null)} />
      {openModal && <Payment open={openModal} onClose={() => setOpenModal(false)} />}
    </>
  )
}
