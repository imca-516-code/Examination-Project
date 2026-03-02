"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Clock,
  HelpCircle,
  Target,
  AlertTriangle,
  Shield,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

function ExamStartContent({ examId }: { examId: string }) {
  const router = useRouter()
  const { state, startAttempt } = useExamStore()

  const exam = state.exams.find((e) => e.id === examId)

  const alreadySubmitted = state.attempts.some(
    (a) =>
      a.examId === examId &&
      a.studentId === state.currentUser?.id &&
      a.status === "submitted"
  )

  const inProgressAttempt = state.attempts.find(
    (a) =>
      a.examId === examId &&
      a.studentId === state.currentUser?.id &&
      a.status === "in_progress"
  )

  if (!exam) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Exam not found.
      </div>
    )
  }

  if (alreadySubmitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-muted-foreground">
          You have already completed this exam.
        </p>
        <Button onClick={() => router.push("/student/results")}>
          View Results
        </Button>
      </div>
    )
  }

  const handleStart = () => {
    const attempt = inProgressAttempt || startAttempt(examId)
    if (attempt) {
      router.push(`/student/attempt/${attempt.id}`)
    } else {
      toast.error("Failed to start exam")
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{exam.title}</h1>
          <p className="text-sm text-muted-foreground">{exam.subject}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Exam Details</CardTitle>
          <CardDescription>{exam.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary p-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg font-bold text-foreground">{exam.duration}</span>
              <span className="text-xs text-muted-foreground">Minutes</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary p-3">
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg font-bold text-foreground">{exam.totalQuestions}</span>
              <span className="text-xs text-muted-foreground">Questions</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary p-3">
              <Target className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg font-bold text-foreground">{exam.passingScore}%</span>
              <span className="text-xs text-muted-foreground">To Pass</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-warning/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-warning-foreground" />
            <CardTitle className="text-base">Exam Rules & Proctoring</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
              The exam will enter fullscreen mode. Exiting fullscreen will be recorded.
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
              Switching tabs or losing window focus will be tracked as violations.
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
              Right-clicking, copy/paste, and keyboard shortcuts are disabled.
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
              The exam auto-submits when the timer expires.
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
              All activities are logged and visible to the examiner.
            </li>
          </ul>
        </CardContent>
      </Card>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="lg" className="w-full">
            {inProgressAttempt ? "Resume Exam" : "Start Exam"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {inProgressAttempt ? "Resume Exam?" : "Start Exam?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {inProgressAttempt
                ? "You will continue from where you left off. The timer is still running."
                : `You will have ${exam.duration} minutes to complete ${exam.totalQuestions} questions. The proctoring system will be active. Are you ready?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStart}>
              {inProgressAttempt ? "Resume" : "Start Now"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function ExamStartPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <ProtectedRoute requiredRole="student">
      <ExamStartContent examId={id} />
    </ProtectedRoute>
  )
}
