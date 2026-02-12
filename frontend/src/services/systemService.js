import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8006/api/v1'
const apiOrigin = apiBase.replace(/\/api\/v1\/?$/, '')

const systemService = {
  /**
   * Backend root endpoint
   * @returns {Promise<Object>} Root response
   */
  async getRoot() {
    const response = await axios.get(`${apiOrigin}/`)
    return response.data
  },

  /**
   * Backend health endpoint
   * @returns {Promise<Object>} Health response
   */
  async getHealth() {
    const response = await axios.get(`${apiOrigin}/health`)
    return response.data
  },
}

export default systemService
