import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'

// Pages
import Home from '../pages/Home'
import About from '../pages/About'
import Skills from '../pages/Skills'
import Projects from '../pages/Projects'
import ProjectDetail from '../pages/ProjectDetail'
import Contact from '../pages/Contact'
import Login from '../pages/Login'
import Register from '../pages/Register'

// Admin Layout & Pages
import AdminLayout from '../layouts/AdminLayout'
import AdminDashboard from '../pages/admin/AdminDashboard'
import ManageProjects from '../pages/admin/ManageProjects'
import ManageSkills from '../pages/admin/ManageSkills'
import ManageExperience from '../pages/admin/ManageExperience'
import ManageEducation from '../pages/admin/ManageEducation'
import ManageContacts from '../pages/admin/ManageContacts'
import Manage3DAssets from '../pages/admin/Manage3DAssets'
import ManageHeroContent from '../pages/admin/ManageHeroContent'
import Settings from '../pages/admin/Settings'
import UserPortfolioLayout from '../layouts/UserPortfolioLayout'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Public user-specific routes using profile slug */}
      <Route path="/u/:slug" element={<UserPortfolioLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="skills" element={<Skills />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Admin Routes (Protected) */}
      <Route path="/admin" element={<PrivateRoute requireAdmin><AdminLayout /></PrivateRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="projects" element={<ManageProjects />} />
        <Route path="skills" element={<ManageSkills />} />
        <Route path="experience" element={<ManageExperience />} />
        <Route path="education" element={<ManageEducation />} />
        <Route path="contacts" element={<ManageContacts />} />
        <Route path="three-assets" element={<Manage3DAssets />} />
        <Route path="hero-content" element={<ManageHeroContent />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
