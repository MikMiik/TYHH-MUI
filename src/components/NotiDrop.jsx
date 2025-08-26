import { useState, useRef } from 'react'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import Popover from '@mui/material/Popover'
import MuiBox from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { Stack } from '@mui/material'

const NotiDrop = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const iconRef = useRef(null)

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <>
      <MuiBox ref={iconRef} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={handleOpen}>
        <NotificationsOutlinedIcon fontSize="medium" />
      </MuiBox>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        transitionDuration={250}
        slotProps={{
          root: {
            sx: {
              mt: 1,
              borderRadius: 2,
              minWidth: 320,
              boxShadow: 3,
              p: 0,
            },
          },
        }}
      >
        <MuiBox sx={{ px: 2, py: 1, borderBottom: '1px solid #eee' }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Danh sách thông báo
          </Typography>
        </MuiBox>
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 200 }}>
          <DoneAllIcon />
          No notifications
        </Stack>
      </Popover>
    </>
  )
}

export default NotiDrop
