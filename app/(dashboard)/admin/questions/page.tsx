"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Plus, Search, Trash2, HelpCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProtectedRoute } from "@/components/protected-route"
import { useExamStore } from "@/lib/exam-store"

const difficultyColor = (d: string) => {
  switch (d) {
    case "easy":
      return "bg-success/10 text-success"
    case "medium":
      return "bg-warning/10 text-warning-foreground"
    case "hard":
      return "bg-destructive/10 text-destructive"
    default:
      return "bg-secondary text-secondary-foreground"
  }
}

function QuestionsContent() {
  const { state, deleteQuestion } = useExamStore()
  const [search, setSearch] = useState("")
  const [subjectFilter, setSubjectFilter] = useState<string>("all")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")

  const filtered = useMemo(() => {
    return state.questions.filter((q) => {
      const matchesSearch =
        search === "" || q.text.toLowerCase().includes(search.toLowerCase())
      const matchesSubject =
        subjectFilter === "all" || q.subject === subjectFilter
      const matchesDifficulty =
        difficultyFilter === "all" || q.difficulty === difficultyFilter
      return matchesSearch && matchesSubject && matchesDifficulty
    })
  }, [state.questions, search, subjectFilter, difficultyFilter])

  const handleDelete = (id: string) => {
    deleteQuestion(id)
    toast.success("Question deleted")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Question Bank</h1>
          <p className="text-sm text-muted-foreground">
            {state.questions.length} total questions
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/questions/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            <SelectItem value="Mathematics">Mathematics</SelectItem>
            <SelectItem value="Science">Science</SelectItem>
            <SelectItem value="Programming">Programming</SelectItem>
          </SelectContent>
        </Select>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filtered.map((q, i) => (
            <Card key={q.id}>
              <CardContent className="flex items-start gap-4 p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-2">{q.text}</p>
                  <div className="grid grid-cols-2 gap-1.5 mb-2">
                    {q.options.map((opt, oi) => (
                      <div
                        key={oi}
                        className={`rounded border px-2.5 py-1.5 text-xs ${
                          oi === q.correctAnswer
                            ? "border-success/50 bg-success/10 text-success font-medium"
                            : "border-border bg-card text-muted-foreground"
                        }`}
                      >
                        <span className="font-medium mr-1">{String.fromCharCode(65 + oi)}.</span>
                        {opt}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{q.subject}</Badge>
                    <span className={`rounded px-1.5 py-0.5 text-xs font-medium capitalize ${difficultyColor(q.difficulty)}`}>
                      {q.difficulty}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(q.id)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <HelpCircle className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-medium text-foreground">No questions found</h3>
            <p className="text-sm text-muted-foreground">
              {search || subjectFilter !== "all" || difficultyFilter !== "all"
                ? "Try adjusting your filters"
                : "Add your first question to get started"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function QuestionsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <QuestionsContent />
    </ProtectedRoute>
  )
}
