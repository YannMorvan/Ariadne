export const PRIORITY_CONFIG = {
  LOW: {
    labelKey: "LOW",
    badgeClass:
      "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400",
    projectClass:
      "border-green-500/30 bg-green-500/15 text-green-700 dark:text-green-300",
  },
  MEDIUM: {
    labelKey: "MEDIUM",
    badgeClass:
      "border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    projectClass:
      "border-yellow-500/30 bg-yellow-500/15 text-yellow-700 dark:text-yellow-300",
  },
  HIGH: {
    labelKey: "HIGH",
    badgeClass:
      "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
    projectClass:
      "border-red-500/30 bg-red-500/15 text-red-700 dark:text-red-300 font-medium",
  },
  URGENT: {
    labelKey: "URGENT",
    badgeClass:
      "border-violet-500/30 bg-violet-500/15 text-violet-600 dark:text-violet-400 font-medium",
    projectClass:
      "border-violet-500/50 bg-violet-500/20 text-violet-700 dark:text-violet-300 font-semibold shadow-sm shadow-violet-500/10 ring-1 ring-violet-500/20",
  },
} as const
