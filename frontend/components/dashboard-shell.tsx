"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="relative flex min-h-svh flex-1 flex-col">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-foreground/[0.03] via-background to-background"
            />
            <header className="relative flex h-12 shrink-0 items-center gap-2 border-b border-border/40 px-4 md:hidden">
              <SidebarTrigger />
              <span className="text-sm font-medium">Ariadne</span>
            </header>
            <div className="relative flex-1">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
