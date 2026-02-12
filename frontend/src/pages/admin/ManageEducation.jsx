import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaGraduationCap } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { usePortfolio } from '../../context/PortfolioContext'
import profileService from '../../services/profileService'

const emptyEducation = {
  institution: '',
  institution_url: '',
  degree: '',
  field_of_study: '',
  grade: '',
  start_date: '',
  end_date: '',
  is_current: false,
  is_certification: false,
  certificate_url: '',
  credential_id: '',
  description: '',
  activities: '',
  display_order: 0,
}

const ManageEducation = () => {
  const { education, fetchEducation } = usePortfolio()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyEducation)
  const [loading, setLoading] = useState(false)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyEducation)
    setShowForm(true)
  }

  const openEdit = (edu) => {
    setEditing(edu.id)
    setForm({
      ...emptyEducation,
      ...edu,
      start_date: edu.start_date ? edu.start_date.slice(0, 10) : '',
      end_date: edu.end_date ? edu.end_date.slice(0, 10) : '',
    })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
    setForm(emptyEducation)
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
        await profileService.updateEducation(editing, payload)
        toast.success('Education updated!')
      } else {
        await profileService.createEducation(payload)
        toast.success('Education added!')
      }

      await fetchEducation()
      closeForm()
    } catch (error) {
      toast.error(editing ? 'Failed to update education' : 'Failed to add education')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this education entry?')) return
    try {
      await profileService.deleteEducation(id)
      toast.success('Education deleted!')
      await fetchEducation()
    } catch (error) {
      toast.error('Failed to delete education')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading">Education</h1>
          <p className="text-soft mt-1">{education.length} entr{education.length !== 1 ? 'ies' : 'y'}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-primary text-ink rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition-all"
        >
          <FaPlus size={12} /> Add Education
        </button>
      </div>

      {education.length === 0 ? (
        <div className="glass-card p-12 text-center text-soft">
          <FaGraduationCap size={32} className="mx-auto mb-3 opacity-30" />
          <p>No education entries yet. Click &quot;Add Education&quot; to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-6 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-xl font-heading">{edu.institution}</h3>
                    {edu.is_current && (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Current</span>
                    )}
                    {edu.is_certification && (
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary">Certification</span>
                    )}
                  </div>
                  <p className="text-muted mt-1">{edu.degree}{edu.field_of_study ? ` in ${edu.field_of_study}` : ''}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-soft flex-wrap">
                    {edu.grade && <span>Grade: {edu.grade}</span>}
                    {edu.start_date && (
                      <span>
                        {edu.start_date.slice(0, 7)} - {edu.is_current ? 'Present' : edu.end_date?.slice(0, 7) || ''}
                      </span>
                    )}
                  </div>
                  {edu.description && (
                    <p className="text-soft text-sm mt-3 leading-relaxed">{edu.description}</p>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                  <button onClick={() => openEdit(edu)}
                    className="p-2 rounded-lg hover:bg-white/10 text-soft hover:text-primary transition-colors">
                    <FaEdit size={14} />
                  </button>
                  <button onClick={() => handleDelete(edu.id)}
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
                <h2 className="text-xl font-heading">{editing ? 'Edit Education' : 'Add Education'}</h2>
                <button onClick={closeForm} className="text-soft hover:text-white p-1">
                  <FaTimes size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                <div>
                  <label className="block text-sm text-soft mb-2">Institution *</label>
                  <input name="institution" value={form.institution} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="University / Institute name" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-soft mb-2">Degree *</label>
                    <input name="degree" value={form.degree} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="B.Tech / M.Sc / Certificate" />
                  </div>
                  <div>
                    <label className="block text-sm text-soft mb-2">Field of Study</label>
                    <input name="field_of_study" value={form.field_of_study} onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="Computer Science" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-soft mb-2">Grade / GPA</label>
                    <input name="grade" value={form.grade} onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="8.5 / 10" />
                  </div>
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
                    <span className="text-sm">Currently studying</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="is_certification" checked={form.is_certification} onChange={handleChange}
                      className="w-5 h-5 rounded bg-ink-200 border border-white/20 accent-primary" />
                    <span className="text-sm">Certification</span>
                  </label>
                </div>

                {form.is_certification && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-soft mb-2">Certificate URL</label>
                      <input name="certificate_url" value={form.certificate_url} onChange={handleChange}
                        className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="https://..." />
                    </div>
                    <div>
                      <label className="block text-sm text-soft mb-2">Credential ID</label>
                      <input name="credential_id" value={form.credential_id} onChange={handleChange}
                        className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="CERT-12345" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm text-soft mb-2">Institution URL</label>
                  <input name="institution_url" value={form.institution_url} onChange={handleChange}
                    className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="https://university.edu" />
                </div>

                <div>
                  <label className="block text-sm text-soft mb-2">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                    className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Describe your coursework, thesis, etc." />
                </div>

                <div>
                  <label className="block text-sm text-soft mb-2">Activities & Societies</label>
                  <textarea name="activities" value={form.activities} onChange={handleChange} rows={2}
                    className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Clubs, societies, extracurricular activities..." />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={closeForm}
                    className="px-5 py-2.5 rounded-lg border border-white/10 text-sm text-soft hover:text-white hover:border-white/20 transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}
                    className="px-5 py-2.5 rounded-lg bg-gradient-primary text-ink text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50">
                    {loading ? 'Saving...' : editing ? 'Update Education' : 'Add Education'}
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

export default ManageEducation
