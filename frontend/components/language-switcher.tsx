"use client"

import { useTransition } from "react"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { Globe, Loader2 } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return

    startTransition(() => {
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
      router.refresh()
    })
  }

  return (
    <Select
      value={locale}
      onValueChange={(val) => val && handleLanguageChange(val)}
      disabled={isPending}
    >
      <SelectTrigger className="w-60 rounded-xl border-border/50 bg-card/40 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {isPending ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : (
            <Globe className="size-4 text-muted-foreground" />
          )}
          <SelectValue placeholder="Langue" />
        </div>
      </SelectTrigger>
      <SelectContent className="rounded-xl border-border/50 bg-popover/95 backdrop-blur-sm">
        <SelectItem value="fr">Français (FR)</SelectItem>
        <SelectItem value="en">English (EN)</SelectItem>
      </SelectContent>
    </Select>
  )
}
