import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { usePortfolio } from '../context/PortfolioContext'

const UserPortfolioLayout = () => {
  const { slug } = useParams()
  const {
    setProfileSlug,
    fetchSiteContent,
    fetchProjects,
    fetchSkills,
    fetchExperience,
    fetchEducation,
  } = usePortfolio()

  useEffect(() => {
    if (!slug) return
    setProfileSlug(slug)
    fetchSiteContent(slug)
    fetchProjects()
    fetchSkills()
    fetchExperience(slug)
    fetchEducation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  return <Outlet />
}

export default UserPortfolioLayout
