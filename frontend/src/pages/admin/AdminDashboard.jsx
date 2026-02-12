import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FaProjectDiagram,
  FaCogs,
  FaBriefcase,
  FaGraduationCap,
  FaEnvelope,
  FaCube,
  FaImage,
  FaGlobe,
  FaExternalLinkAlt,
} from 'react-icons/fa'
import { usePortfolio } from '../../context/PortfolioContext'

const StatCard = ({ icon: Icon, label, value, color, to, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <Link
      to={to}
      className="glass-card p-6 flex items-center gap-5 hover:border-primary/30 transition-all group block"
    >
      <div className={`h-12 w-12 rounded-xl grid place-items-center ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-3xl font-heading">{value}</p>
        <p className="text-soft text-xs uppercase tracking-[0.3em]">{label}</p>
      </div>
    </Link>
  </motion.div>
)

const AdminDashboard = () => {
  const { projects, skills, experience, education } = usePortfolio()

  const stats = [
    { icon: FaProjectDiagram, label: 'Projects', value: projects.length, color: 'bg-primary/20 text-primary', to: '/admin/projects' },
    { icon: FaCogs, label: 'Skills', value: skills.length, color: 'bg-accent-teal/20 text-accent-teal', to: '/admin/skills' },
    { icon: FaBriefcase, label: 'Experience', value: experience.length, color: 'bg-secondary/20 text-secondary', to: '/admin/experience' },
    { icon: FaGraduationCap, label: 'Education', value: education.length, color: 'bg-accent-coral/20 text-accent-coral', to: '/admin/education' },
  ]

  const quickActions = [
    { label: 'Add Project', to: '/admin/projects', icon: FaProjectDiagram },
    { label: 'Add Skill', to: '/admin/skills', icon: FaCogs },
    { label: 'Add Experience', to: '/admin/experience', icon: FaBriefcase },
    { label: 'View Messages', to: '/admin/contacts', icon: FaEnvelope },
    { label: 'Manage 3D', to: '/admin/three-assets', icon: FaCube },
    { label: 'Hero Content', to: '/admin/hero-content', icon: FaImage },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading">Dashboard</h1>
        <p className="text-soft mt-1">Overview of your portfolio content</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} {...stat} delay={index * 0.1} />
        ))}
      </div>

      <div>
        <h2 className="text-xl font-heading mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                <Link
                  to={action.to}
                  className="glass-card p-4 flex flex-col items-center gap-3 hover:border-primary/30 transition-all text-center group block"
                >
                  <div className="h-10 w-10 rounded-lg bg-white/5 grid place-items-center group-hover:bg-primary/10 transition-colors">
                    <Icon size={16} className="text-soft group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-xs text-soft group-hover:text-white transition-colors">{action.label}</span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <a
          href={window.location.origin}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card p-5 flex items-center justify-between hover:border-primary/30 transition-all group block"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/20 grid place-items-center">
              <FaGlobe size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-heading">Live Portfolio Website</p>
              <p className="text-xs text-soft font-mono mt-1">{window.location.origin}</p>
            </div>
          </div>
          <FaExternalLinkAlt size={14} className="text-soft group-hover:text-primary transition-colors" />
        </a>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading">Recent Projects</h2>
            <Link to="/admin/projects" className="text-xs text-primary uppercase tracking-[0.2em]">View all</Link>
          </div>
          {projects.length === 0 ? (
            <p className="text-soft text-sm py-6 text-center">No projects yet. Add your first project.</p>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <p className="text-sm font-medium">{project.title}</p>
                    <p className="text-xs text-soft">{project.category || 'Uncategorized'}</p>
                  </div>
                  {project.featured && (
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Featured</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading">Skills Overview</h2>
            <Link to="/admin/skills" className="text-xs text-primary uppercase tracking-[0.2em]">View all</Link>
          </div>
          {skills.length === 0 ? (
            <p className="text-soft text-sm py-6 text-center">No skills yet. Add your skills.</p>
          ) : (
            <div className="space-y-3">
              {skills.slice(0, 5).map((skill) => (
                <div key={skill.id} className="p-3 rounded-lg bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">{skill.name}</p>
                    <p className="text-xs text-soft">{skill.proficiency}%</p>
                  </div>
                  <div className="h-1.5 bg-ink-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary rounded-full transition-all"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
