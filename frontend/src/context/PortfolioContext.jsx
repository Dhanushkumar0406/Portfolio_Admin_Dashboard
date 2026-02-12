import { createContext, useContext, useState, useEffect } from 'react'
import projectService from '../services/projectService'
import skillService from '../services/skillService'
import profileService from '../services/profileService'
import siteContentService from '../services/siteContentService'
import { toast } from 'react-toastify'

const PortfolioContext = createContext(null)

export const usePortfolio = () => {
  const context = useContext(PortfolioContext)
  if (!context) {
    throw new Error('usePortfolio must be used within PortfolioProvider')
  }
  return context
}

export const PortfolioProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [experience, setExperience] = useState([])
  const [education, setEducation] = useState([])
  const [profile, setProfile] = useState(null)
  const [siteContent, setSiteContent] = useState(null)
  const [loading, setLoading] = useState(false)
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const initialProfileSlug = urlParams?.get('profile') || null
  const [profileSlug, setProfileSlug] = useState(initialProfileSlug)

  // Fetch all portfolio data on mount
  useEffect(() => {
    fetchAllData()
  }, [profileSlug])

  // Lightweight live refresh: refetch content when tab regains focus and on interval.
  useEffect(() => {
    const handleFocus = () => {
      fetchSiteContent(profileSlug)
      fetchSkills({ silent: true }) // keep stats/widgets fresh without UI flicker
    }
    window.addEventListener('focus', handleFocus)
    const interval = setInterval(handleFocus, 60000) // 1 minute
    return () => {
      window.removeEventListener('focus', handleFocus)
      clearInterval(interval)
    }
  }, [])

  const fetchAllData = async () => {
    await fetchSiteContent(profileSlug)
    await Promise.all([
      fetchProjects(),
      fetchSkills(),
      fetchExperience(),
      fetchEducation(),
    ])
  }

  const fetchProjects = async (params = {}) => {
    try {
      setLoading(true)
      const data = await projectService.getProjects(params)
      setProjects(data)
      return { success: true, data }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const fetchSkills = async (options = {}) => {
    const { silent = false } = options
    try {
      if (!silent) setLoading(true)
      const data = await skillService.getSkills()
      setSkills(data)
      return { success: true, data }
    } catch (error) {
      console.error('Failed to fetch skills:', error)
      return { success: false, error }
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const fetchExperience = async (slug = profileSlug) => {
    try {
      const data = await profileService.getExperience(slug)
      setExperience(data)
      return { success: true, data }
    } catch (error) {
      console.error('Failed to fetch experience:', error)
      return { success: false, error }
    }
  }

  const fetchEducation = async () => {
    try {
      const data = await profileService.getEducation()
      setEducation(data)
      return { success: true, data }
    } catch (error) {
      console.error('Failed to fetch education:', error)
      return { success: false, error }
    }
  }

  const fetchProfile = async () => {
    try {
      const data = await profileService.getProfile()
      setProfile(data)
      return { success: true, data }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      return { success: false, error }
    }
  }

  const fetchSiteContent = async (slug = profileSlug) => {
    try {
      const data = await siteContentService.getPublicContent(slug)
      setSiteContent(data)
      if (data?.profile_slug) {
        setProfileSlug(data.profile_slug)
      }
      return { success: true, data }
    } catch (error) {
      // Active content may not exist yet; keep safe fallback on frontend.
      setSiteContent(null)
      return { success: false, error }
    }
  }

  const addProject = async (projectData) => {
    try {
      const data = await projectService.createProject(projectData)
      setProjects([...projects, data])
      toast.success('Project created successfully!')
      return { success: true, data }
    } catch (error) {
      toast.error('Failed to create project')
      return { success: false, error }
    }
  }

  const updateProject = async (id, projectData) => {
    try {
      const data = await projectService.updateProject(id, projectData)
      setProjects(projects.map(p => p.id === id ? data : p))
      toast.success('Project updated successfully!')
      return { success: true, data }
    } catch (error) {
      toast.error('Failed to update project')
      return { success: false, error }
    }
  }

  const deleteProject = async (id) => {
    try {
      await projectService.deleteProject(id)
      setProjects(projects.filter(p => p.id !== id))
      toast.success('Project deleted successfully!')
      return { success: true }
    } catch (error) {
      toast.error('Failed to delete project')
      return { success: false, error }
    }
  }

  const value = {
    projects,
    skills,
    experience,
    education,
    profile,
    siteContent,
    profileSlug,
    loading,
    fetchProjects,
    fetchSkills,
    fetchExperience,
    fetchEducation,
    fetchProfile,
    fetchSiteContent,
    fetchAllData,
    setProfileSlug,
    addProject,
    updateProject,
    deleteProject,
  }

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export default PortfolioContext
