import { useEffect } from 'react'

/**
 * Component để preload các lazy components quan trọng sau khi app đã load
 * Giúp cải thiện performance cho lần truy cập tiếp theo
 */
const ComponentPreloader = () => {
  useEffect(() => {
    // Preload các components quan trọng sau 2 giây
    const preloadTimer = setTimeout(() => {
      // Preload các trang quan trọng nhất
      const preloadPromises = [
        import('../pages/Courses'),
        import('../pages/Documents'),
        import('../pages/Login'),
        import('../pages/Register'),
        import('../components/VideoJS'), // Video player component
      ]

      // Preload nhưng không làm gì với kết quả
      Promise.allSettled(preloadPromises).then(() => {
        console.log('📦 Important components preloaded')
      })
    }, 2000)

    return () => clearTimeout(preloadTimer)
  }, [])

  // Component này không render gì cả
  return null
}

export default ComponentPreloader
