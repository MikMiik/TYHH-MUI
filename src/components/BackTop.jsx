import { useEffect, useState } from 'react'
import { Box, IconButton, Fade } from '@mui/material'

const BackTop = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Fade in={visible}>
      <Box
        sx={{
          position: 'fixed',
          right: 24,
          bottom: 56,
          zIndex: 20,
        }}
      >
        <IconButton
          onClick={handleClick}
          sx={{
            width: 48,
            height: 48,
            bgcolor: (theme) => theme.palette.primary.main,
            borderRadius: 1,
            boxShadow: 3,
            '&:hover': { bgcolor: (theme) => theme.palette.primary.dark },
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="28" height="28" fill="none" />
            <path d="M8 16L14 10L20 16" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </IconButton>
      </Box>
    </Fade>
  )
}

export default BackTop
