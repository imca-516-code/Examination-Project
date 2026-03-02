export type UserRole = "admin" | "student"

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  createdAt: string
}

export type Difficulty = "easy" | "medium" | "hard"
export type Subject = "Mathematics" | "Science" | "Programming"

export interface Question {
  id: string
  text: string
  options: [string, string, string, string]
  correctAnswer: number // 0-3 index
  subject: Subject
  difficulty: Difficulty
  createdBy: string
}

export type ExamStatus = "draft" | "active" | "completed"

export interface Exam {
  id: string
  title: string
  description: string
  subject: Subject
  duration: number // minutes
  totalQuestions: number
  passingScore: number // percentage
  status: ExamStatus
  questionIds: string[]
  createdBy: string
  createdAt: string
  scheduledAt: string
}

export type ProctorEventType =
  | "tab_switch"
  | "focus_loss"
  | "right_click"
  | "copy_paste"
  | "fullscreen_exit"
  | "key_combo"

export interface ProctorLog {
  id: string
  attemptId: string
  eventType: ProctorEventType
  timestamp: string
  description: string
}

export interface ExamAttempt {
  id: string
  examId: string
  studentId: string
  answers: Record<string, number> // questionId -> selected option index
  startedAt: string
  submittedAt: string | null
  score: number | null
  totalCorrect: number | null
  totalQuestions: number
  proctorLogs: ProctorLog[]
  questionOrder: string[] // randomized question IDs
  status: "in_progress" | "submitted"
}

export interface ExamStoreState {
  users: User[]
  questions: Question[]
  exams: Exam[]
  attempts: ExamAttempt[]
  currentUser: User | null
  initialized: boolean
}

export type ExamStoreAction =
  | { type: "INIT"; payload: Partial<ExamStoreState> }
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "REGISTER"; payload: User }
  | { type: "ADD_QUESTION"; payload: Question }
  | { type: "UPDATE_QUESTION"; payload: Question }
  | { type: "DELETE_QUESTION"; payload: string }
  | { type: "ADD_EXAM"; payload: Exam }
  | { type: "UPDATE_EXAM"; payload: Exam }
  | { type: "DELETE_EXAM"; payload: string }
  | { type: "START_ATTEMPT"; payload: ExamAttempt }
  | { type: "UPDATE_ATTEMPT"; payload: ExamAttempt }
  | { type: "SUBMIT_ATTEMPT"; payload: ExamAttempt }
  | { type: "ADD_PROCTOR_LOG"; payload: { attemptId: string; log: ProctorLog } }
