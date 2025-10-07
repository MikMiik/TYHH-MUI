import { Box, Container, Typography, Stack, Chip, Divider, Alert, CircularProgress } from '@mui/material'
import { useState } from 'react'
import { useGetCreatedCoursesQuery } from '@/features/api/courseApi'
import ImageLazy from '@/components/ImageLazy'

function CreatedCourses() {
  const [page] = useState(1)
  const [search] = useState('')

  const {
    data: createdCoursesData,
    isLoading,
    isError,
    error,
  } = useGetCreatedCoursesQuery({
    page,
    limit: 10,
    search,
  })

  // Group courses by topics
  const groupCoursesByTopics = (courses) => {
    if (!courses || courses.length === 0) return []

    const groupedByTopic = {}

    courses.forEach((course) => {
      // If course has no topics, put it in "Khác" category
      if (!course.topics || course.topics.length === 0) {
        if (!groupedByTopic['Khác']) {
          groupedByTopic['Khác'] = {
            id: 'other',
            title: 'Khác',
            slug: 'khac',
            courses: [],
          }
        }
        groupedByTopic['Khác'].courses.push(course)
      } else {
        // Group by each topic
        course.topics.forEach((topic) => {
          if (!groupedByTopic[topic.title]) {
            groupedByTopic[topic.title] = {
              id: topic.id,
              title: topic.title,
              slug: topic.slug,
              courses: [],
            }
          }
          // Avoid duplicates
          if (!groupedByTopic[topic.title].courses.find((c) => c.id === course.id)) {
            groupedByTopic[topic.title].courses.push(course)
          }
        })
      }
    })

    return Object.values(groupedByTopic)
  }

  const topics = createdCoursesData?.courses ? groupCoursesByTopics(createdCoursesData.courses) : []
  const totalCourses = createdCoursesData?.courses?.length || 0
  const publishedCourses = createdCoursesData?.courses?.filter((course) => !course.isDraft)?.length || 0
  const draftCourses = totalCourses - publishedCourses
  const totalStudents = createdCoursesData?.courses?.reduce((sum, course) => sum + (course.studentCount || 0), 0) || 0

  if (isLoading) {
    return (
      <Container sx={{ my: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (isError) {
    return (
      <Container sx={{ my: 3 }}>
        <Alert severity="error">
          Có lỗi xảy ra khi tải danh sách khóa học: {error?.data?.message || error?.message || 'Lỗi không xác định'}
        </Alert>
      </Container>
    )
  }

  return (
    <Container sx={{ my: 3 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
          Khóa học đã tạo
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý và theo dõi các khóa học bạn đã tạo
        </Typography>
      </Box>

      {/* Stats Overview */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} mb={4}>
        <Box
          sx={{
            p: 2,
            bgcolor: 'primary.main',
            color: 'white',
            borderRadius: 2,
            flex: 1,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            {totalCourses}
          </Typography>
          <Typography variant="body2">Tổng khóa học</Typography>
        </Box>
        <Box
          sx={{
            p: 2,
            bgcolor: 'success.main',
            color: 'white',
            borderRadius: 2,
            flex: 1,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            {publishedCourses}
          </Typography>
          <Typography variant="body2">Đã xuất bản</Typography>
        </Box>
        <Box
          sx={{
            p: 2,
            bgcolor: 'warning.main',
            color: 'white',
            borderRadius: 2,
            flex: 1,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            {draftCourses}
          </Typography>
          <Typography variant="body2">Bản nháp</Typography>
        </Box>
        <Box
          sx={{
            p: 2,
            bgcolor: 'info.main',
            color: 'white',
            borderRadius: 2,
            flex: 1,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            {totalStudents}
          </Typography>
          <Typography variant="body2">Tổng học viên</Typography>
        </Box>
      </Stack>

      {/* Courses by Topic */}
      {topics.length > 0 ? (
        topics.map((topic) => (
          <Box key={topic.id} mb={5}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Stack direction="column">
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  {topic.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {topic.courses.length} khóa học
                </Typography>
              </Stack>
            </Stack>

            {/* Course Grid */}
            <Stack spacing={2}>
              {topic.courses.map((course) => (
                <Box
                  key={course.id}
                  sx={{
                    p: 3,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    '&:hover': {
                      boxShadow: 2,
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                    {/* Course Image */}
                    <Box
                      sx={{
                        width: { xs: '100%', md: 200 },
                      }}
                    >
                      <ImageLazy w="100%" src={course.thumbnail} alt={course.title} />
                    </Box>

                    {/* Course Info */}
                    <Box flex={1}>
                      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                        <Typography variant="h6" fontWeight={600}>
                          {course.title}
                        </Typography>
                        <Chip
                          label={course.isDraft ? 'Bản nháp' : 'Đã xuất bản'}
                          color={course.isDraft ? 'warning' : 'success'}
                          size="small"
                        />
                      </Stack>

                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {course.description}
                      </Typography>

                      <Stack direction="row" spacing={3} mb={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Bài giảng
                          </Typography>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {course.totalOutlines || 0} bài
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Livestream
                          </Typography>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {course.totalLivestreams || 0} buổi
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Học viên
                          </Typography>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {course.studentCount || 0} người
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Giá
                          </Typography>
                          <Typography variant="subtitle2" fontWeight={600} color="primary.main">
                            {course.isFree ? 'Miễn phí' : `${(course.price || 0).toLocaleString('vi-VN')}đ`}
                          </Typography>
                        </Box>
                      </Stack>

                      <Typography variant="caption" color="text.secondary">
                        Tạo ngày: {new Date(course.createdAt).toLocaleDateString('vi-VN')}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Stack>

            {topic.id !== topics[topics.length - 1].id && <Divider sx={{ mt: 3 }} />}
          </Box>
        ))
      ) : (
        /* Empty State */
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Chưa có khóa học nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hãy tạo khóa học đầu tiên của bạn
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default CreatedCourses
