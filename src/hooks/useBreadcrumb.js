import { useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'

// Hook để tạo breadcrumb tùy chỉnh với dữ liệu thực
export const useBreadcrumb = (customData = {}) => {
  const location = useLocation()
  const params = useParams()

  const breadcrumbs = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const crumbs = [{ link: '/', label: 'Trang chủ', key: 'home' }]

    // Don't show breadcrumbs for home page
    if (location.pathname === '/') {
      return []
    }

    let currentPath = ''

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`

      // Check if this is a dynamic route parameter
      if (params && Object.values(params).includes(segment)) {
        let label = segment

        // Use custom data if available
        if (currentPath.includes('/courses/') && index === 1 && customData.courseTitle) {
          // First parameter after /courses/ is courseSlug
          label = customData.courseTitle
        } else if (currentPath.includes('/courses/') && index === 2 && customData.livestreamTitle) {
          // Second parameter after /courses/ is livestream slug
          label = customData.livestreamTitle
        } else if (currentPath.includes('/documents/') && customData.documentTitle) {
          label = customData.documentTitle
        } else if (currentPath.includes('/livestreams/') && customData.livestreamTitle) {
          label = customData.livestreamTitle
        } else {
          // Fallback to generic labels
          if (currentPath.includes('/courses/') && index === 1) {
            label = `Khóa học: ${segment}`
          } else if (currentPath.includes('/courses/') && index === 2) {
            label = `Livestream: ${segment}`
          } else if (currentPath.includes('/documents/')) {
            label = `Tài liệu: ${segment}`
          } else if (currentPath.includes('/livestreams/')) {
            label = `Livestream: ${segment}`
          }
        }

        crumbs.push({
          link: currentPath,
          label: label,
          key: `segment-${index}`,
        })
      } else {
        // Static routes
        const staticLabels = {
          '/courses': 'Khóa học',
          '/my-courses': 'Khóa học của tôi',
          '/vipdocuments': 'Tài liệu VIP',
          '/documents': 'Tài liệu',
          '/liveschedule': 'Lịch livestream',
          '/profile': 'Hồ sơ',
          '/ranking': 'Bảng xếp hạng',
        }

        const label = staticLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1)
        crumbs.push({
          link: currentPath,
          label: label,
          key: `segment-${index}`,
        })
      }
    })

    return crumbs
  }, [location.pathname, params, customData])

  return breadcrumbs
}

// Utility function để tạo breadcrumb tùy chỉnh hoàn toàn
export const createCustomBreadcrumbs = (items) => {
  return items.map((item, index) => ({
    ...item,
    key: item.key || `custom-${index}`,
  }))
}
