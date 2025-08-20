import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Link as MuiLink, styled } from '@mui/material'

const StyledLink = styled(RouterLink)(({ active }) => ({
  color: active ? '#f56751' : 'inherit',
  textTransform: 'none',
  textDecoration: 'none',
  transition: 'all 0.1s',
  '&:hover': {
    color: '#f56751',
  },
}))

const CustomLink = ({ to, children, ...props }) => {
  const location = useLocation()
  const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
  return (
    <StyledLink active={isActive ? 1 : 0} to={to} {...props}>
      {children}
    </StyledLink>
  )
}

export default CustomLink
