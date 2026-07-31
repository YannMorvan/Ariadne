"use client"

import { useState } from "react"
import { UserPlus, Shield, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ProjectMembersDialogProps {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectMembersDialog({
  projectId,
  open,
  onOpenChange,
}: ProjectMembersDialogProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      setIsSubmitting(true)
      // await projectApi.addMember(projectId, email)
      setEmail("")
    } catch (error) {
      console.error("An unexpected error occurred. Please try again.", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Project Members</DialogTitle>
          <DialogDescription>
            Manage access and invited members to collaborate on this project.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleAddMember}
          className="my-2 flex items-center gap-2"
        >
          <Input
            type="email"
            placeholder="email@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-xl"
          />
          <Button
            type="submit"
            disabled={isSubmitting || !email}
            className="shrink-0 gap-1.5 rounded-xl"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <UserPlus className="size-4" />
            )}
            Invite
          </Button>
        </form>

        <div className="mt-4 space-y-3">
          <p className="text-xs font-medium text-muted-foreground">
            Current Members
          </p>

          <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
            <div className="flex items-center justify-between rounded-xl border border-border/40 bg-card/40 p-2.5">
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs">YO</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm leading-none font-medium">You</p>
                  <p className="text-xs text-muted-foreground">Owner</p>
                </div>
              </div>
              <Shield className="size-4 text-violet-500" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
