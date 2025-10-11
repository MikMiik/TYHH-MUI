import { Box, Container, Link, Stack, Typography } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { Suspense } from 'react'
import Spline from '@splinetool/react-spline'

import fbIcon from '@/assets/images/fbIcon.png'
import youtubeIcon from '@/assets/images/youtubeIcon.png'
import tiktokIcon from '@/assets/images/tiktokIcon.png'
import LogoIcon from '@/components/LogoIcon'
import rankingBanner from '@/assets/images/ranking-banner-home.png'
import config from '@/routes/config'
import VideoCarousel from '@/components/VideoCarousel'
import MuiLink from '@/components/MuiLink'
import ImageLazy from '@/components/ImageLazy'
import VideoComp from '@/components/VideoComp'
import { useGetSocialsQuery } from '@/features/api/siteInfoApi'
import { useGetAllTopicsQuery } from '@/features/api/topicApi'
import { useLoadingState } from '@/components/withLoadingState'

function Home() {
  const { data: socials, isSuccess: socialsLoaded } = useGetSocialsQuery()
  const topicsQueryResult = useGetAllTopicsQuery()
  const { data: topics = [], LoadingStateComponent: TopicsLoadingState } = useLoadingState(topicsQueryResult, {
    variant: 'inline',
    loadingText: 'Đang tải chủ đề...',
    emptyText: 'Chưa có chủ đề nào',
    hasDataCheck: (topics) => topics && topics.length > 0,
  })

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
    <Box>
      {/* Head Banner */}
      <Box
        sx={{
          width: '100%',
          minHeight: '700px',
          background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 50%, #e1f0e1 100%)',
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
                  color: 'primary.dark',
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
                    bgcolor: '#1a1a1a',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Spline
                    scene="https://prod.spline.design/Dr3KVR2NzyYMhFQ1/scene.splinecode"
                    onLoad={onSplineLoad}
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
                      display: 'block',
                      margin: 'auto',
                      objectFit: 'contain',
                      objectPosition: 'center center',
                    }}
                  />
                </Box>
              </Suspense>
            </Box>

            {/* Description Section */}
            <Box sx={{ mt: 0, maxWidth: 600 }}>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.7,
                  fontSize: { xs: '0.9rem', md: '1rem' },
                }}
              >
                Tham gia cùng chúng tôi trong hành trình khám phá những bí ẩn của hóa học. Từ những phản ứng đơn giản
                đến các công thức phức tạp, chúng ta sẽ cùng nhau chinh phục môn học tuyệt vời này!
              </Typography>
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
                <Stack direction="row" alignItems="center" spacing={1} key={social.id}>
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
                  <Typography fontWeight={700}>Thầy Phạm Thắng</Typography>
                </Stack>
              </Link>
            ))}
        </Stack>
        {/* Ranking */}
        <Box component="a" href={config.routes.ranking}>
          <img src={rankingBanner} alt="rankingBanner" width="100%" />
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
        <Stack direction="row">
          {/* Left Section: 2/3 width */}
          <Box width="66.7%">
            <VideoComp />
          </Box>
          {/* Right Section: 1/3 width */}
          <Stack direction="column" bgcolor="#60a1d5" width="33.3%">
            <Stack
              p={1}
              direction="row"
              alignItems="center"
              sx={{
                ':hover': {
                  bgcolor: '#49708d',
                },
              }}
            >
              <ImageLazy src="mini-live.png" alt="mini-live" w={200} />
              <Box ml={1} maxWidth="calc(100% - 108px)">
                <Typography noWrap variant="subtitle2" color="#fff" fontWeight={600}>
                  LIVE 8: KIỂM TRA CHẤT LƯỢNG CHƯƠNG I - NGÀY 7 - KIỂM TRA CHẤT LƯỢNG CHƯƠNG I
                </Typography>
                <Typography noWrap variant="subtitle2" color="#fff" fontWeight={600}>
                  Khoá học <MuiLink color="#66ec83">2K8 - HÓA HỌC 10 (SGK MỚI)</MuiLink>
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Stack>

        {/* Bottom Banner */}
        <Box position="relative" my={2}>
          <Link
            sx={{
              ':before': {
                height: '100%',
                width: '100%',
                border: '10px solid hsla(0, 0%, 100%, .45)',
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
            href={config.routes.home}
          >
            <ImageLazy src="banner.png?tr=w-1920,h-700,cm-extract" alt="banner" w="100%" />
          </Link>
        </Box>
      </Container>
    </Box>
  )
}

export default Home
