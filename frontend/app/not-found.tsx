"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"

export default function NotFound() {
  const tNotFound = useTranslations("notFound")

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 md:px-6 md:py-8 lg:py-10">
      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-border/50 bg-card/20 p-8 text-center backdrop-blur-sm">
        <div className="mb-4 inline-flex items-center rounded-lg border border-border/40 bg-muted/40 px-3 py-1 font-mono text-xs font-medium text-muted-foreground">
          ERR_NOT_FOUND // 404
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {tNotFound("title")}
        </h1>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {tNotFound("description")}
        </p>

        <div className="mt-6 flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-4 text-xs font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
          >
            {tNotFound("goBack")}
          </Link>
        </div>
      </div>
    </main>
  )
}
