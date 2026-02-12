import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { usePortfolio } from '../context/PortfolioContext'

const About = () => {
  const { experience, education, fetchExperience, fetchEducation, siteContent } = usePortfolio()

  useEffect(() => {
    fetchExperience()
    fetchEducation()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col">
      <Navbar />

      <section className="section pt-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start"
          >
            <div className="space-y-6">
              <p className="text-soft text-xs uppercase tracking-[0.35em]">About</p>
              <h1 className="text-4xl md:text-6xl font-heading leading-tight">
                {siteContent?.about_title?.trim() || '—'}
              </h1>
              <p className="text-muted text-lg leading-relaxed">
                {siteContent?.about_body_primary?.trim() || '—'}
              </p>
              <p className="text-muted text-lg leading-relaxed">
                {siteContent?.about_body_secondary?.trim() || '—'}
              </p>
            </div>

            <div className="glass-card p-8">
              <p className="text-soft text-xs uppercase tracking-[0.35em]">Snapshot</p>
              <div className="mt-6 space-y-6">
                {[
                  { label: 'Focus', value: siteContent?.about_snapshot_focus?.trim() },
                  { label: 'Stack', value: siteContent?.about_snapshot_stack?.trim() },
                  { label: 'Availability', value: siteContent?.about_snapshot_availability?.trim() },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-soft text-xs uppercase tracking-[0.3em]">{item.label}</p>
                    <p className="text-lg font-heading mt-2">
                      {item.value || '—'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container grid lg:grid-cols-2 gap-10">
          <div>
            <p className="text-soft text-xs uppercase tracking-[0.35em]">Experience</p>
            <h2 className="text-3xl font-heading mt-3">Recent roles</h2>
            <div className="mt-8 space-y-6">
              {(experience.length > 0 ? experience : []).map((item) => (
                <div key={item.id} className="glass-card p-6">
                  <p className="text-soft text-xs uppercase tracking-[0.3em]">
                    {item.employment_type || 'Role'}
                  </p>
                  <h3 className="text-xl font-heading mt-2">{item.position}</h3>
                  <p className="text-muted">{item.company}</p>
                  {item.description && (
                    <p className="text-soft text-sm mt-3 leading-relaxed">{item.description}</p>
                  )}
                </div>
              ))}
              {experience.length === 0 && (
                <div className="glass-card p-6 text-soft">
                  Add experience entries to showcase your timeline.
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-soft text-xs uppercase tracking-[0.35em]">Education</p>
            <h2 className="text-3xl font-heading mt-3">Learning journey</h2>
            <div className="mt-8 space-y-6">
              {(education.length > 0 ? education : []).map((item) => (
                <div key={item.id} className="glass-card p-6">
                  <p className="text-soft text-xs uppercase tracking-[0.3em]">
                    {item.field_of_study || 'Program'}
                  </p>
                  <h3 className="text-xl font-heading mt-2">{item.institution}</h3>
                  <p className="text-muted">{item.degree}</p>
                  {item.description && (
                    <p className="text-soft text-sm mt-3 leading-relaxed">{item.description}</p>
                  )}
                </div>
              ))}
              {education.length === 0 && (
                <div className="glass-card p-6 text-soft">
                  Add education entries to highlight credentials.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default About
