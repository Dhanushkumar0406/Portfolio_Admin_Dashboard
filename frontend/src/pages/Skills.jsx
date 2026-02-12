import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { usePortfolio } from '../context/PortfolioContext'
import Loader from '../components/common/Loader'

const SkillCard = ({ skill, index }) => {
  const percentage = Math.min(Math.max(skill.proficiency || 0, 0), 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-soft text-xs uppercase tracking-[0.3em]">{skill.category || 'Skill'}</p>
          <h3 className="text-xl font-heading mt-2">{skill.name}</h3>
        </div>
        <div className="text-2xl font-heading">{percentage}%</div>
      </div>

      <div className="mt-5 h-2 bg-ink-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: index * 0.05 }}
          className="h-full bg-gradient-primary rounded-full"
        ></motion.div>
      </div>

      {skill.years_experience && (
        <p className="text-soft text-sm mt-3">{skill.years_experience} years experience</p>
      )}
    </motion.div>
  )
}

const Skills = () => {
  const { skills, loading, fetchSkills } = usePortfolio()

  useEffect(() => {
    if (skills.length === 0) fetchSkills()
  }, [])

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other'
    if (!acc[category]) acc[category] = []
    acc[category].push(skill)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col">
      <Navbar />

      <section className="section flex-1 flex items-center justify-center">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-soft text-xs uppercase tracking-[0.35em]">Skills</p>
            <h1 className="text-4xl md:text-6xl font-heading mt-3">
              Crafting worlds with precision and style
            </h1>
            <p className="text-muted mt-4">
              A focused mix of engineering, design, and production skills. Each category maps to
              what I ship end-to-end.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader size="lg" text="Loading skills..." />
            </div>
          ) : (
            <div className="mt-16 space-y-12">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <div key={category}>
                  <h2 className="text-2xl font-heading text-primary mb-6">{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categorySkills.map((skill, index) => (
                      <SkillCard key={skill.id} skill={skill} index={index} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && skills.length === 0 && (
            <div className="text-center py-20 text-soft">
              Add skills in the admin panel to populate this page.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Skills
