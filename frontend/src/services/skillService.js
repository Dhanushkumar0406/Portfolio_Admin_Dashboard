import api from './api'

const skillService = {
  /**
   * Get all skills
   * @param {Object} params - Query parameters (skip, limit, category)
   * @returns {Promise} List of skills
   */
  async getSkills(params = {}) {
    const response = await api.get('/skills/', { params })
    const data = response.data
    if (Array.isArray(data)) return data
    return data?.skills ?? []
  },

  /**
   * Get skill by ID
   * @param {number} id - Skill ID
   * @returns {Promise} Skill data
   */
  async getSkillById(id) {
    const response = await api.get(`/skills/${id}`)
    return response.data
  },

  /**
   * Create new skill (Auth required)
   * @param {Object} skillData - Skill data
   * @returns {Promise} Created skill
   */
  async createSkill(skillData) {
    const response = await api.post('/skills/', skillData)
    return response.data
  },

  /**
   * Update skill (Auth required)
   * @param {number} id - Skill ID
   * @param {Object} skillData - Updated skill data
   * @returns {Promise} Updated skill
   */
  async updateSkill(id, skillData) {
    const response = await api.put(`/skills/${id}`, skillData)
    return response.data
  },

  /**
   * Delete skill (Auth required)
   * @param {number} id - Skill ID
   * @returns {Promise} Deletion response
   */
  async deleteSkill(id) {
    const response = await api.delete(`/skills/${id}`)
    return response.data
  },

  /**
   * Get skills by category
   * @param {string} category - Skill category
   * @returns {Promise} List of skills in category
   */
  async getSkillsByCategory(category) {
    return this.getSkills({ category })
  },
}

export default skillService
