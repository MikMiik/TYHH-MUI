import { Box, Container, Link, Stack, Typography } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { lazy, Suspense } from 'react'

// Lazy load HeroCarousel
const HeroCarousel = lazy(() => import('../components/HeroCarousel'))
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
  return (
    <Box>
      {/* Head Banner */}
      <Box
        sx={{
          width: '100%',
          minHeight: '500px',
          background: '#e1d4b4',
          backgroundSize: '40px 40px',
          backgroundImage:
            'linear-gradient(90deg, hsla(0, 0%, 100%, .2) 1.3px, transparent 0), linear-gradient(180deg, hsla(0, 0%, 100%, .2) 1.3px, transparent 0)',
        }}
      >
        <Suspense
          fallback={
            <Box
              sx={{
                height: 400,
                bgcolor: 'grey.100',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography color="text.secondary">Đang tải banner...</Typography>
            </Box>
          }
        >
          <HeroCarousel py={4} mx="auto" />
        </Suspense>
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
