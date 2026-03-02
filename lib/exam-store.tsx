"use client"

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react"
import type { ExamStoreState, ExamStoreAction, User, Question, Exam, ExamAttempt, ProctorLog } from "./types"
import { seedUsers, seedQuestions, seedExams } from "./seed-data"
import { generateId, getRandomizedQuestionIds } from "./question-utils"
import { evaluateAttempt } from "./evaluation"

const STORAGE_KEY = "exam-system-store"

const initialState: ExamStoreState = {
  users: [],
  questions: [],
  exams: [],
  attempts: [],
  currentUser: null,
  initialized: false,
}

function reducer(state: ExamStoreState, action: ExamStoreAction): ExamStoreState {
  switch (action.type) {
    case "INIT":
      return { ...state, ...action.payload, initialized: true }
    case "LOGIN":
      return { ...state, currentUser: action.payload }
    case "LOGOUT":
      return { ...state, currentUser: null }
    case "REGISTER":
      return { ...state, users: [...state.users, action.payload] }
    case "ADD_QUESTION":
      return { ...state, questions: [...state.questions, action.payload] }
    case "UPDATE_QUESTION":
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.id === action.payload.id ? action.payload : q
        ),
      }
    case "DELETE_QUESTION":
      return {
        ...state,
        questions: state.questions.filter((q) => q.id !== action.payload),
      }
    case "ADD_EXAM":
      return { ...state, exams: [...state.exams, action.payload] }
    case "UPDATE_EXAM":
      return {
        ...state,
        exams: state.exams.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
      }
    case "DELETE_EXAM":
      return {
        ...state,
        exams: state.exams.filter((e) => e.id !== action.payload),
      }
    case "START_ATTEMPT":
      return { ...state, attempts: [...state.attempts, action.payload] }
    case "UPDATE_ATTEMPT":
      return {
        ...state,
        attempts: state.attempts.map((a) =>
          a.id === action.payload.id ? action.payload : a
        ),
      }
    case "SUBMIT_ATTEMPT":
      return {
        ...state,
        attempts: state.attempts.map((a) =>
          a.id === action.payload.id ? action.payload : a
        ),
      }
    case "ADD_PROCTOR_LOG": {
      return {
        ...state,
        attempts: state.attempts.map((a) =>
          a.id === action.payload.attemptId
            ? { ...a, proctorLogs: [...a.proctorLogs, action.payload.log] }
            : a
        ),
      }
    }
    default:
      return state
  }
}

interface ExamStoreContextValue {
  state: ExamStoreState
  login: (email: string, password: string) => User | null
  logout: () => void
  register: (name: string, email: string, password: string) => User | null
  addQuestion: (question: Omit<Question, "id" | "createdBy">) => Question
  updateQuestion: (question: Question) => void
  deleteQuestion: (id: string) => void
  addExam: (exam: Omit<Exam, "id" | "createdBy" | "createdAt">) => Exam
  updateExam: (exam: Exam) => void
  deleteExam: (id: string) => void
  startAttempt: (examId: string) => ExamAttempt | null
  updateAttemptAnswer: (attemptId: string, questionId: string, answer: number) => void
  submitAttempt: (attemptId: string) => ExamAttempt | null
  addProctorLog: (attemptId: string, eventType: ProctorLog["eventType"], description: string) => void
}

const ExamStoreContext = createContext<ExamStoreContextValue | null>(null)

