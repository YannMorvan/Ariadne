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
import { useTranslations } from "next-intl"

interface ActivityChartProps {
  data: ActivityDataPoint[]
}

interface TooltipPayloadItem {
  value?: number
  dataKey?: string
  color?: string
}

function ChartTooltip({
  active,
  payload,
  label,
  tDashboard,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
  tDashboard: (key: string) => string
}) {
  if (!active || !payload?.length) return null

  const hours = payload.find((p) => p.dataKey === "hours")?.value ?? 0
  const tasks = payload.find((p) => p.dataKey === "tasks")?.value ?? 0

  return (
    <div className="rounded-xl border border-border/50 bg-popover/95 px-3 py-2 shadow-lg backdrop-blur-sm">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="space-y-0.5 text-sm">
        <p>
          <span className="text-muted-foreground">
            {tDashboard("activityChart.hours")} :{" "}
          </span>
          <span className="font-medium tabular-nums">{hours}h</span>
        </p>
        <p>
          <span className="text-muted-foreground">
            {tDashboard("activityChart.tasks")} :{" "}
          </span>
          <span className="font-medium tabular-nums">{tasks}</span>
        </p>
      </div>
    </div>
  )
}

export function ActivityChart({ data }: ActivityChartProps) {
  const tDashboard = useTranslations("dashboard")

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
              data={data}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
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
                    stopColor="var(--color-foreground)"
                    stopOpacity={0.15}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-foreground)"
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
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                tickFormatter={(v) => `${v}h`}
                width={40}
              />
              <Tooltip
                content={<ChartTooltip {...{ tDashboard }} />}
                cursor={{ strokeOpacity: 0.2 }}
              />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="var(--color-foreground)"
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
