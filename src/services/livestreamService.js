import httpRequest from '@/utils/httpRequest'

class LivestreamService {
  // Lấy thông tin livestream
  async getLivestreamBySlug(slug) {
    try {
      const response = await httpRequest.get(`/livestreams/${slug}`)
      return response.data
    } catch (error) {
      console.error('Error getting livestream:', error)
      throw error
    }
  }

  // Track view khi user click play video
  async trackView(slug) {
    try {
      const response = await httpRequest.post(`/livestreams/${slug}/view`)

      if (response.success && response.data?.tracked) {
        console.log('✅ Livestream view tracked successfully')
        return { success: true, tracked: true }
      } else {
        console.log('ℹ️ Livestream view already tracked or user not logged in')
        return { success: true, tracked: false }
      }
    } catch (error) {
      console.error('❌ Error tracking livestream view:', error)
      // Don't throw error to avoid breaking video playback
      return { success: false, tracked: false, error: error.message }
    }
  }

  // Track view với debounce để tránh multiple calls
  trackViewDebounced = (() => {
    let timeoutId = null
    let hasTracked = new Set() // Track đã gọi cho slug nào

    return (slug) => {
      // Nếu đã track cho slug này rồi thì skip
      if (hasTracked.has(slug)) {
        return Promise.resolve({ success: true, tracked: false, reason: 'already_tracked_in_session' })
      }

      // Clear timeout cũ nếu có
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      // Debounce 1 giây để tránh spam clicks
      return new Promise((resolve) => {
        timeoutId = setTimeout(async () => {
          try {
            const result = await this.trackView(slug)
            if (result.success) {
              hasTracked.add(slug) // Mark là đã track
            }
            resolve(result)
          } catch (error) {
            resolve({ success: false, tracked: false, error: error.message })
          }
        }, 1000)
      })
    }
  })()
}

export default new LivestreamService()
