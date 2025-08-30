import BreadCrumbsPath from '@/components/BreadCrumbsPath'

import { Box, Button, Chip, Container, Divider, ListItem, Stack, Typography } from '@mui/material'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import VideoComp from '@/components/VideoComp'
import FacebookIcon from '@mui/icons-material/Facebook'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import ListItemStack from '@/components/ListItemStack'
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined'
import CourseOutlineItem from '@/components/CourseOutlineItem'

const CourseDetail = () => {
  return (
    <Container>
      <Box width="100%" my={2}>
        <BreadCrumbsPath />
        <Typography my={2} variant="h6" fontWeight={600}>
          VẬN DỤNG CAO 9+ | TYHH
        </Typography>
        <Stack direction="row" alignItems="center" gap={1} my={2}>
          <ArticleOutlinedIcon fontSize="smaller" />
          <Typography>Chào mừng em đến với Khóa Vận Dụng Cao 9+ (VDC9+ năm 2026 dành cho LOVEVIP2K8)! </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" gap={1} my={1}>
          <PersonOutlineOutlinedIcon fontSize="smaller" />
          <Typography variant="subtitle2" color="secondary.main">
            THẦY PHẠM THẮNG
          </Typography>
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" gap={1} my={1}>
          {/* Left */}
          <Box width={{ md: '66.7%', xs: '100%' }}>
            <VideoComp />
          </Box>

          {/* Right */}
          <Stack direction="column" justifyContent="flex-start" alignItems="center" width={{ md: '33.3%', xs: '100%' }}>
            <Typography variant="subtitle1" fontWeight={600} color="secondary.main">
              Học trọn gói cả năm chỉ với
            </Typography>

            <Typography variant="h5" fontWeight={600} color="tertiary.main" my={2}>
              1.000.000₫
            </Typography>

            <Stack direction="row" gap={2}>
              <Button variant="contained" color="tertiary">
                Đăng ký khóa học
              </Button>
              <Button startIcon={<FacebookIcon />} variant="contained" color="secondary">
                Tư vấn viên
              </Button>
            </Stack>

            <Box>
              <Stack direction="row" alignItems="center" gap={1} mt={2}>
                <DescriptionOutlinedIcon fontSize="smaller" color="tertiary" />
                <Typography>Cấu trúc khóa học:</Typography>
              </Stack>

              <ListItemStack my={0} sx={{ '& .MuiListItem-root': { display: 'list-item' } }}>
                <ListItem>
                  <Typography variant="subtitle2">13 chuyên đề</Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="subtitle2">61 bài giảng</Typography>
                </ListItem>
              </ListItemStack>

              <Stack direction="row" alignItems="center" gap={1} mt={2}>
                <FacebookOutlinedIcon fontSize="smaller" color="secondary" />
                <Typography>Liên hệ:</Typography>
              </Stack>

              <ListItemStack
                my={0}
                sx={{
                  '& .MuiListItem-root': { display: 'list-item' },
                  '& .MuiTypography-root': { textDecoration: 'none', color: 'secondary.main' },
                }}
              >
                <ListItem>
                  <Typography component="a" href="https://www.facebook.com/" variant="subtitle2">
                    Facebook giáo viên
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography component="a" href="https://www.facebook.com/groups/" variant="subtitle2">
                    Group học tập
                  </Typography>
                </ListItem>
              </ListItemStack>
            </Box>
          </Stack>
        </Stack>

        <Box>
          <Divider sx={{ mt: 6, mb: 4 }}>
            <Chip label="Mô tả khóa học" size="medium" color="secondary" sx={{ fontSize: '1rem', p: 2 }} />
          </Divider>
          <Typography>
            Chào mừng em đến với khóa CHUYÊN ĐỀ LIVE T! Khóa học này sẽ giúp các em nắm chắc tất cả các dạng lý thuyết
            và bài tập trọng tâm nhất trong CHUYÊN ĐỀ HÓA 12 (SGK MỚI). Các dạng bài sẽ được Thầy Phạm Thắng dạy chậm -
            kỹ - học đến đâu chắc đến đấy. Phần này yêu cầu tất cả các học sinh đều phải tham gia học đầy đủ. PHẢI HỌC
            THẬT CHẮC KHÓA CHUYÊN ĐỀ LIVE T THÌ CÁC EM MỚI CÓ THỂ TỔNG ÔN + LUYỆN ĐỀ ĐẠT KẾT QUẢ CAO NHẤT! Tự Học - TỰ
            LẬP - Tự Do! Thầy Phạm Thắng
          </Typography>
          <Divider sx={{ my: 4 }}>
            <Chip label="Đề cương khóa học" size="medium" color="secondary" sx={{ fontSize: '1rem', p: 2 }} />
          </Divider>
          <Stack spacing={2}>
            <CourseOutlineItem></CourseOutlineItem>
            <CourseOutlineItem></CourseOutlineItem>
            <CourseOutlineItem></CourseOutlineItem>
          </Stack>
        </Box>
      </Box>
    </Container>
  )
}

export default CourseDetail
