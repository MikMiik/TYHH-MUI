import httpRequest from '@/utils/httpRequest'

const authService = {
  me: async () => {
    const res = await httpRequest.get('/auth/me')
    return res
  },
  login: async (loginInfo) => {
    const res = await httpRequest.post('/auth/login', loginInfo)
    return res
  },
  googleLogin: async (token) => {
    const res = await httpRequest.post('/auth/google', { token })
    return res
  },
  logout: async () => {
    try {
      const res = await httpRequest.post('/auth/logout')
      return res
    } catch (error) {
      console.error('Logout service error:', error)
      return { success: true, message: 'Logout completed' }
    }
  },
  register: async (registerInfo, config) => {
    const res = await httpRequest.post('/auth/register', registerInfo, config)
    return res
  },
  checkInfo: async (type, value) => {
    const res = await httpRequest.get(`auth/check-${type}?${type}=${value}`)
    return res.data.exists
  },
  resetPassword: async (data, token) => {
    const res = await httpRequest.post(`/auth/reset-password?token=${token}`, data)
    return res
  },
  changePassword: async (id, data) => {
    const res = await httpRequest.post(`/auth/change-password/${id}`, data)
    return res
  },
  verifyResetToken: async (token) => {
    const res = await httpRequest.get(`/auth/verify-reset-token?token=${token}`)
    return res
  },
  verifyEmailToken: async (token) => {
    const res = await httpRequest.get(`/auth/verify-email?token=${token}`)
    return res
  },
  sendForgotEmail: async (data) => {
    const res = await httpRequest.post('/auth/forgot-password', data)
    return res
  },
  checkKey: async (key) => {
    const res = await httpRequest.post(`/auth/check-key`, { key })
    return res
  },
}

export default authService
