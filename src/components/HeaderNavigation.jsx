import NavLink from '@/components/NavLink'
import config from '@/routes/config'
import { Box } from '@mui/material'
import HeaderMenu from './HeaderMenu'
import useResponsive from '@/hooks/useResponsive'
import theme from '@/theme'

function HeaderNavigation() {
  const { isLaptop, isDesktop } = useResponsive()
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        [theme.breakpoints.down('md')]: {
          position: 'absolute',
          right: 8,
          textWrap: 'nowrap',
        },
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
          <NavLink to={config.routes.onlineLearning}>Học Online</NavLink>
          <NavLink to={config.routes.vipDocuments}>Tài liệu VIP</NavLink>
          <NavLink to={config.routes.documents}>Tài liệu</NavLink>
          <NavLink to={config.routes.liveSchedule}>Lịch Live</NavLink>
          <NavLink>Thanh toán</NavLink>
        </>
      ) : null}
    </Box>
  )
}

export default HeaderNavigation
