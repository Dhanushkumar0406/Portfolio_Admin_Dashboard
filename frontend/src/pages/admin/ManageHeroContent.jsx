import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaImage, FaCheckCircle, FaUpload } from 'react-icons/fa'
import { toast } from 'react-toastify'
import siteContentService from '../../services/siteContentService'
import uploadService from '../../services/uploadService'
import { usePortfolio } from '../../context/PortfolioContext'

const emptyContent = {
  name: 'Home Hero',
  display_name: 'Harish Kumar',
  icon_text: '3D',
  profile_image_url: '',
  profile_slug: 'default',
  brand_initials: 'HK',
  brand_title: 'Harish Kumar',
  brand_tagline: 'Portfolio',
  nav_cta_text: "Let's Talk",
  nav_cta_link: '/contact',
  eyebrow_text: 'Hello! I am Harish Kumar',
  hero_title: 'A designer who judges a book by its cover.',
  hero_subtitle: 'I build cinematic, interactive experiences for brands and studios.',
  cta_primary_text: 'View Work',
  cta_primary_link: '/projects',
  cta_secondary_text: 'Hire Me',
  cta_secondary_link: '/contact',
  contact_title: 'Let us build your next standout experience.',
  contact_subtitle:
    'Share your project scope, timelines, or collaboration ideas. I will respond within 24 hours.',
  contact_email: 'harish@example.com',
  contact_location: 'Chennai, India',
  contact_availability: 'Open to full-time roles and freelance',
  contact_response_time: 'I typically respond within 24 hours.',
  footer_tagline:
    'Game developer and 3D artist crafting cinematic, interactive digital experiences. Open to full-time roles and studio collaborations.',
  footer_email: 'harish@example.com',
  footer_location: 'Chennai, India',
  footer_availability: 'Open to full-time roles and freelance',
  footer_links: '[]',
  footer_disclaimer: 'Built with React, Three.js & FastAPI',
  footer_rights: '(c) 2026 Harish Kumar. All rights reserved.',
  about_title: 'I craft immersive visuals and systems that feel inevitable.',
  about_body_primary:
    '',
  about_body_secondary:
    '',
  about_snapshot_focus: '',
  about_snapshot_stack: '',
  about_snapshot_availability: '',
  is_active: true,
}

