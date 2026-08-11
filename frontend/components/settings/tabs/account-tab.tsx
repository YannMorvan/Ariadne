"use client"

import { motion } from "framer-motion"
import { Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AccountTab() {
  const tSettings = useTranslations("settings")

  return (
    <div className="space-y-6">
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
            <Label htmlFor="current-password" className="text-xs font-medium">
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
            <Label htmlFor="confirm-password" className="text-xs font-medium">
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
    </div>
  )
}
