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

  // Track view khi user xem đủ nửa thời lượng video
  async trackView(slug) {
    try {
      const response = await httpRequest.post(`/livestreams/${slug}/view`)

      if (response.success) {
        console.log('✅ Livestream view tracked successfully')
        return { success: true, tracked: true }
      } else {
        console.log('ℹ️ Livestream view tracking failed')
        return { success: true, tracked: false }
      }
    } catch (error) {
      console.error('❌ Error tracking livestream view:', error)
      // Don't throw error to avoid breaking video playback
      return { success: false, tracked: false, error: error.message }
    }
  }
}

export default new LivestreamService()
