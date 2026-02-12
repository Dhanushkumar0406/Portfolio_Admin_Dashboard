import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import ProjectGrid from '../components/portfolio/ProjectGrid'
import { usePortfolio } from '../context/PortfolioContext'
import Loader from '../components/common/Loader'

const Projects = () => {
  const { projects, loading, fetchProjects } = usePortfolio()
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (projects.length === 0) fetchProjects()
  }, [])

  const categories = useMemo(() => {
    return [...new Set(projects.map((project) => project.category).filter(Boolean))]
  }, [projects])

  const filteredProjects = useMemo(() => {
    if (filter === 'all') return projects
    if (filter === 'featured') return projects.filter((project) => project.featured)
    return projects.filter((project) => project.category === filter)
  }, [projects, filter])

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col">
      <Navbar />

      <section className="section pt-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <p className="text-soft text-xs uppercase tracking-[0.35em]">Portfolio</p>
            <h1 className="text-4xl md:text-6xl font-heading mt-3">A lab of experiments</h1>
            <p className="text-muted mt-4">
              From interactive showcases to production-ready builds. Each project balances
              aesthetics, performance, and story.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-3 mt-10">
            {[
              { key: 'all', label: 'All' },
              { key: 'featured', label: 'Featured' },
              ...categories.map((category) => ({ key: category, label: category })),
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.3em] border transition-all ${
                  filter === item.key
                    ? 'border-primary text-primary bg-white/5'
                    : 'border-white/10 text-soft hover:border-primary hover:text-primary'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-12">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader size="lg" text="Loading projects..." />
              </div>
            ) : (
              <ProjectGrid projects={filteredProjects} />
            )}
          </div>

          {!loading && projects.length === 0 && (
            <div className="text-center py-20 text-soft">
              Add projects in the admin panel to populate this page.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Projects
