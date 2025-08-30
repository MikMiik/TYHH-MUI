import { Box } from '@mui/material'
import { Link } from 'react-router-dom'

function LogoIcon({ size = 36, src, sx, ...rest }) {
  return (
    <Box
      component="img"
      src={src}
      alt="Logo"
      sx={{
        width: size,
        height: size,
        display: 'inline-block',
        verticalAlign: 'middle',
        ...sx,
      }}
      {...rest}
    />
  )
}

export default LogoIcon
