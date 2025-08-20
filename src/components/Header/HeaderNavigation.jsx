import CustomLink from '@/components/CustomLink'
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
          <CustomLink to={config.routes.home}>Trang chủ</CustomLink>
          <CustomLink to={config.routes.onlineLearning}>Học Online</CustomLink>
          <CustomLink to={config.routes.vipDocuments}>Tài liệu VIP</CustomLink>
          <CustomLink to={config.routes.documents}>Tài liệu</CustomLink>
          <CustomLink to={config.routes.liveSchedule}>Lịch Live</CustomLink>
          <CustomLink>Thanh toán</CustomLink>
        </>
      ) : null}
    </Box>
  )
}

export default HeaderNavigation
