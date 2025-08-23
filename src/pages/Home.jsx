import { Box, Container, Link, Stack, Typography } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

import HeroCarousel from '../components/HeroCarousel'
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

function Home() {
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
        <HeroCarousel py={4} mx="auto" />
      </Box>

      {/* Main Content */}
      <Container>
        {/* Socials */}
        <Stack direction="row" spacing={2} my={2} alignItems="center" justifyContent="center">
          <Link href="https://www.facebook.com/hoctothoahoc" target="_blank">
            <LogoIcon color="white" size={30} src={fbIcon} />
          </Link>
          <Typography fontWeight={700}>Thầy Phạm Thắng</Typography>
          <Link href="https://www.youtube.com/channel/UCAddta3aiDh6u9B4xCh3w7g" target="_blank">
            <LogoIcon color="white" size={30} src={youtubeIcon} />
          </Link>
          <Typography fontWeight={700}>Thầy Phạm Thắng</Typography>
          <Link href="https://www.tiktok.com/discover/t%C3%B4i-y%C3%AAu-h%C3%B3a-h%E1%BB%8Dc" target="_blank">
            <LogoIcon color="white" size={32} src={tiktokIcon} />
          </Link>
          <Typography fontWeight={700}>Thầy Phạm Thắng</Typography>
        </Stack>
        {/* Ranking */}
        <Box component="a" href={config.routes.ranking}>
          <img src={rankingBanner} alt="rankingBanner" width="100%" />
        </Box>

        {/* Video Carousel */}
        <Box>
          <Stack direction="row" justifyContent="space-between" my={1}>
            <Stack direction="column">
              <Typography sx={{ '& span': { fontSize: '1.25rem' } }} fontWeight={700}>
                <Typography component="span" color="primary" fontWeight="bold">
                  LIVEVIP
                </Typography>{' '}
                <Typography component="span" color="tertiary.light" fontWeight="bold">
                  2K8
                </Typography>
              </Typography>
              <Typography variant="subtitle2">Bứt phá điểm số cùng TYHH</Typography>
            </Stack>
            <MuiLink color="tertiary.light" display="inline-flex" alignItems="center" mt="auto">
              Xem tất cả khóa học
              <KeyboardArrowRightIcon fontSize="small" />
            </MuiLink>
          </Stack>
          <VideoCarousel />
        </Box>

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
        <Box position="relative">
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
