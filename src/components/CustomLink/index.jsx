import { Link as RouterLink } from 'react-router-dom'
import { Link as MuiLink } from '@mui/material'

const CustomLink = ({ to, children, ...props }) => {
  return (
    <MuiLink component={RouterLink} to={to} {...props}>
      {children}
    </MuiLink>
  )
}

export default CustomLink
