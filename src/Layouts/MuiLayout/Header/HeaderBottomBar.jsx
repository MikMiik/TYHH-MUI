import LogoIcon from '@/components/LogoIcon'
import { Box } from '@mui/material'

import HeaderNavigation from '@/components/Header/HeaderNavigation'
import HeaderActions from '@/components/Header/HeaderActions'

function HeaderBottomBar() {
  const height = (theme) => theme.customVars.headerBottomBarHeight
  return (
    <Box
      component="nav"
      sx={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        bgcolor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: 2,
        height: height,
        px: 24,
        boxShadow: '0 4px 4px 0 rgba(199,194,194,.25)',
      }}
    >
      <LogoIcon size={height} src="./src/assets/images/mainlogo.png" />
      <Box sx={{ flex: 1 }}>
        <HeaderNavigation />
      </Box>
      <HeaderActions />
    </Box>
  )
}

export default HeaderBottomBar
