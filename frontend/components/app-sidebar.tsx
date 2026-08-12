"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Loader2,
  Settings,
  Sparkles,
  Trophy,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useUser } from "@/context/user-context"
import { useTranslations } from "next-intl"

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase()
}

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useUser()
  const t = useTranslations("navigation")

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const mainNav = [
    { title: t("dashboard"), href: "/", icon: LayoutDashboard },
    { title: t("projects"), href: "/projects", icon: FolderKanban },
    { title: t("tasks"), href: "/tasks", icon: CheckSquare },
    { title: t("achievements"), href: "/achievements", icon: Trophy },
  ]

  const secondaryNav = [
    { title: t("settings"), href: "/settings", icon: Settings },
  ]

  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)

    try {
      await logout()
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
      setIsLoggingOut(false)
    }
  }

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Ariadne</span>
                <span className="truncate text-xs text-muted-foreground">
                  {t("productivity")}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("navigation")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={isActive(item.href)}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>{t("account")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={isActive(item.href)}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between gap-2 p-1.5">
              <div className="flex min-w-0 items-center gap-2">
                <Avatar size="sm">
                  <AvatarFallback>
                    {getInitials(user?.username || "U")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.username || "..."}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.level ? `Level ${user.level}` : "Level 1"}
                  </span>
                </div>
              </div>

              <SidebarMenuButton
                size="sm"
                onClick={() => void handleLogout()}
                disabled={isLoggingOut}
                tooltip="Logout"
                className="size-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <LogOut className="size-4" />
                )}
              </SidebarMenuButton>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
