"use client"

import { use, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ProtectedRoute } from "@/components/protected-route"
import { useExamStore } from "@/lib/exam-store"
import { format, differenceInMinutes } from "date-fns"

function ResultDetailContent({ attemptId }: { attemptId: string }) {
  const router = useRouter()
  const { state } = useExamStore()

  const attempt = state.attempts.find((a) => a.id === attemptId)
  const exam = attempt ? state.exams.find((e) => e.id === attempt.examId) : null

  const questionResults = useMemo(() => {
    if (!attempt) return []
    return attempt.questionOrder.map((qId) => {
      const question = state.questions.find((q) => q.id === qId)
      const studentAnswer = attempt.answers[qId] ?? null
      const isCorrect = question ? studentAnswer === question.correctAnswer : false
      return { question, studentAnswer, isCorrect }
    })
  }, [attempt, state.questions])

  if (!attempt || !exam) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Result not found.
      </div>
    )
  }

  const passed = attempt.score !== null && attempt.score >= exam.passingScore
  const timeTaken =
    attempt.startedAt && attempt.submittedAt
      ? differenceInMinutes(new Date(attempt.submittedAt), new Date(attempt.startedAt))
      : null

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Exam Results</h1>
          <p className="text-sm text-muted-foreground">{exam.title}</p>
        </div>
      </div>

      {/* Score card */}
      <Card className={passed ? "border-success/30" : "border-destructive/30"}>
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <div
            className={`flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold ${
              passed
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {attempt.score?.toFixed(0)}%
          </div>
          <Badge
            variant={passed ? "default" : "destructive"}
            className="text-base px-4 py-1"
          >
            {passed ? "PASSED" : "FAILED"}
          </Badge>
          <p className="text-sm text-muted-foreground">
            Passing score: {exam.passingScore}%
          </p>
          <Progress
            value={attempt.score || 0}
            className="h-2 w-64"
          />
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex flex-col items-center p-4">
            <CheckCircle2 className="mb-1 h-5 w-5 text-success" />
            <p className="text-lg font-bold text-foreground">{attempt.totalCorrect}</p>
            <p className="text-xs text-muted-foreground">Correct</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-4">
            <XCircle className="mb-1 h-5 w-5 text-destructive" />
            <p className="text-lg font-bold text-foreground">
              {(attempt.totalQuestions || 0) - (attempt.totalCorrect || 0)}
            </p>
            <p className="text-xs text-muted-foreground">Incorrect</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-4">
            <Clock className="mb-1 h-5 w-5 text-muted-foreground" />
            <p className="text-lg font-bold text-foreground">
              {timeTaken !== null ? `${timeTaken}m` : "-"}
            </p>
            <p className="text-xs text-muted-foreground">Time Taken</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-4">
            <Shield className="mb-1 h-5 w-5 text-warning-foreground" />
            <p className="text-lg font-bold text-foreground">
              {attempt.proctorLogs.length}
            </p>
            <p className="text-xs text-muted-foreground">Violations</p>
          </CardContent>
        </Card>
      </div>

      {/* Proctoring summary */}
      {attempt.proctorLogs.length > 0 && (
        <Card className="border-warning/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning-foreground" />
              <CardTitle className="text-base">Proctoring Violations</CardTitle>
            </div>
            <CardDescription>
              {attempt.proctorLogs.length} violations recorded during this exam
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {attempt.proctorLogs.map((log, i) => (
                <div
                  key={log.id || i}
                  className="flex items-center justify-between rounded border border-border px-3 py-2 text-xs"
                >
                  <span className="text-foreground">{log.description}</span>
                  <span className="text-muted-foreground shrink-0 ml-4">
                    {format(new Date(log.timestamp), "HH:mm:ss")}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Question-by-question review */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Question Review</CardTitle>
          <CardDescription>Detailed breakdown of your answers</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {questionResults.map(({ question, studentAnswer, isCorrect }, i) => {
            if (!question) return null
            return (
              <div
                key={question.id}
                className={`rounded-lg border p-4 ${
                  isCorrect ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p className="text-sm font-medium text-foreground">
                    <span className="text-muted-foreground mr-2">Q{i + 1}.</span>
                    {question.text}
                  </p>
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 shrink-0 text-destructive" />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {question.options.map((opt, oi) => {
                    const isStudentChoice = studentAnswer === oi
                    const isCorrectOption = question.correctAnswer === oi

                    let className = "rounded border px-3 py-2 text-xs "
                    if (isCorrectOption) {
                      className += "border-success/50 bg-success/10 text-success font-medium"
                    } else if (isStudentChoice && !isCorrectOption) {
                      className += "border-destructive/50 bg-destructive/10 text-destructive"
                    } else {
                      className += "border-border bg-card text-muted-foreground"
                    }

                    return (
                      <div key={oi} className={className}>
                        <span className="font-medium mr-1">
                          {String.fromCharCode(65 + oi)}.
                        </span>
                        {opt}
                        {isCorrectOption && (
                          <span className="ml-1">(Correct)</span>
                        )}
                        {isStudentChoice && !isCorrectOption && (
                          <span className="ml-1">(Your answer)</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}

export default function ResultDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <ProtectedRoute requiredRole="student">
      <ResultDetailContent attemptId={id} />
    </ProtectedRoute>
  )
}
