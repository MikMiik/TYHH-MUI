import VideoCard from '@/components/VideoCard'
import { Stack } from '@mui/material'

function Courses() {
  return (
    <Stack direction="row" flexWrap="wrap" gap={3} justifyContent="end" flex="0 0 75%" maxWidth="75%">
      <VideoCard />
      <VideoCard />
      <VideoCard />
      <VideoCard />
      <VideoCard />
      <VideoCard />
    </Stack>
  )
}

export default Courses
