import { Box, Container, Typography, Paper, Stack, Pagination } from '@mui/material'
import BreadCrumbsPath from '@/components/BreadCrumbsPath'
import VideoCard from '@/components/VideoCard'
import { useGetMyCoursesQuery } from '@/features/api/userApi'
import { useLoadingState } from '@/components/withLoadingState'
import { useState } from 'react'

const MyCourses = () => {
  const [page, setPage] = useState(1)
  const pageSize = 6

  const queryResult = useGetMyCoursesQuery()
  const { data: courses = [], LoadingStateComponent } = useLoadingState(queryResult, {
    variant: 'page',
    loadingText: 'Đang tải khóa học của bạn...',
    emptyText: 'Bạn chưa đăng ký khóa học nào',
    hasDataCheck: (courses) => courses && courses.length > 0,
  })

  // Pagination logic
  const totalPages = Math.ceil(courses.length / pageSize)
  const startIndex = (page - 1) * pageSize
  const paginatedCourses = courses.slice(startIndex, startIndex + pageSize)

  const handlePageChange = (_, value) => {
    setPage(value)
  }

  return (
    <LoadingStateComponent>
      <Container>
        <Box py={3}>
          <BreadCrumbsPath />

          <Paper elevation={2} sx={{ mt: 3, p: 4 }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
                  Khóa học của tôi
                </Typography>
                {courses.length > 0 && (
                  <Typography variant="body1" color="text.secondary">
                    Bạn đã đăng ký {courses.length} khóa học
                  </Typography>
                )}
              </Box>

              {courses.length === 0 ? (
                <Box textAlign="center" py={6}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Bạn chưa đăng ký khóa học nào
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hãy khám phá và đăng ký các khóa học hấp dẫn để bắt đầu học tập!
                  </Typography>
                </Box>
              ) : (
                <Stack
                  direction="row"
                  flexWrap="wrap"
                  gap={{ xs: 1, sm: 2, md: 2 }}
                  justifyContent={{ sm: 'space-between', xs: 'center' }}
                >
                  {paginatedCourses.map((course) => (
                    <VideoCard
                      key={course.id}
                      course={course}
                      sx={{
                        width: { xs: '70%', sm: '48%', lg: '249px' },
                      }}
                    />
                  ))}
                </Stack>
              )}

              {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={3}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                  />
                </Box>
              )}
            </Stack>
          </Paper>
        </Box>
      </Container>
    </LoadingStateComponent>
  )
}

export default MyCourses
