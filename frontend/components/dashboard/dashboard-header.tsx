"use client"

import { motion } from "framer-motion"
import { Command } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CreateProjectDialog } from "./create-project-dialog"

interface DashboardHeaderProps {
  username: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function DashboardHeader({ username }: DashboardHeaderProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Ravi de te revoir, {username} 👋
        </h1>
        <p className="mt-1 max-w-xl text-muted-foreground">
          Voici l&apos;état actuel de ta productivité et de tes projets.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="flex shrink-0 gap-2">
        {/* <Button>
          <Plus data-icon="inline-start" />
          Nouveau projet
        </Button> */}
        <CreateProjectDialog />
        <Button variant="outline">
          <Command data-icon="inline-start" />
          Actions rapides
          <kbd className="pointer-events-none ml-1 hidden rounded-md border border-border/60 bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-block">
            ⌘K
          </kbd>
        </Button>
      </motion.div>
    </motion.div>
  )
}
