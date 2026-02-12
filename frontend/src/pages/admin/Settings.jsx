import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaSave, FaUser, FaPalette, FaCog, FaSyncAlt, FaCheckCircle, FaExclamationCircle, FaShieldAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import profileService from '../../services/profileService'
import authService from '../../services/authService'
import systemService from '../../services/systemService'

const StatusBadge = ({ status }) => {
  if (status === 'ok') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
        <FaCheckCircle size={10} />
        OK
      </span>
    )
  }

  if (status === 'skip') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-white/10 text-soft">
        Skipped
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-accent-coral/10 text-accent-coral">
      <FaExclamationCircle size={10} />
      Failed
    </span>
  )
}

const Settings = () => {
  const { user } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  })
  const [diagnosticsLoading, setDiagnosticsLoading] = useState(false)
  const [diagnostics, setDiagnostics] = useState({
    root: 'fail',
    health: 'fail',
    token: 'fail',
    publicProfile: 'skip',
  })

  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8006/api/v1'

  useEffect(() => {
    setProfile({
      full_name: user?.full_name || '',
      email: user?.email || '',
    })
  }, [user?.full_name, user?.email])

  useEffect(() => {
    runDiagnostics()
  }, [user?.id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await profileService.updateProfile(profile)
      toast.success('Profile updated!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const runDiagnostics = async () => {
    setDiagnosticsLoading(true)

    const next = {
      root: 'fail',
      health: 'fail',
      token: 'fail',
      publicProfile: user?.id ? 'fail' : 'skip',
    }

    try {
      await systemService.getRoot()
      next.root = 'ok'
    } catch {}

    try {
      await systemService.getHealth()
      next.health = 'ok'
    } catch {}

    try {
      await authService.testToken()
      next.token = 'ok'
    } catch {}

    if (user?.id) {
      try {
        await profileService.getPublicProfile(user.id)
        next.publicProfile = 'ok'
      } catch {
        next.publicProfile = 'fail'
      }
    }

    setDiagnostics(next)
    setDiagnosticsLoading(false)
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-heading">Settings</h1>
        <p className="text-soft mt-1">Manage your account and preferences</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaUser className="text-primary" size={16} />
          <h2 className="text-lg font-heading">Profile</h2>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm text-soft mb-2">Full Name</label>
            <input name="full_name" value={profile.full_name} onChange={handleChange}
              className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm text-soft mb-2">Email</label>
            <input name="email" value={profile.email} onChange={handleChange} type="email" disabled
              className="w-full px-4 py-3 bg-ink-200 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all disabled:opacity-50" />
            <p className="text-xs text-soft mt-1">Email cannot be changed</p>
          </div>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-primary text-ink rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50">
            <FaSave size={12} />
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaPalette className="text-primary" size={16} />
          <h2 className="text-lg font-heading">Appearance</h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Dark Mode</p>
            <p className="text-xs text-soft mt-1">Toggle dark/light theme</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-12 h-6 rounded-full transition-colors ${isDark ? 'bg-primary' : 'bg-white/20'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaCog className="text-primary" size={16} />
          <h2 className="text-lg font-heading">System</h2>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
            <span className="text-soft">API URL</span>
            <span className="font-mono text-xs">{apiUrl}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
            <span className="text-soft">App Version</span>
            <span className="font-mono text-xs">1.0.0</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
            <span className="text-soft">GET /</span>
            <StatusBadge status={diagnostics.root} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
            <span className="text-soft">GET /health</span>
            <StatusBadge status={diagnostics.health} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
            <span className="text-soft">POST /auth/test-token</span>
            <StatusBadge status={diagnostics.token} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
            <span className="text-soft">GET /profile/{'{user_id}'}</span>
            <StatusBadge status={diagnostics.publicProfile} />
          </div>
          <button
            type="button"
            onClick={runDiagnostics}
            disabled={diagnosticsLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-sm text-soft hover:text-white hover:border-white/20 transition-all disabled:opacity-50"
          >
            <FaShieldAlt size={12} />
            <FaSyncAlt size={12} className={diagnosticsLoading ? 'animate-spin' : ''} />
            {diagnosticsLoading ? 'Checking...' : 'Run Endpoint Checks'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default Settings
