import { Link as RouterLink } from 'react-router-dom'
import { Link as MuiBaseLink } from '@mui/material'

const MuiLink = ({ to, children, sx, ...props }) => {
  return (
    <MuiBaseLink
      component={RouterLink}
      to={to}
      sx={{
        textTransform: 'none',
        textDecoration: 'none',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiBaseLink>
  )
}

export default MuiLink
