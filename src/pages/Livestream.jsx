import BreadCrumbsPath from '@/components/BreadCrumbsPath'
import { Box, Button, Chip, Container, Divider, Stack, Typography } from '@mui/material'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import VideoComp from '@/components/VideoComp'
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import DownloadIcon from '@mui/icons-material/Download'
import { useParams } from 'react-router-dom'
import { useGetLivestreamQuery } from '@/features/api/livestreamApi'
import CourseOutlineItem from '@/components/CourseOutlineItem'

const Livestream = () => {
  const { slug } = useParams()
  const { data: livestream, isLoading } = useGetLivestreamQuery(slug)

  if (isLoading) return <Box p={4}>Đang tải livestream...</Box>

  return (
    <Container>
      <Box width="100%" my={2}>
        <BreadCrumbsPath />
        <Typography my={2} variant="h6" fontWeight={600}>
          {livestream?.title || 'No title available'}
        </Typography>
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
            spacing={2}
            width={{ md: '33.3%', xs: '100%' }}
          >
            {livestream?.course?.outlines?.map((outline) => (
              <CourseOutlineItem key={outline.id} title={outline.title} livestreams={outline.livestreams} />
            ))}
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
  )
}

export default Livestream
