import api from './api'

const contactService = {
  /**
   * Submit contact form
   * @param {Object} payload - Contact payload
   * @returns {Promise} Submission response
   */
  async submitContact(payload) {
    const response = await api.post('/contact/', payload)
    return response.data
  },
}

export default contactService
