import CustomLink from '@/components/CustomLink'
import config from '@/config'
import { Box } from '@mui/material'
import HeaderMenu from './HeaderMenu'

function HeaderNavigation() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '& > *:not(:first-of-type)': {
          marginLeft: (theme) => theme.spacing(2),
        },
      }}
    >
      <HeaderMenu />
      <CustomLink to={config.routes.home}>Trang chủ</CustomLink>
      <CustomLink to={config.routes.onlineLearning}>Học Online</CustomLink>
      <CustomLink to={config.routes.vipDocuments}>Tài liệu VIP</CustomLink>
      <CustomLink to={config.routes.documents}>Tài liệu</CustomLink>
      <CustomLink to={config.routes.liveSchedule}>Lịch Live</CustomLink>
      <CustomLink to={config.routes.liveSchedule}>Thanh toán</CustomLink>
    </Box>
  )
}

export default HeaderNavigation
