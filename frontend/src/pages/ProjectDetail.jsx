import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt, FaYoutube, FaArrowLeft, FaCalendar } from 'react-icons/fa'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import projectService from '../services/projectService'
import uploadService from '../services/uploadService'
import Loader from '../components/common/Loader'
import { useRoutePrefix, buildPath } from '../utils/routePrefix'

const ProjectDetail = () => {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const prefix = useRoutePrefix()

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await projectService.getProjectById(id)
        setProject(data)
      } catch (error) {
        setProject(null)
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <Navbar />
        <div className="section pt-28 flex items-center justify-center">
          <Loader size="lg" text="Loading project..." />
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <Navbar />
        <div className="section pt-28 text-center">
          <p className="text-soft text-lg">Project not found.</p>
          <Link to={buildPath('/projects', prefix)} className="text-sm uppercase tracking-[0.2em] text-primary mt-4 inline-block">
            Back to projects
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const imageUrl = uploadService.getFileUrl(project.image_url || project.thumbnail_url)
  const hasLinks = project.github_url || project.live_url || project.youtube_url

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="section pt-28">
          <div className="container">
            <Link to={buildPath('/projects', prefix)} className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-primary hover:text-primary-light transition-colors">
              <FaArrowLeft size={12} /> Back to projects
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              {/* Hero Image */}
              <div className="glass-card p-4 md:p-6 mb-10">
                <div className="aspect-[21/9] rounded-2xl bg-ink-200 overflow-hidden">
                  {imageUrl ? (
                    <img src={imageUrl} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-soft text-xs uppercase tracking-[0.35em]">
                      Project Preview
                    </div>
                  )}
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid lg:grid-cols-[1fr_0.4fr] gap-10">
                {/* Main Content */}
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap mb-4">
                      {project.featured && (
                        <span className="text-xs px-3 py-1 rounded-full bg-gradient-primary text-ink font-semibold">
                          Featured
                        </span>
                      )}
                      {project.status && (
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          project.status === 'completed' ? 'bg-primary/10 text-primary' :
                          project.status === 'in-progress' ? 'bg-secondary/10 text-secondary' :
                          'bg-white/10 text-soft'
                        }`}>
                          {project.status}
                        </span>
                      )}
                      {project.category && (
                        <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-soft uppercase tracking-[0.2em]">
                          {project.category}
                        </span>
                      )}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-heading">{project.title}</h1>

                    {project.short_description && (
                      <p className="text-xl text-muted mt-4">{project.short_description}</p>
                    )}
                  </div>

                  {project.description && (
                    <div className="prose-custom">
                      <p className="text-muted leading-relaxed whitespace-pre-wrap">{project.description}</p>
                    </div>
                  )}

                  {/* Technologies */}
                  {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                    <div>
                      <p className="text-soft text-xs uppercase tracking-[0.35em] mb-4">Tech Stack</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={`${project.id}-detail-${index}`}
                            className="px-4 py-2 rounded-xl text-sm bg-white/5 border border-white/10 text-slate-100 hover:border-primary/30 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Project Links */}
                  {hasLinks && (
                    <div className="glass-card p-6">
                      <p className="text-soft text-xs uppercase tracking-[0.35em] mb-4">Links</p>
                      <div className="space-y-3">
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-primary text-ink font-medium text-sm hover:shadow-lg hover:shadow-primary/30 transition-all"
                          >
                            <FaExternalLinkAlt size={14} />
                            View Live
                          </a>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-xl border border-white/10 text-sm text-soft hover:text-white hover:border-white/20 transition-all"
                          >
                            <FaGithub size={16} />
                            Source Code
                          </a>
                        )}
                        {project.youtube_url && (
                          <a
                            href={project.youtube_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-xl border border-white/10 text-sm text-soft hover:text-white hover:border-white/20 transition-all"
                          >
                            <FaYoutube size={16} />
                            Watch Demo
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Project Info */}
                  <div className="glass-card p-6">
                    <p className="text-soft text-xs uppercase tracking-[0.35em] mb-4">Details</p>
                    <div className="space-y-4">
                      {project.category && (
                        <div>
                          <p className="text-xs text-soft uppercase tracking-[0.2em]">Category</p>
                          <p className="text-sm mt-1">{project.category}</p>
                        </div>
                      )}
                      {project.status && (
                        <div>
                          <p className="text-xs text-soft uppercase tracking-[0.2em]">Status</p>
                          <p className="text-sm mt-1 capitalize">{project.status}</p>
                        </div>
                      )}
                      {project.project_date && (
                        <div>
                          <p className="text-xs text-soft uppercase tracking-[0.2em]">Date</p>
                          <p className="text-sm mt-1 flex items-center gap-2">
                            <FaCalendar size={11} className="text-soft" />
                            {new Date(project.project_date).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long',
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ProjectDetail
