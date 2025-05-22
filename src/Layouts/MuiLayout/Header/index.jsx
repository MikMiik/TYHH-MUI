import HeaderBottomBar from './HeaderBottomBar'
import { Box, Container } from '@mui/material'

function Header() {
  return (
    <Container disableGutters maxWidth={false} sx={{ width: '100%', height: (theme) => theme.customVars.headerHeight }}>
      <Box
        sx={{
          backgroundColor: 'primary.main',
          width: '100%',
          height: (theme) => theme.customVars.headerTopBarHeight,
        }}
      />
      <HeaderBottomBar />
    </Container>
  )
}

export default Header
