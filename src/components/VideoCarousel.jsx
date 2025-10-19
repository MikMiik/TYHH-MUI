import { Box, IconButton, useMediaQuery } from '@mui/material'
import VideoCard from './VideoCard'
import { useCallback, useEffect } from 'react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import theme from '@/theme/theme'
import useEmblaCarousel from 'embla-carousel-react'
import AutoPlay from 'embla-carousel-autoplay'
import './VideoCarousel.css'

function VideoCarousel({ videoList = [] }) {
  // Sử dụng useMediaQuery để responsive chính xác hơn
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')) // < 768px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')) // 768px - 991px
  const isLaptop = useMediaQuery(theme.breakpoints.between('md', 'lg')) // 992px - 1139px

  // Tính số slides hiển thị dựa trên responsive breakpoints
  let slidesToShow = 4 // default for large desktop
  if (isMobile) {
    slidesToShow = 1
  } else if (isTablet) {
    slidesToShow = 2
  } else if (isLaptop) {
    slidesToShow = 3
  }

  // AutoPlay plugin - chỉ khi có đủ slides
  const plugins = []
  if (videoList.length > slidesToShow) {
    plugins.push(
      AutoPlay({
        delay: 4000,
        stopOnMouseEnter: true,
        stopOnInteraction: false,
      })
    )
  }

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: videoList.length > slidesToShow,
      align: 'start',
      slidesToScroll: 1,
      containScroll: 'trimSnaps',
      dragFree: false,
    },
    plugins
  )

  // Reinitialize carousel when responsive changes
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit()
    }
  }, [emblaApi, slidesToShow])

  // Navigation handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  // Check if we have enough slides to show controls
  const showControls = videoList.length > slidesToShow

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%', // Đảm bảo không vượt quá container cha
        mx: 'auto',
      }}
    >
      {/* Nút back */}
      <IconButton
        onClick={scrollPrev}
        sx={{
          position: 'absolute',
          left: { xs: -8, sm: -12, md: -12 }, // Responsive positioning
          top: '42%',
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          border: '2px solid',
          borderColor: 'secondary.light',
          boxShadow: 2,
          zIndex: 2,
          width: { xs: 36, sm: 40, md: 44 }, // Responsive size
          height: { xs: 36, sm: 40, md: 44 },
          opacity: showControls ? 1 : 0.3,
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: 'secondary.main',
            '& svg': { color: 'white' },
          },
        }}
        disabled={!showControls}
      >
        <LuChevronLeft color={theme.palette.secondary.light} size={isMobile ? 20 : 24} />
      </IconButton>

      {/* Embla Carousel container */}
      <Box
        ref={emblaRef}
        className="embla"
        sx={{
          overflow: 'hidden',
          position: 'relative',
          borderRadius: 2,
          width: '100%',
          p: { xs: 1, sm: 1.5, md: 2 }, // Responsive padding
        }}
      >
        <Box
          className="embla__container"
          sx={{
            display: 'flex',
            gap: { xs: 1, sm: 1.5, md: 2 }, // Responsive gap
            mx: { xs: -1, sm: -1.5, md: -2 }, // Negative margin để bù padding
          }}
        >
          {videoList.map((item) => (
            <Box
              key={item.id}
              className="embla__slide"
              sx={{
                flex: `0 0 calc(${100 / slidesToShow}% - ${
                  slidesToShow > 1 ? (isMobile ? '4px' : isTablet ? '6px' : '8px') : '0px'
                })`, // Tính toán width chính xác với gap
                minWidth: 0,
                maxWidth: `${100 / slidesToShow}%`,
                px: { xs: 1, sm: 1.5, md: 2 }, // Padding tạo gap
              }}
            >
              <VideoCard
                src={item.thumbnail ? `${import.meta.env.VITE_SERVER_URL}${item.thumbnail}` : ''}
                course={item}
                sx={{
                  height: 'auto',
                  '& .MuiCard-root': {
                    height: '100%',
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Nút next */}
      <IconButton
        onClick={scrollNext}
        sx={{
          position: 'absolute',
          right: { xs: -8, sm: -12, md: -20 }, // Responsive positioning
          top: '42%',
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          border: '2px solid',
          borderColor: 'secondary.light',
          boxShadow: 2,
          zIndex: 2,
          width: { xs: 36, sm: 40, md: 44 }, // Responsive size
          height: { xs: 36, sm: 40, md: 44 },
          opacity: showControls ? 1 : 0.3,
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: 'secondary.main',
            '& svg': { color: 'white' },
          },
        }}
        disabled={!showControls}
      >
        <LuChevronRight color={theme.palette.secondary.light} size={isMobile ? 20 : 24} />
      </IconButton>
    </Box>
  )
}

export default VideoCarousel
