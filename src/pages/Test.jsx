import VideoJS from '@/components/VideoJS'
import { useRef } from 'react'
import videojs from 'video.js'

const Test = () => {
  const playerRef = useRef(null)

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    controlBar: {
      skipButtons: {
        forward: 10,
        backward: 10,
      },
    },

    playbackRates: [0.25, 0.5, 1, 1.5, 2],
    fluid: true,
    inactivityTimeout: 2000,
    sources: [
      {
        src: '../src/assets/video/video-test.mp4',
        type: 'video/mp4',
      },
    ],
  }

  const handlePlayerReady = (player) => {
    playerRef.current = player

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting')
    })

    player.on('dispose', () => {
      videojs.log('player will dispose')
    })
  }

  return (
    <>
      <div>Rest of app here</div>
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      <div>Rest of app here</div>
    </>
  )
}

export default Test
