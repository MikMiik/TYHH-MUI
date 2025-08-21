import LogoIcon from '@/components/LogoIcon'
import { Box } from '@mui/material'
import logoImg from '@/assets/images/mainlogo.png'

import HeaderNavigation from '@/components/HeaderNavigation'
import HeaderActions from '@/components/HeaderActions'

function HeaderBottomBar() {
  const height = (theme) => theme.customVars.headerBottomBarHeight
  return (
    <Box
      component="nav"
      sx={{
        position: 'sticky',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        inset: 0,
        zIndex: 10,
        bgcolor: 'white',
        width: '100%',
        height: height,
        boxShadow: '0 4px 4px 0 rgba(199,194,194,.25)',
      }}
    >
      <LogoIcon size={height} src={logoImg} />
      <HeaderNavigation />
      <HeaderActions />
    </Box>
  )
}

export default HeaderBottomBar
