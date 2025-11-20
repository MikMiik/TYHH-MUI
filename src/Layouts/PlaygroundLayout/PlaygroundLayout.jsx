import React from 'react'
import { Box, IconButton } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { Outlet, useNavigate } from 'react-router-dom'

import logoImg from '@/assets/images/mainlogo.png'
import { Link } from 'react-router-dom'
import LogoIcon from '@/components/LogoIcon'
import config from '@/routes/config'

function PlaygroundLayout() {
  const navigate = useNavigate()

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top-left back icon */}
      <Box sx={{ position: 'absolute', top: 12, left: 8, zIndex: 30 }}>
        <IconButton size="smaller" onClick={() => navigate(config.routes.home)} aria-label="go-back">
          <ArrowBackIosNewIcon />
        </IconButton>
      </Box>

      {/* Top-right logo */}
      <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 30 }}>
        <Link to="/">
          <LogoIcon size={40} src={logoImg} />
        </Link>
      </Box>
      <Outlet />
    </Box>
  )
}

export default PlaygroundLayout
