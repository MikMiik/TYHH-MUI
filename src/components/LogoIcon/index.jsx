import { Box } from '@mui/material'

function LogoIcon({ size = 36, src, ...rest }) {
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
        ...rest,
      }}
    />
  )
}

export default LogoIcon
