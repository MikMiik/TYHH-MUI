import { Box } from '@mui/material'
import logo from '@/assets/images/mainlogo.png'

function LogoIcon({ size = 36 }) {
  return (
    <Box
      component="img"
      src={logo}
      alt="Logo"
      sx={{
        width: size,
        height: size,
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
    />
  )
}

export default LogoIcon