const ManageHeroContent = () => {
  const { fetchSiteContent } = usePortfolio()
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyContent)
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    try {
      const data = await siteContentService.list()
      const rows = Array.isArray(data?.contents) ? data.contents : []
      setContents(rows)
    } catch (error) {
      toast.error('Failed to load hero content')
      setContents([])
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setEditing(null)
    setForm(emptyContent)
    setImageFile(null)
    setShowForm(true)
  }

  const openEdit = (content) => {
    setEditing(content.id)
    setForm({
      ...emptyContent,
      ...content,
      footer_links: Array.isArray(content.footer_links)
        ? JSON.stringify(content.footer_links, null, 2)
        : content.footer_links || '[]',
    })
    setImageFile(null)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
    setForm(emptyContent)
    setImageFile(null)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const safeDeleteUpload = async (filePathOrUrl) => {
    if (!filePathOrUrl) return
    try {
      await uploadService.deleteFile(filePathOrUrl)
    } catch {
      // Best-effort cleanup.
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImageFile(file)
    try {
      const result = await uploadService.uploadImage(file, 'profile')
      setForm((prev) => ({
        ...prev,
        profile_image_url: result.file_path || result.url,
      }))
      toast.success('Profile image uploaded!')
    } catch (error) {
      toast.error('Failed to upload profile image')
    }
  }

  const clearImage = async () => {
    await safeDeleteUpload(form.profile_image_url)
    setForm((prev) => ({ ...prev, profile_image_url: '' }))
    setImageFile(null)
    toast.info('Profile image cleared')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      let parsedFooterLinks = []
      if (typeof form.footer_links === 'string' && form.footer_links.trim().length > 0) {
        try {
          parsedFooterLinks = JSON.parse(form.footer_links)
        } catch (err) {
          toast.error('Footer links must be valid JSON')
          setSaving(false)
          return
        }
      } else if (Array.isArray(form.footer_links)) {
        parsedFooterLinks = form.footer_links
      }

      const payload = {
        ...form,
        name: form.name?.trim() || 'Home Hero',
        display_name: form.display_name?.trim() || 'Harish Kumar',
        footer_links: parsedFooterLinks,
      }

      if (editing) {
        const previous = contents.find((item) => item.id === editing)
        if (
          previous?.profile_image_url &&
          previous.profile_image_url !== payload.profile_image_url
        ) {
          await safeDeleteUpload(previous.profile_image_url)
        }
        await siteContentService.update(editing, payload)
        toast.success('Hero content updated!')
      } else {
        await siteContentService.create(payload)
        toast.success('Hero content created!')
      }

      await fetchContents()
      await fetchSiteContent()
      closeForm()
    } catch (error) {
      toast.error(editing ? 'Failed to update hero content' : 'Failed to create hero content')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hero content?')) return

    try {
      const content = contents.find((item) => item.id === id)
      if (content?.profile_image_url) {
        await safeDeleteUpload(content.profile_image_url)
      }
      await siteContentService.remove(id)
      toast.success('Hero content deleted!')
      await fetchContents()
      await fetchSiteContent()
    } catch (error) {
      toast.error('Failed to delete hero content')
    }
  }

  const handleActivate = async (id) => {
    try {
      await siteContentService.activate(id)
      toast.success('Hero content activated!')
      await fetchContents()
      await fetchSiteContent()
    } catch (error) {
      toast.error('Failed to activate hero content')
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
          <h1 className="text-3xl font-heading">Hero Content</h1>
          <p className="text-soft mt-1">
            {contents.length} content variant{contents.length !== 1 && 's'}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-primary text-ink rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition-all"
        >
          <FaPlus size={12} /> Add Hero Content
        </button>
      </div>

      {contents.length === 0 ? (
        <div className="glass-card p-12 text-center text-soft">
          <FaImage size={32} className="mx-auto mb-3 opacity-30" />
          <p>No hero content yet. Create one to control icon, name, texts, and CTA links.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {contents.map((content, index) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="glass-card p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{content.name}</p>
                  <p className="text-xs text-soft mt-1">{content.display_name || 'Unnamed'}</p>
                </div>
                <div className="flex items-center gap-2">
                  {content.is_active && (
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary inline-flex items-center gap-1">
                      <FaCheckCircle size={10} />
                      Active
                    </span>
                  )}
                  <button
                    onClick={() => openEdit(content)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-soft hover:text-primary transition-colors"
                  >
                    <FaEdit size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(content.id)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-soft hover:text-accent-coral transition-colors"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>

              <p className="text-soft text-xs uppercase tracking-[0.25em] mt-4">
                {content.eyebrow_text || '--'}
              </p>
              <h3 className="text-lg font-heading mt-2 line-clamp-2">{content.hero_title || '--'}</h3>
              <p className="text-soft text-sm mt-2 line-clamp-3">{content.hero_subtitle || '--'}</p>

              <div className="mt-4 text-xs text-soft space-y-1">
                <p>Primary: {content.cta_primary_text || '--'} -> {content.cta_primary_link || '--'}</p>
                <p>Secondary: {content.cta_secondary_text || '--'} -> {content.cta_secondary_link || '--'}</p>
              </div>

              {!content.is_active && (
                <button
                  onClick={() => handleActivate(content.id)}
                  className="mt-4 w-full px-3 py-2 rounded-lg border border-white/10 text-xs uppercase tracking-[0.2em] text-soft hover:text-white hover:border-white/20 transition-all"
                >
                  Set Active
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}

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
              className="fixed inset-4 md:inset-x-auto md:inset-y-8 md:w-full md:max-w-3xl md:mx-auto bg-ink-100 border border-white/10 rounded-2xl z-50 flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-heading">{editing ? 'Edit Hero Content' : 'New Hero Content'}</h2>
                <button onClick={closeForm} className="text-soft hover:text-white p-1">
                  <FaTimes size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-soft mb-2">Content Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-soft mb-2">Display Name *</label>
                    <input
                      name="display_name"
                      value={form.display_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
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
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-soft mb-2">Brand Initials</label>
                    <input
                      name="brand_initials"
                      value={form.brand_initials}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="HK"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-soft mb-2">Brand Title</label>
                    <input
                      name="brand_title"
                      value={form.brand_title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="Harish Kumar"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-soft mb-2">Brand Tagline</label>
                    <input
                      name="brand_tagline"
                      value={form.brand_tagline}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="Portfolio"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-soft mb-2">Nav CTA Text</label>
                      <input
                        name="nav_cta_text"
                        value={form.nav_cta_text}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="Let's Talk"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-soft mb-2">Nav CTA Link</label>
                      <input
                        name="nav_cta_link"
                        value={form.nav_cta_link}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="/contact"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-soft mb-2">Icon Text</label>
                    <input
                      name="icon_text"
                      value={form.icon_text}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="e.g. 3D"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-soft mb-2">Profile Image Upload</label>
                    <label className="cursor-pointer">
                      <div className="px-4 py-3 bg-ink-200 border border-dashed border-white/20 rounded-lg text-center text-soft text-sm hover:border-primary/40 transition-colors flex items-center justify-center gap-2">
                        <FaUpload size={12} />
                        {imageFile ? imageFile.name : 'Upload profile image'}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    {form.profile_image_url && (
                      <div className="mt-2 flex items-center gap-2">
                        <p className="text-xs text-soft truncate">{form.profile_image_url}</p>
                        <button
                          type="button"
                          onClick={clearImage}
                          className="text-xs px-2 py-1 rounded bg-white/10 text-soft hover:text-white"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-soft mb-2">Eyebrow Text</label>
                  <input
                    name="eyebrow_text"
                    value={form.eyebrow_text}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm text-soft mb-2">Hero Title (H1)</label>
                  <input
                    name="hero_title"
                    value={form.hero_title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm text-soft mb-2">Hero Subtitle / Supporting Copy</label>
                  <textarea
                    name="hero_subtitle"
                    value={form.hero_subtitle}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-soft mb-2">Primary CTA Text</label>
                    <input
                      name="cta_primary_text"
                      value={form.cta_primary_text}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-soft mb-2">Primary CTA Link</label>
                    <input
                      name="cta_primary_link"
                      value={form.cta_primary_link}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="/projects or https://..."
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-soft mb-2">Secondary CTA Text</label>
                    <input
                      name="cta_secondary_text"
                      value={form.cta_secondary_text}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-soft mb-2">Secondary CTA Link</label>
                    <input
                      name="cta_secondary_link"
                      value={form.cta_secondary_link}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="/contact or https://..."
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-sm font-medium text-white mb-2">Contact Section</p>
                    <div className="space-y-3">
                      <input
                        name="contact_title"
                        value={form.contact_title}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="Contact heading"
                      />
                      <textarea
                        name="contact_subtitle"
                        value={form.contact_subtitle}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                        placeholder="Supporting text"
                      />
                      <input
                        name="contact_email"
                        value={form.contact_email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="Email"
                      />
                      <input
                        name="contact_location"
                        value={form.contact_location}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="Location"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-soft mb-2">Availability</label>
                      <input
                        name="contact_availability"
                        value={form.contact_availability}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="Open to full-time roles and freelance"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-soft mb-2">Response Time</label>
                      <input
                        name="contact_response_time"
                        value={form.contact_response_time}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="I typically respond within 24 hours."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Footer Links (JSON)</label>
                      <textarea
                        name="footer_links"
                        value={form.footer_links}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white font-mono text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                        placeholder='[{"label":"GitHub","url":"https://github.com","icon":"github"}]'
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-soft mb-2">Footer Tagline</label>
                    <textarea
                      name="footer_tagline"
                      value={form.footer_tagline}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-soft mb-2">Footer Email</label>
                      <input
                        name="footer_email"
                        value={form.footer_email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-soft mb-2">Footer Location</label>
                      <input
                        name="footer_location"
                        value={form.footer_location}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-soft mb-2">Footer Availability</label>
                      <input
                        name="footer_availability"
                        value={form.footer_availability}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                    <label className="block text-sm text-soft mb-2">Footer Disclaimer</label>
                    <input
                      name="footer_disclaimer"
                      value={form.footer_disclaimer}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="Built with React, Three.js & FastAPI"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-soft mb-2">Footer Rights</label>
                    <input
                      name="footer_rights"
                      value={form.footer_rights}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="© 2026 Your Name. All rights reserved."
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-white mb-2">About Page</p>
                    <input
                      name="about_title"
                      value={form.about_title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="About heading"
                    />
                    <textarea
                      name="about_body_primary"
                      value={form.about_body_primary}
                      onChange={handleChange}
                      rows={4}
                      className="mt-3 w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Intro paragraph"
                    />
                    <textarea
                      name="about_body_secondary"
                      value={form.about_body_secondary}
                      onChange={handleChange}
                      rows={3}
                      className="mt-3 w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Second paragraph"
                    />
                  </div>
                  <div className="space-y-3 pt-6 md:pt-0">
                    <div>
                      <label className="block text-sm text-soft mb-2">Snapshot Focus</label>
                      <input
                        name="about_snapshot_focus"
                        value={form.about_snapshot_focus}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-soft mb-2">Snapshot Stack</label>
                      <input
                        name="about_snapshot_stack"
                        value={form.about_snapshot_stack}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-soft mb-2">Snapshot Availability</label>
                      <input
                        name="about_snapshot_availability"
                        value={form.about_snapshot_availability}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                    className="w-5 h-5 rounded bg-ink-200 border border-white/20 accent-primary"
                  />
                  <span className="text-sm">Set as active content</span>
                </label>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-5 py-2.5 rounded-lg border border-white/10 text-sm text-soft hover:text-white hover:border-white/20 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-lg bg-gradient-primary text-ink text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editing ? 'Update Content' : 'Create Content'}
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

export default ManageHeroContent
