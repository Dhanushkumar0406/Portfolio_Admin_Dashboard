import ProjectCard from './ProjectCard'

const ProjectGrid = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-soft text-xl">No projects found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  )
}

export default ProjectGrid
