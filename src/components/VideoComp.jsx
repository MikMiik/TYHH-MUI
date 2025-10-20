import { lazy, Suspense, useRef } from 'react'
import { CircularProgress, Box } from '@mui/material'

// Lazy load VideoJS component
const VideoJS = lazy(() => import('@/components/VideoJS'))

const VideoComp = ({ src, poster, options, livestreamSlug }) => {
  const playerRef = useRef(null)

  // Determine video source URL
  let videoSrc = ''
  if (src) {
    if (src.startsWith('http')) {
      // Already a full URL (for backwards compatibility)
      videoSrc = src
    } else {
      // Local file path, construct full URL
      const baseURL = import.meta.env.VITE_SERVER_URL
      videoSrc = baseURL ? `${baseURL}/${src.replace(/^\//, '')}` : `/${src.replace(/^\//, '')}`
    }
  }

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    playbackRates: [0.25, 0.5, 1, 1.5, 2],
    fluid: true,
    fill: true,
    inactivityTimeout: 2000,
    sources: [
      {
        src: videoSrc,
        type: 'video/mp4',
      },
    ],
    poster: poster || '/bg-video.jpg',
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
