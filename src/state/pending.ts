/**
 * Offline-tolerant submissions. If a lesson/assessment/revision submission
 * fails because the network or server is unavailable, it is queued here (per
 * learner) and retried later. Each submission carries a unique attempt id and
 * the backend treats repeats idempotently, so retrying can never award XP twice.
 */
import type { AnswerValue } from '../content/types'
import { readJSON, writeJSON } from '../lib/storage'

export interface PendingSubmission {
  kind: 'lesson' | 'assessment' | 'revision'
  targetId: string
  answers: Record<string, AnswerValue>
  attemptId: string
  createdAt: string
}

const key = (userId: string) => `veleta.pending.${userId}`

export const listPending = (userId: string) => readJSON<PendingSubmission[]>(key(userId), [])

export function addPending(userId: string, p: PendingSubmission) {
  const list = listPending(userId).filter((x) => x.attemptId !== p.attemptId)
  writeJSON(key(userId), [...list, p].slice(-20))
}

export function removePending(userId: string, attemptId: string) {
  writeJSON(key(userId), listPending(userId).filter((x) => x.attemptId !== attemptId))
}
