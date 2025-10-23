import LogoIcon from '@/components/LogoIcon'
import { Box, Stack } from '@mui/material'
import logoImg from '@/assets/images/mainlogo.png'

import HeaderNavigation from '@/components/HeaderNavigation'
import HeaderActions from '@/components/HeaderActions'
import { Link } from 'react-router-dom'
import useResponsive from '@/hooks/useResponsive'
import ThemeToggle from '@/components/ThemeToggle'
import { Chip } from '@mui/material'
import { useCurrentUser } from '@/hooks/useCurrentUser'

function HeaderBottomBar() {
  const { isMobile } = useResponsive()
  const currentUser = useCurrentUser()
  const height = (theme) => theme.muiVars.headerBottomBarHeight
  return (
    <Box
      component="nav"
      sx={{
        position: {
          xs: 'static',
          md: 'sticky',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        inset: 0,
        zIndex: 20,
        background: (theme) => theme.vars?.palette?.gradient?.intersection || theme.palette.background.default,
        height: height,
        boxShadow: '0 4px 4px 0 rgba(199,194,194,.25)',
      }}
    >
      {isMobile && (
        <Stack direction="row" spacing={4} sx={{ position: 'absolute', left: 50 }}>
          {currentUser?.activeKey && <Chip label="VIP" color="tertiary" variant="contained" />}
          <ThemeToggle />
        </Stack>
      )}
      <Link to="/">
        <LogoIcon size={height} src={logoImg} />
      </Link>
      <HeaderNavigation />
      <HeaderActions />
    </Box>
  )
}

export default HeaderBottomBar
