import { useLocation } from 'react-router-dom'
import { usePortfolio } from '../context/PortfolioContext'

export const useRoutePrefix = () => {
  const location = useLocation()
  const { profileSlug } = usePortfolio()

  const match = /^\/u\/([^\/]+)/.exec(location.pathname)
  const slugFromPath = match ? match[1] : null
  const slug = slugFromPath || profileSlug

  if (slug) {
    return `/u/${slug}`
  }
  return ''
}

export const buildPath = (path, prefix) => {
  if (!prefix) return path
  if (!path) return prefix
  if (/^https?:\/\//i.test(path)) return path

  const normalized = path.startsWith('/') ? path.slice(1) : path
  if (!normalized || normalized === '') return prefix
  return `${prefix}/${normalized}`
}
