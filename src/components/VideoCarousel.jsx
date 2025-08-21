import { Box, IconButton, Stack } from '@mui/material'
import VideoCard from './VideoCard'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import theme from '@/theme'

const videoList = [
  {
    id: 1,
    image: '',
    title: 'VẬN DỤNG CAO 9+ | TYHH',
    teacher: 'THẦY PHẠM THẮNG',
    price: '1',
  },
  {
    id: 2,
    image: '',
    title: 'CHUYÊN ĐỀ LIVE T (NỀN TẢNG 12)',
    teacher: 'THẦY PHẠM THẮNG',
    price: '2',
  },
  {
    id: 3,
    image: '',
    title: '2K8 - HÓA HỌC 10 (SGK MỚI)',
    teacher: 'THẦY NGỌC ANH',
    price: '3',
  },
  {
    id: 4,
    image: '',
    title: '2K8 - HÓA HỌC 11 (SGK MỚI)',
    teacher: 'THẦY NGỌC ANH',
    price: '4',
  },
  {
    id: 5,
    image: '',
    title: '2K8 - HÓA HỌC 10 (SGK MỚI)',
    teacher: 'THẦY NGỌC ANH',
    price: '5',
  },
  {
    id: 6,
    image: '',
    title: '2K8 - HÓA HỌC 11 (SGK MỚI)',
    teacher: 'THẦY NGỌC ANH',
    price: '6',
  },
  {
    id: 7,
    image: '',
    title: '2K8 - HÓA HỌC 10 (SGK MỚI)',
    teacher: 'THẦY NGỌC ANH',
    price: '7',
  },
  {
    id: 8,
    image: '',
    title: '2K8 - HÓA HỌC 11 (SGK MỚI)',
    teacher: 'THẦY NGỌC ANH',
    price: '8',
  },
]

function VideoCarousel({ maxVisible = 4 }) {
  const [startIdx, setStartIdx] = useState(0)

  const CARD_WIDTH = parseInt(theme.customVars.videoCardWidth, 10)
  const GAP = 16 // px
  const STEP = CARD_WIDTH + GAP

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext()
    }, 3000)
    return () => clearInterval(timer)
  }, [startIdx])

  const handleBack = () => {
    setStartIdx((prev) => (prev - 1 + videoList.length) % videoList.length)
  }
  const handleNext = () => {
    setStartIdx((prev) => (prev + 1) % videoList.length)
  }

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {/* Nút back */}
      <IconButton
        onClick={handleBack}
        sx={{
          position: 'absolute',
          left: 0,
          top: '38%',
          zIndex: 2,
          bgcolor: 'white',
          border: '2px solid',
          borderColor: 'secondary.light',
        }}
        size="small"
      >
        <LuChevronLeft color={theme.palette.secondary.light} size={26} />
      </IconButton>

      {/* Carousel container */}
      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          height: theme.customVars.videoCardHeight,
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
            height: theme.customVars.videoCardHeight,
            willChange: 'transform',
          }}
          animate={{ x: -startIdx * STEP }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        >
          {videoList.map((item) => (
            <VideoCard key={item.id} {...item} />
          ))}
        </Stack>
      </Box>

      {/* Nút next */}
      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          right: 0,
          top: '38%',
          zIndex: 2,
          bgcolor: 'white',
          border: '2px solid',
          borderColor: 'secondary.light',
        }}
        size="small"
      >
        <LuChevronRight color={theme.palette.secondary.light} size={26} />
      </IconButton>
    </Box>
  )
}

export default VideoCarousel
