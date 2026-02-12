import api from './api'

const toRelativeUploadPath = (value) => {
  if (!value || typeof value !== 'string') return ''

  let path = value.trim()
  if (!path) return ''

  if (path.startsWith('http://') || path.startsWith('https://')) {
    try {
      const url = new URL(path)
      path = url.pathname
    } catch {
      return ''
    }
  }

  path = path.replace(/^\/+/, '')
  path = path.replace(/^uploads\//, '')
  return path
}

const uploadService = {
  /**
   * Upload image file
   * @param {File} file - Image file to upload
   * @param {string} category - Image category (projects, profile, certificates)
   * @returns {Promise} Upload response with file URL
   */
  async uploadImage(file, category = 'projects') {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post(`/upload/image?category=${category}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  },

  /**
   * Upload 3D model file
   * @param {File} file - 3D model file (GLB, GLTF, FBX, OBJ)
   * @returns {Promise} Upload response with file URL
   */
  async uploadModel(file) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/upload/model', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  },

  /**
   * Upload texture file
   * @param {File} file - Texture file (JPG, PNG, EXR, HDR)
   * @returns {Promise} Upload response with file URL
   */
  async uploadTexture(file) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/upload/texture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  },

  /**
   * Delete uploaded file by relative path or full URL
   * @param {string} filePathOrUrl - Relative upload path or absolute URL
   * @returns {Promise} Deletion response
   */
  async deleteFile(filePathOrUrl) {
    const filePath = toRelativeUploadPath(filePathOrUrl)
    if (!filePath) {
      throw new Error('Invalid file path')
    }

    const response = await api.delete('/upload/file', {
      params: { file_path: filePath },
    })

    return response.data
  },

  /**
   * Get file URL from backend
   * @param {string} filePath - Relative file path
   * @returns {string} Full URL to file
   */
  getFileUrl(filePath) {
    if (!filePath) return null
    if (filePath.startsWith('http')) return filePath
    const baseUrl = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:8006/uploads'
    return `${baseUrl}/${filePath}`
  },
}

export default uploadService
