"use client"

import { useState, useEffect, useCallback } from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExamTimerProps {
  durationMinutes: number
  startedAt: string
  onExpire: () => void
  className?: string
}

export function ExamTimer({ durationMinutes, startedAt, onExpire, className }: ExamTimerProps) {
  const calculateRemaining = useCallback(() => {
    const start = new Date(startedAt).getTime()
    const end = start + durationMinutes * 60 * 1000
    const now = Date.now()
    return Math.max(0, Math.floor((end - now) / 1000))
  }, [durationMinutes, startedAt])

  const [remaining, setRemaining] = useState(calculateRemaining)

  useEffect(() => {
    const interval = setInterval(() => {
      const newRemaining = calculateRemaining()
      setRemaining(newRemaining)
      if (newRemaining <= 0) {
        clearInterval(interval)
        onExpire()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [calculateRemaining, onExpire])

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60

  const isWarning = remaining <= 300 && remaining > 60
  const isCritical = remaining <= 60

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-sm font-semibold transition-colors",
        isCritical
          ? "bg-destructive/10 text-destructive animate-pulse"
          : isWarning
            ? "bg-warning/10 text-warning-foreground"
            : "bg-secondary text-secondary-foreground",
        className
      )}
    >
      <Clock className="h-4 w-4" />
      <span>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  )
}
