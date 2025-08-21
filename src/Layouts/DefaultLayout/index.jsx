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
      <Container disableGutters maxWidth={false} sx={{ minHeight: '100vh' }}>
        {/* Header */}
        <HeaderTopBar />
        <HeaderBottomBar />

        {/* Body */}
        <Box>
          <Outlet />
        </Box>

        {/* Footer */}
        <Container maxWidth={false} disableGutters sx={{ bgcolor: 'primary.main', minHeight: '630px' }}>
          <Box py={5} display="flex" justifyContent="center" alignItems="center">
            <FooterMainArea />
          </Box>
          <Divider sx={{ borderColor: 'white' }} />
          <Box py={4} display="flex" justifyContent="center" alignItems="center">
            <FooterBottomArea />
          </Box>
        </Container>
      </Container>
    </>
  )
}

export default DefaultLayout
