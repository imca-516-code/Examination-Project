"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/protected-route"
import { useExamStore } from "@/lib/exam-store"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

function ReportsContent() {
  const { state } = useExamStore()

  const submittedAttempts = useMemo(
    () => state.attempts.filter((a) => a.status === "submitted"),
    [state.attempts]
  )

  // Score distribution
  const scoreDistribution = useMemo(() => {
    const buckets = [
      { range: "0-20", count: 0 },
      { range: "21-40", count: 0 },
      { range: "41-60", count: 0 },
      { range: "61-80", count: 0 },
      { range: "81-100", count: 0 },
    ]
    for (const a of submittedAttempts) {
      const score = a.score || 0
      if (score <= 20) buckets[0].count++
      else if (score <= 40) buckets[1].count++
      else if (score <= 60) buckets[2].count++
      else if (score <= 80) buckets[3].count++
      else buckets[4].count++
    }
    return buckets
  }, [submittedAttempts])

  // Subject performance
  const subjectPerformance = useMemo(() => {
    const subjectMap: Record<string, { total: number; count: number }> = {}
    for (const a of submittedAttempts) {
      const exam = state.exams.find((e) => e.id === a.examId)
      if (exam) {
        if (!subjectMap[exam.subject]) {
          subjectMap[exam.subject] = { total: 0, count: 0 }
        }
        subjectMap[exam.subject].total += a.score || 0
        subjectMap[exam.subject].count++
      }
    }
    return Object.entries(subjectMap).map(([subject, data]) => ({
      subject,
      avgScore: Math.round(data.total / data.count),
      attempts: data.count,
    }))
  }, [submittedAttempts, state.exams])

  // Difficulty accuracy
  const difficultyAccuracy = useMemo(() => {
    const diffMap: Record<string, { correct: number; total: number }> = {
      easy: { correct: 0, total: 0 },
      medium: { correct: 0, total: 0 },
      hard: { correct: 0, total: 0 },
    }
    for (const attempt of submittedAttempts) {
      for (const qId of attempt.questionOrder) {
        const question = state.questions.find((q) => q.id === qId)
        if (question) {
          diffMap[question.difficulty].total++
          if (attempt.answers[qId] === question.correctAnswer) {
            diffMap[question.difficulty].correct++
          }
        }
      }
    }
    return Object.entries(diffMap).map(([difficulty, data]) => ({
      difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
      accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    }))
  }, [submittedAttempts, state.questions])

  // Leaderboard
  const leaderboard = useMemo(() => {
    const studentMap: Record<string, { name: string; total: number; count: number }> = {}
    for (const a of submittedAttempts) {
      const student = state.users.find((u) => u.id === a.studentId)
      if (student) {
        if (!studentMap[a.studentId]) {
          studentMap[a.studentId] = { name: student.name, total: 0, count: 0 }
        }
        studentMap[a.studentId].total += a.score || 0
        studentMap[a.studentId].count++
      }
    }
    return Object.values(studentMap)
      .map((s) => ({
        name: s.name,
        avgScore: Math.round(s.total / s.count),
        exams: s.count,
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 10)
  }, [submittedAttempts, state.users])

  // Question-level stats
  const questionStats = useMemo(() => {
    return state.questions.map((q) => ({
      subject: q.subject,
      difficulty: q.difficulty,
    }))
  }, [state.questions])

  const questionsBySubject = useMemo(() => {
    const map: Record<string, number> = {}
    for (const q of questionStats) {
      map[q.subject] = (map[q.subject] || 0) + 1
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [questionStats])

  const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

  if (submittedAttempts.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Performance insights and statistics
          </p>
        </div>
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">
              No exam data available yet. Reports will appear once students complete exams.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Performance insights across {submittedAttempts.length} exam submissions
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Score Distribution</CardTitle>
            <CardDescription>How students scored across all exams</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                <Tooltip />
                <Bar dataKey="count" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Questions by Subject</CardTitle>
            <CardDescription>Distribution of questions across subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width={220} height={220}>
                <PieChart>
                  <Pie
                    data={questionsBySubject}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {questionsBySubject.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2">
                {questionsBySubject.map((entry, i) => (
                  <div key={entry.name} className="flex items-center gap-2 text-sm">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-muted-foreground">{entry.name}:</span>
                    <span className="font-semibold text-foreground">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subject Performance</CardTitle>
            <CardDescription>Average score by subject</CardDescription>
          </CardHeader>
          <CardContent>
            {subjectPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={subjectPerformance}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="subject" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                  <Tooltip />
                  <Bar dataKey="avgScore" fill="var(--chart-2)" radius={[4, 4, 0, 0]} name="Avg Score" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">No data</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Difficulty Accuracy</CardTitle>
            <CardDescription>Accuracy rate by question difficulty</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={difficultyAccuracy}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="difficulty" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" unit="%" />
                <Tooltip />
                <Bar dataKey="accuracy" fill="var(--chart-3)" radius={[4, 4, 0, 0]} name="Accuracy" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Leaderboard</CardTitle>
          <CardDescription>Top performing students</CardDescription>
        </CardHeader>
        <CardContent>
          {leaderboard.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left font-medium text-muted-foreground">Rank</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Student</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Avg Score</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Exams Taken</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((s, i) => (
                  <tr key={s.name} className="border-b border-border last:border-0">
                    <td className="py-3 font-mono text-foreground">{i + 1}</td>
                    <td className="py-3 font-medium text-foreground">{s.name}</td>
                    <td className="py-3 font-mono text-foreground">{s.avgScore}%</td>
                    <td className="py-3 text-muted-foreground">{s.exams}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">No data yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function ReportsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <ReportsContent />
    </ProtectedRoute>
  )
}
