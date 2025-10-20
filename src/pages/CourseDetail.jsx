import BreadCrumbsPath from '@/components/BreadCrumbsPath'
import { Box, Button, Chip, Container, Divider, Paper, Stack, Typography } from '@mui/material'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import VideoComp from '@/components/VideoComp'
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import DraggableOutlineItem from '@/components/DraggableOutlineItem'
import CreateOutlineModal from '@/components/CreateOutlineModal'
import CreateLivestreamModal from '@/components/CreateLivestreamModal'
import EditOutlineModal from '@/components/EditOutlineModal'
import CreateCourseModal from '@/components/CreateCourseModal'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import PaymentModal from '@/components/PaymentModal'
import {
  useGetCourseQuery,
  useDeleteCourseOutlineMutation,
  useReorderCourseOutlinesMutation,
} from '@/features/api/courseApi'
import { useCheckEnrollmentQuery } from '@/features/api/paymentsApi'
import { useParams, useNavigate } from 'react-router-dom'
import { useLoadingState } from '@/components/withLoadingState'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useUserRole } from '@/hooks/useUserRole'
import { useCurrentUser } from '@/hooks/useCurrentUser'

const CourseDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const queryResult = useGetCourseQuery(slug)
  const { data: course, LoadingStateComponent } = useLoadingState(queryResult, {
    variant: 'page',
    loadingText: 'Đang tải thông tin khóa học...',
    emptyText: 'Không tìm thấy khóa học này',
  })

  // Get current user info for payment
  const user = useCurrentUser()

  // Check enrollment status
  const { data: enrollmentData, isLoading: isEnrollmentLoading } = useCheckEnrollmentQuery(course?.id, {
    skip: !course?.id || !user?.id, // Skip query if course or user not loaded
  })

  const isEnrolled = enrollmentData?.data?.enrolled || false
  const isLoadingEnrollment = isEnrollmentLoading && course?.id && user?.id

  // Enrollment check performed via RTK Query (no debug logs in production)

  const [openOutlineModal, setOpenOutlineModal] = useState(false)
  const [editModal, setEditModal] = useState({
    open: false,
    outline: null,
  })
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    outlineId: null,
    outlineName: '',
  })
  const [livestreamModal, setLivestreamModal] = useState({
    open: false,
    outline: null,
  })
  const [editCourseModal, setEditCourseModal] = useState(false)
  const [paymentModal, setPaymentModal] = useState(false)

  const [deleteOutline, { isLoading: isDeleting }] = useDeleteCourseOutlineMutation()
  const [reorderOutlines] = useReorderCourseOutlinesMutation()

  const userRole = useUserRole()
  const isTeacher = userRole?.includes('teacher')

  // Setup sensors for dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleCreateOutline = () => {
    setOpenOutlineModal(true)
  }

  const handleCloseOutlineModal = () => {
    setOpenOutlineModal(false)
  }

  const handleOutlineCreated = () => {
    setOpenOutlineModal(false)
    // RTK Query sẽ tự động refetch thông qua invalidatesTags, không cần gọi refetch() thủ công
  }

  const handleEditOutline = (outline) => {
    setEditModal({
      open: true,
      outline,
    })
  }

  const handleCloseEditModal = () => {
    setEditModal({
      open: false,
      outline: null,
    })
  }

  const handleOutlineUpdated = () => {
    setEditModal({
      open: false,
      outline: null,
    })
    // RTK Query sẽ tự động refetch thông qua invalidatesTags
  }

  const handleDeleteOutline = (outlineId, outlineName) => {
    setDeleteModal({
      open: true,
      outlineId,
      outlineName,
    })
  }

  const handleCreateLivestream = (outline) => {
    setLivestreamModal({
      open: true,
      outline: {
        ...outline,
        courseId: course?.id, // Ensure courseId is passed
      },
    })
  }

  const handleCloseLivestreamModal = () => {
    setLivestreamModal({
      open: false,
      outline: null,
    })
  }

  const handleLivestreamCreated = () => {
    setLivestreamModal({
      open: false,
      outline: null,
    })
    // RTK Query sẽ tự động refetch thông qua invalidatesTags
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteOutline(deleteModal.outlineId).unwrap()
      toast.success('Xóa outline thành công!')
      setDeleteModal({ open: false, outlineId: null, outlineName: '' })
      // RTK Query sẽ tự động refetch thông qua invalidatesTags, không cần gọi refetch() thủ công
    } catch (error) {
      toast.error(error?.data?.message || 'Có lỗi xảy ra khi xóa outline')
    }
  }

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModal({ open: false, outlineId: null, outlineName: '' })
    }
  }

  const handleCourseUpdated = (updatedCourse) => {
    setEditCourseModal(false)

    // Nếu slug thay đổi, redirect đến URL mới
    if (updatedCourse?.slug && updatedCourse.slug !== slug) {
      navigate(`/courses/${updatedCourse.slug}`, { replace: true })
      toast.success('Đã cập nhật khóa học thành công!')
    } else {
      toast.success('Đã cập nhật khóa học thành công!')
    }
  }

  // Handle drag and drop reorder with dnd-kit
  const handleDragEnd = async (event) => {
    // Disable drag if user is not a teacher
    if (!isTeacher) {
      return
    }

    const { active, over } = event

    // No destination or no movement
    if (!over || active.id === over.id) {
      return
    }

    if (!course?.outlines) {
      return
    }

    try {
      // Find current positions
      const oldIndex = course.outlines.findIndex((outline) => outline.id.toString() === active.id)
      const newIndex = course.outlines.findIndex((outline) => outline.id.toString() === over.id)

      // Create reordered array
      const reorderedOutlines = arrayMove(course.outlines, oldIndex, newIndex)

      // Create orders payload for API
      const orders = reorderedOutlines.map((outline, index) => ({
        id: outline.id,
        order: index + 1,
      }))

      await reorderOutlines({
        courseId: course.id,
        orders,
      }).unwrap()

      toast.success('Đã sắp xếp lại thứ tự outline!')
    } catch (error) {
      toast.error(error?.data?.message || 'Có lỗi xảy ra khi sắp xếp lại outline')
    }
  }

  // Handle payment modal
  const handleOpenPayment = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để đăng ký khóa học')
      return
    }
    setPaymentModal(true)
  }

  const handleClosePayment = () => {
    setPaymentModal(false)
  }

  const handlePaymentSuccess = () => {
    setPaymentModal(false)
    toast.success('Đăng ký khóa học thành công!')
  }

  return (
    <LoadingStateComponent>
      <Container>
        <Box width="100%" py={2}>
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

          {isTeacher && (
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<EditIcon />}
              onClick={() => setEditCourseModal(true)}
              sx={{ alignSelf: 'flex-start', mt: 2 }}
            >
              Chỉnh sửa khóa học
            </Button>
          )}
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" gap={1} my={1}>
            {/* Left */}
            <Box width={{ md: '66.7%', xs: '100%' }}>
              <Paper
                elevation={2}
                sx={{
                  borderRadius: 1,
                  overflow: 'hidden',
                  '& .video-js .vjs-poster': {
                    backgroundSize: 'cover !important',
                    backgroundPosition: 'center !important',
                  },
                }}
              >
                <VideoComp src={course?.introVideo} />
              </Paper>
            </Box>

            {/* Right */}
            <Stack
              direction="column"
              justifyContent="flex-start"
              alignItems="center"
              width={{ md: '33.3%', xs: '100%' }}
            >
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
                <Button
                  startIcon={isEnrolled ? <CheckCircleIcon /> : <AppRegistrationIcon />}
                  variant="contained"
                  color={isEnrolled ? 'success' : 'tertiary'}
                  onClick={isEnrolled || isTeacher ? undefined : handleOpenPayment}
                  disabled={isEnrolled || isLoadingEnrollment || isTeacher}
                  sx={isEnrolled || isTeacher ? { cursor: 'default' } : {}}
                >
                  {isLoadingEnrollment
                    ? 'Đang kiểm tra...'
                    : isEnrolled
                    ? 'Bạn đã đăng ký khóa học này'
                    : isTeacher
                    ? 'Đã đăng ký khóa học'
                    : 'Đăng ký khóa học'}
                </Button>

                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<FacebookOutlinedIcon />}
                  component="a"
                  href={course?.teacher?.facebook || 'https://www.facebook.com/'}
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
                  href={course?.group || 'https://www.facebook.com/'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Group Facebook
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

            {/* Drag and Drop Context for Outlines with dnd-kit */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext
                items={course?.outlines?.map((outline) => outline.id.toString()) || []}
                strategy={verticalListSortingStrategy}
              >
                <Stack spacing={2} sx={{ minHeight: course?.outlines?.length ? 'auto' : 100 }}>
                  {course?.outlines?.length > 0 ? (
                    course.outlines.map((outline, index) => (
                      <DraggableOutlineItem
                        key={outline.id}
                        courseSlug={course?.slug}
                        outline={outline}
                        index={index}
                        onDeleteOutline={handleDeleteOutline}
                        onEditOutline={handleEditOutline}
                        onCreateLivestream={handleCreateLivestream}
                        isDragDisabled={!isTeacher}
                        activeAction={isTeacher}
                        isEnrolled={isEnrolled}
                        isTeacher={isTeacher}
                        hasActiveKey={user?.activeKey}
                        defaultExpanded
                      />
                    ))
                  ) : (
                    <Box
                      sx={{
                        textAlign: 'center',
                        py: 4,
                        color: 'text.secondary',
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body2">Chưa có outline nào. Hãy tạo outline đầu tiên!</Typography>
                    </Box>
                  )}
                  {isTeacher && (
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleCreateOutline}
                      sx={{ alignSelf: 'flex-start', mt: 2, color: 'primary.light' }}
                    >
                      Tạo Outline Mới
                    </Button>
                  )}
                </Stack>
              </SortableContext>
            </DndContext>

            {/* Create Outline Modal */}
            <CreateOutlineModal
              open={openOutlineModal}
              onClose={handleCloseOutlineModal}
              onOutlineCreated={handleOutlineCreated}
              courseId={course?.id}
            />

            {/* Create Livestream Modal */}
            <CreateLivestreamModal
              open={livestreamModal.open}
              onClose={handleCloseLivestreamModal}
              onLivestreamCreated={handleLivestreamCreated}
              outline={livestreamModal.outline}
            />

            {/* Edit Outline Modal */}
            <EditOutlineModal
              open={editModal.open}
              onClose={handleCloseEditModal}
              onOutlineUpdated={handleOutlineUpdated}
              outline={editModal.outline}
            />

            {/* Edit Course Modal */}
            <CreateCourseModal
              open={editCourseModal}
              onClose={() => setEditCourseModal(false)}
              onCourseCreated={handleCourseUpdated}
              editMode={true}
              initialData={course}
            />

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
              open={deleteModal.open}
              onClose={handleCloseDeleteModal}
              onConfirm={handleConfirmDelete}
              title="Xóa outline"
              message="Bạn có chắc chắn muốn xóa outline này? Tất cả livestream liên quan sẽ bị xóa vĩnh viễn."
              itemName={deleteModal.outlineName}
              loading={isDeleting}
            />

            {/* Payment Modal */}
            <PaymentModal
              open={paymentModal}
              onClose={handleClosePayment}
              onPaymentSuccess={handlePaymentSuccess}
              course={course}
              user={user}
              amount={course?.discount || course?.price}
            />
          </Box>
        </Box>
      </Container>
    </LoadingStateComponent>
  )
}

export default CourseDetail
