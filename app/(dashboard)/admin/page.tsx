"use client"

import { useMemo } from "react"
import { Users, FileText, HelpCircle, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"
import { useExamStore } from "@/lib/exam-store"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { format } from "date-fns"

function AdminDashboardContent() {
  const { state } = useExamStore()

  const stats = useMemo(() => {
    const students = state.users.filter((u) => u.role === "student")
    const submittedAttempts = state.attempts.filter((a) => a.status === "submitted")
    const avgScore =
      submittedAttempts.length > 0
        ? submittedAttempts.reduce((sum, a) => sum + (a.score || 0), 0) /
          submittedAttempts.length
        : 0

    return {
      totalStudents: students.length,
      totalExams: state.exams.length,
      totalQuestions: state.questions.length,
      avgScore: Math.round(avgScore),
      totalAttempts: submittedAttempts.length,
    }
  }, [state])

  const passFail = useMemo(() => {
    const submitted = state.attempts.filter((a) => a.status === "submitted")
    let passed = 0
    let failed = 0
    for (const attempt of submitted) {
      const exam = state.exams.find((e) => e.id === attempt.examId)
      if (exam && attempt.score !== null) {
        if (attempt.score >= exam.passingScore) passed++
        else failed++
      }
    }
    return [
      { name: "Passed", value: passed, color: "var(--chart-2)" },
      { name: "Failed", value: failed, color: "var(--chart-4)" },
    ]
  }, [state])

  const examPerformance = useMemo(() => {
    return state.exams.map((exam) => {
      const attempts = state.attempts.filter(
        (a) => a.examId === exam.id && a.status === "submitted"
      )
      const avg =
        attempts.length > 0
          ? attempts.reduce((s, a) => s + (a.score || 0), 0) / attempts.length
          : 0
      return {
        name: exam.title.length > 15 ? exam.title.slice(0, 15) + "..." : exam.title,
        avgScore: Math.round(avg),
        attempts: attempts.length,
      }
    })
  }, [state])

  const recentAttempts = useMemo(() => {
    return state.attempts
      .filter((a) => a.status === "submitted")
      .sort(
        (a, b) =>
          new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime()
      )
      .slice(0, 5)
      .map((a) => {
        const student = state.users.find((u) => u.id === a.studentId)
        const exam = state.exams.find((e) => e.id === a.examId)
        return { ...a, studentName: student?.name || "Unknown", examTitle: exam?.title || "Unknown", passingScore: exam?.passingScore || 0 }
      })
  }, [state])

  const statCards = [
    { label: "Total Students", value: stats.totalStudents, icon: Users, color: "text-chart-1" },
    { label: "Total Exams", value: stats.totalExams, icon: FileText, color: "text-chart-2" },
    { label: "Questions", value: stats.totalQuestions, icon: HelpCircle, color: "text-chart-3" },
    { label: "Avg Score", value: `${stats.avgScore}%`, icon: TrendingUp, color: "text-chart-5" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of the examination system
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-secondary ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pass / Fail Ratio</CardTitle>
            <CardDescription>Overall exam results distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {passFail[0].value + passFail[1].value > 0 ? (
              <div className="flex items-center justify-center">
                <ResponsiveContainer width={220} height={220}>
                  <PieChart>
                    <Pie
                      data={passFail}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {passFail.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2">
                  {passFail.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2 text-sm">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-muted-foreground">{entry.name}:</span>
                      <span className="font-semibold text-foreground">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No exam attempts yet
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Exam Performance</CardTitle>
            <CardDescription>Average score by exam</CardDescription>
          </CardHeader>
          <CardContent>
            {examPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={examPerformance}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <Tooltip />
                  <Bar dataKey="avgScore" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No performance data yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Attempts</CardTitle>
          <CardDescription>Latest exam submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {recentAttempts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left font-medium text-muted-foreground">Student</th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">Exam</th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">Score</th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttempts.map((attempt) => (
                    <tr key={attempt.id} className="border-b border-border last:border-0">
                      <td className="py-3 font-medium text-foreground">{attempt.studentName}</td>
                      <td className="py-3 text-muted-foreground">{attempt.examTitle}</td>
                      <td className="py-3 font-mono text-foreground">{attempt.score?.toFixed(0)}%</td>
                      <td className="py-3">
                        <Badge variant={attempt.score !== null && attempt.score >= attempt.passingScore ? "default" : "destructive"}>
                          {attempt.score !== null && attempt.score >= attempt.passingScore ? "Passed" : "Failed"}
                        </Badge>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {attempt.submittedAt
                          ? format(new Date(attempt.submittedAt), "MMM d, yyyy HH:mm")
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No exam attempts yet. Students can take exams from their dashboard.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboardContent />
    </ProtectedRoute>
  )
}
