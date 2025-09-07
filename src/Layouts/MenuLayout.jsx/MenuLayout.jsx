import { Box, Container, Stack, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'
import BreadCrumbsPath from '@/components/BreadCrumbsPath'
import Selection from '@/components/Selection'
import TopicList from '@/components/TopicList'
import { useGetAllTopicsQuery } from '@/features/api/topicApi'
import useResponsive from '@/hooks/useResponsive'
import ImageLazy from '@/components/ImageLazy'

function MenuLayout() {
  const { isMobile } = useResponsive()
  const { data: topics = [], isSuccess } = useGetAllTopicsQuery()
  return (
    <Container sx={{ my: 2 }}>
      <BreadCrumbsPath />

      <Stack direction="row" alignItems="center" justifyContent={{ sm: 'space-between', xs: 'flex-end' }} mt={2}>
        {!isMobile && (
          <Typography variant="subtitle1" fontWeight={600} my={2}>
            DANH MỤC
          </Typography>
        )}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="subtitle2">Sắp xếp</Typography>
          <Selection />
        </Stack>
      </Stack>

      <Stack direction="row">
        {!isMobile && (
          <Box flex="0 0 25%" maxWidth="25%">
            <TopicList items={isSuccess ? topics : []} />
          </Box>
        )}

        <Outlet />
      </Stack>
      <ImageLazy src="banner.png?tr=w-1920,h-700,cm-extract" alt="banner" w="100%" />
    </Container>
  )
}

export default MenuLayout
