"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ProtectedRoute } from "@/components/protected-route"
import { useExamStore } from "@/lib/exam-store"
import type { Subject, Difficulty } from "@/lib/types"

function AddQuestionContent() {
  const router = useRouter()
  const { addQuestion } = useExamStore()
  const [text, setText] = useState("")
  const [options, setOptions] = useState(["", "", "", ""])
  const [correctAnswer, setCorrectAnswer] = useState<number>(0)
  const [subject, setSubject] = useState<Subject>("Mathematics")
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")

  const updateOption = (index: number, value: string) => {
    setOptions((prev) => prev.map((o, i) => (i === index ? value : o)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (options.some((o) => o.trim() === "")) {
      toast.error("All options must be filled")
      return
    }

    addQuestion({
      text,
      options: options as [string, string, string, string],
      correctAnswer,
      subject,
      difficulty,
    })

    toast.success("Question added successfully")
    router.push("/admin/questions")
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Question</h1>
          <p className="text-sm text-muted-foreground">
            Create a new MCQ question
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Question Details</CardTitle>
            <CardDescription>Write the question and set its metadata</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="text">Question Text</Label>
              <Input
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your question..."
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Subject</Label>
                <Select value={subject} onValueChange={(v) => setSubject(v as Subject)}>
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
                <Label>Difficulty</Label>
                <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Answer Options</CardTitle>
            <CardDescription>Enter 4 options and select the correct one</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={String(correctAnswer)}
              onValueChange={(v) => setCorrectAnswer(parseInt(v))}
              className="flex flex-col gap-3"
            >
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-3">
                  <RadioGroupItem value={String(i)} id={`option-${i}`} />
                  <Label htmlFor={`option-${i}`} className="text-sm font-medium w-6">
                    {String.fromCharCode(65 + i)}.
                  </Label>
                  <Input
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    required
                    className="flex-1"
                  />
                </div>
              ))}
            </RadioGroup>
            <p className="mt-3 text-xs text-muted-foreground">
              Select the radio button next to the correct answer
            </p>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit">Add Question</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function AddQuestionPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AddQuestionContent />
    </ProtectedRoute>
  )
}