export function ExamStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        dispatch({ type: "INIT", payload: parsed })
      } else {
        // Initialize with seed data
        dispatch({
          type: "INIT",
          payload: {
            users: seedUsers,
            questions: seedQuestions,
            exams: seedExams,
            attempts: [],
            currentUser: null,
          },
        })
      }
    } catch {
      dispatch({
        type: "INIT",
        payload: {
          users: seedUsers,
          questions: seedQuestions,
          exams: seedExams,
          attempts: [],
          currentUser: null,
        },
      })
    }
  }, [])

  // Save to localStorage on state change
  useEffect(() => {
    if (state.initialized) {
      try {
        const toStore = {
          users: state.users,
          questions: state.questions,
          exams: state.exams,
          attempts: state.attempts,
          currentUser: state.currentUser,
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore))
      } catch {
        // Silently fail on storage errors
      }
    }
  }, [state])

  const login = (email: string, password: string): User | null => {
    const user = state.users.find(
      (u) => u.email === email && u.password === password
    )
    if (user) {
      dispatch({ type: "LOGIN", payload: user })
      return user
    }
    return null
  }

  const logout = () => {
    dispatch({ type: "LOGOUT" })
  }

  const register = (name: string, email: string, password: string): User | null => {
    if (state.users.some((u) => u.email === email)) {
      return null
    }
    const newUser: User = {
      id: generateId(),
      name,
      email,
      password,
      role: "student",
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: "REGISTER", payload: newUser })
    dispatch({ type: "LOGIN", payload: newUser })
    return newUser
  }

  const addQuestion = (question: Omit<Question, "id" | "createdBy">): Question => {
    const newQuestion: Question = {
      ...question,
      id: generateId(),
      createdBy: state.currentUser?.id || "",
    }
    dispatch({ type: "ADD_QUESTION", payload: newQuestion })
    return newQuestion
  }

  const updateQuestion = (question: Question) => {
    dispatch({ type: "UPDATE_QUESTION", payload: question })
  }

  const deleteQuestion = (id: string) => {
    dispatch({ type: "DELETE_QUESTION", payload: id })
  }

  const addExam = (exam: Omit<Exam, "id" | "createdBy" | "createdAt">): Exam => {
    const newExam: Exam = {
      ...exam,
      id: generateId(),
      createdBy: state.currentUser?.id || "",
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: "ADD_EXAM", payload: newExam })
    return newExam
  }

  const updateExam = (exam: Exam) => {
    dispatch({ type: "UPDATE_EXAM", payload: exam })
  }

  const deleteExam = (id: string) => {
    dispatch({ type: "DELETE_EXAM", payload: id })
  }

  const startAttempt = (examId: string): ExamAttempt | null => {
    if (!state.currentUser) return null
    const exam = state.exams.find((e) => e.id === examId)
    if (!exam || exam.status !== "active") return null

    // Check if student already has an in-progress attempt
    const existing = state.attempts.find(
      (a) =>
        a.examId === examId &&
        a.studentId === state.currentUser!.id &&
        a.status === "in_progress"
    )
    if (existing) return existing

    const questionOrder = getRandomizedQuestionIds(
      exam.questionIds,
      state.currentUser.id
    )

    const attempt: ExamAttempt = {
      id: generateId(),
      examId,
      studentId: state.currentUser.id,
      answers: {},
      startedAt: new Date().toISOString(),
      submittedAt: null,
      score: null,
      totalCorrect: null,
      totalQuestions: exam.totalQuestions,
      proctorLogs: [],
      questionOrder,
      status: "in_progress",
    }
    dispatch({ type: "START_ATTEMPT", payload: attempt })
    return attempt
  }

  const updateAttemptAnswer = (
    attemptId: string,
    questionId: string,
    answer: number
  ) => {
    const attempt = state.attempts.find((a) => a.id === attemptId)
    if (!attempt || attempt.status !== "in_progress") return

    const updated = {
      ...attempt,
      answers: { ...attempt.answers, [questionId]: answer },
    }
    dispatch({ type: "UPDATE_ATTEMPT", payload: updated })
  }

  const submitAttempt = (attemptId: string): ExamAttempt | null => {
    const attempt = state.attempts.find((a) => a.id === attemptId)
    if (!attempt) return null

    const exam = state.exams.find((e) => e.id === attempt.examId)
    if (!exam) return null

    const result = evaluateAttempt(attempt, state.questions, exam.passingScore)

    const submitted: ExamAttempt = {
      ...attempt,
      submittedAt: new Date().toISOString(),
      score: result.score,
      totalCorrect: result.totalCorrect,
      totalQuestions: result.totalQuestions,
      status: "submitted",
    }
    dispatch({ type: "SUBMIT_ATTEMPT", payload: submitted })
    return submitted
  }

  const addProctorLog = (
    attemptId: string,
    eventType: ProctorLog["eventType"],
    description: string
  ) => {
    const log: ProctorLog = {
      id: generateId(),
      attemptId,
      eventType,
      timestamp: new Date().toISOString(),
      description,
    }
    dispatch({ type: "ADD_PROCTOR_LOG", payload: { attemptId, log } })
  }

  return (
    <ExamStoreContext.Provider
      value={{
        state,
        login,
        logout,
        register,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        addExam,
        updateExam,
        deleteExam,
        startAttempt,
        updateAttemptAnswer,
        submitAttempt,
        addProctorLog,
      }}
    >
      {children}
    </ExamStoreContext.Provider>
  )
}

export function useExamStore() {
  const context = useContext(ExamStoreContext)
  if (!context) {
    throw new Error("useExamStore must be used within ExamStoreProvider")
  }
  return context
}
