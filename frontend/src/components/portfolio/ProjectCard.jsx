import { motion } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt, FaYoutube } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import uploadService from '../../services/uploadService'
import { useRoutePrefix, buildPath } from '../../utils/routePrefix'

const ProjectCard = ({ project, index }) => {
  const navigate = useNavigate()
  const prefix = useRoutePrefix()
  const imageUrl = uploadService.getFileUrl(project.image_url || project.thumbnail_url)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group glass-card overflow-hidden relative cursor-pointer"
      onClick={() => navigate(buildPath(`/projects/${project.id}`, prefix))}
      onKeyDown={(event) => {
        if (event.key === 'Enter') navigate(buildPath(`/projects/${project.id}`, prefix))
      }}
      role="button"
      tabIndex={0}
    >
      <div className="p-4">
        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-ink-200">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-soft text-xs uppercase tracking-[0.35em]">
              Preview
            </div>
          )}

          {project.featured && (
            <div className="absolute top-4 right-4 bg-gradient-primary px-3 py-1 rounded-full text-xs font-semibold text-ink">
              Featured
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-heading group-hover:text-primary transition-all">
            {project.title}
          </h3>
          <div className="flex items-center gap-3 text-soft">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <FaGithub size={18} />
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <FaExternalLinkAlt size={16} />
              </a>
            )}
            {project.youtube_url && (
              <a
                href={project.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <FaYoutube size={18} />
              </a>
            )}
          </div>
        </div>

        <p className="text-muted text-sm mt-3 line-clamp-2">
          {project.short_description || project.description}
        </p>

        {Array.isArray(project.technologies) && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {project.technologies.slice(0, 4).map((tech, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-white/5 text-soft text-xs rounded-full uppercase tracking-[0.2em]"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {project.category && (
          <span className="inline-block text-xs text-soft uppercase tracking-[0.3em] mt-4">
            {project.category}
          </span>
        )}
      </div>

    </motion.div>
  )
}

export default ProjectCard
