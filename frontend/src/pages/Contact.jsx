import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import contactService from '../services/contactService'
import { toast } from 'react-toastify'
import { usePortfolio } from '../context/PortfolioContext'

const Contact = () => {
  const { siteContent } = usePortfolio()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)

  const contactTitle = siteContent?.contact_title || ''
  const contactSubtitle = siteContent?.contact_subtitle || ''
  const contactEmail = siteContent?.contact_email || ''
  const contactLocation = siteContent?.contact_location || ''
  const contactAvailability = siteContent?.contact_availability || ''
  const contactResponseTime = siteContent?.contact_response_time || ''

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await contactService.submitContact(formData)
      toast.success('Message sent successfully!')
      setFormData({ name: '', email: '', subject: '', message: '', phone: '' })
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col">
      <Navbar />

      <section className="section pt-28">
        <div className="container grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <p className="text-soft text-xs uppercase tracking-[0.35em]">Contact</p>
            <h1 className="text-4xl md:text-6xl font-heading">
              {contactTitle}
            </h1>
            <p className="text-muted">
              {contactSubtitle}
            </p>

            <div className="glass-card p-6 space-y-4">
              <div>
                <p className="text-soft text-xs uppercase tracking-[0.3em]">Email</p>
                <p className="text-lg">{contactEmail}</p>
              </div>
              <div>
                <p className="text-soft text-xs uppercase tracking-[0.3em]">Location</p>
                <p className="text-lg">{contactLocation}</p>
              </div>
              <div>
                <p className="text-soft text-xs uppercase tracking-[0.3em]">Availability</p>
                <p className="text-lg">{contactAvailability}</p>
              </div>
              <div>
                <p className="text-soft text-xs uppercase tracking-[0.3em]">Response time</p>
                <p className="text-lg">{contactResponseTime}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8 md:p-10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Optional"
                />
                <Input
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Project inquiry"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-soft mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Tell me about your project..."
                  className="w-full px-4 py-3 bg-ink-100 border border-white/10 rounded-lg text-white placeholder:text-slate-100/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  required
                ></textarea>
              </div>

              <Button variant="primary" size="lg" type="submit" loading={loading}>
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Contact
