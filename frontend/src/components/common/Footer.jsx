import { Link } from 'react-router-dom'
import { FaGithub, FaLinkedin, FaTwitter, FaYoutube, FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa'
import { usePortfolio } from '../../context/PortfolioContext'

const Footer = () => {
  const { siteContent } = usePortfolio()
  const currentYear = new Date().getFullYear()
  const brandInitials = siteContent?.brand_initials || siteContent?.icon_text || ''
  const brandTitle = siteContent?.brand_title || siteContent?.display_name || ''
  const footerTagline = siteContent?.footer_tagline || ''
  const footerEmail = siteContent?.footer_email || siteContent?.contact_email || ''
  const footerLocation = siteContent?.footer_location || siteContent?.contact_location || ''
  const footerAvailability = siteContent?.footer_availability || siteContent?.contact_availability || ''
  const footerDisclaimer = siteContent?.footer_disclaimer || ''
  const footerRights = siteContent?.footer_rights || `© ${currentYear} ${brandTitle || 'Portfolio'}. All rights reserved.`
  const profileImageUrl = siteContent?.profile_image_url

  const footerLinks = Array.isArray(siteContent?.footer_links) ? siteContent.footer_links : []

  return (
    <footer className="border-t border-white/10 bg-ink/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <span className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center text-ink font-bold text-sm overflow-hidden">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt={brandTitle} className="h-full w-full object-cover" />
                ) : (
                  brandInitials
                )}
              </span>
              <p className="text-lg font-heading">{brandTitle}</p>
            </Link>
            <p className="text-soft text-sm leading-relaxed max-w-sm">
              {footerTagline}
            </p>
            {footerLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {footerLinks.map((link, idx) => (
                  <a
                    key={`${link.url || idx}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-soft hover:text-primary transition-colors inline-flex items-center gap-2 text-sm"
                    aria-label={link.label || 'Link'}
                  >
                    {link.icon === 'github' && <FaGithub size={18} />}
                    {link.icon === 'linkedin' && <FaLinkedin size={18} />}
                    {link.icon === 'twitter' && <FaTwitter size={18} />}
                    {link.icon === 'youtube' && <FaYoutube size={18} />}
                    {!link.icon && <FaExternalLinkAlt size={14} />}
                    <span className="hidden sm:inline">{link.label || link.url}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-soft mb-4">Navigation</p>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
                { name: 'Skills', path: '/skills' },
                { name: 'Projects', path: '/projects' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-muted hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-soft mb-4">Get In Touch</p>
            <ul className="space-y-3 text-sm text-muted">
              <li>{footerEmail}</li>
              <li>{footerLocation}</li>
              <li>{footerAvailability}</li>
              <li className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-xs uppercase tracking-[0.2em] hover:border-primary hover:text-primary transition-all"
                >
                  Send a message
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-soft">
            {footerRights}
          </p>
          <p className="text-xs text-soft">
            {footerDisclaimer}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
