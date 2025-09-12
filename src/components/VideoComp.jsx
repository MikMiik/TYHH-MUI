import VideoJS from '@/components/VideoJS'
import { useRef } from 'react'

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
        src: src || 'https://ik.imagekit.io/mikmik/video-test.mp4/ik-master.m3u8?tr=sr-240_360_480_720_1080',
        type: 'application/x-mpegURL',
      },
    ],
    poster: poster || 'https://ik.imagekit.io/mikmik/black_big.jpg?tr=w-1480,h-832',
    ...options, // Spread additional options if provided
  }

  const handlePlayerReady = (player) => {
    playerRef.current = player
  }

  return <VideoJS options={videoJsOptions} onReady={handlePlayerReady} livestreamSlug={livestreamSlug} />
}

export default VideoComp
