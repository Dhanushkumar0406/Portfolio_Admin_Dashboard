import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import Button from '../components/common/Button'
import { usePortfolio } from '../context/PortfolioContext'
import uploadService from '../services/uploadService'

const Home = () => {
  const navigate = useNavigate()
  const { projects, skills, experience, siteContent } = usePortfolio()

  const featuredProjects = useMemo(() => {
    const featured = projects.filter((project) => project.featured)
    if (featured.length > 0) return featured.slice(0, 2)
    return projects.slice(0, 2)
  }, [projects])

  const showcaseExperience = experience.slice(0, 4)
  const highlightSkills = skills.slice(0, 8)
  const displayName = siteContent?.display_name?.trim() || ''
  const eyebrowText = siteContent?.eyebrow_text?.trim() || ''
  const heroTitle = siteContent?.hero_title?.trim() || ''
  const heroSubtitle = siteContent?.hero_subtitle?.trim() || ''
  const primaryCtaText = siteContent?.cta_primary_text?.trim() || 'View Work'
  const primaryCtaLink = siteContent?.cta_primary_link?.trim() || '/projects'
  const secondaryCtaText = siteContent?.cta_secondary_text?.trim() || 'Get in Touch'
  const secondaryCtaLink = siteContent?.cta_secondary_link?.trim() || '/contact'
  const iconText = siteContent?.icon_text?.trim() || ''
  const profileImageUrl = uploadService.getFileUrl(siteContent?.profile_image_url)

  const experienceYears = useMemo(() => {
    if (!experience?.length) return 0
    const now = new Date()
    const totalMonths = experience.reduce((months, item) => {
      if (!item?.start_date) return months
      const start = new Date(item.start_date)
      const end = item.end_date ? new Date(item.end_date) : now
      if (isNaN(start)) return months
      const diffMonths = (end - start) / (1000 * 60 * 60 * 24 * 30.44)
      return months + Math.max(diffMonths, 0)
    }, 0)
    const years = totalMonths / 12
    return Math.max(0, Number(years.toFixed(years >= 5 ? 0 : 1)))
  }, [experience])

  const companiesServed = useMemo(() => {
    if (!experience?.length) return 0
    const companies = experience
      .map((item) => item.company)
      .filter(Boolean)
    return new Set(companies).size
  }, [experience])

  const liveStats = useMemo(() => {
    const formatCount = (count) => `${Math.max(0, count)}`
    const formatYears = (years) => `${years} yrs`

    return [
      { label: 'Projects', value: formatCount(projects.length) },
      { label: 'Experience', value: formatYears(experienceYears) },
      { label: 'Skills', value: formatCount(skills.length) },
      {
        label: 'Clients',
        value: formatCount(companiesServed),
      },
    ]
  }, [projects.length, experienceYears, skills.length, companiesServed])

  const handleCtaClick = (url) => {
    if (!url) return
    if (/^https?:\/\//i.test(url)) {
      window.open(url, '_blank', 'noopener,noreferrer')
      return
    }
    navigate(url)
  }

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24">
        <section className="section">
          <div className="container relative">
            <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/20 blur-[120px]"></div>
            <div className="absolute top-10 right-0 h-72 w-72 rounded-full bg-accent-coral/20 blur-[140px]"></div>

            <div className="grid lg:grid-cols-2 gap-12 items-center relative">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <p className="text-soft uppercase tracking-[0.35em] text-xs">
                  {eyebrowText}
                </p>

                <h1 className="text-4xl md:text-6xl font-heading leading-tight">
                  {heroTitle}
                </h1>

                <p className="text-xl text-muted max-w-xl">
                  {heroSubtitle}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" size="lg" onClick={() => handleCtaClick(primaryCtaLink)}>
                    {primaryCtaText}
                  </Button>
                  <Button variant="primary" size="lg" onClick={() => handleCtaClick(secondaryCtaLink)}>
                    {secondaryCtaText}
                  </Button>
                </div>

                <div className="flex flex-wrap gap-3 pt-6">
                  {highlightSkills.length > 0 ? (
                    highlightSkills.map((skill) => (
                      <span
                        key={skill.id || skill.name}
                        className="px-3 py-1 rounded-full text-xs uppercase tracking-[0.2em] bg-white/5 border border-white/10 text-soft"
                      >
                        {skill.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-soft text-sm">Add skills to highlight your stack.</span>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="glass-card p-8 md:p-12">
                  <div className="relative">
                    <div className="absolute -top-10 -left-8 h-16 w-16 rounded-2xl bg-primary/20 blur-lg"></div>
                    <div className="absolute -bottom-10 right-0 h-20 w-20 rounded-full bg-accent-coral/30 blur-xl"></div>
                    <div className="flex items-center gap-6">
                      <div className="h-24 w-24 rounded-3xl bg-gradient-primary grid place-items-center text-2xl text-ink overflow-hidden">
                        {profileImageUrl ? (
                          <img
                            src={profileImageUrl}
                            alt={displayName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          iconText
                        )}
                      </div>
                      <div>
                        <p className="text-soft text-xs uppercase tracking-[0.3em]">Profile</p>
                        <p className="text-2xl font-heading">{displayName || 'Your Name'}</p>
                        <p className="text-muted text-sm">{siteContent?.tagline?.trim() || ''}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 grid grid-cols-2 gap-4">
                    {liveStats.map((stat) => (
                      <div key={stat.label} className="surface rounded-2xl p-4">
                        <p className="text-2xl font-heading">{stat.value}</p>
                        <p className="text-soft text-xs uppercase tracking-[0.3em]">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div>
                <p className="text-soft text-xs uppercase tracking-[0.35em]">Work Experience</p>
                <h2 className="text-3xl md:text-4xl font-heading">Where I have shipped</h2>
              </div>
              <Link to="/about" className="text-sm uppercase tracking-[0.2em] text-primary">
                View timeline
              </Link>
            </div>

                {showcaseExperience.length === 0 ? (
                  <div className="glass-card p-8 text-soft text-sm">
                    Add experience entries in the admin dashboard to showcase your timeline.
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {showcaseExperience.map((item, index) => (
                      <motion.div
                        key={item.id || `${item.company}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card p-6 md:p-8"
                      >
                        <p className="text-soft text-xs uppercase tracking-[0.3em]">
                          {item.employment_type || 'Role'}
                        </p>
                        <h3 className="text-2xl font-heading mt-2">{item.company}</h3>
                        <p className="text-muted mt-2">{item.position}</p>
                        <p className="text-soft mt-4 text-sm leading-relaxed">
                          {item.description || ''}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <p className="text-soft text-xs uppercase tracking-[0.35em]">Featured Projects</p>
                <h2 className="text-3xl md:text-4xl font-heading">Selected work</h2>
              </div>
              <Link to="/projects" className="text-sm uppercase tracking-[0.2em] text-primary">
                See all
              </Link>
            </div>

            <div className="space-y-16">
              {featuredProjects.length === 0 && (
                <div className="glass-card p-10 text-center text-soft">
                  Add projects to highlight your featured work.
                </div>
              )}

              {featuredProjects.map((project, index) => {
                const imageUrl = uploadService.getFileUrl(
                  project.image_url || project.thumbnail_url
                )
                const isEven = index % 2 === 0

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid lg:grid-cols-2 gap-10 items-center"
                  >
                    <div className={isEven ? '' : 'lg:order-2'}>
                      <div className="glass-card p-4 md:p-6">
                        <div className="aspect-[16/10] rounded-2xl bg-ink-200 overflow-hidden grid place-items-center text-soft">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-xs uppercase tracking-[0.35em]">Preview</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={isEven ? '' : 'lg:order-1'}>
                      <p className="text-soft text-xs uppercase tracking-[0.35em]">Featured Project</p>
                      <h3 className="text-3xl font-heading mt-3">{project.title}</h3>
                      <p className="text-muted mt-4 max-w-xl">
                        {project.short_description || project.description || ''}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-6">
                        {(Array.isArray(project.technologies) ? project.technologies : [])
                          .slice(0, 4)
                          .map((tech, techIndex) => (
                          <span
                            key={`${project.id}-tech-${techIndex}`}
                            className="px-3 py-1 rounded-full text-xs uppercase tracking-[0.2em] bg-white/5 border border-white/10 text-soft"
                          >
                            {tech}
                          </span>
                          ))}
                      </div>
                      <div className="mt-6">
                        <Link to="/projects" className="text-sm uppercase tracking-[0.2em] text-primary">
                          View project
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="glass-card p-10 md:p-14 text-center relative overflow-hidden">
              <div className="absolute -top-16 right-10 h-40 w-40 rounded-full bg-primary/20 blur-[90px]"></div>
              <p className="text-soft text-xs uppercase tracking-[0.35em]">Let us build together</p>
              <h2 className="text-3xl md:text-4xl font-heading mt-3">
                {siteContent?.cta_section_title?.trim() || 'Ready to collaborate?'}
              </h2>
              <p className="text-muted max-w-2xl mx-auto mt-4">
                {siteContent?.cta_section_subtitle?.trim() || ''}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button variant="primary" size="lg" onClick={() => navigate('/contact')}>
                  Contact Me
                </Button>
                <Link
                  to="/projects"
                  className="px-6 py-3 rounded-lg border border-white/10 text-sm uppercase tracking-[0.2em] hover:border-primary hover:text-primary transition-all"
                >
                  See Work
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
