import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useGetCreatedCoursesQuery, useDeleteCourseMutation } from '@/features/api/courseApi'
import LocalImageLazy from '@/components/LocalImageLazy'
import CreateCourseModal from '@/components/CreateCourseModal'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useUserRole } from '@/hooks/useUserRole'

function CreatedCourses() {
  const userRole = useUserRole()
  const isTeacher = userRole?.includes('teacher')
  const navigate = useNavigate()
  const [page] = useState(1)
  const [search] = useState('')
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [editModal, setEditModal] = useState({
    open: false,
    courseData: null,
  })
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    courseId: null,
    courseName: '',
  })

  const {
    data: createdCoursesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCreatedCoursesQuery({
    page,
    limit: 10,
    search,
  })

  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation()

  useEffect(() => {
    if (!isTeacher) {
      navigate('/')
    }
  }, [isTeacher, navigate])

  const handleCreateCourse = () => {
    setOpenCreateModal(true)
  }

  const handleEditCourse = (course) => {
    setEditModal({
      open: true,
      courseData: course,
    })
  }

  const handleDeleteCourse = (courseId, courseTitle) => {
    setDeleteModal({
      open: true,
      courseId,
      courseName: courseTitle,
    })
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteCourse(deleteModal.courseId).unwrap()
      setDeleteModal({ open: false, courseId: null, courseName: '' })
      // refetch sẽ được tự động gọi do invalidatesTags
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa khóa học: ' + (error.data?.message || error.message))
    }
  }

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModal({ open: false, courseId: null, courseName: '' })
    }
  }

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false)
  }

  const handleCloseEditModal = () => {
    setEditModal({ open: false, courseData: null })
  }

  const handleCourseCreated = () => {
    setOpenCreateModal(false)
    refetch() // Refresh the course list
  }

  const handleCourseEdited = () => {
    setEditModal({ open: false, courseData: null })
    refetch() // Refresh the course list
  }

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
      <Container sx={{ py: 3 }}>
        <Alert severity="error">
          Có lỗi xảy ra khi tải danh sách khóa học: {error?.data?.message || error?.message || 'Lỗi không xác định'}
        </Alert>
      </Container>
    )
  }

  return (
    <Container sx={{ py: 3 }}>
      {/* Header */}
      <Box mb={4}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
              Khóa học đã tạo
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Quản lý và theo dõi các khóa học bạn đã tạo
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateCourse}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
            }}
          >
            Tạo khóa học mới
          </Button>
        </Stack>
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
                    position: 'relative',
                  }}
                >
                  <Link to={`/courses/${course.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Box
                      sx={{
                        p: 3,
                        border: '1px solid',
                        borderColor: 'grey.300',
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s, border-color 0.2s',
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
                          <LocalImageLazy w="100%" h="120px" src={course.thumbnail} alt={course.title} />
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
                                {course.isFree ? 'Miễn phí' : `${(Number(course.price) || 0).toLocaleString('vi-VN')}đ`}
                              </Typography>
                            </Box>
                          </Stack>

                          <Typography variant="caption" color="text.secondary">
                            Tạo ngày: {new Date(course.createdAt).toLocaleDateString('vi-VN')}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Link>

                  {/* Action Icons */}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 2,
                    }}
                  >
                    {/* Edit Icon */}
                    <Tooltip title="Chỉnh sửa khóa học">
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: 'background.paper',
                          boxShadow: 1,
                          '&:hover': {
                            bgcolor: 'primary.main',
                            color: 'white',
                          },
                        }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          e.currentTarget.blur()
                          handleEditCourse(course)
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {/* Delete Icon */}
                    <Tooltip title="Xóa khóa học">
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: 'background.paper',
                          boxShadow: 1,
                          '&:hover': {
                            bgcolor: 'error.main',
                            color: 'white',
                          },
                        }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          // Blur the button to remove focus before opening modal
                          e.currentTarget.blur()
                          handleDeleteCourse(course.id, course.title)
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
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

      {/* Create Course Modal */}
      <CreateCourseModal
        open={openCreateModal}
        onClose={handleCloseCreateModal}
        onCourseCreated={handleCourseCreated}
      />

      {/* Edit Course Modal */}
      <CreateCourseModal
        open={editModal.open}
        onClose={handleCloseEditModal}
        onCourseCreated={handleCourseEdited}
        editMode={true}
        initialData={editModal.courseData}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={deleteModal.open}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Xóa khóa học"
        message="Bạn có chắc chắn muốn xóa khóa học này? Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn."
        itemName={deleteModal.courseName}
        loading={isDeleting}
      />
    </Container>
  )
}

export default CreatedCourses
