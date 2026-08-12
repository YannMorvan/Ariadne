"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"

export default function NotificationsTab() {
  const tSettings = useTranslations("settings")

  return (
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
  )
}
