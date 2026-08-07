"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ActivityDataPoint } from "@/types/dashboard"
import { useLocale, useTranslations } from "next-intl"

interface ActivityChartProps {
  data: ActivityDataPoint[]
}

function ChartTooltip({
  active,
  payload,
  label,
  tDashboard,
}: {
  active?: boolean
  payload?: Array<{ value?: number; dataKey?: string }>
  label?: string
  tDashboard: (key: string) => string
}) {
  if (!active || !payload?.length) return null

  const tasks = payload.find((p) => p.dataKey === "tasks")?.value ?? 0

  return (
    <div className="rounded-xl border border-border/50 bg-popover/95 px-3 py-2 shadow-lg backdrop-blur-sm">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="text-sm font-medium">
        <span className="text-muted-foreground">
          {tDashboard("activityChart.tasks")} :{" "}
        </span>
        <span className="text-foreground tabular-nums">{tasks}</span>
      </div>
    </div>
  )
}

export function ActivityChart({ data }: ActivityChartProps) {
  const tDashboard = useTranslations("dashboard")
  const locale = useLocale()

  const formattedData = (data || []).map((item) => {
    let dayLabel = item.day || ""

    if (item.date) {
      const dateObj = new Date(item.date)
      if (!isNaN(dateObj.getTime())) {
        dayLabel = new Intl.DateTimeFormat(locale, { weekday: "short" })
          .format(dateObj)
          .replace(".", "")
      }
    }

    return {
      ...item,
      dayLabel: dayLabel
        ? dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1)
        : "",
    }
  })

  return (
    <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm transition-colors hover:bg-card/80">
      <CardHeader>
        <CardTitle>{tDashboard("activityChart.title")}</CardTitle>
        <CardDescription>
          {tDashboard("activityChart.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="activityGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-border)"
                strokeOpacity={0.5}
              />
              <XAxis
                dataKey="dayLabel"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                allowDecimals={false}
                width={45}
              />
              <Tooltip
                content={<ChartTooltip tDashboard={tDashboard} />}
                cursor={{ strokeOpacity: 0.2 }}
              />
              <Area
                type="monotone"
                dataKey="tasks"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#activityGradient)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
