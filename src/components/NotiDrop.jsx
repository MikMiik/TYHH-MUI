import { useState, useRef } from 'react'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import Popover from '@mui/material/Popover'
import MuiBox from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { Stack, List, ListItem, ListItemText, Badge, Divider, Avatar, Chip } from '@mui/material'
import { useGetAllNotificationsQuery } from '@/features/api/notificationApi'
import { useLoadingState } from './withLoadingState'

const NotiDrop = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const iconRef = useRef(null)

  const queryResult = useGetAllNotificationsQuery()
  const { data: notifications, LoadingStateComponent } = useLoadingState(queryResult, {
    variant: 'inline',
    loadingText: 'Đang tải thông báo...',
    emptyText: 'Chưa có thông báo nào',
  })

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const unreadCount = notifications?.length || 0

  const formatTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))

      if (diffInMinutes < 1) return 'Vừa xong'
      if (diffInMinutes < 60) return `${diffInMinutes} phút trước`

      const diffInHours = Math.floor(diffInMinutes / 60)
      if (diffInHours < 24) return `${diffInHours} giờ trước`

      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} ngày trước`
    } catch {
      return 'Vừa xong'
    }
  }

  return (
    <>
      <MuiBox ref={iconRef} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error" max={99}>
          <NotificationsOutlinedIcon fontSize="medium" />
        </Badge>
      </MuiBox>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        transitionDuration={250}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: 2,
              minWidth: 380,
              maxWidth: 420,
              maxHeight: 500,
              boxShadow: 3,
              overflow: 'hidden',
            },
          },
        }}
      >
        <MuiBox sx={{ px: 2, py: 1.5, borderBottom: '1px solid #eee', bgcolor: 'grey.50' }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Thông báo ({notifications?.length || 0})
          </Typography>
        </MuiBox>

        <LoadingStateComponent>
          {notifications && notifications.length > 0 ? (
            <List sx={{ p: 0, maxHeight: 400, overflowY: 'auto' }}>
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      px: 2,
                      py: 1.5,
                      '&:hover': { bgcolor: 'grey.50' },
                      cursor: 'pointer',
                    }}
                  >
                    <Avatar
                      src={notification.teacher?.avatar}
                      sx={{
                        width: 40,
                        height: 40,
                        mr: 1.5,
                        bgcolor: 'primary.main',
                      }}
                    >
                      {notification.teacher?.name?.charAt(0)?.toUpperCase() || 'T'}
                    </Avatar>
                    <ListItemText
                      primary={
                        <>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="subtitle2" color="primary" fontWeight="bold">
                              {notification.teacher?.name || 'Giáo viên'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTimeAgo(notification.createdAt)}
                            </Typography>
                          </Stack>
                          <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 0.5 }}>
                            {notification.title}
                          </Typography>
                        </>
                      }
                      secondary={
                        <Stack spacing={0.5}>
                          {notification.message && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {notification.message}
                            </Typography>
                          )}
                        </Stack>
                      }
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
                </div>
              ))}
            </List>
          ) : (
            <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 200, p: 3 }}>
              <DoneAllIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Chưa có thông báo nào
              </Typography>
            </Stack>
          )}
        </LoadingStateComponent>
      </Popover>
    </>
  )
}

export default NotiDrop
