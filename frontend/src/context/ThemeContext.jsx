import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true) // Default to dark mode for gaming theme
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
    setIsDark(savedTheme === 'dark')
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (newTheme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark'
    setTheme(newTheme)
    setIsDark(!isDark)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  const setDarkMode = () => {
    setTheme('dark')
    setIsDark(true)
    localStorage.setItem('theme', 'dark')
    applyTheme('dark')
  }

  const setLightMode = () => {
    setTheme('light')
    setIsDark(false)
    localStorage.setItem('theme', 'light')
    applyTheme('light')
  }

  const value = {
    isDark,
    theme,
    toggleTheme,
    setDarkMode,
    setLightMode,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeContext
