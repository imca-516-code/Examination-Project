"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface QuestionNavigatorProps {
  totalQuestions: number
  currentIndex: number
  answeredQuestions: Set<number>
  flaggedQuestions: Set<number>
  onNavigate: (index: number) => void
}

export function QuestionNavigator({
  totalQuestions,
  currentIndex,
  answeredQuestions,
  flaggedQuestions,
  onNavigate,
}: QuestionNavigatorProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-foreground">Questions</h3>
      <div className="grid grid-cols-5 gap-1.5">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const isActive = i === currentIndex
          const isAnswered = answeredQuestions.has(i)
          const isFlagged = flaggedQuestions.has(i)

          return (
            <Button
              key={i}
              variant="outline"
              size="sm"
              onClick={() => onNavigate(i)}
              className={cn(
                "h-9 w-9 p-0 text-xs font-medium relative",
                isActive && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                isAnswered && !isActive && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground border-primary",
                !isAnswered && !isActive && "bg-card text-muted-foreground",
              )}
            >
              {i + 1}
              {isFlagged && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-warning" />
              )}
            </Button>
          )
        })}
      </div>
      <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mt-1">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-primary" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm border border-border bg-card" />
          <span>Unanswered</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-warning" />
          <span>Flagged</span>
        </div>
      </div>
    </div>
  )
}
