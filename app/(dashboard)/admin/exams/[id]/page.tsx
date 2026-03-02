"use client"

import { use, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, HelpCircle, Target, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"
import { useExamStore } from "@/lib/exam-store"
import { format } from "date-fns"

function ExamDetailContent({ examId }: { examId: string }) {
  const router = useRouter()
  const { state } = useExamStore()

  const exam = state.exams.find((e) => e.id === examId)
  const questions = useMemo(
    () => state.questions.filter((q) => exam?.questionIds.includes(q.id)),
    [state.questions, exam]
  )
  const attempts = useMemo(
    () =>
      state.attempts
        .filter((a) => a.examId === examId && a.status === "submitted")
        .sort(
          (a, b) =>
            new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime()
        )
        .map((a) => {
          const student = state.users.find((u) => u.id === a.studentId)
          return { ...a, studentName: student?.name || "Unknown" }
        }),
    [state.attempts, state.users, examId]
  )

  if (!exam) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Exam not found.{" "}
        <Button variant="link" onClick={() => router.push("/admin/exams")}>
          Go back
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{exam.title}</h1>
            <Badge variant={exam.status === "active" ? "default" : "secondary"}>
              {exam.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{exam.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: Clock, label: "Duration", value: `${exam.duration} min` },
          { icon: HelpCircle, label: "Questions", value: exam.totalQuestions },
          { icon: Target, label: "Passing", value: `${exam.passingScore}%` },
          { icon: Users, label: "Attempts", value: attempts.length },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-lg font-bold text-foreground">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Questions ({questions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {questions.map((q, i) => (
              <div key={q.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{q.text}</p>
                  <span className="mt-1 inline-block text-xs text-muted-foreground capitalize rounded bg-muted px-1.5 py-0.5">
                    {q.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Submissions ({attempts.length})</CardTitle>
          <CardDescription>Student attempts for this exam</CardDescription>
        </CardHeader>
        <CardContent>
          {attempts.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left font-medium text-muted-foreground">Student</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Score</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Result</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Violations</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium text-foreground">{a.studentName}</td>
                    <td className="py-3 font-mono text-foreground">{a.score?.toFixed(0)}%</td>
                    <td className="py-3">
                      <Badge variant={a.score !== null && a.score >= exam.passingScore ? "default" : "destructive"}>
                        {a.score !== null && a.score >= exam.passingScore ? "Passed" : "Failed"}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">{a.proctorLogs.length}</td>
                    <td className="py-3 text-muted-foreground">
                      {a.submittedAt ? format(new Date(a.submittedAt), "MMM d, HH:mm") : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No submissions yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function ExamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <ProtectedRoute requiredRole="admin">
      <ExamDetailContent examId={id} />
    </ProtectedRoute>
  )
}
