import { useMemo, useState } from "react"
import { UserPlus, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslations } from "next-intl"
import { projectApi } from "@/api/project"
import {
  PROJECT_ROLES,
  ProjectMembersDialogProps,
  type ProjectRole,
} from "@/types"
import { MembersTab } from "../tabs/project-member-tabs"

export function ProjectMembersDialog({
  projectId,
  ownerId,
  members = [],
  open,
  onOpenChange,
  onMembersChange,
}: ProjectMembersDialogProps) {
  const [identifier, setIdentifier] = useState("")
  const [role, setRole] = useState<ProjectRole>("MEMBER")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const tProjectsMembers = useTranslations("projects.members")
  const tEnumRoles = useTranslations("enums.roles")

  const { activeMembers, pendingMembers } = useMemo(() => {
    return {
      activeMembers: members.filter(
        (m) => m.id === ownerId || m.status === "ACCEPTED" || !m.status
      ),
      pendingMembers: members.filter(
        (m) => m.id !== ownerId && m.status === "PENDING"
      ),
    }
  }, [members, ownerId])

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedIdentifier = identifier.trim()
    if (!trimmedIdentifier) return

    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      const newMember = await projectApi.addMember(projectId, {
        identifier: trimmedIdentifier,
        role,
      })

      onMembersChange?.([...members, newMember])
      setIdentifier("")
      setRole("MEMBER")
    } catch (error: any) {
      setErrorMessage(
        error?.message || "An unexpected error occurred. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      setDeletingId(memberId)
      await projectApi.removeMember(projectId, memberId)
      onMembersChange?.(members.filter((m) => m.id !== memberId))
    } catch (error: any) {
      setErrorMessage(error?.message || "Failed to remove member.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{tProjectsMembers("title")}</DialogTitle>
          <DialogDescription>
            {tProjectsMembers("description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddMember} className="my-2 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder={tProjectsMembers("inviteMemberPlaceholder")}
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value)
                if (errorMessage) setErrorMessage(null)
              }}
              className="flex-1 rounded-xl"
            />

            <Select
              value={role}
              onValueChange={(val) => setRole(val as ProjectRole)}
            >
              <SelectTrigger className="w-[125px] rounded-xl text-xs">
                <SelectValue>{tEnumRoles(role)}</SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50 bg-popover/95 backdrop-blur-sm">
                {PROJECT_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {tEnumRoles(r)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="submit"
              disabled={isSubmitting || !identifier.trim()}
              className="shrink-0 gap-1.5 rounded-xl"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <UserPlus className="size-4" />
              )}
              {tProjectsMembers("inviteMember")}
            </Button>
          </div>

          {errorMessage && (
            <p className="text-xs font-medium text-destructive">
              {errorMessage}
            </p>
          )}
        </form>

        <MembersTab
          ownerId={ownerId}
          activeMembers={activeMembers}
          pendingMembers={pendingMembers}
          deletingId={deletingId}
          onRemove={handleRemoveMember}
          tProjectsMembers={tProjectsMembers}
          tEnumRoles={tEnumRoles}
        />
      </DialogContent>
    </Dialog>
  )
}
