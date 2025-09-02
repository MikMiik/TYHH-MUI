import { Avatar, ListItemIcon } from '@mui/material'
import { List, ListItem, ListItemButton, ListItemText, Box, Paper, Popper } from '@mui/material'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const DropAvatar = ({ bgcolor, width, height }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

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
      <Avatar sx={{ bgcolor, width, height }}></Avatar>

      <Popper
        component={motion.div}
        open={open}
        anchorEl={anchorEl}
        disablePortal={true}
        modifiers={[{ name: 'offset', options: { offset: [0, 4] } }]}
        sx={{ minWidth: '140%', position: 'absolute', right: 0, top: '120%' }}
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
            >
              <List
                sx={{
                  py: '4px',
                  color: 'rgba(0, 0, 0, .65)',
                  '& .MuiListItemButton-root': {
                    padding: '2px 6px',
                    textAlign: 'center',
                    '&:hover': {
                      bgcolor: '#e6f7ff',
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
              </List>
            </Paper>
          )}
        </AnimatePresence>
      </Popper>
    </Box>
  )
}

export default DropAvatar
