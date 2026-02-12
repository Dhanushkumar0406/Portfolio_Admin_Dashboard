import api from './api'

const threeService = {
  /**
   * Get 3D scene configuration by scene name
   * @param {string} sceneName - Scene name (e.g., 'hero', 'skills', 'projects')
   * @returns {Promise} Scene configuration
   */
  async getSceneConfig(sceneName) {
    const response = await api.get(`/three-config/by-scene/${sceneName}`)
    return response.data
  },

  /**
   * Get all 3D configurations
   * @returns {Promise} List of 3D configurations
   */
  async getAllConfigs() {
    const response = await api.get('/three-config/')
    const data = response.data
    if (Array.isArray(data)) return data
    return data?.configs ?? []
  },

  /**
   * Create new 3D scene configuration (Auth required)
   * @param {Object} configData - Scene configuration data
   * @returns {Promise} Created configuration
   */
  async createConfig(configData) {
    const response = await api.post('/three-config/', configData)
    return response.data
  },

  /**
   * Update 3D scene configuration (Auth required)
   * @param {number} id - Config ID
   * @param {Object} configData - Updated configuration data
   * @returns {Promise} Updated configuration
   */
  async updateConfig(id, configData) {
    const response = await api.put(`/three-config/${id}`, configData)
    return response.data
  },

  /**
   * Delete 3D scene configuration (Auth required)
   * @param {number} id - Config ID
   * @returns {Promise} Deletion response
   */
  async deleteConfig(id) {
    const response = await api.delete(`/three-config/${id}`)
    return response.data
  },
}

export default threeService
