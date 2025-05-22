import LogoIcon from '@/components/LogoIcon'
import { Box, Container } from '@mui/material'

import HeaderNavigation from '@/components/Header/HeaderNavigation'
import HeaderActions from '@/components/Header/HeaderActions'

function HeaderBottomBar() {
  const height = (theme) => `calc(${theme.customVars.headerHeight} - ${theme.customVars.headerTopBarHeight})`
  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        px: 24,
        height: height,
        boxShadow: '0 4px 4px 0 rgba(199,194,194,.25)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 2 }}>
        <LogoIcon size={height} />
        <Box sx={{ flex: 1 }}>
          <HeaderNavigation />
        </Box>
        <HeaderActions />
      </Box>
    </Container>
  )
}

export default HeaderBottomBar
