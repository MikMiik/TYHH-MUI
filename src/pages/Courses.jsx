import BreadCrumbsPath from '@/components/BreadCrumbsPath'
import CourseList from '@/components/CourseList'
import Selection from '@/components/Selection'
import VideoCard from '@/components/VideoCard'
import { Container, Typography, Box, Stack } from '@mui/material'

function Courses() {
  return (
    <Container sx={{ my: 2 }}>
      <BreadCrumbsPath />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mt={2}>
        <Typography variant="subtitle1" fontWeight={600} my={2}>
          DANH MỤC
        </Typography>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography>Sắp xếp</Typography>
          <Selection />
        </Stack>
      </Stack>
      <Stack direction="row">
        <Box flex="0 0 25%" maxWidth="25%">
          <CourseList items={['LIVEVIP 2K8', 'LIVEVIP 2K9', 'LIVEVIP 2K10']} />
        </Box>
        <Stack direction="row" flexWrap="wrap" gap={3} justifyContent="end" flex="0 0 75%" maxWidth="75%">
          <VideoCard />
          <VideoCard />
          <VideoCard />
          <VideoCard />
          <VideoCard />
          <VideoCard />
        </Stack>
      </Stack>
    </Container>
  )
}

export default Courses
