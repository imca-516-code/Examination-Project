import type { ExamAttempt, Question } from "./types"

export interface EvaluationResult {
  score: number
  totalCorrect: number
  totalQuestions: number
  passed: boolean
  questionResults: QuestionResult[]
}

export interface QuestionResult {
  questionId: string
  studentAnswer: number | null
  correctAnswer: number
  isCorrect: boolean
}

export function evaluateAttempt(
  attempt: ExamAttempt,
  questions: Question[],
  passingScore: number
): EvaluationResult {
  const questionMap = new Map(questions.map((q) => [q.id, q]))
  let totalCorrect = 0
  const questionResults: QuestionResult[] = []

  for (const questionId of attempt.questionOrder) {
    const question = questionMap.get(questionId)
    if (!question) continue

    const studentAnswer = attempt.answers[questionId] ?? null
    const isCorrect = studentAnswer === question.correctAnswer

    if (isCorrect) totalCorrect++

    questionResults.push({
      questionId,
      studentAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
    })
  }

  const totalQuestions = attempt.questionOrder.length
  const score = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0
  const passed = score >= passingScore

  return {
    score: Math.round(score * 100) / 100,
    totalCorrect,
    totalQuestions,
    passed,
    questionResults,
  }
}
