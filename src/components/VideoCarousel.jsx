import { Box, IconButton, Stack } from '@mui/material'
import VideoCard from './VideoCard'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import theme from '@/theme/theme'
import useResponsive from '@/hooks/useResponsive'

function VideoCarousel({ videoList = [] }) {
  const [startIdx, setStartIdx] = useState(0)
  const { isMobile, isTablet, isLaptop, isDesktop } = useResponsive()

  const maxVisible = isMobile ? 1 : isTablet ? 2 : isLaptop ? 3 : isDesktop ? 4 : 4
  const CARD_WIDTH = parseInt(theme.muiVars.videoCardWidth, 10)
  const GAP = 16 // px
  const STEP = CARD_WIDTH + GAP

  useEffect(() => {
    const timer = setInterval(() => {
      setStartIdx((prev) => (prev + 1) % videoList.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [startIdx, videoList.length])

  const handleBack = () => {
    setStartIdx((prev) => (prev - 1 + videoList.length) % videoList.length)
  }
  const handleNext = () => {
    setStartIdx((prev) => (prev + 1) % videoList.length)
  }
  console.log(videoList)

  return (
    <Box position="relative" width="100%">
      {/* Nút back */}
      <IconButton
        onClick={handleBack}
        sx={{
          position: 'absolute',
          left: 0,
          top: '40%',
          bgcolor: 'white',
          border: '2px solid',
          borderColor: 'secondary.light',
          zIndex: 1,
        }}
        size="small"
        disabled={videoList.length <= maxVisible}
      >
        <LuChevronLeft color={theme.palette.secondary.light} size={26} />
      </IconButton>

      {/* Carousel container */}
      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          height: theme.muiVars.videoCardHeight,
          borderRadius: 2,
          width: STEP * maxVisible - GAP,
          mx: 'auto',
        }}
      >
        <Stack
          component={motion.div}
          direction="row"
          spacing={2}
          style={{
            width: `${videoList.length * STEP - GAP}px`,
            height: theme.muiVars.videoCardHeight,
            willChange: 'transform',
          }}
          animate={{ x: -startIdx * STEP }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        >
          {videoList.map((item) => (
            <VideoCard key={item.id} course={item} />
          ))}
        </Stack>
      </Box>

      {/* Nút next */}
      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          right: 0,
          top: '40%',
          bgcolor: 'white',
          border: '2px solid',
          borderColor: 'secondary.light',
        }}
        size="small"
        disabled={videoList.length <= maxVisible}
      >
        <LuChevronRight color={theme.palette.secondary.light} size={26} />
      </IconButton>
    </Box>
  )
}

export default VideoCarousel
