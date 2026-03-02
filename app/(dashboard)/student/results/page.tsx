"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Trophy, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import { useExamStore } from "@/lib/exam-store"
import { format } from "date-fns"

function ResultsContent() {
  const { state } = useExamStore()

  const myResults = useMemo(() => {
    return state.attempts
      .filter(
        (a) => a.studentId === state.currentUser?.id && a.status === "submitted"
      )
      .sort(
        (a, b) =>
          new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime()
      )
      .map((a) => {
        const exam = state.exams.find((e) => e.id === a.examId)
        return {
          ...a,
          examTitle: exam?.title || "Unknown Exam",
          examSubject: exam?.subject || "Unknown",
          passingScore: exam?.passingScore || 0,
        }
      })
  }, [state])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Results</h1>
        <p className="text-sm text-muted-foreground">
          Review your exam results and performance
        </p>
      </div>

      {myResults.length > 0 ? (
        <div className="flex flex-col gap-4">
          {myResults.map((result) => {
            const passed = result.score !== null && result.score >= result.passingScore

            return (
              <Card key={result.id}>
                <CardContent className="flex items-center gap-4 p-5">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-lg text-lg font-bold ${
                      passed
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {result.score?.toFixed(0)}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground truncate">
                        {result.examTitle}
                      </h3>
                      <Badge variant={passed ? "default" : "destructive"}>
                        {passed ? "Passed" : "Failed"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {result.examSubject} | {result.totalCorrect}/{result.totalQuestions} correct |{" "}
                      {result.proctorLogs.length} violations
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Submitted {result.submittedAt ? format(new Date(result.submittedAt), "MMM d, yyyy 'at' HH:mm") : "-"}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/student/results/${result.id}`}>
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      Review
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-medium text-foreground">No results yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Complete an exam to see your results here
            </p>
            <Button asChild>
              <Link href="/student">Browse Exams</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function ResultsPage() {
  return (
    <ProtectedRoute requiredRole="student">
      <ResultsContent />
    </ProtectedRoute>
  )
}
