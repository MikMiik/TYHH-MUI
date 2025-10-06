import VideoCard from '@/components/VideoCard'
import { Box, Stack, Pagination } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { useGetAllCoursesQuery } from '@/features/api/courseApi'
import React from 'react'

function Courses() {
  const [searchParams, setSearchParams] = useSearchParams()
  const topic = searchParams.get('topic') || ''
  const page = parseInt(searchParams.get('page')) || 1
  const sort = searchParams.get('sort') || 'newest'
  const pageSize = 6

  const { data: { courses, totalPages } = {}, isSuccess } = useGetAllCoursesQuery(
    {
      ...(topic ? { topic } : {}),
      page,
      limit: pageSize,
      sort,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const handlePageChange = (_, value) => {
    const newParams = {
      ...(topic ? { topic } : {}),
      ...(sort ? { sort } : {}),
      page: value.toString(),
    }
    setSearchParams(newParams)
  }

  return (
    <Box width="100%">
      <Stack
        direction="row"
        flexWrap="wrap"
        ml={{ xs: 0, sm: 2, md: 3 }}
        gap={{ xs: 1, sm: 2, md: 2 }}
        justifyContent={{ sm: 'space-between', xs: 'center' }}
      >
        {isSuccess && courses && courses.length > 0 ? (
          courses.map((course) => (
            <VideoCard
              key={course.id}
              course={course}
              sx={{
                width: { xs: '70%', sm: '48%', lg: '249px' },
              }}
            />
          ))
        ) : (
          <Box>No courses available.</Box>
        )}
      </Stack>
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" shape="rounded" />
        </Box>
      )}
    </Box>
  )
}

export default Courses
