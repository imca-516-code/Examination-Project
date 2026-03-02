"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Clock, FileText, Trophy, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import { useExamStore } from "@/lib/exam-store"

function StudentDashboardContent() {
  const { state } = useExamStore()

  const activeExams = useMemo(
    () => state.exams.filter((e) => e.status === "active"),
    [state.exams]
  )

  const myAttempts = useMemo(
    () =>
      state.attempts.filter(
        (a) => a.studentId === state.currentUser?.id && a.status === "submitted"
      ),
    [state.attempts, state.currentUser]
  )

  const stats = useMemo(() => {
    const avgScore =
      myAttempts.length > 0
        ? myAttempts.reduce((s, a) => s + (a.score || 0), 0) / myAttempts.length
        : 0
    const passed = myAttempts.filter((a) => {
      const exam = state.exams.find((e) => e.id === a.examId)
      return exam && a.score !== null && a.score >= exam.passingScore
    }).length
    return {
      attempted: myAttempts.length,
      avgScore: Math.round(avgScore),
      passed,
    }
  }, [myAttempts, state.exams])

  const hasAttempted = (examId: string) =>
    state.attempts.some(
      (a) =>
        a.examId === examId &&
        a.studentId === state.currentUser?.id &&
        a.status === "submitted"
    )

  const hasInProgress = (examId: string) =>
    state.attempts.some(
      (a) =>
        a.examId === examId &&
        a.studentId === state.currentUser?.id &&
        a.status === "in_progress"
    )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {state.currentUser?.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here are your available exams and recent performance
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.attempted}</p>
              <p className="text-xs text-muted-foreground">Exams Taken</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.avgScore}%</p>
              <p className="text-xs text-muted-foreground">Average Score</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.passed}</p>
              <p className="text-xs text-muted-foreground">Exams Passed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Available Exams</h2>
        {activeExams.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {activeExams.map((exam) => {
              const attempted = hasAttempted(exam.id)
              const inProgress = hasInProgress(exam.id)

              return (
                <Card key={exam.id} className="flex flex-col">
                  <CardHeader className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{exam.title}</CardTitle>
                        <CardDescription className="mt-1">{exam.description}</CardDescription>
                      </div>
                      <Badge variant="outline">{exam.subject}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {exam.duration} min
                      </span>
                      <span>{exam.totalQuestions} questions</span>
                      <span>Pass: {exam.passingScore}%</span>
                    </div>
                    {attempted ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Completed</Badge>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/student/results">View Results</Link>
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" asChild>
                        <Link href={`/student/exams/${exam.id}`}>
                          {inProgress ? "Resume Exam" : "Start Exam"}
                          <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No active exams at the moment</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function StudentDashboard() {
  return (
    <ProtectedRoute requiredRole="student">
      <StudentDashboardContent />
    </ProtectedRoute>
  )
}
