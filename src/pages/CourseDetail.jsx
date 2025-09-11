import BreadCrumbsPath from '@/components/BreadCrumbsPath'
import { Box, Button, Chip, Container, Divider, Stack, Typography } from '@mui/material'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import VideoComp from '@/components/VideoComp'
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import CourseOutlineItem from '@/components/CourseOutlineItem'
import { useGetCourseQuery } from '@/features/api/courseApi'
import { useParams } from 'react-router-dom'

const CourseDetail = () => {
  const { slug } = useParams()
  const { data: course, isLoading, error } = useGetCourseQuery(slug)
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <Container>
      <Box width="100%" my={2}>
        <BreadCrumbsPath />
        <Typography my={2} variant="h6" fontWeight={600}>
          {course?.title || 'No title available'}
        </Typography>
        <Stack direction="row" alignItems="center" gap={1} my={2}>
          <ArticleOutlinedIcon fontSize="smaller" />
          <Typography>{course?.description || 'No description available'} </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" gap={1} my={1}>
          <PersonOutlineOutlinedIcon fontSize="smaller" />
          <Typography variant="subtitle2" color="secondary.main">
            {course?.teacher?.name?.toUpperCase() || 'Unknown Teacher'}
          </Typography>
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" gap={1} my={1}>
          {/* Left */}
          <Box width={{ md: '66.7%', xs: '100%' }}>
            <VideoComp />
          </Box>

          {/* Right */}
          <Stack direction="column" justifyContent="flex-start" alignItems="center" width={{ md: '33.3%', xs: '100%' }}>
            <Typography variant="subtitle1" fontWeight={600} color="secondary.main">
              Học trọn gói cả năm chỉ với
            </Typography>

            <Typography
              variant="h5"
              fontWeight={600}
              color="primary.dark"
              mt={2}
              sx={course?.discount ? { textDecoration: 'line-through' } : {}}
            >
              {course?.price ? `${parseInt(course.price, 10).toLocaleString('vi-VN')}₫` : 'No updated price'}
            </Typography>
            {course?.discount && (
              <Typography variant="h5" mb={2} fontWeight={700} color="tertiary.main">
                {`${parseInt(course.discount, 10).toLocaleString('vi-VN')}₫`}
              </Typography>
            )}

            <Stack direction="row" gap={2} flexWrap="wrap" justifyContent="center">
              <Button startIcon={<AppRegistrationIcon />} variant="contained" color="tertiary">
                Đăng ký khóa học
              </Button>
              <Button
                startIcon={<FacebookOutlinedIcon />}
                variant="contained"
                color="secondary"
                rel="noopener noreferrer"
              >
                Tư vấn viên
              </Button>

              <Button
                variant="contained"
                color="secondary"
                startIcon={<FacebookOutlinedIcon />}
                component="a"
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook giáo viên
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<FacebookOutlinedIcon />}
                component="a"
                href="https://www.facebook.com/groups/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Group học tập
              </Button>
            </Stack>
          </Stack>
        </Stack>

        <Box>
          <Divider sx={{ mt: 6, mb: 4 }}>
            <Chip label="Mô tả khóa học" size="medium" color="secondary" sx={{ fontSize: '1rem', p: 2 }} />
          </Divider>
          <Typography>{course?.content || 'No content available'}</Typography>
          <Divider sx={{ my: 4 }}>
            <Chip label="Đề cương khóa học" size="medium" color="secondary" sx={{ fontSize: '1rem', p: 2 }} />
          </Divider>
          <Stack spacing={2}>
            {course?.outlines?.map((outline) => (
              <CourseOutlineItem key={outline.id} title={outline.title} livestreams={outline.livestreams} />
            ))}
          </Stack>
        </Box>
      </Box>
    </Container>
  )
}

export default CourseDetail
