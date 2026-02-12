import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext'
import { ThemeProvider } from './context/ThemeContext'
import AppRoutes from './routes/AppRoutes'

const HeadManager = () => {
  const { siteContent, skills } = usePortfolio()

  useEffect(() => {
    const clean = (value) => (typeof value === 'string' ? value.trim() : '')
    const titleBase =
      clean(siteContent?.brand_title) ||
      clean(siteContent?.display_name) ||
      'Portfolio'
    const titleSuffix = clean(siteContent?.brand_tagline)
    const finalTitle = titleSuffix ? `${titleBase} – ${titleSuffix}` : titleBase
    document.title = finalTitle

    const ensureMeta = (name, content) => {
      if (!content) return
      let tag = document.querySelector(`meta[name="${name}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', name)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    }

    const description =
      clean(siteContent?.hero_subtitle) ||
      clean(siteContent?.about_body_primary) ||
      clean(siteContent?.brand_tagline)

    const keywordParts = [
      clean(siteContent?.about_snapshot_focus),
      clean(siteContent?.about_snapshot_stack),
      skills?.length ? skills.map((s) => clean(s.name)).filter(Boolean).join(', ') : '',
    ]
    const keywords = keywordParts.filter(Boolean).join(', ')

    ensureMeta('description', description)
    ensureMeta('keywords', keywords)
  }, [siteContent, skills])

  return null
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <PortfolioProvider>
            <div className="App">
              <HeadManager />
              <AppRoutes />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastClassName="glass-card"
              />
            </div>
          </PortfolioProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
