"use client"

import { useEffect, useState } from "react"
import { Check, X, MailOpen, Loader2, FolderKanban } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { projectApi } from "@/api/project"
import type { ProjectInvitation } from "@/types"
import { useTranslations } from "next-intl"

interface ProjectInvitationsDialogProps {
  onInvitationAccepted?: (projectId: string) => void
}

export function ProjectInvitationsDialog({
  onInvitationAccepted,
}: ProjectInvitationsDialogProps) {
  const [open, setOpen] = useState(false)
  const [invitations, setInvitations] = useState<ProjectInvitation[]>([])
  const [isLoadingList, setIsLoadingList] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const tInvitations = useTranslations("projects.invitations")
  const tRoles = useTranslations("enums.roles")

  const fetchInvitations = async () => {
    try {
      setIsLoadingList(true)
      const data = await projectApi.getPendingInvitations()
      setInvitations(data || [])
    } catch (error) {
      console.error("Failed to fetch pending invitations:", error)
    } finally {
      setIsLoadingList(false)
    }
  }

  useEffect(() => {
    fetchInvitations()
  }, [])

  const handleRespond = async (
    projectId: string,
    action: "ACCEPTED" | "DECLINED"
  ) => {
    try {
      setLoadingId(projectId)
      if (action === "ACCEPTED") {
        await projectApi.acceptInvitation(projectId)
        onInvitationAccepted?.(projectId)
      } else {
        await projectApi.declineInvitation(projectId)
      }
      setInvitations((prev) =>
        prev.filter((inv) => inv.projectId !== projectId)
      )
    } catch (error) {
      console.error(`Failed to ${action.toLowerCase()} invitation:`, error)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) {
          fetchInvitations()
        }
      }}
    >
      <DialogTrigger className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-accent-foreground">
        <MailOpen className="size-4" />
        <span>{tInvitations("dialogTitle")}</span>
        {invitations.length > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white shadow-sm">
            {invitations.length}
          </span>
        )}
      </DialogTrigger>

      <DialogContent className="rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
              <MailOpen className="size-5" />
            </div>
            <div>
              <DialogTitle>{tInvitations("title")}</DialogTitle>
              <DialogDescription>
                {tInvitations("description")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-3 space-y-3">
          {isLoadingList ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="size-6 animate-spin" />
            </div>
          ) : invitations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <FolderKanban className="size-10 stroke-1 text-muted-foreground/50" />
              <p className="mt-2 text-sm">{tInvitations("noInvitations")}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {tInvitations("noInvitationsDescription")}
              </p>
            </div>
          ) : (
            <div className="max-h-80 space-y-2.5 overflow-y-auto pr-1">
              {invitations.map((inv) => {
                const isLoading = loadingId === inv.projectId
                return (
                  <div
                    key={inv.id}
                    className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-card/40 p-4 transition-colors hover:border-border/80"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold tracking-tight">
                          {inv.projectName}
                        </h4>
                        {inv.projectDescription && (
                          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                            {inv.projectDescription}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {tRoles(inv.role)}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/30 pt-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                          {inv.invitedBy.avatarUrl && (
                            <AvatarImage
                              src={inv.invitedBy.avatarUrl}
                              alt={inv.invitedBy.username}
                            />
                          )}
                          <AvatarFallback className="text-[10px]">
                            {inv.invitedBy.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {tInvitations("invitedBy", {
                            inviterName: inv.invitedBy.username,
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 rounded-xl px-2.5 text-xs text-muted-foreground hover:text-destructive"
                          onClick={() =>
                            handleRespond(inv.projectId, "DECLINED")
                          }
                          disabled={isLoading}
                        >
                          <X className="mr-1 size-3.5" />
                          {tInvitations("decline")}
                        </Button>

                        <Button
                          size="sm"
                          className="h-8 rounded-xl bg-emerald-600 px-3 text-xs text-white hover:bg-emerald-500"
                          onClick={() =>
                            handleRespond(inv.projectId, "ACCEPTED")
                          }
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Check className="mr-1 size-3.5" />
                          )}
                          {tInvitations("accept")}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
