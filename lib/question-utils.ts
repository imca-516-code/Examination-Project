import type { Question } from "./types"

// Simple seeded random number generator for deterministic shuffling
function seededRandom(seed: string): () => number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return function () {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff
    return hash / 0x7fffffff
  }
}

// Fisher-Yates shuffle with seed
function shuffleArray<T>(array: T[], rng: () => number): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getRandomizedQuestionIds(
  questionIds: string[],
  studentId: string
): string[] {
  const rng = seededRandom(`${studentId}-order`)
  return shuffleArray(questionIds, rng)
}

export function getShuffledOptions(
  question: Question,
  studentId: string
): { options: string[]; correctAnswer: number } {
  const rng = seededRandom(`${studentId}-${question.id}`)
  const indices = [0, 1, 2, 3]
  const shuffledIndices = shuffleArray(indices, rng)

  const options = shuffledIndices.map((i) => question.options[i])
  const correctAnswer = shuffledIndices.indexOf(question.correctAnswer)

  return { options, correctAnswer }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
