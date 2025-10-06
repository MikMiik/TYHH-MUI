import BreadCrumbsPath from '@/components/BreadCrumbsPath'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import VideoComp from '@/components/VideoComp'
import DownloadIcon from '@mui/icons-material/Download'
import { useParams } from 'react-router-dom'
import { useGetLivestreamQuery } from '@/features/api/livestreamApi'
import CourseOutlineItemCompact from '@/components/CourseOutlineItemCompact'
import { useLoadingState } from '@/components/withLoadingState'

const Livestream = () => {
  const { slug } = useParams()
  const queryResult = useGetLivestreamQuery(slug)
  const { data: livestream, LoadingStateComponent } = useLoadingState(queryResult, {
    variant: 'page',
    loadingText: 'Đang tải livestream...',
    emptyText: 'Không tìm thấy livestream này',
  })

  return (
    <LoadingStateComponent>
      <Container>
        <Box width="100%" my={2}>
          <BreadCrumbsPath />
          <Typography my={2} variant="h6" fontWeight={600}>
            {livestream?.title || 'No title available'}
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" gap={1} my={1}>
            {/* Left */}
            <Box width={{ md: '66.7%', xs: '100%' }}>
              <VideoComp livestreamSlug={livestream?.slug} />
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
          </Stack>
        </Box>
      </Container>
    </LoadingStateComponent>
  )
}

export default Livestream
