import { Avatar, ListItemIcon } from '@mui/material'
import { List, ListItem, ListItemButton, ListItemText, Box, Paper, Popper } from '@mui/material'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useUserRole } from '@/hooks/useUserRole'

const DropAvatar = ({ bgcolor, width, height }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const userRole = useUserRole()
  const isTeacher = userRole?.includes('teacher')
  const open = Boolean(anchorEl)
  const currentUser = useCurrentUser()
  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMouseLeave = () => {
    setAnchorEl(null)
  }
  return (
    <Box
      sx={{
        display: 'inline-block',
        position: 'relative',
        '&:after': {
          display: open ? 'block' : 'none',
          content: '""',
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
        },
        cursor: 'pointer',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Avatar src={`${import.meta.env.VITE_SERVER_URL}${currentUser.avatar}`} sx={{ bgcolor, width, height }}></Avatar>

      <Popper
        component={motion.div}
        open={open}
        anchorEl={anchorEl}
        disablePortal={true}
        modifiers={[{ name: 'offset', options: { offset: [0, 4] } }]}
        sx={{ minWidth: 180, position: 'absolute', right: 0, top: '120%' }}
      >
        <AnimatePresence>
          {open && (
            <Paper
              component={motion.div}
              elevation={2}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
              layout
              sx={{
                minWidth: 180,
                background: open ? (theme) => theme.vars.palette.background.default : 'transparent',
              }}
            >
              <List
                sx={{
                  py: '4px',
                  color: 'text.primary',
                  '& .MuiListItemButton-root': {
                    padding: '2px 6px',
                    textAlign: 'center',
                    '&:hover': {
                      bgcolor: (theme) => theme.vars.palette.background.paper,
                      borderRadius: 1,
                    },
                  },
                  '& .MuiTypography-root': {
                    fontSize: '0.875rem',
                  },
                }}
              >
                <ListItem
                  component={Link}
                  to="/profile"
                  sx={{ whiteSpace: 'nowrap', width: 'auto', color: 'inherit' }}
                  disablePadding
                >
                  <ListItemButton>
                    <ListItemIcon sx={{ mr: 1, minWidth: 'auto' }}>
                      <AccountCircleOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={'Thông tin cá nhân'} />
                  </ListItemButton>
                </ListItem>
                <ListItem
                  component={Link}
                  to="/my-courses"
                  sx={{ whiteSpace: 'nowrap', width: 'auto', color: 'inherit' }}
                  disablePadding
                >
                  <ListItemButton>
                    <ListItemIcon sx={{ mr: 1, minWidth: 'auto' }}>
                      <VideocamOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={'Khóa học của tôi'} />
                  </ListItemButton>
                </ListItem>
                {isTeacher && (
                  <ListItem
                    component={Link}
                    to="/created-courses"
                    sx={{ whiteSpace: 'nowrap', width: 'auto', color: 'inherit' }}
                    disablePadding
                  >
                    <ListItemButton>
                      <ListItemIcon sx={{ mr: 1, minWidth: 'auto' }}>
                        <CreateOutlinedIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={'Khóa học đã tạo'} />
                    </ListItemButton>
                  </ListItem>
                )}
              </List>
            </Paper>
          )}
        </AnimatePresence>
      </Popper>
    </Box>
  )
}

export default DropAvatar
