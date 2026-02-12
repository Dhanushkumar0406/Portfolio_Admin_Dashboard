import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCube, FaUpload } from 'react-icons/fa'
import { toast } from 'react-toastify'
import threeService from '../../services/threeService'
import uploadService from '../../services/uploadService'

const emptyConfig = {
  scene_name: '',
  scene_type: 'environment',
  description: '',
  model_url: '',
  environment_url: '',
  texture_urls: [],
  is_active: true,
  settings: '{}',
}

const Manage3DAssets = () => {
  const [configs, setConfigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyConfig)
  const [saving, setSaving] = useState(false)
  const [modelFile, setModelFile] = useState(null)
  const [textureFile, setTextureFile] = useState(null)

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    try {
      const data = await threeService.getAllConfigs()
      setConfigs(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch 3D configs:', error)
      setConfigs([])
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setEditing(null)
    setForm(emptyConfig)
    setModelFile(null)
    setTextureFile(null)
    setShowForm(true)
  }

  const openEdit = (config) => {
    setEditing(config.id)
    setForm({
      ...emptyConfig,
      ...config,
      texture_urls: Array.isArray(config.texture_urls) ? config.texture_urls : [],
      settings: typeof config.settings === 'object' ? JSON.stringify(config.settings, null, 2) : config.settings || '{}',
    })
    setModelFile(null)
    setTextureFile(null)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
    setForm(emptyConfig)
    setModelFile(null)
    setTextureFile(null)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleModelUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setModelFile(file)
      try {
        const result = await uploadService.uploadModel(file)
        setForm((prev) => ({ ...prev, model_url: result.file_path || result.url }))
        toast.success('Model uploaded!')
      } catch (error) {
        toast.error('Failed to upload model')
      }
    }
  }

  const safeDeleteUploadedFile = async (filePathOrUrl) => {
    if (!filePathOrUrl) return
    try {
      await uploadService.deleteFile(filePathOrUrl)
    } catch {
      // Best-effort cleanup. Keep UI flow uninterrupted.
    }
  }

  const handleTextureUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setTextureFile(file)
    try {
      const result = await uploadService.uploadTexture(file)
      const texturePath = result.file_path || result.url
      setForm((prev) => ({
        ...prev,
        texture_urls: [...(Array.isArray(prev.texture_urls) ? prev.texture_urls : []), texturePath],
      }))
      toast.success('Texture uploaded!')
    } catch (error) {
      toast.error('Failed to upload texture')
    } finally {
      e.target.value = ''
    }
  }

  const removeTexture = async (index) => {
    const textures = Array.isArray(form.texture_urls) ? form.texture_urls : []
    const target = textures[index]
    await safeDeleteUploadedFile(target)
    setForm((prev) => ({
      ...prev,
      texture_urls: (Array.isArray(prev.texture_urls) ? prev.texture_urls : []).filter((_, i) => i !== index),
    }))
    toast.info('Texture removed')
  }

  const clearModel = async () => {
    await safeDeleteUploadedFile(form.model_url)
    setForm((prev) => ({ ...prev, model_url: '' }))
    setModelFile(null)
    toast.info('Model cleared')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      let parsedSettings = {}
      try {
        parsedSettings = JSON.parse(form.settings)
      } catch {
        toast.error('Invalid JSON in settings')
        setSaving(false)
        return
      }

      const payload = {
        ...form,
        settings: parsedSettings,
        texture_urls: Array.isArray(form.texture_urls) ? form.texture_urls : [],
      }

      if (editing) {
        const previous = configs.find((item) => item.id === editing)
        if (previous?.model_url && previous.model_url !== payload.model_url) {
          await safeDeleteUploadedFile(previous.model_url)
        }
        await threeService.updateConfig(editing, payload)
        toast.success('3D config updated!')
      } else {
        await threeService.createConfig(payload)
        toast.success('3D config created!')
      }

      await fetchConfigs()
      closeForm()
    } catch (error) {
      toast.error(editing ? 'Failed to update config' : 'Failed to create config')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this 3D configuration?')) return
    try {
      const target = configs.find((item) => item.id === id)
      if (target?.model_url) {
        await safeDeleteUploadedFile(target.model_url)
      }
      const textures = Array.isArray(target?.texture_urls) ? target.texture_urls : []
      await Promise.allSettled(textures.map((path) => safeDeleteUploadedFile(path)))

      await threeService.deleteConfig(id)
      toast.success('Config deleted!')
      await fetchConfigs()
    } catch (error) {
      toast.error('Failed to delete config')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading">3D Assets</h1>
          <p className="text-soft mt-1">{configs.length} scene config{configs.length !== 1 && 's'}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-primary text-ink rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition-all"
        >
          <FaPlus size={12} /> Add Config
        </button>
      </div>

      {configs.length === 0 ? (
        <div className="glass-card p-12 text-center text-soft">
          <FaCube size={32} className="mx-auto mb-3 opacity-30" />
          <p>No 3D configurations yet. Add scene configs to customize your 3D experience.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {configs.map((config, index) => (
            <motion.div
              key={config.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-5 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-accent-teal/10 grid place-items-center">
                    <FaCube className="text-accent-teal" size={16} />
                  </div>
                  <div>
                    <p className="font-medium">{config.scene_name}</p>
                    <p className="text-xs text-soft">{config.scene_type}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(config)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-soft hover:text-primary transition-colors">
                    <FaEdit size={12} />
                  </button>
                  <button onClick={() => handleDelete(config.id)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-soft hover:text-accent-coral transition-colors">
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
              {config.description && (
                <p className="text-soft text-xs mt-3 line-clamp-2">{config.description}</p>
              )}
              <div className="flex items-center gap-2 mt-3">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  config.is_active ? 'bg-primary/10 text-primary' : 'bg-white/10 text-soft'
                }`}>
                  {config.is_active ? 'Active' : 'Inactive'}
                </span>
                {config.model_url && (
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-soft">Has model</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={closeForm}
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="fixed inset-4 md:inset-x-auto md:inset-y-8 md:w-full md:max-w-2xl md:mx-auto bg-ink-100 border border-white/10 rounded-2xl z-50 flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-heading">{editing ? 'Edit 3D Config' : 'New 3D Config'}</h2>
                <button onClick={closeForm} className="text-soft hover:text-white p-1">
                  <FaTimes size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-soft mb-2">Scene Name *</label>
                    <input name="scene_name" value={form.scene_name} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="e.g. hero, skills" />
                  </div>
                  <div>
                    <label className="block text-sm text-soft mb-2">Scene Type</label>
                    <select name="scene_type" value={form.scene_type} onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all">
                      <option value="environment">Environment</option>
                      <option value="model">Model Viewer</option>
                      <option value="particles">Particles</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-soft mb-2">Description</label>
                  <input name="description" value={form.description} onChange={handleChange}
                    className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="Short description of this scene" />
                </div>

                <div>
                  <label className="block text-sm text-soft mb-2">3D Model Upload</label>
                  <label className="cursor-pointer">
                    <div className="px-4 py-3 bg-ink-200 border border-dashed border-white/20 rounded-lg text-center text-soft text-sm hover:border-primary/40 transition-colors flex items-center justify-center gap-2">
                      <FaUpload size={12} />
                      {modelFile ? modelFile.name : 'Upload .glb, .gltf, .fbx, .obj'}
                    </div>
                    <input type="file" accept=".glb,.gltf,.fbx,.obj" onChange={handleModelUpload} className="hidden" />
                  </label>
                  {form.model_url && (
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-xs text-soft truncate">Model: {form.model_url}</p>
                      <button
                        type="button"
                        onClick={clearModel}
                        className="text-xs px-2 py-1 rounded bg-white/10 text-soft hover:text-white"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-soft mb-2">Texture Upload</label>
                  <label className="cursor-pointer">
                    <div className="px-4 py-3 bg-ink-200 border border-dashed border-white/20 rounded-lg text-center text-soft text-sm hover:border-primary/40 transition-colors flex items-center justify-center gap-2">
                      <FaUpload size={12} />
                      {textureFile ? textureFile.name : 'Upload .jpg, .png, .exr, .hdr'}
                    </div>
                    <input type="file" accept=".jpg,.jpeg,.png,.exr,.hdr,.webp" onChange={handleTextureUpload} className="hidden" />
                  </label>
                  {Array.isArray(form.texture_urls) && form.texture_urls.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {form.texture_urls.map((texture, index) => (
                        <div key={`${texture}-${index}`} className="flex items-center justify-between gap-2 p-2 rounded bg-white/5">
                          <p className="text-xs text-soft truncate">{texture}</p>
                          <button
                            type="button"
                            onClick={() => removeTexture(index)}
                            className="text-xs px-2 py-1 rounded bg-white/10 text-soft hover:text-white"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-soft mb-2">Environment URL</label>
                  <input name="environment_url" value={form.environment_url} onChange={handleChange}
                    className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="HDRI / environment map URL" />
                </div>

                <div>
                  <label className="block text-sm text-soft mb-2">Settings (JSON)</label>
                  <textarea name="settings" value={form.settings} onChange={handleChange} rows={8}
                    className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white font-mono text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    placeholder='{ "camera": { "fov": 75 } }' />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange}
                    className="w-5 h-5 rounded bg-ink-200 border border-white/20 accent-primary" />
                  <span className="text-sm">Active</span>
                </label>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={closeForm}
                    className="px-5 py-2.5 rounded-lg border border-white/10 text-sm text-soft hover:text-white hover:border-white/20 transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="px-5 py-2.5 rounded-lg bg-gradient-primary text-ink text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50">
                    {saving ? 'Saving...' : editing ? 'Update Config' : 'Create Config'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Manage3DAssets
