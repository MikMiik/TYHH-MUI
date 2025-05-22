import Container from '@mui/material/Container'

import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

function MuiLayout() {
  return (
    <>
      <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
        <Header />
        <Outlet />
        <Footer />
      </Container>
    </>
  )
}

export default MuiLayout
