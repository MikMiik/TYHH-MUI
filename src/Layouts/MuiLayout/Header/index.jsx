import HeaderBottomBar from './HeaderBottomBar'
import HeaderTopBar from './HeaderTopBar'
import { Container } from '@mui/material'

function Header() {
  return (
    <Container disableGutters maxWidth={false} sx={{ width: '100%', height: (theme) => theme.customVars.headerHeight }}>
      <HeaderTopBar />
      <HeaderBottomBar />
    </Container>
  )
}

export default Header
