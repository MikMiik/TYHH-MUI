import NavLink from '@/components/NavLink'
import config from '@/routes/config'
import { Box, Chip } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import React, { useState } from 'react'
import HeaderMenu from './HeaderMenu'
import useResponsive from '@/hooks/useResponsive'
import NotiDrop from './NotiDrop'
import ThemeToggle from './ThemeToggle'
import Payment from './Payment'
import { useCurrentUser } from '@/hooks/useCurrentUser'

function HeaderNavigation() {
  const theme = useTheme()
  const { isLaptop, isDesktop, isTablet, isMobile } = useResponsive()
  const [openModal, setOpenModal] = useState(false)
  const currentUser = useCurrentUser()
  return (
    <Box
      sx={{
        [theme.breakpoints.down('md')]: {
          position: 'absolute',
          right: 8,
          textWrap: 'nowrap',
        },
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1, sm: 2 },
        '& .MuiLink-root': {
          transition: 'all 0.1s',
          display: 'block',
          '&:hover': {
            color: theme.palette.tertiary.main,
          },
        },
      }}
    >
      {isMobile ? (
        <>
          <NotiDrop />
        </>
      ) : null}

      {isTablet ? (
        <>
          {currentUser?.activeKey && <Chip label="VIP" color="tertiary" variant="contained" />}
          <ThemeToggle />
          <NotiDrop />
        </>
      ) : null}

      <HeaderMenu />
      {isLaptop || isDesktop ? (
        <>
          <NavLink to={config.routes.home}>Trang chủ</NavLink>
          <NavLink to={config.routes.courses}>Học Online</NavLink>
          <NavLink to={config.routes.vipDocuments}>Tài liệu VIP</NavLink>
          <NavLink to={config.routes.documents}>Tài liệu</NavLink>
          <NavLink to={config.routes.liveSchedule}>Lịch Live</NavLink>
          <NavLink onClick={() => setOpenModal(true)}>Thanh toán</NavLink>
        </>
      ) : null}

      {/* Only render PaymentModal when needed */}
      {openModal && <Payment open={openModal} onClose={() => setOpenModal(false)} />}
    </Box>
  )
}

export default HeaderNavigation
