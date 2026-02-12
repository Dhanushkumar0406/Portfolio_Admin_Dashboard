import { createContext, useContext, useState, useEffect } from 'react'
import threeService from '../services/threeService'

const ThreeContext = createContext(null)

export const useThree = () => {
  const context = useContext(ThreeContext)
  if (!context) {
    throw new Error('useThree must be used within ThreeProvider')
  }
  return context
}

export const ThreeProvider = ({ children }) => {
  const [sceneConfigs, setSceneConfigs] = useState({})
  const [activeScene, setActiveScene] = useState(null)
  const [loading, setLoading] = useState(false)
  const [performanceMode, setPerformanceMode] = useState('high') // high, medium, low

  useEffect(() => {
    // Detect device performance
    detectPerformance()
  }, [])

  const detectPerformance = () => {
    // Simple performance detection based on device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const hasLowRAM = navigator.deviceMemory && navigator.deviceMemory < 4

    if (isMobile || hasLowRAM) {
      setPerformanceMode('medium')
    } else {
      setPerformanceMode('high')
    }
  }

  const loadSceneConfig = async (sceneName) => {
    if (sceneConfigs[sceneName]) {
      setActiveScene(sceneName)
      return sceneConfigs[sceneName]
    }

    try {
      setLoading(true)
      const config = await threeService.getSceneConfig(sceneName)
      setSceneConfigs({ ...sceneConfigs, [sceneName]: config })
      setActiveScene(sceneName)
      return config
    } catch (error) {
      console.error(`Failed to load scene config for ${sceneName}:`, error)
      // Return default config on error
      const defaultConfig = getDefaultSceneConfig(sceneName)
      setSceneConfigs({ ...sceneConfigs, [sceneName]: defaultConfig })
      setActiveScene(sceneName)
      return defaultConfig
    } finally {
      setLoading(false)
    }
  }

  const getDefaultSceneConfig = (sceneName) => {
    // Default configurations for different scenes
    const defaults = {
      hero: {
        scene_name: 'hero',
        settings: {
          camera: { position: [0, 2, 5], fov: 75 },
          lighting: {
            ambient: { intensity: 0.5, color: '#ffffff' },
            directional: { intensity: 1.0, color: '#ffffff', position: [5, 5, 5] },
          },
          effects: {
            particles: true,
            bloom: false,
            fog: false,
          },
        },
      },
      skills: {
        scene_name: 'skills',
        settings: {
          camera: { position: [0, 0, 8], fov: 75 },
          lighting: {
            ambient: { intensity: 0.6, color: '#ffffff' },
          },
          effects: {
            particles: true,
            bloom: true,
          },
        },
      },
      projects: {
        scene_name: 'projects',
        settings: {
          camera: { position: [0, 3, 10], fov: 75 },
          lighting: {
            ambient: { intensity: 0.5, color: '#ffffff' },
            directional: { intensity: 0.8, color: '#ffffff', position: [3, 5, 3] },
          },
          effects: {
            particles: false,
            bloom: true,
          },
        },
      },
    }

    return defaults[sceneName] || defaults.hero
  }

  const updateSceneConfig = async (sceneName, config) => {
    setSceneConfigs({ ...sceneConfigs, [sceneName]: config })
  }

  const value = {
    sceneConfigs,
    activeScene,
    loading,
    performanceMode,
    loadSceneConfig,
    updateSceneConfig,
    setPerformanceMode,
    setActiveScene,
  }

  return <ThreeContext.Provider value={value}>{children}</ThreeContext.Provider>
}

export default ThreeContext
