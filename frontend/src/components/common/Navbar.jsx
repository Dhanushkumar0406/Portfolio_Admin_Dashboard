import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes, FaCog } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { usePortfolio } from '../../context/PortfolioContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated } = useAuth()
   const { siteContent } = usePortfolio()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Skills', path: '/skills' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
  ]

  const isActive = (path) => location.pathname === path
  const brandInitials = siteContent?.brand_initials || siteContent?.icon_text || ''
  const brandTitle = siteContent?.brand_title || siteContent?.display_name || ''
  const brandTagline = siteContent?.brand_tagline || ''
  const navCtaText = siteContent?.nav_cta_text || "Let's Talk"
  const navCtaLink = siteContent?.nav_cta_link || '/contact'
  const profileImageUrl = siteContent?.profile_image_url

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-ink/70 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center text-ink font-bold overflow-hidden">
              {profileImageUrl ? (
                <img src={profileImageUrl} alt={brandTitle} className="h-full w-full object-cover" />
              ) : (
                brandInitials
              )}
            </span>
            <div className="leading-tight">
              <p className="text-sm uppercase tracking-[0.3em] text-soft">{brandTagline}</p>
              <p className="text-lg font-heading">{brandTitle}</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-10 text-sm uppercase tracking-[0.2em]">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-primary'
                    : 'text-slate-100/70 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && (
              <Link
                to="/admin"
                className="p-2 rounded-lg text-soft hover:text-primary transition-colors"
                title="Admin Dashboard"
              >
                <FaCog size={16} />
              </Link>
            )}
            <Link
              to={navCtaLink || '/contact'}
              className="px-4 py-2 rounded-full border border-white/10 text-sm uppercase tracking-[0.2em] hover:border-primary hover:text-primary transition-all"
            >
              {navCtaText}
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4"
            >
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-base uppercase tracking-[0.2em] transition-colors duration-300 ${
                      isActive(link.path) ? 'text-primary' : 'text-slate-100/70 hover:text-primary'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  to={navCtaLink || '/contact'}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-white/10 text-sm uppercase tracking-[0.2em] hover:border-primary hover:text-primary transition-all"
                >
                  {navCtaText}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar
