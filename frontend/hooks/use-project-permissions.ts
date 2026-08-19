import { useMemo } from "react"
import { useUser } from "@/context/user-context"
import type { Project, ProjectRole } from "@/types/project"

export function useProjectPermissions(
  project?: Pick<Project, "ownerId" | "members"> | null
) {
  const { user } = useUser()

  return useMemo(() => {
    if (!user || !project) {
      return {
        role: null as ProjectRole | null,
        isOwner: false,
        isAdmin: false,
        isMember: false,
        isViewer: false,
        canEditProject: false,
        canDeleteProject: false,
        canManageMembers: false,
        canCreateTasks: false,
        canEditTasks: false,
        canDeleteTasks: false,
      }
    }

    const isDirectOwner = project.ownerId === user.id

    const membership = project.members?.find(
      (m) => m.id === user.id && (m.status === "ACCEPTED" || !m.status)
    )

    const currentRole: ProjectRole | null = isDirectOwner
      ? "OWNER"
      : (membership?.role ?? null)

    const isOwner = currentRole === "OWNER"
    const isAdmin = isOwner || currentRole === "ADMIN"
    const isMember = isAdmin || currentRole === "MEMBER"
    const isViewer = isMember || currentRole === "VIEWER"

    return {
      role: currentRole,
      isOwner,
      isAdmin,
      isMember,
      isViewer,

      canDeleteProject: isOwner,
      canEditProject: isAdmin,
      canManageMembers: isAdmin,
      canCreateTasks: isMember,
      canEditTasks: isMember,
      canDeleteTasks: isAdmin,
    }
  }, [user, project])
}
