import BreadCrumbsPath from '@/components/BreadCrumbsPath'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import VideoComp from '@/components/VideoComp'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'
import LocalVideoUploadModal from '@/components/LocalVideoUploadModal'
import { useParams } from 'react-router-dom'
import { useGetLivestreamQuery, useUpdateLivestreamMutation } from '@/features/api/livestreamApi'
import CourseOutlineItemCompact from '@/components/CourseOutlineItemCompact'
import { useLoadingState } from '@/components/withLoadingState'
import { useState } from 'react'
import { toast } from 'react-toastify'

const Livestream = () => {
  const { slug, courseSlug } = useParams()
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  const queryResult = useGetLivestreamQuery(slug)
  const { data: livestream, LoadingStateComponent } = useLoadingState(queryResult, {
    variant: 'page',
    loadingText: 'Đang tải livestream...',
    emptyText: 'Không tìm thấy livestream này',
  })

  const [updateLivestream] = useUpdateLivestreamMutation()

  const handleUploadVideo = () => {
    setUploadModalOpen(true)
  }

  const extractRelativePath = (response) => {
    // Use filePath directly as it's already relative from VideoUploadModal
    return response.filePath || response.url?.replace(/^.*\//, '') || ''
  }

  const handleUploadSuccess = async (response) => {
    console.log('Video uploaded successfully:', response)

    try {
      // Extract relative path from response
      const relativePath = extractRelativePath(response)

      // Update livestream with relative path
      await updateLivestream({
        id: livestream.id,
        url: relativePath,
      }).unwrap()

      toast.success('Cập nhật video thành công!')
    } catch (error) {
      console.error('Error updating livestream:', error)
      const errorMessage = error?.data?.message || 'Có lỗi xảy ra khi cập nhật video'
      toast.error(errorMessage)
    }
  }

  return (
    <LoadingStateComponent>
      <Container>
        <Box width="100%" my={2}>
          <BreadCrumbsPath
            customData={{
              courseTitle: livestream?.course?.title,
              livestreamTitle: livestream?.title,
            }}
          />
          <Typography my={2} variant="h6" fontWeight={600}>
            {livestream?.title || 'No title available'}
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" gap={1} my={1}>
            {/* Left */}
            <Box width={{ md: '66.7%', xs: '100%' }}>
              <VideoComp src={livestream?.url} livestreamSlug={livestream?.slug} />
            </Box>

            {/* Right */}
            <Stack
              direction="column"
              justifyContent="flex-start"
              alignItems="stretch"
              spacing={2}
              width={{ md: '33.3%', xs: '100%' }}
            >
              <Box
                className="livestream-course-outline"
                sx={{
                  maxHeight: 400,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  width: '100%',
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: '1px solid #e0e0e0',
                  '& .green-circle-step-icon': {
                    width: '16px !important',
                    height: '16px !important',
                    borderWidth: '2px !important',
                  },
                  '& .MuiAccordionSummary-root': {
                    px: 1,
                  },
                  '&::-webkit-scrollbar': {
                    width: 6,
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f1f1f1',
                    borderRadius: 3,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#c1c1c1',
                    borderRadius: 3,
                    '&:hover': {
                      backgroundColor: '#a8a8a8',
                    },
                  },
                }}
              >
                <Stack spacing={0.5} p={1}>
                  {livestream?.course?.outlines?.map((outline) => (
                    <CourseOutlineItemCompact
                      key={outline.id}
                      courseSlug={courseSlug}
                      title={outline.title}
                      livestreams={outline.livestreams}
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" gap={1} my={2}>
            <Button variant="contained" color="secondary" disableElevation startIcon={<DownloadIcon />} size="large">
              Tải Tài Liệu
            </Button>
            <Button variant="contained" color="tertiary" disableElevation size="large" startIcon={<DownloadIcon />}>
              Tải Slidenote
            </Button>
            <Button
              variant="contained"
              color="primary"
              disableElevation
              size="large"
              startIcon={<UploadIcon />}
              onClick={handleUploadVideo}
            >
              Upload Video
            </Button>
          </Stack>
        </Box>

        {/* Video Upload Modal */}
        <LocalVideoUploadModal
          open={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
          livestream={livestream}
        />
      </Container>
    </LoadingStateComponent>
  )
}

export default Livestream
