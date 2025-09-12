/**
 * Cookie utility functions for frontend
 * Handles client-side cookie operations (non-httpOnly cookies only)
 */

/**
 * Get cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
export const getCookie = (name) => {
  try {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop().split(';').shift()
    }
    return null
  } catch (error) {
    console.error('Error getting cookie:', error.message)
    return null
  }
}

/**
 * Set cookie with options
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {Object} options - Cookie options
 * @param {number} options.days - Expiry in days (default: 7)
 * @param {string} options.path - Cookie path (default: '/')
 * @param {string} options.domain - Cookie domain
 * @param {boolean} options.secure - Secure flag (default: false in dev, true in prod)
 * @param {string} options.sameSite - SameSite attribute (default: 'Lax')
 */
export const setCookie = (name, value, options = {}) => {
  try {
    const { days = 7, path = '/', domain, secure = window.location.protocol === 'https:', sameSite = 'Lax' } = options

    let cookieString = `${name}=${value}`

    if (days) {
      const date = new Date()
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
      cookieString += `; expires=${date.toUTCString()}`
    }

    cookieString += `; path=${path}`

    if (domain) {
      cookieString += `; domain=${domain}`
    }

    if (secure) {
      cookieString += `; secure`
    }

    cookieString += `; samesite=${sameSite}`

    document.cookie = cookieString
    return true
  } catch (error) {
    console.error('Error setting cookie:', error.message)
    return false
  }
}

/**
 * Remove cookie by name
 * @param {string} name - Cookie name
 * @param {Object} options - Cookie options
 * @param {string} options.path - Cookie path (default: '/')
 * @param {string} options.domain - Cookie domain
 */
export const removeCookie = (name, options = {}) => {
  try {
    const { path = '/', domain } = options

    let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`

    if (domain) {
      cookieString += `; domain=${domain}`
    }

    document.cookie = cookieString
    return true
  } catch (error) {
    console.error('Error removing cookie:', error.message)
    return false
  }
}

/**
 * Check if cookie exists
 * @param {string} name - Cookie name
 * @returns {boolean} True if cookie exists
 */
export const hasCookie = (name) => {
  return getCookie(name) !== null
}

/**
 * Get all cookies as object
 * @returns {Object} Object with cookie name-value pairs
 */
export const getAllCookies = () => {
  try {
    const cookies = {}
    document.cookie.split(';').forEach((cookie) => {
      const [name, value] = cookie.trim().split('=')
      if (name && value) {
        cookies[name] = decodeURIComponent(value)
      }
    })
    return cookies
  } catch (error) {
    console.error('Error getting all cookies:', error.message)
    return {}
  }
}

export default {
  getCookie,
  setCookie,
  removeCookie,
  hasCookie,
  getAllCookies,
}
