import api from './api'

const authService = {
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Response with tokens
   */
  async login(email, password) {
    const formData = new URLSearchParams()
    formData.append('username', email) // API expects 'username' field
    formData.append('password', password)

    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    // Store tokens in localStorage
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token)
      localStorage.setItem('refresh_token', response.data.refresh_token)
    }

    return response.data
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Response with user data
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  /**
   * Get current user information
   * @returns {Promise} User data
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me')
    return response.data
  },

  /**
   * Verify current access token
   * @returns {Promise} User data if token is valid
   */
  async testToken() {
    const response = await api.post('/auth/test-token')
    return response.data
  },

  /**
   * Refresh access token
   * @returns {Promise} New access token
   */
  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token')
    const response = await api.post('/auth/refresh', {
      refresh_token: refreshToken,
    })

    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token)
    }

    return response.data
  },

  /**
   * Logout user - clear tokens
   */
  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user has valid token
   */
  isAuthenticated() {
    return !!localStorage.getItem('access_token')
  },

  /**
   * Get stored access token
   * @returns {string|null} Access token
   */
  getAccessToken() {
    return localStorage.getItem('access_token')
  },
}

export default authService
