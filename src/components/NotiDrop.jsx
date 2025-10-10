import { useState, useRef } from 'react'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import Popover from '@mui/material/Popover'
import MuiBox from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { Stack, List, ListItem, ListItemText, Badge, Divider, Avatar, Button } from '@mui/material'
import {
  useGetAllNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from '@/features/api/notificationApi'
import { useLoadingState } from './withLoadingState'
import { Link } from 'react-router-dom'

const NotiDrop = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const iconRef = useRef(null)

  const queryResult = useGetAllNotificationsQuery({ page: 1, limit: 5 })
  const { data: { notifications } = {}, LoadingStateComponent } = useLoadingState(queryResult, {
    variant: 'inline',
    loadingText: 'Đang tải thông báo...',
    emptyText: 'Chưa có thông báo nào',
    dataKey: 'notifications',
    hasDataCheck: (notifications) => notifications && notifications.length > 0,
  })

  const [markAsRead] = useMarkNotificationAsReadMutation()
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation()

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await markAsRead(notification.id).unwrap()
      } catch (error) {
        console.error('Error marking notification as read:', error)
      }
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap()
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const open = Boolean(anchorEl)
  const unreadCount = notifications?.filter((notification) => !notification.isRead).length || 0

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
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight={600}>
              Thông báo ({unreadCount > 0 ? `${unreadCount} chưa đọc` : 'đã đọc hết'})
            </Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                variant="text"
                onClick={handleMarkAllAsRead}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  color: 'primary.main',
                  minWidth: 'auto',
                  p: 0.5,
                }}
              >
                Đọc hết
              </Button>
            )}
          </Stack>
        </MuiBox>

        <LoadingStateComponent>
          {notifications && notifications.length > 0 ? (
            <List sx={{ p: 0, maxHeight: 400, overflowY: 'auto' }}>
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <ListItem
                    alignItems="flex-start"
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      px: 2,
                      py: 1.5,
                      '&:hover': { bgcolor: 'grey.50' },
                      cursor: 'pointer',
                      bgcolor: !notification.isRead ? '#8bc58dff' : 'transparent',
                      transition: 'background-color 0.3s',
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
                            {!notification.isRead && (
                              <Typography variant="caption" color="primary" fontWeight="bold">
                                • Mới
                              </Typography>
                            )}
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

        {/* Footer với link "Xem tất cả" */}
        <MuiBox sx={{ px: 2, py: 1.5, borderTop: '1px solid #eee', bgcolor: 'grey.50' }}>
          <Button
            component={Link}
            to="/notifications"
            variant="text"
            fullWidth
            size="small"
            onClick={handleClose}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              color: 'primary.main',
            }}
          >
            Xem tất cả thông báo
          </Button>
        </MuiBox>
      </Popover>
    </>
  )
}

export default NotiDrop
