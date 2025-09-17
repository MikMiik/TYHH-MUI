import { Box, IconButton, useMediaQuery } from '@mui/material'
import VideoCard from './VideoCard'
import { useCallback, useState, useEffect } from 'react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import theme from '@/theme/theme'
import useEmblaCarousel from 'embla-carousel-react'
import AutoPlay from 'embla-carousel-autoplay'
import './VideoCarousel.css'

function VideoCarousel({ videoList = [] }) {
  // Sử dụng useMediaQuery trực tiếp để responsive chính xác hơn
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')) // < 768px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg')) // 768px - 1139px

  const [viewportWidth, setViewportWidth] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth : 1200
  })

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Tính số slides hiển thị dựa trên responsive breakpoints
  // Mobile (< 768px): 1 slide, Tablet (768px-1139px): 2-3 slides, Desktop (>=1140px): 4 slides
  let slidesToShow = 4 // default for desktop
  if (isMobile) {
    slidesToShow = 1
  } else if (isTablet) {
    // Tính toán động dựa trên viewport width để responsive tốt hơn
    if (viewportWidth < 900) {
      slidesToShow = 2
    } else {
      slidesToShow = 3
    }
  }

  // AutoPlay plugin - đơn giản hóa cấu hình
  const plugins = []
  if (videoList.length > slidesToShow) {
    plugins.push(
      AutoPlay({
        delay: 3000,
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
    <Box position="relative" width="100%">
      {/* Nút back */}
      <IconButton
        onClick={scrollPrev}
        sx={{
          position: 'absolute',
          left: -10,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'white',
          border: '2px solid',
          borderColor: 'secondary.light',
          zIndex: 1,
          opacity: showControls ? 1 : 0.3,
        }}
        size="small"
        disabled={!showControls}
      >
        <LuChevronLeft color={theme.palette.secondary.light} size={26} />
      </IconButton>

      {/* Embla Carousel container */}
      <Box
        ref={emblaRef}
        className="embla"
        sx={{
          overflow: 'hidden',
          position: 'relative',
          px: { xs: 1, sm: 1.5 }, // Padding để tạo space
        }}
      >
        <Box
          className="embla__container"
          sx={{
            display: 'flex',
            mx: { xs: -1, sm: -1.5 }, // Negative margin để bù padding
          }}
        >
          {videoList.map((item) => (
            <Box
              key={item.id}
              className="embla__slide"
              sx={{
                flex: `0 0 ${100 / slidesToShow}%`, // Simple percentage
                minWidth: 0,
                px: { xs: 1, sm: 1.5 }, // Padding tạo gap
              }}
            >
              <VideoCard course={item} sx={{ width: '100%' }} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Nút next */}
      <IconButton
        onClick={scrollNext}
        sx={{
          position: 'absolute',
          right: -10,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'white',
          border: '2px solid',
          borderColor: 'secondary.light',
          opacity: showControls ? 1 : 0.3,
        }}
        size="small"
        disabled={!showControls}
      >
        <LuChevronRight color={theme.palette.secondary.light} size={26} />
      </IconButton>
    </Box>
  )
}

export default VideoCarousel
