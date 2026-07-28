const UNITS: { limit: number; divisor: number; label: string }[] = [
  { limit: 60, divisor: 1, label: "seconde" },
  { limit: 3600, divisor: 60, label: "minute" },
  { limit: 86400, divisor: 3600, label: "heure" },
  { limit: 604800, divisor: 86400, label: "jour" },
  { limit: Infinity, divisor: 604800, label: "semaine" },
]

export function formatRelativeTime(date: Date | string): string {
  const target = typeof date === "string" ? new Date(date) : date
  const diffSeconds = Math.max(0, Math.floor((Date.now() - target.getTime()) / 1000))

  for (const unit of UNITS) {
    if (diffSeconds < unit.limit) {
      const value = Math.max(1, Math.floor(diffSeconds / unit.divisor))
      const plural = value > 1 ? "s" : ""
      return `Il y a ${value} ${unit.label}${plural}`
    }
  }

  return "Il y a longtemps"
}
