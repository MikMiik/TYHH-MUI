import LogoIcon from '@/components/LogoIcon'
import { Box } from '@mui/material'
import logoImg from '@/assets/images/mainlogo.png'

import HeaderNavigation from '@/components/Header/HeaderNavigation'
import HeaderActions from '@/components/Header/HeaderActions'

function HeaderBottomBar() {
  const height = (theme) => theme.customVars.headerBottomBarHeight
  return (
    <>
      <Box
        component="nav"
        sx={{
          position: 'sticky',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          bgcolor: 'white',
          width: '100%',
          height: height,
          boxShadow: '0 4px 4px 0 rgba(199,194,194,.25)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            maxWidth: {
              xs: '100%',
              sm: '540px',
              md: '880px',
              lg: '1140px',
            },
          }}
        >
          <LogoIcon size={height} src={logoImg} />
          <HeaderNavigation />
          <HeaderActions />
        </Box>
      </Box>
    </>
  )
}

export default HeaderBottomBar
