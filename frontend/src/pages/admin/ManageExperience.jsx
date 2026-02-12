import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaBriefcase } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { usePortfolio } from '../../context/PortfolioContext'
import profileService from '../../services/profileService'

const emptyExperience = {
  company: '',
  company_url: '',
  position: '',
  employment_type: 'Full-time',
  location: '',
  is_remote: false,
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
  achievements: '',
  display_order: 0,
  profile_slug: 'default',
}

const ManageExperience = () => {
  const { experience, fetchExperience } = usePortfolio()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyExperience)
  const [loading, setLoading] = useState(false)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyExperience)
    setShowForm(true)
  }

  const openEdit = (exp) => {
    setEditing(exp.id)
    setForm({
      ...emptyExperience,
      ...exp,
      start_date: exp.start_date ? exp.start_date.slice(0, 10) : '',
      end_date: exp.end_date ? exp.end_date.slice(0, 10) : '',
    })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
    setForm(emptyExperience)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...form,
        display_order: parseInt(form.display_order, 10) || 0,
        end_date: form.is_current ? null : form.end_date || null,
      }

      if (editing) {
        await profileService.updateExperience(editing, payload)
        toast.success('Experience updated!')
      } else {
        await profileService.createExperience(payload)
        toast.success('Experience added!')
      }

      await fetchExperience()
      closeForm()
    } catch (error) {
      toast.error(editing ? 'Failed to update experience' : 'Failed to add experience')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience?')) return
    try {
      await profileService.deleteExperience(id)
      toast.success('Experience deleted!')
      await fetchExperience()
    } catch (error) {
      toast.error('Failed to delete experience')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading">Experience</h1>
          <p className="text-soft mt-1">{experience.length} entr{experience.length !== 1 ? 'ies' : 'y'}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-primary text-ink rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition-all"
        >
          <FaPlus size={12} /> Add Experience
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="glass-card p-12 text-center text-soft">
          <FaBriefcase size={32} className="mx-auto mb-3 opacity-30" />
          <p>No experience entries yet. Click &quot;Add Experience&quot; to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {experience.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-6 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-xl font-heading">{exp.position}</h3>
                    {exp.is_current && (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Current</span>
                    )}
                  </div>
                  <p className="text-muted mt-1">{exp.company}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-soft flex-wrap">
                    {exp.employment_type && <span>{exp.employment_type}</span>}
                    {exp.location && <span>{exp.location}</span>}
                    {exp.is_remote && <span className="text-primary">Remote</span>}
                    {exp.start_date && (
                      <span>
                        {exp.start_date.slice(0, 7)} - {exp.is_current ? 'Present' : exp.end_date?.slice(0, 7) || ''}
                      </span>
                    )}
                  </div>
                  {exp.description && (
                    <p className="text-soft text-sm mt-3 leading-relaxed">{exp.description}</p>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                  <button onClick={() => openEdit(exp)}
                    className="p-2 rounded-lg hover:bg-white/10 text-soft hover:text-primary transition-colors">
                    <FaEdit size={14} />
                  </button>
                  <button onClick={() => handleDelete(exp.id)}
                    className="p-2 rounded-lg hover:bg-white/10 text-soft hover:text-accent-coral transition-colors">
                    <FaTrash size={14} />
                  </button>
                </div>
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
                <h2 className="text-xl font-heading">{editing ? 'Edit Experience' : 'Add Experience'}</h2>
                <button onClick={closeForm} className="text-soft hover:text-white p-1">
                  <FaTimes size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-soft mb-2">Position *</label>
                    <input name="position" value={form.position} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="Software Engineer" />
                  </div>
                  <div>
                    <label className="block text-sm text-soft mb-2">Company *</label>
                    <input name="company" value={form.company} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="Company name" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-soft mb-2">Profile Slug *</label>
                  <input
                    name="profile_slug"
                    value={form.profile_slug}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="e.g. harish, anu"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-soft mb-2">Employment Type</label>
                    <select name="employment_type" value={form.employment_type} onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all">
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-soft mb-2">Location</label>
                    <input name="location" value={form.location} onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="Chennai, India" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-soft mb-2">Start Date</label>
                    <input name="start_date" type="date" value={form.start_date} onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm text-soft mb-2">End Date</label>
                    <input name="end_date" type="date" value={form.end_date} onChange={handleChange} disabled={form.is_current}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all disabled:opacity-40" />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="is_current" checked={form.is_current} onChange={handleChange}
                      className="w-5 h-5 rounded bg-ink-200 border border-white/20 accent-primary" />
                    <span className="text-sm">Currently working here</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="is_remote" checked={form.is_remote} onChange={handleChange}
                      className="w-5 h-5 rounded bg-ink-200 border border-white/20 accent-primary" />
                    <span className="text-sm">Remote</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm text-soft mb-2">Company URL</label>
                  <input name="company_url" value={form.company_url} onChange={handleChange}
                    className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="https://company.com" />
                </div>

                <div>
                  <label className="block text-sm text-soft mb-2">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                    className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Describe your role and responsibilities..." />
                </div>

                <div>
                  <label className="block text-sm text-soft mb-2">Achievements</label>
                  <textarea name="achievements" value={form.achievements} onChange={handleChange} rows={3}
                    className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Key achievements and accomplishments..." />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={closeForm}
                    className="px-5 py-2.5 rounded-lg border border-white/10 text-sm text-soft hover:text-white hover:border-white/20 transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}
                    className="px-5 py-2.5 rounded-lg bg-gradient-primary text-ink text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50">
                    {loading ? 'Saving...' : editing ? 'Update Experience' : 'Add Experience'}
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

export default ManageExperience
