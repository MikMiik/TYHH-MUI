import { Box, Button, Container, Link, Paper, Stack, Typography } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import ScienceIcon from '@mui/icons-material/Science'
import { Suspense, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Spline from '@splinetool/react-spline'

import fbIcon from '@/assets/images/fbIcon.png'
import youtubeIcon from '@/assets/images/youtubeicon.png'
import tiktokIcon from '@/assets/images/tiktokIcon.png'
import LogoIcon from '@/components/LogoIcon'
import rankingBanner from '@/assets/images/ranking-banner-home.png'
import config from '@/routes/config'
import VideoCarousel from '@/components/VideoCarousel'
import MuiLink from '@/components/MuiLink'
import LocalImageLazy from '@/components/LocalImageLazy'
import VideoComp from '@/components/VideoComp'
import { useGetSocialsQuery } from '@/features/api/siteInfoApi'
import { useGetAllTopicsQuery } from '@/features/api/topicApi'
import { useGetAllCoursesQuery } from '@/features/api/courseApi'
import { useLoadingState } from '@/components/withLoadingState'

function Home() {
  const navigate = useNavigate()
  const { data: socials, isSuccess: socialsLoaded } = useGetSocialsQuery()
  const topicsQueryResult = useGetAllTopicsQuery()
  const { data: topics = [], LoadingStateComponent: TopicsLoadingState } = useLoadingState(topicsQueryResult, {
    variant: 'inline',
    loadingText: 'Đang tải chủ đề...',
    emptyText: 'Chưa có chủ đề nào',
    hasDataCheck: (topics) => topics && topics.length > 0,
  })

  // Lấy courses miễn phí để hiển thị trong phần "Free Video"
  const freeCoursesQueryResult = useGetAllCoursesQuery({
    isFree: true,
    limit: 5,
    sort: 'newest',
  })
  const { data: { courses: freeCourses = [] } = {}, LoadingStateComponent: FreeCoursesLoadingState } = useLoadingState(
    freeCoursesQueryResult,
    {
      variant: 'inline',
      loadingText: 'Đang tải khóa học miễn phí...',
      emptyText: 'Chưa có khóa học miễn phí nào',
      dataKey: 'courses',
      hasDataCheck: (courses) => courses && courses.length > 0,
    }
  )

  // Lấy random introVideo từ các freeCourses có video
  const randomIntroVideo = useMemo(() => {
    // Lọc các courses có introVideo
    const coursesWithVideo = freeCourses.filter((course) => course.introVideo)

    if (coursesWithVideo.length === 0) return null

    // Chọn random một course
    const randomIndex = Math.floor(Math.random() * coursesWithVideo.length)
    return coursesWithVideo[randomIndex].introVideo
  }, [freeCourses])

  const onSplineLoad = (spline) => {
    // Điều chỉnh camera để căn giữa scene
    const camera = spline.findObjectByName('Camera')
    if (camera) {
      // Reset camera position để căn giữa hoàn toàn
      camera.position.set(0, 0, 8)
      camera.lookAt(0, 0, 0)
      camera.rotation.set(0, 0, 0)
    }

    // Tự động fit scene vào viewport và căn giữa
    spline.setZoom(0.8)
  }

  return (
    <Box py={2}>
      {/* Head Banner */}
      <Box
        sx={{
          width: '100%',
          minHeight: '700px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            {/* Title Section */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  mb: 1,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}
              >
                🧪 TÔI YÊU HÓA HỌC 🧪
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'primary.main',
                  opacity: 0.8,
                  fontSize: { xs: '1rem', md: '1.125rem' },
                }}
              >
                Khám phá thế giới hóa học qua những bài học sinh động
              </Typography>
            </Box>

            {/* Spline Container */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                mb: 3,
              }}
            >
              <Suspense
                fallback={
                  <Box
                    sx={{
                      width: { xs: '350px', sm: '600px', md: '800px' },
                      height: { xs: '280px', sm: '450px', md: '600px' },
                      bgcolor: 'rgba(3, 76, 49, 0.05)',
                      border: '2px dashed',
                      borderColor: 'primary.light',
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography color="primary.main" variant="h6">
                      Đang tải mô hình 3D...
                    </Typography>
                  </Box>
                }
              >
                <Box
                  sx={{
                    width: { xs: '350px', sm: '600px', md: '800px' },
                    height: { xs: '280px', sm: '450px', md: '600px' },
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(3, 76, 49, 0.15)',
                    border: '1px solid',
                    borderColor: 'primary.light',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Spline scene="https://prod.spline.design/nArfjhfvkTR3joXc/scene.splinecode" onLoad={onSplineLoad} />
                </Box>
              </Suspense>
            </Box>

            {/* Description Section */}
            <Box sx={{ mt: 0, maxWidth: 600 }}>
              <Typography
                sx={{
                  color: 'primary.light',
                  lineHeight: 1.7,
                  fontSize: { xs: '0.9rem', md: '1rem' },
                }}
              >
                Tham gia cùng chúng tôi trong hành trình khám phá những bí ẩn của hóa học. Từ những phản ứng đơn giản
                đến các công thức phức tạp, chúng ta sẽ cùng nhau chinh phục môn học tuyệt vời này!
              </Typography>

              {/* Button link to Playground */}
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ScienceIcon />}
                  onClick={() => navigate(config.routes.playground)}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: 3,
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Playground
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container>
        {/* Socials */}
        <Stack direction="row" spacing={3} my={2} alignItems="center" justifyContent="center">
          {socialsLoaded &&
            socials.map((social) => (
              <Link key={social.id} href={social.url} target="_blank">
                <Stack direction="row" alignItems="center" spacing={2} key={social.id}>
                  {(() => {
                    switch (social.platform) {
                      case 'facebook':
                        return <LogoIcon color="white" size={30} src={fbIcon} />
                      case 'youtube':
                        return <LogoIcon color="white" size={30} src={youtubeIcon} />
                      case 'tiktok':
                        return <LogoIcon color="white" size={30} src={tiktokIcon} />
                      default:
                        return null
                    }
                  })()}
                  <Typography fontWeight={700}>
                    {social.platform?.charAt(0).toUpperCase() + social.platform?.slice(1)}
                  </Typography>
                </Stack>
              </Link>
            ))}
        </Stack>
        {/* Ranking */}
        <Box component="a" display="block" href={config.routes.ranking}>
          <img
            src={rankingBanner}
            alt="rankingBanner"
            width="100%"
            height="200px"
            style={{ objectFit: 'cover', objectPosition: 'top', borderRadius: '10px' }}
          />
        </Box>

        {/* Video Carousels by Topic */}
        <TopicsLoadingState>
          {Array.isArray(topics) &&
            topics.map((topic) => (
              <Box key={topic.id} mb={4}>
                <Stack direction="row" justifyContent="space-between" my={1}>
                  <Stack direction="column">
                    <Typography sx={{ '& span': { fontSize: '1.25rem' } }} fontWeight={700}>
                      <Typography component="span" color="primary" fontWeight="bold">
                        {topic.title}
                      </Typography>
                    </Typography>
                    <Typography variant="subtitle2">Bứt phá điểm số cùng TYHH</Typography>
                  </Stack>
                  <MuiLink
                    to={`/courses?topic=${topic.slug}`}
                    color="tertiary.light"
                    display="inline-flex"
                    alignItems="center"
                    mt="auto"
                  >
                    Xem tất cả khóa học
                    <KeyboardArrowRightIcon fontSize="small" />
                  </MuiLink>
                </Stack>
                <VideoCarousel videoList={topic.courses || []} />
              </Box>
            ))}
        </TopicsLoadingState>

        {/* Free Video */}
        <Typography variant="h6" fontWeight={600} color="primary.main">
          Video Miễn Phí
        </Typography>
        <FreeCoursesLoadingState>
          {freeCourses.length > 0 && (
            <Paper
              sx={{
                display: 'flex',
                flexDirection: 'row',
                overflow: 'hidden',
                border: '2px solid',
                borderColor: (theme) => theme.palette.primary.light,
              }}
            >
              {/* Left Section: 2/3 width */}
              <Box width="66.7%">
                <VideoComp src={randomIntroVideo} />
              </Box>
              {/* Right Section: 1/3 width */}

              <Stack direction="column" bgcolor={(theme) => theme.palette.info.gradient} width="33.3%">
                {freeCourses.slice(0, 4).map((course) => (
                  <Stack
                    key={course.id}
                    p={1}
                    direction="row"
                    alignItems="center"
                    component={MuiLink}
                    to={`/courses/${course.slug}`}
                    sx={{
                      textDecoration: 'none',
                      ':hover': {
                        bgcolor: (theme) => theme.palette.info.navy,
                      },
                    }}
                  >
                    <LocalImageLazy src={course.thumbnail || ''} alt={course.title} w={80} h={50} />
                    <Box ml={1} maxWidth="calc(100% - 108px)">
                      <Typography
                        noWrap
                        variant="subtitle2"
                        color={(theme) => theme.palette.text.inverse}
                        fontWeight={600}
                      >
                        {course.title}
                      </Typography>
                      <Typography
                        noWrap
                        variant="subtitle2"
                        color={(theme) => theme.palette.text.inverse}
                        fontWeight={600}
                      >
                        Giáo viên:{' '}
                        <Typography component="span" color={(theme) => theme.palette.success.bright}>
                          {course.teacher?.name || 'TYHH'}
                        </Typography>
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          )}
        </FreeCoursesLoadingState>

        {/* Bottom Banner */}
        <Box position="relative" mt={2}>
          <Box
            sx={{
              ':before': {
                height: '100%',
                width: '100%',
                border: '8px solid hsla(0, 0%, 100%, .45)',
                background: 'hsla(0, 0%, 100%, .15)',
                content: '""',
                position: 'absolute',
                transform: 'scale(0)',
                transition: 'transform 0.3s ease-out',
                zIndex: -1,
              },
              ':hover:before': {
                transform: 'scale(1)',
                zIndex: 1,
              },
            }}
          >
            <img src="banner.png" alt="banner" style={{ width: '100%' }} />
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Home
