"use client"

import { Shield, Loader2, Crown, User, Clock, Trash2, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { type Member, type ProjectRole } from "@/types"
import { useTranslations } from "next-intl"

interface MembersTabProps {
  ownerId: string
  activeMembers: Member[]
  pendingMembers: Member[]
  deletingId: string | null
  onRemove: (id: string) => void
}

export function MembersTab({
  ownerId,
  activeMembers,
  pendingMembers,
  deletingId,
  onRemove,
}: MembersTabProps) {
  const renderRoleIcon = (role: ProjectRole) => {
    switch (role) {
      case "OWNER":
        return <Crown className="size-4 text-amber-500" />
      case "ADMIN":
        return <Shield className="size-4 text-violet-500" />
      case "VIEWER":
        return <Eye className="size-4 text-sky-500" />
      default:
        return <User className="size-4 text-zinc-400" />
    }
  }

  const tProjectsMembers = useTranslations("projects.members")
  const tEnumRoles = useTranslations("enums.roles")

  return (
    <div className="mt-4 space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          {tProjectsMembers("currentMembers")} ({activeMembers.length})
        </p>

        <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
          {activeMembers.map((member) => {
            const isOwner = member.id === ownerId
            const displayRole = isOwner ? "OWNER" : member.role

            return (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-xl border border-border/40 bg-card/40 p-2.5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="size-8 border border-border/40">
                    {member.avatarUrl && (
                      <AvatarImage
                        src={member.avatarUrl}
                        alt={member.username}
                      />
                    )}
                    <AvatarFallback className="text-xs">
                      {member.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm leading-none font-medium">
                      {member.username}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {tEnumRoles(displayRole)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div title={tEnumRoles(displayRole)}>
                    {renderRoleIcon(displayRole)}
                  </div>

                  {!isOwner && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemove(member.id)}
                      disabled={deletingId === member.id}
                      title="Retirer le membre"
                    >
                      {deletingId === member.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {pendingMembers.length > 0 && (
        <div className="space-y-2 border-t border-border/40 pt-3">
          <div className="flex items-center gap-2">
            <Clock className="size-3.5 text-amber-500" />
            <p className="text-xs font-medium text-muted-foreground">
              {tProjectsMembers("pendingInvitations", {
                count: pendingMembers.length,
              })}
            </p>
          </div>

          <div className="max-h-36 space-y-2 overflow-y-auto pr-1">
            {pendingMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="size-8 opacity-75">
                    {member.avatarUrl && (
                      <AvatarImage
                        src={member.avatarUrl}
                        alt={member.username}
                      />
                    )}
                    <AvatarFallback className="text-xs">
                      {member.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm leading-none font-medium">
                        {member.username}
                      </p>
                      <Badge variant="outline" className="text-[10px]">
                        {tEnumRoles(member.role)}
                      </Badge>
                    </div>
                    <Badge
                      variant="outline"
                      className="mt-1 border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-500"
                    >
                      {tProjectsMembers("pending")}
                    </Badge>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-destructive"
                  onClick={() => onRemove(member.id)}
                  disabled={deletingId === member.id}
                  title="Annuler l'invitation"
                >
                  {deletingId === member.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
