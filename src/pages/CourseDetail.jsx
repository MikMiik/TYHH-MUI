import BreadCrumbsPath from '@/components/BreadCrumbsPath'
import { Box, Button, Chip, Container, Divider, Stack, Typography } from '@mui/material'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import AddIcon from '@mui/icons-material/Add'
import VideoComp from '@/components/VideoComp'
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import CourseOutlineItem from '@/components/CourseOutlineItem'
import CreateOutlineModal from '@/components/CreateOutlineModal'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import { useGetCourseQuery, useDeleteCourseOutlineMutation } from '@/features/api/courseApi'
import { useParams } from 'react-router-dom'
import { useLoadingState } from '@/components/withLoadingState'
import { useState } from 'react'
import { toast } from 'react-toastify'

const CourseDetail = () => {
  const { slug } = useParams()
  const queryResult = useGetCourseQuery(slug)
  const { data: course, LoadingStateComponent } = useLoadingState(queryResult, {
    variant: 'page',
    loadingText: 'Đang tải thông tin khóa học...',
    emptyText: 'Không tìm thấy khóa học này',
  })

  const [openOutlineModal, setOpenOutlineModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    outlineId: null,
    outlineName: '',
  })

  const [deleteOutline, { isLoading: isDeleting }] = useDeleteCourseOutlineMutation()

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

  const handleDeleteOutline = (outlineId, outlineName) => {
    setDeleteModal({
      open: true,
      outlineId,
      outlineName,
    })
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

  return (
    <LoadingStateComponent>
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
                <CourseOutlineItem
                  key={outline.id}
                  title={outline.title}
                  livestreams={outline.livestreams}
                  outlineId={outline.id}
                  onDeleteOutline={handleDeleteOutline}
                />
              ))}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreateOutline}
                sx={{ alignSelf: 'flex-start', mt: 2 }}
              >
                Tạo Outline Mới
              </Button>
            </Stack>

            {/* Create Outline Modal */}
            <CreateOutlineModal
              open={openOutlineModal}
              onClose={handleCloseOutlineModal}
              onOutlineCreated={handleOutlineCreated}
              courseId={course?.id}
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
          </Box>
        </Box>
      </Container>
    </LoadingStateComponent>
  )
}

export default CourseDetail
