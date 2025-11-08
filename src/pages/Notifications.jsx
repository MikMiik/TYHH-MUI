import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Stack,
  Pagination,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { Add as AddIcon, Search as SearchIcon, Clear as ClearIcon, Delete as DeleteIcon } from '@mui/icons-material'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { useSearchParams } from 'react-router-dom'
import {
  useGetAllNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} from '@/features/api/notificationApi'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useLoadingState } from '@/components/withLoadingState'
import CreateNotificationModal from '@/components/CreateNotificationModal'
import BreadCrumbsPath from '@/components/BreadCrumbsPath'
import useDebounce from '@/hooks/useDebounce'
import { useUserRole } from '@/hooks/useUserRole'

const Notifications = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')
  const debouncedSearchValue = useDebounce(searchValue, 300)

  const page = parseInt(searchParams.get('page')) || 1
  const search = searchParams.get('search') || ''
  const pageSize = 10

  const userRole = useUserRole()
  const isTeacher = userRole?.includes('teacher')
  const currentUser = useCurrentUser()

  // Update URL params when debounced search value changes
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams)

    if (debouncedSearchValue.trim()) {
      newParams.set('search', debouncedSearchValue.trim())
      newParams.set('page', '1') // Reset to first page when searching
    } else {
      newParams.delete('search')
    }

    setSearchParams(newParams, { replace: true })
  }, [debouncedSearchValue, searchParams, setSearchParams])

  // Sync searchValue with URL params when URL changes externally
  useEffect(() => {
    setSearchValue(search)
  }, [search])

  const queryResult = useGetAllNotificationsQuery(
    {
      page,
      limit: pageSize,
      search,
    },
    {
      refetchOnMountOrArgChange: true,
      // Skip API call when user is not logged in
      skip: !currentUser?.id,
    }
  )

  const [markAsRead] = useMarkNotificationAsReadMutation()
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation()
  const [deleteNotification] = useDeleteNotificationMutation()

  const { data: { notifications = [], totalPages = 0 } = {}, LoadingStateComponent } = useLoadingState(queryResult, {
    variant: 'section',
    loadingText: 'Đang tải thông báo...',
    emptyText: 'Chưa có thông báo nào',
    skeletonType: 'card',
    skeletonCount: 5,
    dataKey: 'notifications',
    hasDataCheck: (notifications) => notifications && notifications.length > 0,
  })

  const handleNotificationClick = async (notificationId) => {
    try {
      await markAsRead(notificationId).unwrap()
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handlePageChange = (_, value) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', value.toString())
    setSearchParams(newParams)
  }

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value)
  }

  const handleClearSearch = () => {
    setSearchValue('')
  }

  const handleNotificationCreated = () => {
    // Refetch will happen automatically due to cache invalidation
    setSearchParams({ page: '1' })
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap()
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const handleDeleteNotification = async (event, notificationId) => {
    // Prevent triggering the notification click event
    event.stopPropagation()
    
    try {
      await deleteNotification(notificationId).unwrap()
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

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
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <BreadCrumbsPath />

        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={600}>
            Thông báo
          </Typography>
          <Stack direction="row" spacing={2}>
            {notifications && notifications.filter((n) => !n.isRead).length > 0 && (
              <Button variant="outlined" onClick={handleMarkAllAsRead} sx={{ textTransform: 'none' }}>
                Đánh dấu đọc hết
              </Button>
            )}
            {isTeacher && (
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateModalOpen(true)}>
                Tạo thông báo
              </Button>
            )}
          </Stack>
        </Stack>

        {/* Search */}
        <Box sx={{ mb: 3 }}>
          <TextField
            placeholder="Tìm kiếm thông báo..."
            value={searchValue}
            onChange={handleSearchChange}
            sx={{ maxWidth: 400 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchValue && (
                <InputAdornment position="end">
                  <IconButton onClick={handleClearSearch} size="small">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Notifications List */}
        {!currentUser ? (
          <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 200, p: 3 }}>
            <DoneAllIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Chưa có thông báo nào
            </Typography>
          </Stack>
        ) : (
          <LoadingStateComponent>
            <Stack spacing={2}>
              {notifications &&
                notifications.length > 0 &&
                notifications.map((notification, index) => (
                  <Card
                    key={notification.id}
                    elevation={1}
                    onClick={() => handleNotificationClick(notification.id)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: !notification.isRead ? 'theme.palette.success.notification' : 'background.paper',
                      '&:hover': {
                        bgcolor: !notification.isRead ? 'primary.light' : 'text.hint',
                      },
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Avatar
                          src={notification.teacher?.avatar}
                          sx={{
                            width: 48,
                            height: 48,
                            bgcolor: 'primary.main',
                          }}
                        >
                          {notification.teacher?.name?.charAt(0)?.toUpperCase() || 'T'}
                        </Avatar>

                        <Box flex={1}>
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            {notification.title}
                          </Typography>

                          {notification.message && (
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                              {notification.message}
                            </Typography>
                          )}

                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Chip label={notification.teacher?.name || 'Admin'} size="small" variant="outlined" />
                            <Typography variant="caption" color="text.secondary">
                              {formatTimeAgo(notification.createdAt)}
                            </Typography>
                          </Stack>
                        </Box>

                        {notification.teacherId === currentUser?.id && isTeacher && <IconButton
                          onClick={(e) => handleDeleteNotification(e, notification.id)}
                          size="small"
                          sx={{
                            color: 'error.main',
                            '&:hover': {
                              bgcolor: 'error.light',
                              color: 'error.dark',
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>}
                      </Stack>
                    </CardContent>
                    {index < notifications.length - 1 && <Divider />}
                  </Card>
                ))}
            </Stack>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  size="large"
                />
              </Box>
            )}
          </LoadingStateComponent>
        )}

        {/* Create Modal */}
        <CreateNotificationModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onNotificationCreated={handleNotificationCreated}
        />
      </Box>
    </Container>
  )
}

export default Notifications
