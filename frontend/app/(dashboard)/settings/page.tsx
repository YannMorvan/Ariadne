"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import {
  User,
  Shield,
  Bell,
  Palette,
  Laptop,
  Check,
  Save,
  Loader2,
  Trash2,
  Moon,
  Sun,
  Mail,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslations } from "next-intl"
import { useUser } from "@/context/user-context"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { theme, setTheme } = useTheme()
  const tCommon = useTranslations("common")
  const tSettings = useTranslations("settings")
  const { user } = useUser()

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setIsSaved(false)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsSaving(false)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-8 lg:py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {tSettings("title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {tSettings("description")}
          </p>
        </div>

        <Button
          onClick={() => void handleSave()}
          disabled={isSaving}
          className="gap-2 rounded-xl font-medium transition-all"
        >
          {isSaving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : isSaved ? (
            <Check className="size-4 text-emerald-400" />
          ) : (
            <Save className="size-4" />
          )}
          {isSaving
            ? tCommon("saving")
            : isSaved
              ? tCommon("saved")
              : tCommon("save")}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="flex h-auto flex-wrap gap-1 rounded-2xl border border-border/50 bg-card/50 p-1.5 backdrop-blur-sm sm:inline-flex">
          <TabsTrigger
            value="profile"
            className="gap-2 rounded-xl text-xs sm:text-sm"
          >
            <User className="size-4" />
            {tSettings("profile.tab")}
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className="gap-2 rounded-xl text-xs sm:text-sm"
          >
            <Shield className="size-4" />
            {tSettings("security.tab")}
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="gap-2 rounded-xl text-xs sm:text-sm"
          >
            <Palette className="size-4" />
            {tSettings("appearance.tab")}
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="gap-2 rounded-xl text-xs sm:text-sm"
          >
            <Bell className="size-4" />
            {tSettings("notifications.tab")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-0 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm"
          >
            <div>
              <h3 className="text-base font-semibold tracking-tight">
                {tSettings("profile.title")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {tSettings("profile.description")}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar className="size-20 border-2 border-border/60 shadow-inner">
                <AvatarImage src="" alt="Avatar" />
                <AvatarFallback className="bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-lg font-bold">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs"
                  >
                    {tSettings("profile.changePhoto")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    {tSettings("profile.deletePhoto")}
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {tSettings("profile.photoLimits")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs font-medium">
                  {tSettings("profile.username")}
                </Label>
                <Input
                  id="username"
                  defaultValue={user?.username || ""}
                  className="rounded-xl border-border/50 bg-card/40 focus:bg-card/80"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium">
                  {tSettings("profile.email")}
                </Label>
                <div className="relative">
                  <Mail className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email || ""}
                    className="rounded-xl border-border/50 bg-card/40 pl-9 focus:bg-card/80"
                  />
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="bio" className="text-xs font-medium">
                  {tSettings("profile.role")}
                </Label>
                <Input
                  id="bio"
                  placeholder="ex: Software Engineer / Student at Epitech"
                  defaultValue="Full-stack Developer & Student"
                  className="rounded-xl border-border/50 bg-card/40 focus:bg-card/80"
                />
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="account" className="mt-0 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm"
          >
            <div>
              <h3 className="text-base font-semibold tracking-tight">
                {tSettings("security.title")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {tSettings("security.description")}
              </p>
            </div>

            <div className="max-w-md space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="current-password"
                  className="text-xs font-medium"
                >
                  {tSettings("security.currentPassword")}
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="••••••••"
                  className="rounded-xl border-border/50 bg-card/40 focus:bg-card/80"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-xs font-medium">
                  {tSettings("security.newPassword")}
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  className="rounded-xl border-border/50 bg-card/40 focus:bg-card/80"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirm-password"
                  className="text-xs font-medium"
                >
                  {tSettings("security.confirmPassword")}
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  className="rounded-xl border-border/50 bg-card/40 focus:bg-card/80"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="space-y-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold tracking-tight text-red-500">
                  {tSettings("security.dangerZoneTitle")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {tSettings("security.dangerZoneDescription")}
                </p>
              </div>
              <Button
                variant="outline"
                className="gap-2 rounded-xl border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500"
              >
                <Trash2 className="size-4" />
                {tSettings("security.deleteAccount")}
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="appearance" className="mt-0 space-y-6">
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
              {/* Sombre (Dark) */}
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

              {/* Clair (Light) */}
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

              {/* Système (System) */}
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
        </TabsContent>

        <TabsContent value="notifications" className="mt-0 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm"
          >
            <div>
              <h3 className="text-base font-semibold tracking-tight">
                {tSettings("notifications.title")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {tSettings("notifications.description")}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-border/40 bg-card/30 p-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">
                    {tSettings("notifications.assignedTaskTitle")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tSettings("notifications.assignedTaskDesc")}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                >
                  {tSettings("notifications.enabled")}
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/40 bg-card/30 p-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">
                    {tSettings("notifications.dueRemindersTitle")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tSettings("notifications.dueRemindersDesc")}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                >
                  {tSettings("notifications.enabled")}
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/40 bg-card/30 p-4 opacity-75">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">
                    {tSettings("notifications.projectUpdates")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tSettings("notifications.projectUpdatesDescription")}
                  </p>
                </div>
                <Badge variant="outline" className="text-muted-foreground">
                  {tSettings("notifications.disabled")}
                </Badge>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
