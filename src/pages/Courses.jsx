import VideoCard from '@/components/VideoCard'
import { Box, Stack, Pagination } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { useGetAllCoursesQuery } from '@/features/api/courseApi'
import { useLoadingState } from '@/components/withLoadingState'
import React from 'react'

function Courses() {
  const [searchParams, setSearchParams] = useSearchParams()
  const topic = searchParams.get('topic') || ''
  const page = parseInt(searchParams.get('page')) || 1
  const sort = searchParams.get('sort') || 'newest'
  const search = searchParams.get('search') || ''
  const pageSize = 6

  const queryResult = useGetAllCoursesQuery(
    {
      ...(topic ? { topic } : {}),
      page,
      limit: pageSize,
      sort,
      search,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const { data: { courses, totalPages } = {}, LoadingStateComponent } = useLoadingState(queryResult, {
    variant: 'section',
    loadingText: 'Đang tải khóa học...',
    emptyText: 'Chưa có khóa học nào',
    skeletonType: 'card',
    skeletonCount: 6,
    dataKey: 'courses',
    hasDataCheck: (courses) => courses && courses.length > 0,
  })

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
      <LoadingStateComponent>
        <Stack
          direction="row"
          flexWrap="wrap"
          ml={{ xs: 0, sm: 2, md: 3 }}
          gap={{ xs: 1, sm: 2, md: 2 }}
          justifyContent={{ sm: 'flex-end', xs: 'center' }}
        >
          {courses &&
            courses.length > 0 &&
            courses.map((course) => (
              <VideoCard
                src={course.thumbnail ? `${import.meta.env.VITE_SERVER_URL}${course.thumbnail}` : ''}
                key={course.id}
                course={course}
                sx={{
                  width: { xs: '70%', sm: '48%', lg: '249px' },
                }}
              />
            ))}
        </Stack>
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" shape="rounded" />
          </Box>
        )}
      </LoadingStateComponent>
    </Box>
  )
}

export default Courses
