import { DashboardShell } from "@/components/dashboard-shell"
import { UserProvider } from "@/context/user-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
      <DashboardShell>{children}</DashboardShell>
    </UserProvider>
  )
}
