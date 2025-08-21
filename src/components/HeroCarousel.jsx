import { useEffect, useState } from 'react'
import { Box, IconButton } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

function HeroCarousel({ ...props }) {
  const [active, setActive] = useState(0)

  function onBackClick() {
    setActive((prev) => (prev - 1 + imageSlides.length) % imageSlides.length)
  }
  function onNextClick() {
    setActive((prev) => (prev + 1) % imageSlides.length)
  }

  const imageSlides = [
    {
      id: 1,
      image: './src/assets/images/tyhh-hero-carousel-1.png',
    },
    {
      id: 2,
      image: './src/assets/images/tyhh-hero-carousel-2.png',
    },
  ]
  useEffect(() => {
    const timerId = setInterval(() => {
      setActive((prev) => (prev + 1) % imageSlides.length)
    }, 4000)
    return () => {
      clearInterval(timerId)
    }
  }, [imageSlides.length, active])
  return (
    <Box sx={{ position: 'relative', height: 424, width: 774, overflow: 'hidden', borderRadius: 5 }} {...props}>
      <AnimatePresence initial={false}>
        <Box
          component={motion.div}
          key={active}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ ease: 'easeInOut' }}
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url(${imageSlides[active]?.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 5,
            overflow: 'hidden',
          }}
        ></Box>
      </AnimatePresence>

      {/* LuChevronLeft */}
      <IconButton
        onClick={onBackClick}
        sx={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'white',
          bgcolor: 'rgba(255, 255, 255, 0.6)',
          '&:hover': {
            bgcolor: 'primary.light',
          },
        }}
        size="large"
      >
        <LuChevronLeft />
      </IconButton>

      {/* LuChevronRight */}
      <IconButton
        onClick={onNextClick}
        sx={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'white',
          bgcolor: 'rgba(255, 255, 255, 0.6)',
          '&:hover': {
            bgcolor: 'primary.light',
          },
        }}
        size="large"
      >
        <LuChevronRight />
      </IconButton>
    </Box>
  )
}

export default HeroCarousel
