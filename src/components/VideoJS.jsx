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

        // Track view dựa trên thời gian thực sự đã xem (watch time)
        if (livestreamSlug) {
          let hasTrackedView = false
          let viewTrackingInterval = null
          let totalWatchTime = 0 // Tổng thời gian đã xem (giây)
          let lastCurrentTime = 0 // Vị trí video ở lần check trước

          const checkViewProgress = () => {
            if (hasTrackedView || player.paused()) {
              return
            }

            const currentTime = player.currentTime()
            const duration = player.duration()

            if (!duration) return

            // Chỉ tính watch time khi video đang phát liên tục
            // Nếu currentTime tăng không quá 2 giây so với lần trước (tránh seek/tua)
            const timeDiff = currentTime - lastCurrentTime
            if (timeDiff > 0 && timeDiff <= 2) {
              totalWatchTime += timeDiff
            }
            lastCurrentTime = currentTime

            // Kiểm tra xem đã xem đủ 50% thời lượng video chưa
            const requiredWatchTime = duration * 0.5
            if (totalWatchTime >= requiredWatchTime) {
              hasTrackedView = true

              // Clear interval để không check nữa
              if (viewTrackingInterval) {
                clearInterval(viewTrackingInterval)
                viewTrackingInterval = null
              }

              // Track view
              livestreamService
                .trackView(livestreamSlug)
                .then((result) => {
                  if (result.success && result.tracked) {
                    console.log(
                      `📊 View tracked after watching ${totalWatchTime.toFixed(1)}s/${requiredWatchTime.toFixed(
                        1
                      )}s for: ${livestreamSlug}`
                    )
                  }
                })
                .catch((error) => {
                  console.error('Error tracking view:', error)
                  hasTrackedView = false // Reset để có thể thử lại
                })
            }
          }

          // Bắt đầu check progress khi play
          player.on('play', () => {
            if (!hasTrackedView && !viewTrackingInterval) {
              lastCurrentTime = player.currentTime() // Reset vị trí bắt đầu
              viewTrackingInterval = setInterval(checkViewProgress, 1000) // Check mỗi giây
            }
          })

          // Dừng check khi pause
          player.on('pause', () => {
            if (viewTrackingInterval) {
              clearInterval(viewTrackingInterval)
              viewTrackingInterval = null
            }
          })

          // Reset watch time khi seek (tua video)
          player.on('seeked', () => {
            lastCurrentTime = player.currentTime() // Reset vị trí sau khi tua
            console.log(`🔄 User seeked to ${lastCurrentTime.toFixed(1)}s, watch time: ${totalWatchTime.toFixed(1)}s`)
          })

          // Cleanup interval khi component unmount
          player.on('dispose', () => {
            if (viewTrackingInterval) {
              clearInterval(viewTrackingInterval)
              viewTrackingInterval = null
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
