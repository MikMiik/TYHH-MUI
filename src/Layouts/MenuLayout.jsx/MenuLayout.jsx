import { Box, Container, Stack, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'
import BreadCrumbsPath from '@/components/BreadCrumbsPath'
import Selection from '@/components/Selection'
import CourseList from '@/components/CourseList'

function MenuLayout() {
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
        <Box>
          <Outlet />
        </Box>
      </Stack>
    </Container>
  )
}

export default MenuLayout
