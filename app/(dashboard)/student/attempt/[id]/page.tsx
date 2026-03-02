"use client"

import { use, useState, useCallback, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Send,
  AlertTriangle,
  Maximize,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ProtectedRoute } from "@/components/protected-route"
import { useExamStore } from "@/lib/exam-store"
import { ExamTimer } from "@/components/exam-timer"
import { QuestionNavigator } from "@/components/question-navigator"
import { useProctoring } from "@/hooks/use-proctoring"

function ExamAttemptContent({ attemptId }: { attemptId: string }) {
  const router = useRouter()
  const { state, updateAttemptAnswer, submitAttempt, addProctorLog } = useExamStore()

  const attempt = state.attempts.find((a) => a.id === attemptId)
  const exam = attempt ? state.exams.find((e) => e.id === attempt.examId) : null

  const [currentIndex, setCurrentIndex] = useState(0)
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleViolation = useCallback(
    (type: Parameters<typeof addProctorLog>[1], description: string) => {
      if (attempt) {
        addProctorLog(attempt.id, type, description)
        toast.warning(description, { duration: 3000 })
      }
    },
    [attempt, addProctorLog]
  )

  const { proctoringState, enterFullscreen } = useProctoring({
    enabled: !!attempt && attempt.status === "in_progress",
    onViolation: handleViolation,
  })

  // Enter fullscreen on mount
  useEffect(() => {
    if (attempt?.status === "in_progress") {
      enterFullscreen()
    }
  }, [attempt?.status, enterFullscreen])

  const answeredQuestions = useMemo(() => {
    if (!attempt) return new Set<number>()
    const answered = new Set<number>()
    attempt.questionOrder.forEach((qId, idx) => {
      if (attempt.answers[qId] !== undefined) {
        answered.add(idx)
      }
    })
    return answered
  }, [attempt])

  const currentQuestionId = attempt?.questionOrder[currentIndex]
  const currentQuestion = currentQuestionId
    ? state.questions.find((q) => q.id === currentQuestionId)
    : null

  const handleAnswer = (answer: string) => {
    if (attempt && currentQuestionId) {
      updateAttemptAnswer(attempt.id, currentQuestionId, parseInt(answer))
    }
  }

  const handleSubmit = useCallback(() => {
    if (!attempt || isSubmitting) return
    setIsSubmitting(true)

    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    }

    const result = submitAttempt(attempt.id)
    if (result) {
      toast.success("Exam submitted successfully!")
      router.push(`/student/results/${result.id}`)
    } else {
      toast.error("Failed to submit exam")
      setIsSubmitting(false)
    }
  }, [attempt, isSubmitting, submitAttempt, router])

  const handleTimerExpire = useCallback(() => {
    toast.warning("Time is up! Auto-submitting your exam...")
    handleSubmit()
  }, [handleSubmit])

  const toggleFlag = () => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev)
      if (next.has(currentIndex)) {
        next.delete(currentIndex)
      } else {
        next.add(currentIndex)
      }
      return next
    })
  }

  if (!attempt || !exam) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Exam attempt not found.
      </div>
    )
  }

  if (attempt.status === "submitted") {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-muted-foreground">This exam has already been submitted.</p>
        <Button onClick={() => router.push(`/student/results/${attempt.id}`)}>
          View Results
        </Button>
      </div>
    )
  }

  const totalAnswered = Object.keys(attempt.answers).length

  return (
    <div className="flex flex-col gap-4 -m-6">
      {/* Proctoring violation banner */}
      {proctoringState.totalViolations > 0 && (
        <div className="flex items-center gap-3 bg-destructive/10 px-6 py-2 text-sm">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <span className="text-destructive font-medium">
            Violations: {proctoringState.totalViolations}
          </span>
          <span className="text-destructive/80 text-xs">
            (Tab: {proctoringState.tabSwitches}, Focus: {proctoringState.focusLosses}, 
            Right-click: {proctoringState.rightClicks}, Copy/Paste: {proctoringState.copyPastes})
          </span>
        </div>
      )}

      {/* Fullscreen prompt */}
      {!proctoringState.isFullscreen && (
        <div className="flex items-center justify-between gap-3 bg-warning/10 px-6 py-2">
          <span className="text-sm text-warning-foreground">
            Fullscreen mode required for proctoring
          </span>
          <Button size="sm" variant="outline" onClick={enterFullscreen}>
            <Maximize className="mr-1 h-3.5 w-3.5" />
            Enter Fullscreen
          </Button>
        </div>
      )}

      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3 bg-card">
        <div>
          <h1 className="text-lg font-bold text-foreground">{exam.title}</h1>
          <p className="text-xs text-muted-foreground">
            Question {currentIndex + 1} of {attempt.questionOrder.length} |{" "}
            {totalAnswered} answered
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExamTimer
            durationMinutes={exam.duration}
            startedAt={attempt.startedAt}
            onExpire={handleTimerExpire}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default" size="sm">
                <Send className="mr-1 h-3.5 w-3.5" />
                Submit
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
                <AlertDialogDescription>
                  You have answered {totalAnswered} out of{" "}
                  {attempt.questionOrder.length} questions.
                  {totalAnswered < attempt.questionOrder.length && (
                    <span className="block mt-1 font-medium text-destructive">
                      {attempt.questionOrder.length - totalAnswered} questions are
                      still unanswered!
                    </span>
                  )}
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Continue Exam</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Exam"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Main content */}
      <div className="flex gap-6 px-6 pb-6">
        {/* Question area */}
        <div className="flex-1 min-w-0">
          {currentQuestion ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Question {currentIndex + 1}
                  </CardTitle>
                  <Button
                    variant={flaggedQuestions.has(currentIndex) ? "default" : "outline"}
                    size="sm"
                    onClick={toggleFlag}
                    className="gap-1"
                  >
                    <Flag className="h-3.5 w-3.5" />
                    {flaggedQuestions.has(currentIndex) ? "Flagged" : "Flag"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-foreground leading-relaxed">
                  {currentQuestion.text}
                </p>
                <RadioGroup
                  value={
                    attempt.answers[currentQuestionId!] !== undefined
                      ? String(attempt.answers[currentQuestionId!])
                      : undefined
                  }
                  onValueChange={handleAnswer}
                  className="flex flex-col gap-3"
                >
                  {currentQuestion.options.map((option, oi) => (
                    <label
                      key={oi}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                        attempt.answers[currentQuestionId!] === oi
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value={String(oi)} id={`q-${oi}`} />
                      <Label
                        htmlFor={`q-${oi}`}
                        className="flex-1 cursor-pointer text-sm"
                      >
                        <span className="font-medium mr-2">
                          {String.fromCharCode(65 + oi)}.
                        </span>
                        {option}
                      </Label>
                    </label>
                  ))}
                </RadioGroup>

                {/* Navigation */}
                <div className="mt-6 flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
                    disabled={currentIndex === 0}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentIndex((p) =>
                        Math.min(attempt.questionOrder.length - 1, p + 1)
                      )
                    }
                    disabled={currentIndex === attempt.questionOrder.length - 1}
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <p className="text-muted-foreground">Question not found</p>
          )}
        </div>

        {/* Sidebar navigator */}
        <div className="hidden w-56 shrink-0 lg:block">
          <Card>
            <CardContent className="p-4">
              <QuestionNavigator
                totalQuestions={attempt.questionOrder.length}
                currentIndex={currentIndex}
                answeredQuestions={answeredQuestions}
                flaggedQuestions={flaggedQuestions}
                onNavigate={setCurrentIndex}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function ExamAttemptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <ProtectedRoute requiredRole="student">
      <ExamAttemptContent attemptId={id} />
    </ProtectedRoute>
  )
}
