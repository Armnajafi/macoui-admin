"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = "app-theme"

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
    if (stored === "light" || stored === "dark") {
      setThemeState(stored)
    }
    setMounted(true)
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
  }

  // Prevent flash of wrong theme
  if (!mounted) {
    return null
  }

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

// Theme color constants
export const themeColors = {
  dark: {
    background: "#002340",
    card: "#0F2A48",
    cardSecondary: "#1A365D",
    cardHover: "#151E32",
    text: "#FFFFFF",
    textSecondary: "#94A3B8",
    textMuted: "#64748B",
    border: "rgba(255, 255, 255, 0.2)",
    borderLight: "rgba(255, 255, 255, 0.1)",
  },
  light: {
    background: "#FAFAFA",
    card: "#FFFFFF",
    cardSecondary: "#F1F5F9",
    cardHover: "#E2E8F0",
    text: "#0F172A",
    textSecondary: "#475569",
    textMuted: "#94A3B8",
    border: "rgba(0, 0, 0, 0.1)",
    borderLight: "rgba(0, 0, 0, 0.05)",
  },
} as const
