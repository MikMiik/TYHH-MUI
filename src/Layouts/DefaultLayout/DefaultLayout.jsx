import Container from '@mui/material/Container'

import { Outlet } from 'react-router-dom'
import { Box, Divider } from '@mui/material'
import HeaderTopBar from './Header/HeaderTopBar'
import HeaderBottomBar from './Header/HeaderBottomBar'
import FooterMainArea from './Footer/FooterMainArea'
import FooterBottomArea from './Footer/FooterBottomArea'
import MuiBottomNavigation from '@/components/MuiBottomNavigation'

function DefaultLayout() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Header */}
      <HeaderTopBar />
      <HeaderBottomBar />
      <MuiBottomNavigation />
      {/* Body */}

      <Outlet />

      {/* Footer */}
      <Box sx={{ bgcolor: 'primary.main', minHeight: '630px' }}>
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
