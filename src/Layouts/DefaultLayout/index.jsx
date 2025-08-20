import Container from '@mui/material/Container'

import { Outlet } from 'react-router-dom'
import { Box, Divider } from '@mui/material'
import HeaderTopBar from './Header/HeaderTopBar'
import HeaderBottomBar from './Header/HeaderBottomBar'
import FooterMainArea from './Footer/FooterMainArea'
import FooterBottomArea from './Footer/FooterBottomArea'

function DefaultLayout() {
  return (
    <>
      <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <HeaderTopBar />
          <HeaderBottomBar />
        </Box>

        {/* Body */}
        <Box>
          <Outlet />
        </Box>

        {/* Footer */}
        <Container maxWidth={true} disableGutters sx={{ bgcolor: 'primary.main', minHeight: '630px' }}>
          <FooterMainArea />
          <Divider sx={{ borderColor: 'white' }} />
          <FooterBottomArea />
        </Container>
      </Container>
    </>
  )
}

export default DefaultLayout
