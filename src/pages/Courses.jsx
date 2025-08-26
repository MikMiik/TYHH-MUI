import VideoCard from '@/components/VideoCard'
import { Stack } from '@mui/material'

function Courses() {
  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      ml={{ xs: 0, sm: 2, md: 3 }}
      gap={{ xs: 1, sm: 2, md: 2 }}
      justifyContent={{ sm: 'space-between', xs: 'center' }}
    >
      {[...Array(6)].map((_, i) => (
        <VideoCard
          key={i}
          sx={{
            width: { xs: '70%', sm: '48%', lg: '249px' },
          }}
        />
      ))}
    </Stack>
  )
}

export default Courses
