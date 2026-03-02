"use client"

import { useMemo } from "react"
import { Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"
import { useExamStore } from "@/lib/exam-store"
import { format } from "date-fns"

function StudentsContent() {
  const { state } = useExamStore()

  const students = useMemo(() => {
    return state.users
      .filter((u) => u.role === "student")
      .map((student) => {
        const attempts = state.attempts.filter(
          (a) => a.studentId === student.id && a.status === "submitted"
        )
        const avgScore =
          attempts.length > 0
            ? attempts.reduce((s, a) => s + (a.score || 0), 0) / attempts.length
            : null
        return {
          ...student,
          attempts: attempts.length,
          avgScore,
        }
      })
  }, [state])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Students</h1>
        <p className="text-sm text-muted-foreground">
          {students.length} registered students
        </p>
      </div>

      {students.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Exams Taken</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Avg Score</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-foreground">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.email}</td>
                    <td className="px-4 py-3 text-foreground">{s.attempts}</td>
                    <td className="px-4 py-3">
                      {s.avgScore !== null ? (
                        <Badge variant={s.avgScore >= 60 ? "default" : "destructive"}>
                          {s.avgScore.toFixed(0)}%
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {format(new Date(s.createdAt), "MMM d, yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-medium text-foreground">No students yet</h3>
            <p className="text-sm text-muted-foreground">
              Students will appear here after they register
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function StudentsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <StudentsContent />
    </ProtectedRoute>
  )
}
