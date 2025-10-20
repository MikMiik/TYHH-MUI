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
import useResponsive from '@/hooks/useResponsive'

import Payment from './Payment'
import PaymentIcon from '@mui/icons-material/Payment'
import PopoverMenu from './PopoverMenu'

export default function MuiBottomNavigation() {
  const location = useLocation()
  const [hideNav, setHideNav] = React.useState(false)
  const [popoverAnchor, setPopoverAnchor] = React.useState(null)
  const [openModal, setOpenModal] = React.useState(false)
  const navigate = useNavigate()
  const { isMobile } = useResponsive()

  // Map pathname to navigation value (use explicit string values to avoid index-shifting bugs when
  // the number/order of actions change between mobile/desktop)
  const getNavValue = React.useCallback(() => {
    const { pathname } = location
    if (pathname === config.routes.home) return 'home'
    if (pathname === config.routes.courses) return 'courses'

    if (isMobile) {
      // Mobile: Trang chủ, Học online, Tài liệu, Xem thêm
      if (pathname === config.routes.documents) return 'documents'
      // vipDocuments and liveSchedule live in the "Xem thêm" popover on mobile
      if (pathname === config.routes.vipDocuments) return 'more'
      if (pathname === config.routes.liveSchedule) return 'more'
    } else {
      // Desktop: Trang chủ, Học online, Tài liệu VIP, Tài liệu, Lịch Live, Thanh toán, Xem thêm
      if (pathname === config.routes.vipDocuments) return 'vipDocuments'
      if (pathname === config.routes.documents) return 'documents'
      if (pathname === config.routes.liveSchedule) return 'liveSchedule'
    }

    return null
  }, [location, isMobile])

  const value = getNavValue()

  const handleNav = (event, newValue) => {
    // Use explicit string values for navigation so action identity doesn't depend on child index
    switch (newValue) {
      case 'home':
        navigate(config.routes.home)
        break
      case 'courses':
        navigate(config.routes.courses)
        break
      case 'documents':
        navigate(config.routes.documents)
        break
      case 'vipDocuments':
        navigate(config.routes.vipDocuments)
        break
      case 'liveSchedule':
        navigate(config.routes.liveSchedule)
        break
      case 'payment':
        setOpenModal(true)
        break
      case 'more':
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

  // Additional menu items for mobile (Tài liệu VIP, Lịch Live, Thanh toán)
  const mobileAdditionalItems = isMobile
    ? [
        { label: 'Tài liệu VIP', icon: <DescriptionIcon />, route: config.routes.vipDocuments },
        { label: 'Lịch Live', icon: <CalendarMonthIcon />, route: config.routes.liveSchedule },
        { label: 'Thanh toán', icon: <PaymentIcon />, action: 'payment' },
      ]
    : []

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
          <BottomNavigationAction value="home" label="Trang chủ" icon={<HouseIcon />} />
          <BottomNavigationAction value="courses" label="Học online" icon={<VideocamIcon />} />
          {!isMobile && <BottomNavigationAction value="vipDocuments" label="Tài liệu VIP" icon={<DescriptionIcon />} />}
          <BottomNavigationAction value="documents" label="Tài liệu" icon={<DescriptionIcon />} />
          {!isMobile && <BottomNavigationAction value="liveSchedule" label="Lịch Live" icon={<CalendarMonthIcon />} />}
          {!isMobile && <BottomNavigationAction value="payment" label="Thanh toán" icon={<PaymentIcon />} />}
          <BottomNavigationAction value="more" label="Xem thêm" icon={<MoreHorizIcon />} />
        </BottomNavigation>
      </Box>

      {/* Popover menu + Payment modal */}
      <PopoverMenu
        anchorEl={popoverAnchor}
        open={Boolean(popoverAnchor)}
        onClose={() => setPopoverAnchor(null)}
        additionalItems={mobileAdditionalItems}
        onPaymentClick={() => setOpenModal(true)}
      />
      {openModal && <Payment open={openModal} onClose={() => setOpenModal(false)} />}
    </>
  )
}
