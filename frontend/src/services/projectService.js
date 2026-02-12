import api from './api'

const projectService = {
  /**
   * Get all projects with optional filtering
   * @param {Object} params - Query parameters (skip, limit, category, featured)
   * @returns {Promise} List of projects
   */
  async getProjects(params = {}) {
    const response = await api.get('/projects/', { params })
    const data = response.data
    if (Array.isArray(data)) return data
    return data?.projects ?? []
  },

  /**
   * Get project by ID
   * @param {number} id - Project ID
   * @returns {Promise} Project data
   */
  async getProjectById(id) {
    const response = await api.get(`/projects/${id}`)
    return response.data
  },

  /**
   * Create new project (Auth required)
   * @param {Object} projectData - Project data
   * @returns {Promise} Created project
   */
  async createProject(projectData) {
    const response = await api.post('/projects/', projectData)
    return response.data
  },

  /**
   * Update project (Auth required)
   * @param {number} id - Project ID
   * @param {Object} projectData - Updated project data
   * @returns {Promise} Updated project
   */
  async updateProject(id, projectData) {
    const response = await api.put(`/projects/${id}`, projectData)
    return response.data
  },

  /**
   * Delete project (Auth required)
   * @param {number} id - Project ID
   * @returns {Promise} Deletion response
   */
  async deleteProject(id) {
    const response = await api.delete(`/projects/${id}`)
    return response.data
  },

  /**
   * Get featured projects
   * @returns {Promise} List of featured projects
   */
  async getFeaturedProjects() {
    return this.getProjects({ featured: true })
  },

  /**
   * Get projects by category
   * @param {string} category - Project category
   * @returns {Promise} List of projects in category
   */
  async getProjectsByCategory(category) {
    return this.getProjects({ category })
  },
}

export default projectService
