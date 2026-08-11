"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

function Progress({
  className,
  children,
  value = 0,
  ...props
}: ProgressPrimitive.Root.Props) {
  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot="progress"
      className={cn("flex flex-wrap gap-3", className)}
      {...props}
    >
      {children}
      <ProgressTrack>
        <ProgressIndicator value={value} />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      className={cn(
        "relative flex h-2 w-full items-center overflow-x-hidden rounded-2xl bg-muted",
        className
      )}
      data-slot="progress-track"
      {...props}
    />
  )
}

interface AnimatedProgressIndicatorProps extends React.ComponentPropsWithoutRef<
  typeof motion.div
> {
  value?: number | null
}

function ProgressIndicator({
  className,
  value = 0,
  ...props
}: AnimatedProgressIndicatorProps) {
  const safeValue = Math.min(100, Math.max(0, value ?? 0))

  return (
    <motion.div
      data-slot="progress-indicator"
      className={cn("h-full rounded-2xl bg-primary", className)}
      initial={{ width: 0 }}
      animate={{ width: `${safeValue}%` }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 15,
        mass: 0.5,
      }}
      {...props}
    />
  )
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cn("text-sm font-medium", className)}
      data-slot="progress-label"
      {...props}
    />
  )
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cn(
        "ml-auto text-sm text-muted-foreground tabular-nums",
        className
      )}
      data-slot="progress-value"
      {...props}
    />
  )
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
}
