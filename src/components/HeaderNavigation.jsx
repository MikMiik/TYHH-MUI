import NavLink from '@/components/NavLink'
import config from '@/routes/config'
import { Box } from '@mui/material'
import React, { useState } from 'react'
import HeaderMenu from './HeaderMenu'
import useResponsive from '@/hooks/useResponsive'
import theme from '@/theme/theme'
import PaymentModal from './PaymentModal'

function HeaderNavigation() {
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
            color: '#f56751',
          },
        },
      }}
    >
      <HeaderMenu />
      {isLaptop || isDesktop ? (
        <>
          <NavLink to={config.routes.home}>Trang chủ</NavLink>
          <NavLink to={config.routes.topics}>Học Online</NavLink>
          <NavLink to={config.routes.vipDocuments}>Tài liệu VIP</NavLink>
          <NavLink to={config.routes.documents}>Tài liệu</NavLink>
          <NavLink to={config.routes.liveSchedule}>Lịch Live</NavLink>
          <NavLink onClick={() => setOpenModal(true)}>Thanh toán</NavLink>
        </>
      ) : null}
      <PaymentModal open={openModal} onClose={() => setOpenModal(false)} />
    </Box>
  )
}

export default HeaderNavigation
