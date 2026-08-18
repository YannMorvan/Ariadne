import type { Task } from "./index"

export const PROJECT_ROLES = ["OWNER", "ADMIN", "MEMBER", "VIEWER"] as const

export type ProjectPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"
export type ProjectRole = (typeof PROJECT_ROLES)[number]
export type MembershipStatus = "PENDING" | "ACCEPTED" | "DECLINED"

export interface Member {
  id: string
  username: string
  email: string
  avatarUrl: string | null
  role: ProjectRole
  status?: MembershipStatus
  joinedAt?: string
}

export interface Project {
  id: string
  name: string
  description: string | null
  priority: ProjectPriority
  isArchived: boolean
  ownerId: string

  members: Member[]

  progress?: number
  tasksCount?: number
  completedTasksCount?: number

  createdAt: string
  updatedAt: string
}

export interface ProjectInvitation {
  id: string
  projectId: string
  projectName: string
  projectDescription: string | null
  invitedBy: {
    id: string
    username: string
    avatarUrl: string | null
  }
  role: string
  createdAt: string
}

export interface ProjectWithTasks extends Project {
  tasks: Task[]
}

export interface ProjectMembersDialogProps {
  projectId: string
  ownerId: string
  members: Member[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onMembersChange?: (members: Member[]) => void
}

export interface MemberRowProps {
  member: Member
  isOwner: boolean
  isPending?: boolean
  isDeleting: boolean
  onRemove: (id: string) => void
  tEnumRoles: (key: string) => string
  tPendingLabel?: string
}
