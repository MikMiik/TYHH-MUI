import { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import 'videojs-contrib-quality-levels' //Plugin to handle quality levels in HLS/DASH streams
import 'videojs-http-source-selector' // Plugin that adds quality selector UI to the player
import 'videojs-seek-buttons'
import 'videojs-seek-buttons/dist/videojs-seek-buttons.css'
import livestreamService from '@/services/livestreamService'

const VideoJS = (props) => {
  const videoRef = useRef(null)
  const playerRef = useRef(null)
  const { options, onReady, livestreamSlug } = props

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement('video-js')

      videoElement.classList.add('vjs-big-play-centered', 'video-js', 'vjs-default-skin')
      videoRef.current.appendChild(videoElement)

      const player = (playerRef.current = videojs(videoElement, options, () => {
        onReady && onReady(player)
      }))
      // ABS
      player.ready(() => {
        if (typeof player.httpSourceSelector === 'function') {
          player.httpSourceSelector({
            default: 'auto', //Choose the best quality automatically
          })
        }
        player.seekButtons({
          forward: 10,
          back: 10,
        })

        // Track view khi user click play video
        if (livestreamSlug) {
          let hasTrackedView = false

          const trackViewOnPlay = () => {
            if (!hasTrackedView) {
              hasTrackedView = true
              livestreamService
                .trackViewDebounced(livestreamSlug)
                .then((result) => {
                  if (result.success && result.tracked) {
                    console.log(`📊 Tracked view for livestream: ${livestreamSlug}`)
                  }
                })
                .catch((error) => {
                  console.error('Error tracking view:', error)
                  hasTrackedView = false // Reset để có thể thử lại
                })
            }
          }

          // Track view khi play lần đầu
          player.one('play', trackViewOnPlay)

          // Backup: Track view khi user click play button
          player.on('useractive', () => {
            if (!player.paused() && !hasTrackedView) {
              trackViewOnPlay()
            }
          })
        }
      })
      playerRef.current = player

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player = playerRef.current

      player.autoplay(options.autoplay)
      player.src(options.sources)
    }
  }, [options, videoRef, onReady, livestreamSlug])

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  )
}

export default VideoJS
