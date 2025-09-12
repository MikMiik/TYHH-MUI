import { useCallback } from 'react'
import livestreamService from '@/services/livestreamService'

/**
 * Hook để track view livestream
 * @returns {Function} trackView - Function để track view
 */
export const useLivestreamTracking = () => {
  const trackView = useCallback(async (livestreamSlug) => {
    if (!livestreamSlug) {
      console.warn('useLivestreamTracking: livestreamSlug is required')
      return { success: false, error: 'Slug is required' }
    }

    try {
      const result = await livestreamService.trackViewDebounced(livestreamSlug)
      return result
    } catch (error) {
      console.error('Error tracking livestream view:', error)
      return { success: false, error: error.message }
    }
  }, [])

  return { trackView }
}

export default useLivestreamTracking
