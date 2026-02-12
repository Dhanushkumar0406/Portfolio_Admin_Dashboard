import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { usePortfolio } from '../../context/PortfolioContext'
import skillService from '../../services/skillService'

const emptySkill = {
  name: '',
  category: '',
  proficiency: 80,
  years_experience: 1,
  icon_url: '',
  color: '#2DD4BF',
  display_order: 0,
}

const ManageSkills = () => {
  const { skills, fetchSkills } = usePortfolio()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptySkill)
  const [loading, setLoading] = useState(false)

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptySkill })
    setShowForm(true)
  }

  const openEdit = (skill) => {
    setEditing(skill.id)
    setForm({
      name: skill.name || '',
      category: skill.category || '',
      proficiency: skill.proficiency || 80,
      years_experience: skill.years_experience || 1,
      icon_url: skill.icon_url || '',
      color: skill.color || '#2DD4BF',
      display_order: skill.display_order || 0,
    })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
    setForm({ ...emptySkill })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...form,
        proficiency: parseFloat(form.proficiency) || 0,
        years_experience: parseFloat(form.years_experience) || 0,
        display_order: parseInt(form.display_order, 10) || 0,
      }

      if (editing) {
        await skillService.updateSkill(editing, payload)
        toast.success('Skill updated!')
      } else {
        await skillService.createSkill(payload)
        toast.success('Skill created!')
      }

      await fetchSkills()
      closeForm()
    } catch (error) {
      toast.error(editing ? 'Failed to update skill' : 'Failed to create skill')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return
    try {
      await skillService.deleteSkill(id)
      toast.success('Skill deleted!')
      await fetchSkills()
    } catch (error) {
      toast.error('Failed to delete skill')
    }
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading">Skills</h1>
          <p className="text-soft mt-1">{skills.length} skill{skills.length !== 1 && 's'}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-primary text-ink rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition-all"
        >
          <FaPlus size={12} /> Add Skill
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="glass-card p-12 text-center text-soft">
          No skills yet. Click &quot;Add Skill&quot; to get started.
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category}>
              <h2 className="text-lg font-heading text-primary mb-4">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {categorySkills.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="glass-card p-5 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-8 w-8 rounded-lg grid place-items-center text-xs font-bold"
                          style={{ backgroundColor: `${skill.color || '#2DD4BF'}20`, color: skill.color || '#2DD4BF' }}
                        >
                          {skill.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{skill.name}</p>
                          <p className="text-xs text-soft">{skill.years_experience || 0} yrs</p>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(skill)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-soft hover:text-primary transition-colors">
                          <FaEdit size={12} />
                        </button>
                        <button onClick={() => handleDelete(skill.id)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-soft hover:text-accent-coral transition-colors">
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-soft mb-1">
                        <span>Proficiency</span>
                        <span>{skill.proficiency}%</span>
                      </div>
                      <div className="h-1.5 bg-ink-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${skill.proficiency}%`, backgroundColor: skill.color || '#2DD4BF' }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
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
              className="fixed left-[calc(50%-4rem)] top-[calc(50%-20rem)] -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] md:w-full md:max-w-lg bg-ink-100 border border-white/10 rounded-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-heading">{editing ? 'Edit Skill' : 'New Skill'}</h2>
                <button onClick={closeForm} className="text-soft hover:text-white p-1">
                  <FaTimes size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-soft mb-2">Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="e.g. React" />
                  </div>
                  <div>
                    <label className="block text-sm text-soft mb-2">Category</label>
                    <input name="category" value={form.category} onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="e.g. Frontend" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-soft mb-2">Proficiency ({form.proficiency}%)</label>
                    <input name="proficiency" type="range" min="0" max="100" value={form.proficiency} onChange={handleChange}
                      className="w-full accent-primary" />
                  </div>
                  <div>
                    <label className="block text-sm text-soft mb-2">Years Experience</label>
                    <input name="years_experience" type="number" step="0.5" value={form.years_experience} onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-soft mb-2">Color</label>
                    <div className="flex items-center gap-3">
                      <input name="color" type="color" value={form.color} onChange={handleChange}
                        className="h-10 w-10 rounded-lg bg-transparent border border-white/10 cursor-pointer" />
                      <input name="color" value={form.color} onChange={handleChange}
                        className="flex-1 px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-soft mb-2">Display Order</label>
                    <input name="display_order" type="number" value={form.display_order} onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-soft mb-2">Icon (SVG/PNG)</label>
                  <input 
                    type="file" 
                    accept=".svg,.png"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        try {
                          const formData = new FormData()
                          formData.append('file', file)
                          const response = await fetch('/api/v1/upload/skill-icon', {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                            body: formData
                          })
                          const data = await response.json()
                          setForm(prev => ({ 
                            ...prev, 
                            icon_url: data.url,
                            name: prev.name || data.detected_name || ''
                          }))
                          toast.success('Icon uploaded!')
                        } catch (error) {
                          toast.error('Upload failed')
                        }
                      }
                    }}
                    className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer"
                  />
                  {form.icon_url && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={form.icon_url}
                        alt="Icon"
                        className="h-8 w-8 object-contain"
                        onError={() => setForm((prev) => ({ ...prev, icon_url: '' }))} // drop broken images
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={closeForm}
                    className="px-5 py-2.5 rounded-lg border border-white/10 text-sm text-soft hover:text-white hover:border-white/20 transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}
                    className="px-5 py-2.5 rounded-lg bg-gradient-primary text-ink text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50">
                    {loading ? 'Saving...' : editing ? 'Update Skill' : 'Create Skill'}
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

export default ManageSkills
