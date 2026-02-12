import api from './api'

const siteContentService = {
  /**
   * Get active site content for public pages
   * @returns {Promise<Object|null>} Active content row
   */
  async getPublicContent(profileSlug) {
    const response = await api.get('/site-content/public', {
      params: profileSlug ? { slug: profileSlug } : {},
    })
    return response.data
  },

  /**
   * List all site content rows (admin)
   * @param {Object} params Query params
   * @returns {Promise<Object>} List payload
   */
  async list(params = {}) {
    const response = await api.get('/site-content/', { params })
    return response.data
  },

  /**
   * Get one site content row by ID (admin)
   * @param {number} id Row ID
   * @returns {Promise<Object>} Site content row
   */
  async getById(id) {
    const response = await api.get(`/site-content/${id}`)
    return response.data
  },

  /**
   * Create site content (admin)
   * @param {Object} payload Payload
   * @returns {Promise<Object>} Created row
   */
  async create(payload) {
    const response = await api.post('/site-content/', payload)
    return response.data
  },

  /**
   * Update site content (admin)
   * @param {number} id Row ID
   * @param {Object} payload Payload
   * @returns {Promise<Object>} Updated row
   */
  async update(id, payload) {
    const response = await api.put(`/site-content/${id}`, payload)
    return response.data
  },

  /**
   * Activate one content row (admin)
   * @param {number} id Row ID
   * @returns {Promise<Object>} Activated row
   */
  async activate(id) {
    const response = await api.post(`/site-content/${id}/activate`)
    return response.data
  },

  /**
   * Delete site content row (admin)
   * @param {number} id Row ID
   * @returns {Promise<void>}
   */
  async remove(id) {
    await api.delete(`/site-content/${id}`)
  },
}

export default siteContentService
