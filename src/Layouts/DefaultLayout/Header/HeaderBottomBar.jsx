import LogoIcon from '@/components/LogoIcon'
import { Box } from '@mui/material'
import logoImg from '@/assets/images/mainlogo.png'

import HeaderNavigation from '@/components/HeaderNavigation'
import HeaderActions from '@/components/HeaderActions'
import { Link } from 'react-router-dom'

function HeaderBottomBar() {
  const height = (theme) => theme.muiVars.headerBottomBarHeight
  return (
    <Box
      component="nav"
      sx={{
        position: {
          xs: 'static', // màn hình nhỏ (mobile)
          md: 'sticky',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        inset: 0,
        zIndex: 20,
        bgcolor: 'white',
        width: '100%',
        height: height,
        boxShadow: '0 4px 4px 0 rgba(199,194,194,.25)',
      }}
    >
      <Link to="/">
        <LogoIcon size={height} src={logoImg} />
      </Link>
      <HeaderNavigation />
      <HeaderActions />
    </Box>
  )
}

export default HeaderBottomBar
