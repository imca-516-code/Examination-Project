"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useExamStore } from "@/lib/exam-store"

export default function HomePage() {
  const { state } = useExamStore()
  const router = useRouter()

  useEffect(() => {
    if (!state.initialized) return

    if (state.currentUser) {
      router.replace(
        state.currentUser.role === "admin" ? "/admin" : "/student"
      )
    } else {
      router.replace("/login")
    }
  }, [state.initialized, state.currentUser, router])

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading ExamPortal...</p>
      </div>
    </div>
  )
}
