import Container from '@mui/material/Container'

import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'

function MuiLayout() {
  return (
    <>
      <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
        <Header />
        <Box sx={{ mt: (theme) => theme.customVars.headerTopBarHeight }}>
          <Outlet />
        </Box>
        <Footer />
      </Container>
    </>
  )
}

export default MuiLayout
