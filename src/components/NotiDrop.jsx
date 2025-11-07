import { useState, useRef, useEffect } from 'react'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import Popover from '@mui/material/Popover'
import MuiBox from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { Stack, List, ListItem, ListItemText, Badge, Divider, Avatar, Button } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  useGetAllNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from '@/features/api/notificationApi'
import { useLoadingState } from './withLoadingState'
import { Link } from 'react-router-dom'
import socketClient from '@/utils/socketClient'
import { useCurrentUser } from '@/hooks/useCurrentUser'

const NotiDrop = () => {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState(null)
  const iconRef = useRef(null)
  const currentUser = useCurrentUser()

  // Skip API query when there's no current user to avoid unnecessary calls
  const queryResult = useGetAllNotificationsQuery({ page: 1, limit: 5 }, { skip: !currentUser?.id })
  const { data: { notifications: apiNotifications } = {}, LoadingStateComponent } = useLoadingState(queryResult, {
    variant: 'inline',
    loadingText: 'Đang tải thông báo...',
    emptyText: 'Chưa có thông báo nào',
    dataKey: 'notifications',
    hasDataCheck: (notifications) => notifications && notifications.length > 0,
  })

  // Local state for notifications with real-time updates
  const [notifications, setNotifications] = useState(apiNotifications || [])

  const [markAsRead] = useMarkNotificationAsReadMutation()
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation()

  // Sync API notifications with local state
  useEffect(() => {
    if (apiNotifications) {
      setNotifications(apiNotifications)
    } else if (!currentUser) {
      // ensure empty when there's no user
      setNotifications([])
    }
  }, [apiNotifications, currentUser])

  // Listen for real-time notifications via socket
  useEffect(() => {
    if (!currentUser?.id) return

    const channel = socketClient.subscribe(`notifications`)
    channel.bind('new-notification', (newNotification) => {
      setNotifications((prevNotifications) => {
        // Check if notification already exists to avoid duplicates
        const notificationExists = prevNotifications.some((n) => n.id === newNotification.id)
        if (notificationExists) {
          return prevNotifications
        }
        // Add new notification to the beginning and keep only latest 5
        return [newNotification, ...prevNotifications].slice(0, 5)
      })
    })

    // Cleanup subscription on unmount
    return () => {
      socketClient.unsubscribe(`notifications`)
    }
  }, [currentUser?.id])

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
        // Update local state immediately for better UX
        setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)))
      } catch (error) {
        console.error('Error marking notification as read:', error)
      }
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap()
      // Update local state immediately for better UX
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      )
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const open = Boolean(anchorEl)
  const unreadCount = currentUser ? notifications?.filter((notification) => !notification.isRead).length || 0 : 0

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
              minWidth: { xs: 300, sm: 380 },
              maxWidth: { xs: 300, sm: 420 },
              maxHeight: 500,
              boxShadow: 3,
              overflow: 'hidden',
              bgcolor: theme.vars.palette.background.light,
            },
          },
        }}
      >
        <MuiBox sx={{ px: 2, py: 1.5, borderBottom: `1px solid #eee`, bgcolor: theme.vars.palette.background.light }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
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
          {currentUser && notifications && notifications.length > 0 ? (
            <List sx={{ p: 0, maxHeight: 400, overflowY: 'auto' }}>
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <ListItem
                    alignItems="flex-start"
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      px: 2,
                      py: 1.5,
                      '&:hover': { bgcolor: theme.vars.palette.primary.light },
                      cursor: 'pointer',
                      bgcolor: !notification.isRead ? theme.palette.success.notification : 'transparent',
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
                              {notification.teacher?.name || 'Admin'}
                            </Typography>
                            <Typography variant="caption" color="text.contrastText">
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
                              color="text.main"
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
        <MuiBox sx={{ px: 2, py: 1.5, background: theme.vars.palette.background.light }}>
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
