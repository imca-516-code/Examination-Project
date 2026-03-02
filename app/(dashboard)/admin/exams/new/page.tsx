"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"
import { useExamStore } from "@/lib/exam-store"
import type { Subject, ExamStatus } from "@/lib/types"

function CreateExamContent() {
  const router = useRouter()
  const { state, addExam } = useExamStore()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [subject, setSubject] = useState<Subject>("Mathematics")
  const [duration, setDuration] = useState(30)
  const [passingScore, setPassingScore] = useState(60)
  const [status, setStatus] = useState<ExamStatus>("draft")
  const [scheduledAt, setScheduledAt] = useState("")
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([])

  const availableQuestions = useMemo(
    () => state.questions.filter((q) => q.subject === subject),
    [state.questions, subject]
  )

  const toggleQuestion = (questionId: string) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    )
  }

  const selectAll = () => {
    if (selectedQuestionIds.length === availableQuestions.length) {
      setSelectedQuestionIds([])
    } else {
      setSelectedQuestionIds(availableQuestions.map((q) => q.id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedQuestionIds.length === 0) {
      toast.error("Please select at least one question")
      return
    }

    addExam({
      title,
      description,
      subject,
      duration,
      totalQuestions: selectedQuestionIds.length,
      passingScore,
      status,
      questionIds: selectedQuestionIds,
      scheduledAt: scheduledAt || new Date().toISOString(),
    })

    toast.success("Exam created successfully")
    router.push("/admin/exams")
  }

  // Reset selection when subject changes
  const handleSubjectChange = (newSubject: Subject) => {
    setSubject(newSubject)
    setSelectedQuestionIds([])
  }

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

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Exam</h1>
          <p className="text-sm text-muted-foreground">
            Set up a new examination
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Exam Details</CardTitle>
            <CardDescription>
              Basic information about the exam
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mathematics Midterm"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the exam..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Subject</Label>
                <Select
                  value={subject}
                  onValueChange={(v) => handleSubjectChange(v as Subject)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Programming">Programming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Status</Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as ExamStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={5}
                  max={180}
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="passingScore">Passing Score (%)</Label>
                <Input
                  id="passingScore"
                  type="number"
                  min={1}
                  max={100}
                  value={passingScore}
                  onChange={(e) =>
                    setPassingScore(parseInt(e.target.value) || 60)
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="scheduledAt">Scheduled Date</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  Select Questions ({selectedQuestionIds.length} selected)
                </CardTitle>
                <CardDescription>
                  {availableQuestions.length} {subject} questions available
                </CardDescription>
              </div>
              {availableQuestions.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={selectAll}
                >
                  {selectedQuestionIds.length === availableQuestions.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {availableQuestions.length > 0 ? (
              <div className="flex flex-col gap-2">
                {availableQuestions.map((q) => (
                  <label
                    key={q.id}
                    className="flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedQuestionIds.includes(q.id)}
                      onCheckedChange={() => toggleQuestion(q.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{q.text}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`rounded px-1.5 py-0.5 text-xs font-medium capitalize ${difficultyColor(q.difficulty)}`}
                        >
                          {q.difficulty}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No questions available for {subject}. Add questions first.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={selectedQuestionIds.length === 0}>
            <Check className="mr-2 h-4 w-4" />
            Create Exam
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function CreateExamPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <CreateExamContent />
    </ProtectedRoute>
  )
}
