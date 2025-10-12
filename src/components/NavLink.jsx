import { Link as RouterLink, useLocation } from 'react-router-dom'
import { styled } from '@mui/material'

const StyledLink = styled(RouterLink)(({ theme, active }) => ({
  color: active ? theme.palette.tertiary.main : 'inherit',
  textTransform: 'none',
  textDecoration: 'none',
  transition: 'all 0.1s',
  '&:hover': {
    color: theme.palette.tertiary.main,
  },
}))

const NavLink = ({ to, children, ...props }) => {
  const location = useLocation()
  const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
  return (
    <StyledLink active={isActive ? 1 : 0} to={to} {...props}>
      {children}
    </StyledLink>
  )
}

export default NavLink
