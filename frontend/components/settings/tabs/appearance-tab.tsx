"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTranslations } from "next-intl"

import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { LanguageSwitcher } from "@/components/language-switcher"
import { cn } from "@/lib/utils"

export default function AppearanceTab() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const tSettings = useTranslations("settings")

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm"
    >
      <div>
        <h3 className="text-base font-semibold tracking-tight">
          {tSettings("appearance.title")}
        </h3>
        <p className="text-xs text-muted-foreground">
          {tSettings("appearance.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Dark */}
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={cn(
            "group relative flex cursor-pointer flex-col gap-3 rounded-xl border p-4 text-left transition-all focus:outline-none",
            mounted && theme === "dark"
              ? "border-2 border-primary bg-card/80 shadow-sm"
              : "border-border/40 bg-card/20 opacity-60 hover:border-border/80 hover:opacity-100"
          )}
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon
                className={cn(
                  "size-4",
                  mounted && theme === "dark"
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              />
              <span className="text-sm font-medium">
                {tSettings("appearance.darkMode")}
              </span>
            </div>
            {mounted && theme === "dark" && (
              <Badge variant="outline" className="text-[10px]">
                {tSettings("appearance.active")}
              </Badge>
            )}
          </div>
          <div className="h-20 w-full space-y-2 rounded-lg border border-border/40 bg-zinc-950 p-2">
            <div className="h-2 w-1/2 rounded bg-zinc-800" />
            <div className="h-8 w-full rounded border border-zinc-800 bg-zinc-900" />
          </div>
        </button>

        {/* Light */}
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={cn(
            "group relative flex cursor-pointer flex-col gap-3 rounded-xl border p-4 text-left transition-all focus:outline-none",
            mounted && theme === "light"
              ? "border-2 border-primary bg-card/80 shadow-sm"
              : "border-border/40 bg-card/20 opacity-60 hover:border-border/80 hover:opacity-100"
          )}
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun
                className={cn(
                  "size-4",
                  mounted && theme === "light"
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              />
              <span className="text-sm font-medium">
                {tSettings("appearance.lightMode")}
              </span>
            </div>
            {mounted && theme === "light" && (
              <Badge variant="outline" className="text-[10px]">
                {tSettings("appearance.active")}
              </Badge>
            )}
          </div>
          <div className="h-20 w-full space-y-2 rounded-lg border border-zinc-200 bg-zinc-100 p-2">
            <div className="h-2 w-1/2 rounded bg-zinc-300" />
            <div className="h-8 w-full rounded border border-zinc-200 bg-white" />
          </div>
        </button>

        {/* System */}
        <button
          type="button"
          onClick={() => setTheme("system")}
          className={cn(
            "group relative flex cursor-pointer flex-col gap-3 rounded-xl border p-4 text-left transition-all focus:outline-none",
            mounted && theme === "system"
              ? "border-2 border-primary bg-card/80 shadow-sm"
              : "border-border/40 bg-card/20 opacity-60 hover:border-border/80 hover:opacity-100"
          )}
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <Laptop
                className={cn(
                  "size-4",
                  mounted && theme === "system"
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              />
              <span className="text-sm font-medium">
                {tSettings("appearance.systemMode")}
              </span>
            </div>
            {mounted && theme === "system" && (
              <Badge variant="outline" className="text-[10px]">
                {tSettings("appearance.active")}
              </Badge>
            )}
          </div>
          <div className="h-20 w-full space-y-2 rounded-lg border border-border/40 bg-gradient-to-r from-zinc-950 to-zinc-100 p-2">
            <div className="h-2 w-1/2 rounded bg-zinc-500" />
            <div className="h-8 w-full rounded bg-zinc-800/80" />
          </div>
        </button>
      </div>

      <div className="space-y-2 border-t border-border/30 pt-4">
        <Label className="text-xs font-medium">
          {tSettings("appearance.language")}
        </Label>
        <LanguageSwitcher />
      </div>
    </motion.div>
  )
}
