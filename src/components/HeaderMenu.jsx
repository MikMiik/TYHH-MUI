import { List, ListItem, ListItemButton, ListItemText, Box, Paper, Popper } from '@mui/material'
import { useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import NavLink from '@/components/NavLink'
import { AnimatePresence, motion } from 'framer-motion'
import { useGetAllTopicsQuery } from '@/features/api/topicApi'

function HeaderMenu() {
  const { data: topics, isSuccess: isTopicsLoaded } = useGetAllTopicsQuery()

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
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <NavLink
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        Danh mục
        <KeyboardArrowDownIcon />
      </NavLink>

      <Popper
        component={motion.div}
        open={open}
        anchorEl={anchorEl}
        disablePortal={true}
        modifiers={[{ name: 'offset', options: { offset: [0, 4] } }]}
        sx={{ minWidth: '110%', position: 'absolute', right: 0, zIndex: 20 }}
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
                  color: 'text.primary',
                  background: (theme) => theme.vars.palette.background.paper,
                  '& .MuiListItemButton-root': {
                    padding: '2px 6px',
                    textAlign: 'center',
                    '&:hover': {
                      color: (theme) => theme.palette.primary.main,
                      bgcolor: (theme) => theme.vars.palette.background.paper,
                    },
                  },
                  '& .MuiTypography-root': {
                    fontSize: '0.875rem',
                  },
                }}
              >
                {isTopicsLoaded &&
                  topics.map((topic) => (
                    <ListItem sx={{ whiteSpace: 'nowrap', width: 'auto' }} disablePadding key={topic.id}>
                      <ListItemButton component={NavLink} to={`/courses?topic=${topic.slug}`}>
                        <ListItemText primary={topic.title} />
                      </ListItemButton>
                    </ListItem>
                  ))}
              </List>
            </Paper>
          )}
        </AnimatePresence>
      </Popper>
    </Box>
  )
}

export default HeaderMenu
