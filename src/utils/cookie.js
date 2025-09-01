// Cookie utility functions for handling authentication tokens using react-cookie
import { Cookies } from 'react-cookie'

const cookies = new Cookies()

export const getCookie = (name) => {
  return cookies.get(name) || null
}

export const setCookie = (name, value, options = {}) => {
  cookies.set(name, value, {
    path: '/',
    ...options,
  })
}

export const deleteCookie = (name, options = {}) => {
  cookies.remove(name, {
    path: '/',
    ...options,
  })
}

export const getAuthTokensFromCookies = () => {
  // Debug: log all cookies
  console.log('All cookies:', cookies.getAll())

  const accessToken = getCookie('accessToken')
  const refreshToken = getCookie('refreshToken')

  // Debug logging
  console.log('Getting tokens from cookies:', {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    accessTokenLength: accessToken ? accessToken.length : 0,
    refreshTokenLength: refreshToken ? refreshToken.length : 0,
  })

  return {
    accessToken,
    refreshToken,
  }
}

export const clearAuthTokensFromCookies = () => {
  deleteCookie('accessToken', { path: '/' })
  deleteCookie('refreshToken', { path: '/' })

  // Debug logging for development
  console.log('Cleared auth tokens from cookies')
}
