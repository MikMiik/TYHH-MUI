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
import { Add as AddIcon, Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material'
import { useSearchParams } from 'react-router-dom'
import {
  useGetAllNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from '@/features/api/notificationApi'
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
    }
  )

  const [markAsRead] = useMarkNotificationAsReadMutation()
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation()

  const { data: { notifications, totalPages } = {}, LoadingStateComponent } = useLoadingState(queryResult, {
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
                    bgcolor: !notification.isRead ? '#8bc58dff' : 'background.paper',
                    '&:hover': {
                      bgcolor: !notification.isRead ? 'primary.light' : 'grey.50',
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
                          <Chip label={notification.teacher?.name || 'Giáo viên'} size="small" variant="outlined" />
                          <Typography variant="caption" color="text.secondary">
                            {formatTimeAgo(notification.createdAt)}
                          </Typography>
                        </Stack>
                      </Box>
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
