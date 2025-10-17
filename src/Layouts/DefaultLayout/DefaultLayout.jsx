import Container from '@mui/material/Container'

import { Outlet } from 'react-router-dom'
import { Box, Divider } from '@mui/material'
import HeaderTopBar from './Header/HeaderTopBar'
import HeaderBottomBar from './Header/HeaderBottomBar'
import FooterMainArea from './Footer/FooterMainArea'
import FooterBottomArea from './Footer/FooterBottomArea'
import MuiBottomNavigation from '@/components/MuiBottomNavigation'
import useResponsive from '@/hooks/useResponsive'

function DefaultLayout() {
  const { isMobile, isTablet } = useResponsive()
  return (
    <Box>
      {/* Header */}
      <HeaderTopBar />
      <HeaderBottomBar />
      {(isMobile || isTablet) && <MuiBottomNavigation />}
      {/* Body */}

      <Box
        sx={{
          background: (theme) => theme.vars?.palette?.gradient?.secondary || theme.palette.gradient.secondary,
        }}
      >
        <Outlet />
      </Box>

      {/* Footer */}
      <Box sx={{ background: (theme) => theme.palette.gradient.main, minHeight: '630px' }}>
        <Container sx={{ py: 4 }} display="flex">
          <FooterMainArea />
        </Container>
        <Divider sx={{ borderColor: 'white' }} />
        <Container sx={{ py: 4 }} display="flex">
          <FooterBottomArea />
        </Container>
      </Box>
    </Box>
  )
}

export default DefaultLayout
