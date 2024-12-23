"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <div
      className="w-full"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-4 w-4 mr-2 dark:hidden" />
      <Moon className="hidden h-4 mr-2 w-4 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </div>
  )
}