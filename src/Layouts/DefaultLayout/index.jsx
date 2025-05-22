import Container from '@mui/material/Container'

import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

function DefaultLayout() {
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

export default DefaultLayout
