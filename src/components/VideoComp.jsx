import { lazy, Suspense, useRef } from 'react'
import { CircularProgress, Box } from '@mui/material'

// Lazy load VideoJS component
const VideoJS = lazy(() => import('@/components/VideoJS'))

const VideoComp = ({ src, poster, options, livestreamSlug }) => {
  const playerRef = useRef(null)

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    playbackRates: [0.25, 0.5, 1, 1.5, 2],
    fluid: true,
    inactivityTimeout: 2000,
    sources: [
      {
        src: src
          ? `${import.meta.env.VITE_IK_URL_ENDPOINT}${src}?tr=sr-240_360_480_720_1080`
          : 'https://ik.imagekit.io/mikmik/video-test.mp4',
        // /ik-master.m3u8?tr=sr-240_360_480_720_1080
        type: 'video/mp4',
      },
    ],
    poster: poster || 'https://ik.imagekit.io/mikmik/poster-bg-livestreams.jpg?tr=w-1480,h-832',
    ...options, // Spread additional options if provided
  }

  const handlePlayerReady = (player) => {
    playerRef.current = player
  }

  const VideoLoadingFallback = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
        bgcolor: 'grey.100',
        borderRadius: 1,
      }}
    >
      <CircularProgress size={40} />
    </Box>
  )

  return (
    <Suspense fallback={<VideoLoadingFallback />}>
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} livestreamSlug={livestreamSlug} />
    </Suspense>
  )
}

export default VideoComp
