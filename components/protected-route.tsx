"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useExamStore } from "@/lib/exam-store"
import type { UserRole } from "@/lib/types"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { state } = useExamStore()
  const router = useRouter()

  useEffect(() => {
    if (!state.initialized) return

    if (!state.currentUser) {
      router.replace("/login")
      return
    }

    if (requiredRole && state.currentUser.role !== requiredRole) {
      router.replace(state.currentUser.role === "admin" ? "/admin" : "/student")
    }
  }, [state.initialized, state.currentUser, requiredRole, router])

  if (!state.initialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!state.currentUser) return null
  if (requiredRole && state.currentUser.role !== requiredRole) return null

  return <>{children}</>
}
