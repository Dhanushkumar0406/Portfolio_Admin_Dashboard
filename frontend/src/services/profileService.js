import api from './api'

const profileService = {
  /**
   * Get user profile
   * @returns {Promise} Profile data
   */
  async getProfile() {
    const response = await api.get('/profile/me')
    return response.data
  },

  /**
   * Update user profile (Auth required)
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} Updated profile
   */
  async updateProfile(profileData) {
    const response = await api.put('/profile/me', profileData)
    return response.data
  },

  /**
   * Get public profile by user ID
   * @param {number} userId - User ID
   * @returns {Promise} Public profile data
   */
  async getPublicProfile(userId) {
    const response = await api.get(`/profile/${userId}`)
    return response.data
  },

  /**
   * Get all experience entries
   * @returns {Promise} List of experience
   */
  async getExperience(profileSlug) {
    const response = await api.get('/experience/', {
      params: profileSlug ? { slug: profileSlug } : {},
    })
    const data = response.data
    if (Array.isArray(data)) return data
    return data?.experiences ?? []
  },

  /**
   * Create new experience entry (Auth required)
   * @param {Object} experienceData - Experience data
   * @returns {Promise} Created experience
   */
  async createExperience(experienceData) {
    const response = await api.post('/experience/', experienceData)
    return response.data
  },

  /**
   * Update experience entry (Auth required)
   * @param {number} id - Experience ID
   * @param {Object} experienceData - Updated experience data
   * @returns {Promise} Updated experience
   */
  async updateExperience(id, experienceData) {
    const response = await api.put(`/experience/${id}`, experienceData)
    return response.data
  },

  /**
   * Delete experience entry (Auth required)
   * @param {number} id - Experience ID
   * @returns {Promise} Deletion response
   */
  async deleteExperience(id) {
    const response = await api.delete(`/experience/${id}`)
    return response.data
  },

  /**
   * Get all education entries
   * @returns {Promise} List of education
   */
  async getEducation() {
    const response = await api.get('/education/')
    const data = response.data
    if (Array.isArray(data)) return data
    return data?.educations ?? []
  },

  /**
   * Create new education entry (Auth required)
   * @param {Object} educationData - Education data
   * @returns {Promise} Created education
   */
  async createEducation(educationData) {
    const response = await api.post('/education/', educationData)
    return response.data
  },

  /**
   * Update education entry (Auth required)
   * @param {number} id - Education ID
   * @param {Object} educationData - Updated education data
   * @returns {Promise} Updated education
   */
  async updateEducation(id, educationData) {
    const response = await api.put(`/education/${id}`, educationData)
    return response.data
  },

  /**
   * Delete education entry (Auth required)
   * @param {number} id - Education ID
   * @returns {Promise} Deletion response
   */
  async deleteEducation(id) {
    const response = await api.delete(`/education/${id}`)
    return response.data
  },
}

export default profileService
