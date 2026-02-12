import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaGithub, FaExternalLinkAlt, FaYoutube, FaStar, FaProjectDiagram } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { usePortfolio } from '../../context/PortfolioContext'
import projectService from '../../services/projectService'
import uploadService from '../../services/uploadService'

const emptyProject = {
  title: '',
  description: '',
  short_description: '',
  category: '',
  technologies: '',
  github_url: '',
  live_url: '',
  youtube_url: '',
  image_url: '',
  featured: false,
  status: 'completed',
  display_order: 0,
}

const ManageProjects = () => {
  const { projects, fetchProjects } = usePortfolio()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyProject)
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyProject)
    setImageFile(null)
    setImagePreview(null)
    setShowForm(true)
  }

  const openEdit = (project) => {
    setEditing(project.id)
    setForm({
      ...emptyProject,
      ...project,
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(', ')
        : project.technologies || '',
    })
    setImageFile(null)
    setImagePreview(uploadService.getFileUrl(project.image_url || project.thumbnail_url))
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
    setForm(emptyProject)
    setImageFile(null)
    setImagePreview(null)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const previous = editing ? projects.find((p) => p.id === editing) : null
      const previousImage = previous?.image_url || previous?.thumbnail_url
      let imageUrl = form.image_url
      if (imageFile) {
        const uploadResult = await uploadService.uploadImage(imageFile, 'projects')
        imageUrl = uploadResult.file_path || uploadResult.url
      }

      const payload = {
        ...form,
        image_url: imageUrl,
        technologies: form.technologies
          ? form.technologies.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        display_order: parseInt(form.display_order, 10) || 0,
      }

      if (editing) {
        if (previousImage && previousImage !== imageUrl) {
          try {
            await uploadService.deleteFile(previousImage)
          } catch {
            // Best-effort cleanup for replaced uploads.
          }
        }
        await projectService.updateProject(editing, payload)
        toast.success('Project updated!')
      } else {
        await projectService.createProject(payload)
        toast.success('Project created!')
      }

      await fetchProjects()
      closeForm()
    } catch (error) {
      toast.error(editing ? 'Failed to update project' : 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return
    try {
      const target = projects.find((project) => project.id === id)
      const imagePath = target?.image_url || target?.thumbnail_url
      if (imagePath) {
        try {
          await uploadService.deleteFile(imagePath)
        } catch {
          // Best-effort cleanup for uploaded files.
        }
      }
      await projectService.deleteProject(id)
      toast.success('Project deleted!')
      await fetchProjects()
    } catch (error) {
      toast.error('Failed to delete project')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading">Projects</h1>
          <p className="text-soft mt-1">{projects.length} project{projects.length !== 1 && 's'}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-primary text-ink rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition-all"
        >
          <FaPlus size={12} /> Add Project
        </button>
      </div>

      {/* Projects Table */}
      <div className="glass-card overflow-hidden">
        {projects.length === 0 ? (
          <div className="p-12 text-center text-soft">
            <FaProjectDiagram size={32} className="mx-auto mb-3 opacity-30" />
            <p>No projects yet. Click &quot;Add Project&quot; to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-soft text-xs uppercase tracking-[0.2em]">
                  <th className="text-left p-4">Project</th>
                  <th className="text-left p-4 hidden md:table-cell">Category</th>
                  <th className="text-left p-4 hidden lg:table-cell">Status</th>
                  <th className="text-center p-4 hidden sm:table-cell">Featured</th>
                  <th className="text-center p-4 hidden lg:table-cell">Links</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => {
                  const imgUrl = uploadService.getFileUrl(project.image_url || project.thumbnail_url)
                  return (
                    <motion.tr
                      key={project.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-ink-200 overflow-hidden flex-shrink-0">
                            {imgUrl ? (
                              <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full grid place-items-center text-xs text-soft">--</div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{project.title}</p>
                            <p className="text-xs text-soft line-clamp-1 max-w-xs">{project.short_description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-soft hidden md:table-cell">{project.category || '--'}</td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          project.status === 'completed' ? 'bg-primary/10 text-primary' :
                          project.status === 'in-progress' ? 'bg-secondary/10 text-secondary' :
                          'bg-white/10 text-soft'
                        }`}>
                          {project.status || 'completed'}
                        </span>
                      </td>
                      <td className="p-4 text-center hidden sm:table-cell">
                        {project.featured && <FaStar className="text-secondary mx-auto" size={14} />}
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <div className="flex items-center justify-center gap-2 text-soft">
                          {project.github_url && <FaGithub size={14} />}
                          {project.live_url && <FaExternalLinkAlt size={12} />}
                          {project.youtube_url && <FaYoutube size={14} />}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(project)}
                            className="p-2 rounded-lg hover:bg-white/10 text-soft hover:text-primary transition-colors"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-2 rounded-lg hover:bg-white/10 text-soft hover:text-accent-coral transition-colors"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
                <h2 className="text-xl font-heading">{editing ? 'Edit Project' : 'New Project'}</h2>
                <button onClick={closeForm} className="text-soft hover:text-white p-1">
                  <FaTimes size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                <div>
                  <label className="block text-sm text-soft mb-2">Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="Project title" />
                </div>

                <div>
                  <label className="block text-sm text-soft mb-2">Short Description</label>
                  <input name="short_description" value={form.short_description} onChange={handleChange}
                    className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="One-line summary" />
                </div>

                <div>
                  <label className="block text-sm text-soft mb-2">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                    className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Full project description" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-soft mb-2">Category</label>
                    <input name="category" value={form.category} onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="e.g. Web, Game, 3D" />
                  </div>
                  <div>
                    <label className="block text-sm text-soft mb-2">Status</label>
                    <select name="status" value={form.status} onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all">
                      <option value="completed">Completed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-soft mb-2">Technologies (comma separated)</label>
                  <input name="technologies" value={form.technologies} onChange={handleChange}
                    className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="React, Three.js, Node.js" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-soft mb-2">GitHub URL</label>
                    <input name="github_url" value={form.github_url} onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="https://github.com/..." />
                  </div>
                  <div>
                    <label className="block text-sm text-soft mb-2">Live URL</label>
                    <input name="live_url" value={form.live_url} onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-sm text-soft mb-2">YouTube URL</label>
                    <input name="youtube_url" value={form.youtube_url} onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="https://youtube.com/..." />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-soft mb-2">Project Image</label>
                  <div className="flex items-start gap-4">
                    {imagePreview && (
                      <div className="h-20 w-32 rounded-lg overflow-hidden bg-ink-200 flex-shrink-0">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="px-4 py-3 bg-ink-200 border border-dashed border-white/20 rounded-lg text-center text-soft text-sm hover:border-primary/40 transition-colors">
                        Click to upload image
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-soft mb-2">Display Order</label>
                    <input name="display_order" type="number" value={form.display_order} onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange}
                        className="w-5 h-5 rounded bg-ink-200 border border-white/20 text-primary focus:ring-primary focus:ring-offset-0 accent-primary" />
                      <span className="text-sm">Featured project</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={closeForm}
                    className="px-5 py-2.5 rounded-lg border border-white/10 text-sm text-soft hover:text-white hover:border-white/20 transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}
                    className="px-5 py-2.5 rounded-lg bg-gradient-primary text-ink text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50">
                    {loading ? 'Saving...' : editing ? 'Update Project' : 'Create Project'}
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

export default ManageProjects
