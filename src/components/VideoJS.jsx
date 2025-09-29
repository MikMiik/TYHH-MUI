import { useEffect, useRef, useCallback } from 'react'
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
  const trackingStateRef = useRef(null) // Lưu trữ trạng thái tracking
  const { options, onReady, livestreamSlug } = props

  // Helper function để reset tracking state
  const resetTrackingState = useCallback(() => {
    if (trackingStateRef.current) {
      // Clear interval nếu có
      if (trackingStateRef.current.viewTrackingInterval) {
        clearInterval(trackingStateRef.current.viewTrackingInterval)
      }

      // Reset tất cả trạng thái
      trackingStateRef.current = null
    }
  }, [])

  // Helper function để khởi tạo tracking state
  const initTrackingState = useCallback((slug) => {
    trackingStateRef.current = {
      hasTrackedView: false,
      viewTrackingInterval: null,
      totalWatchTime: 0,
      lastCurrentTime: 0,
      currentSlug: slug, // Lưu slug hiện tại vào state
    }
  }, [])

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
          // Reset và khởi tạo trạng thái tracking mới
          resetTrackingState()
          initTrackingState(livestreamSlug)

          const checkViewProgress = () => {
            if (!trackingStateRef.current || trackingStateRef.current.hasTrackedView || player.paused()) {
              return
            }

            const currentTime = player.currentTime()
            const duration = player.duration()

            if (!duration) return

            // Chỉ tính watch time khi video đang phát liên tục
            // Nếu currentTime tăng không quá 2 giây so với lần trước (tránh seek/tua)
            const timeDiff = currentTime - trackingStateRef.current.lastCurrentTime
            if (timeDiff > 0 && timeDiff <= 2) {
              trackingStateRef.current.totalWatchTime += timeDiff
            }
            trackingStateRef.current.lastCurrentTime = currentTime

            // Kiểm tra xem đã xem đủ 50% thời lượng video chưa
            const requiredWatchTime = duration * 0.5
            if (trackingStateRef.current.totalWatchTime >= requiredWatchTime) {
              trackingStateRef.current.hasTrackedView = true

              // Clear interval để không check nữa
              if (trackingStateRef.current.viewTrackingInterval) {
                clearInterval(trackingStateRef.current.viewTrackingInterval)
                trackingStateRef.current.viewTrackingInterval = null
              }

              // Track view
              const slugToTrack = trackingStateRef.current.currentSlug
              livestreamService
                .trackView(slugToTrack)
                .then((result) => {
                  if (result.success && result.tracked) {
                    console.log(
                      `📊 View tracked after watching ${trackingStateRef.current.totalWatchTime.toFixed(
                        1
                      )}s/${requiredWatchTime.toFixed(1)}s for: ${slugToTrack}`
                    )
                  }
                })
                .catch((error) => {
                  console.error('Error tracking view:', error)
                  if (trackingStateRef.current) {
                    trackingStateRef.current.hasTrackedView = false // Reset để có thể thử lại
                  }
                })
            }
          }

          // Bắt đầu check progress khi play (bao gồm replay)
          player.on('play', () => {
            if (!trackingStateRef.current) return

            const currentTime = player.currentTime()
            const duration = player.duration()

            // Kiểm tra nếu đây là replay (video bắt đầu từ gần đầu sau khi đã track view)
            const isReplay = trackingStateRef.current.hasTrackedView && currentTime < 5 && duration

            if (isReplay) {
              console.log(`🔄 Replay detected, resetting tracking for: ${trackingStateRef.current.currentSlug}`)
              // Reset tracking state để có thể track view lại
              const currentSlug = trackingStateRef.current.currentSlug
              const oldInterval = trackingStateRef.current.viewTrackingInterval

              // Clear interval cũ nếu có
              if (oldInterval) {
                clearInterval(oldInterval)
              }

              // Reset state nhưng giữ slug
              trackingStateRef.current = {
                hasTrackedView: false,
                viewTrackingInterval: null,
                totalWatchTime: 0,
                lastCurrentTime: currentTime,
                currentSlug: currentSlug,
              }
            }

            // Bắt đầu tracking nếu chưa có interval và chưa track view
            if (!trackingStateRef.current.hasTrackedView && !trackingStateRef.current.viewTrackingInterval) {
              trackingStateRef.current.lastCurrentTime = currentTime
              trackingStateRef.current.viewTrackingInterval = setInterval(checkViewProgress, 1000)
            }
          })

          // Dừng check khi pause
          player.on('pause', () => {
            if (trackingStateRef.current && trackingStateRef.current.viewTrackingInterval) {
              clearInterval(trackingStateRef.current.viewTrackingInterval)
              trackingStateRef.current.viewTrackingInterval = null
            }
          })

          // Reset watch time khi seek (tua video) - bao gồm reset tracking khi tua về đầu
          player.on('seeked', () => {
            if (trackingStateRef.current) {
              const newCurrentTime = player.currentTime()
              const duration = player.duration()

              // Nếu tua về gần đầu video (< 5s) sau khi đã track view -> reset để có thể track lại
              if (trackingStateRef.current.hasTrackedView && newCurrentTime < 5 && duration) {
                console.log(
                  `🔄 Seek to beginning detected (${newCurrentTime.toFixed(1)}s), resetting tracking for: ${
                    trackingStateRef.current.currentSlug
                  }`
                )

                const currentSlug = trackingStateRef.current.currentSlug
                const oldInterval = trackingStateRef.current.viewTrackingInterval

                // Clear interval cũ nếu có
                if (oldInterval) {
                  clearInterval(oldInterval)
                }

                // Reset state nhưng giữ slug
                trackingStateRef.current = {
                  hasTrackedView: false,
                  viewTrackingInterval: null,
                  totalWatchTime: 0,
                  lastCurrentTime: newCurrentTime,
                  currentSlug: currentSlug,
                }

                // Bắt đầu tracking lại nếu video đang play
                if (!player.paused()) {
                  trackingStateRef.current.viewTrackingInterval = setInterval(checkViewProgress, 1000)
                }
              } else {
                // Logic cũ cho seek bình thường
                trackingStateRef.current.lastCurrentTime = newCurrentTime
                console.log(
                  `🔄 User seeked to ${newCurrentTime.toFixed(
                    1
                  )}s, watch time: ${trackingStateRef.current.totalWatchTime.toFixed(1)}s`
                )
              }
            }
          })

          // Reset tracking khi video chạy hết để chuẩn bị cho replay
          player.on('ended', () => {
            console.log('🎬 Video ended, ready for replay tracking...')
          })

          // Cleanup interval khi component unmount
          player.on('dispose', () => {
            resetTrackingState()
          })
        }
      })
      playerRef.current = player

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player = playerRef.current

      // Reset tracking state khi có livestreamSlug mới
      if (livestreamSlug) {
        resetTrackingState()
        initTrackingState(livestreamSlug)
        console.log(`🔄 Reset tracking for new livestream: ${livestreamSlug}`)
      }

      player.autoplay(options.autoplay)
      player.src(options.sources)
    }
  }, [options, videoRef, onReady, livestreamSlug, resetTrackingState, initTrackingState])

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
      // Cleanup tracking state khi component unmount
      resetTrackingState()
    }
  }, [playerRef, resetTrackingState])

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  )
}

export default VideoJS
