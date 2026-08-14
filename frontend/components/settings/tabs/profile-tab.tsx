"use client"

import { motion } from "framer-motion"
import { Mail } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/context/user-context"

export default function ProfileTab() {
  const tSettings = useTranslations("settings")
  const { user } = useUser()

  return (
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
            <Button variant="outline" size="sm" className="rounded-xl text-xs">
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
            value={user?.username || ""}
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
              value={user?.email || ""}
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
            placeholder={tSettings("profile.rolePlaceholder")}
            value={user?.description || ""}
            className="rounded-xl border-border/50 bg-card/40 focus:bg-card/80"
          />
        </div>
      </div>
    </motion.div>
  )
}
