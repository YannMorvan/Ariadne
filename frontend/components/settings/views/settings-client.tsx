"use client"

import { useState } from "react"
import { User, Shield, Palette, Bell, Check, Save, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import ProfileTab from "../tabs/profile-tab"
import AccountTab from "../tabs/account-tab"
import AppearanceTab from "../tabs/appearance-tab"
import NotificationsTab from "../tabs/notifications-tab"

export default function SettingsClient() {
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const tCommon = useTranslations("common")
  const tSettings = useTranslations("settings")

  const handleSave = async () => {
    setIsSaving(true)
    setIsSaved(false)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsSaving(false)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-8 lg:py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {tSettings("title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {tSettings("description")}
          </p>
        </div>

        <Button
          onClick={() => void handleSave()}
          disabled={isSaving}
          className="gap-2 rounded-xl font-medium transition-all"
        >
          {isSaving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : isSaved ? (
            <Check className="size-4 text-emerald-400" />
          ) : (
            <Save className="size-4" />
          )}
          {isSaving
            ? tCommon("saving")
            : isSaved
              ? tCommon("saved")
              : tCommon("save")}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="flex h-auto flex-wrap gap-1 rounded-2xl border border-border/50 bg-card/50 p-1.5 backdrop-blur-sm sm:inline-flex">
          <TabsTrigger
            value="profile"
            className="gap-2 rounded-xl text-xs sm:text-sm"
          >
            <User className="size-4" />
            {tSettings("profile.tab")}
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className="gap-2 rounded-xl text-xs sm:text-sm"
          >
            <Shield className="size-4" />
            {tSettings("security.tab")}
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="gap-2 rounded-xl text-xs sm:text-sm"
          >
            <Palette className="size-4" />
            {tSettings("appearance.tab")}
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="gap-2 rounded-xl text-xs sm:text-sm"
          >
            <Bell className="size-4" />
            {tSettings("notifications.tab")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-0">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="account" className="mt-0">
          <AccountTab />
        </TabsContent>

        <TabsContent value="appearance" className="mt-0">
          <AppearanceTab />
        </TabsContent>

        <TabsContent value="notifications" className="mt-0">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
