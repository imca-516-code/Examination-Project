"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Plus, FileText, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProtectedRoute } from "@/components/protected-route"
import { useExamStore } from "@/lib/exam-store"
import { format } from "date-fns"

function ExamsContent() {
  const { state, deleteExam, updateExam } = useExamStore()

  const exams = useMemo(
    () =>
      [...state.exams].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [state.exams]
  )

  const handleDelete = (id: string, title: string) => {
    deleteExam(id)
    toast.success(`Exam "${title}" deleted`)
  }

  const handleToggleStatus = (exam: typeof exams[0]) => {
    const newStatus = exam.status === "active" ? "draft" : "active"
    updateExam({ ...exam, status: newStatus })
    toast.success(`Exam "${exam.title}" set to ${newStatus}`)
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "draft":
        return "secondary"
      case "completed":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Exams</h1>
          <p className="text-sm text-muted-foreground">
            Manage all examinations
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/exams/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Exam
          </Link>
        </Button>
      </div>

      {exams.length > 0 ? (
        <div className="overflow-x-auto">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Subject</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Duration</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Questions</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Created</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam) => (
                    <tr key={exam.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <Link href={`/admin/exams/${exam.id}`} className="font-medium text-foreground hover:text-primary">
                          {exam.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{exam.subject}</td>
                      <td className="px-4 py-3 text-muted-foreground">{exam.duration} min</td>
                      <td className="px-4 py-3 text-muted-foreground">{exam.totalQuestions}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusColor(exam.status)}>{exam.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {format(new Date(exam.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/exams/${exam.id}`}>
                                <FileText className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(exam)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Set {exam.status === "active" ? "Draft" : "Active"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(exam.id, exam.title)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-medium text-foreground">No exams yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Create your first exam to get started
            </p>
            <Button asChild>
              <Link href="/admin/exams/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Exam
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function AdminExamsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <ExamsContent />
    </ProtectedRoute>
  )
}
