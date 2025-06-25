import { Box } from '@mui/material'
import HeroCarousel from '../Login/HeroCarousel'

function Home() {
  return (
    <Box
      sx={{
        width: '100%',
        mt: -4,
        px: 24,
        minHeight: '500px',
        background: '#e1d4b4',
        backgroundSize: '40px 40px',
        backgroundImage:
          'linear-gradient(90deg, hsla(0, 0%, 100%, .2) 1.3px, transparent 0), linear-gradient(180deg, hsla(0, 0%, 100%, .2) 1.3px, transparent 0)',
      }}
    >
      <Box sx={{ py: 4 }}>
        <HeroCarousel></HeroCarousel>
      </Box>
    </Box>
  )
}

export default Home
