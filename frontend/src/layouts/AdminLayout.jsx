import { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaHome,
  FaProjectDiagram,
  FaCogs,
  FaBriefcase,
  FaGraduationCap,
  FaEnvelope,
  FaCube,
  FaImage,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaArrowLeft,
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: FaHome },
  { name: 'Projects', path: '/admin/projects', icon: FaProjectDiagram },
  { name: 'Skills', path: '/admin/skills', icon: FaCogs },
  { name: 'Experience', path: '/admin/experience', icon: FaBriefcase },
  { name: 'Education', path: '/admin/education', icon: FaGraduationCap },
  { name: 'Messages', path: '/admin/contacts', icon: FaEnvelope },
  { name: '3D Assets', path: '/admin/three-assets', icon: FaCube },
  { name: 'Portfolio Content', path: '/admin/hero-content', icon: FaImage },
  { name: 'Settings', path: '/admin/settings', icon: FaCog },
]

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-dark flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-ink-100/80 border-r border-white/10 fixed h-full z-40">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center text-ink font-bold text-sm">
              HK
            </span>
            <div className="leading-tight">
              <p className="text-xs uppercase tracking-[0.3em] text-soft">Admin</p>
              <p className="text-base font-heading">Dashboard</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  isActive(link.path)
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-soft hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {link.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-soft hover:text-white hover:bg-white/5 transition-all"
          >
            <FaArrowLeft size={14} />
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-soft hover:text-accent-coral hover:bg-accent-coral/5 transition-all w-full"
          >
            <FaSignOutAlt size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-ink-100 border-r border-white/10 z-50 lg:hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                  <span className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center text-ink font-bold text-sm">
                    HK
                  </span>
                  <p className="text-base font-heading">Admin</p>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="text-soft hover:text-white p-1">
                  <FaTimes size={18} />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                        isActive(link.path)
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'text-soft hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon size={16} />
                      {link.name}
                    </Link>
                  )
                })}
              </nav>

              <div className="p-4 border-t border-white/10 space-y-2">
                <Link
                  to="/"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-soft hover:text-white hover:bg-white/5 transition-all"
                >
                  <FaArrowLeft size={14} />
                  Back to Site
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-soft hover:text-accent-coral hover:bg-accent-coral/5 transition-all w-full"
                >
                  <FaSignOutAlt size={14} />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-ink/70 border-b border-white/10">
          <div className="flex items-center justify-between px-6 h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-soft hover:text-white p-2"
              aria-label="Open sidebar"
            >
              <FaBars size={20} />
            </button>

            <div className="hidden lg:block">
              <p className="text-sm text-soft">
                Welcome back, <span className="text-white">{user?.full_name || 'Admin'}</span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-gradient-primary grid place-items-center text-ink text-xs font-bold">
                {(user?.full_name || 'A').charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
