import NavLink from '@/components/NavLink'
import config from '@/routes/config'
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import React, { useState } from 'react'
import HeaderMenu from './HeaderMenu'
import useResponsive from '@/hooks/useResponsive'
import { Suspense } from 'react'
import NotiDrop from './NotiDrop'
import ThemeToggle from './ThemeToggle'
import Payment from './Payment'

function HeaderNavigation() {
  const theme = useTheme()
  const { isLaptop, isDesktop } = useResponsive()
  const [openModal, setOpenModal] = useState(false)
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
        gap: 2,
        '& .MuiLink-root': {
          transition: 'all 0.1s',
          display: 'block',
          '&:hover': {
            color: theme.palette.tertiary.main,
          },
        },
      }}
    >
      {!isLaptop && !isDesktop ? (
        <>
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
