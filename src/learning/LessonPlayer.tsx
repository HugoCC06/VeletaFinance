import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { AnswerValue, Lesson, Question } from '../content/types'
import type { LessonResult } from '../backend/types'
import { BackendError } from '../backend/types'
import { gradeAnswer } from '../engine/grading'
import { XP } from '../engine/rewards'
import { Mascot } from '../brand/Mascot'
import { Icon } from '../components/Icon'
import { Dialog } from '../components/Dialog'
import { Confetti } from '../components/Confetti'
import { Button, LinkButton, ProgressBar, Alert } from '../components/ui'
import { readJSON, removeKey, uuid, writeJSON } from '../lib/storage'
import { initialRaw, isAnswered, normalise, type RawAnswer } from './answers'
import { QuestionView } from './QuestionView'
import { StepView } from './StepView'
import { Feedback } from './Feedback'
import { RewardPanel } from './RewardPanel'

interface Draft {
  v: 1
  queue: number[]
  pos: number
  done: number[]
  firstAnswers: Record<string, AnswerValue>
  attemptId: string
  savedAt: string
}

type Phase =
  | { kind: 'playing' }
  | { kind: 'submitting' }
  | { kind: 'complete'; result: LessonResult | null; offline: boolean }
  | { kind: 'error'; message: string }

interface Props {
  lesson: Lesson
  context: string
  mode: 'learner' | 'guest'
  draftKey: string
  onSubmit?: (answers: Record<string, AnswerValue>, attemptId: string) => Promise<LessonResult>
  onQueueOffline?: (answers: Record<string, AnswerValue>, attemptId: string) => void
  exitTo: string
  nextHref?: string | null
  nextLabel?: string
  alreadyCompleted?: boolean
}

function freshDraft(lesson: Lesson): Draft {
  return { v: 1, queue: lesson.steps.map((_, i) => i), pos: 0, done: [], firstAnswers: {}, attemptId: uuid(), savedAt: new Date().toISOString() }
}

export function LessonPlayer({ lesson, context, mode, draftKey, onSubmit, onQueueOffline, exitTo, nextHref, nextLabel = 'Next lesson', alreadyCompleted }: Props) {
  const navigate = useNavigate()
  const saved = useMemo(() => {
    const d = readJSON<Draft | null>(draftKey, null)
    return d && d.v === 1 && d.pos > 0 && d.queue.every((i) => i < lesson.steps.length) ? d : null
  }, [draftKey, lesson.steps.length])
  const [draft, setDraft] = useState<Draft>(() => saved ?? freshDraft(lesson))
  const [resumed, setResumed] = useState(!!saved)
  const [answer, setAnswer] = useState<{ qid: string | null; raw: RawAnswer }>({ qid: null, raw: null })
  const [checked, setChecked] = useState<null | { correct: boolean }>(null)
  const [phase, setPhase] = useState<Phase>({ kind: 'playing' })
  const [confirmExit, setConfirmExit] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const stepIndex = draft.queue[draft.pos]
  const step = stepIndex !== undefined ? lesson.steps[stepIndex] : undefined
  const question: Question | null = step?.kind === 'question' ? step.question : null

  // The answer always belongs to the current question; a new question starts from its own initial value.
  const raw: RawAnswer = question && answer.qid === question.id ? answer.raw : question ? initialRaw(question) : null
  const setRaw = (v: RawAnswer) => setAnswer({ qid: question?.id ?? null, raw: v })

  useEffect(() => {
    setChecked(null)
    contentRef.current?.focus({ preventScroll: true })
    window.scrollTo({ top: 0 })
  }, [draft.pos, question])

  useEffect(() => {
    if (phase.kind === 'playing' && draft.pos > 0) writeJSON(draftKey, { ...draft, savedAt: new Date().toISOString() })
  }, [draft, draftKey, phase.kind])

  const submit = useCallback(async (d: Draft) => {
    if (mode === 'guest' || !onSubmit) {
      removeKey(draftKey)
      setPhase({ kind: 'complete', result: null, offline: false })
      return
    }
    setPhase({ kind: 'submitting' })
    try {
      const result = await onSubmit(d.firstAnswers, d.attemptId)
      removeKey(draftKey)
      setPhase({ kind: 'complete', result, offline: false })
    } catch (e) {
      const err = e instanceof BackendError ? e : new BackendError('unknown', 'Unexpected error')
      if (err.code === 'network' || err.code === 'unavailable') {
        onQueueOffline?.(d.firstAnswers, d.attemptId)
        removeKey(draftKey)
        setPhase({ kind: 'complete', result: null, offline: true })
      } else {
        setPhase({ kind: 'error', message: err.message })
      }
    }
  }, [mode, onSubmit, onQueueOffline, draftKey])

  const advance = (requeue: boolean) => {
    const d = draft
    const queue = requeue ? [...d.queue, d.queue[d.pos]] : d.queue
    const done = requeue || d.done.includes(d.queue[d.pos]) ? d.done : [...d.done, d.queue[d.pos]]
    const next = { ...d, queue, done, pos: d.pos + 1 }
    setDraft(next)
    if (next.pos >= next.queue.length) void submit(next)
  }

  const check = () => {
    if (!question || !isAnswered(question, raw)) return
    const value = normalise(question, raw)
    const correct = gradeAnswer(question, value)
    setChecked({ correct })
    if (!(question.id in draft.firstAnswers) && value !== null) {
      setDraft((d) => ({ ...d, firstAnswers: { ...d.firstAnswers, [question.id]: value } }))
    }
  }

  const restart = () => {
    removeKey(draftKey)
    setAnswer({ qid: null, raw: null })
    setDraft(freshDraft(lesson))
    setResumed(false)
  }

  const progress = draft.done.length / lesson.steps.length
  const totalQuestions = lesson.steps.filter((s) => s.kind === 'question').length
  const firstCorrect = Object.entries(draft.firstAnswers).filter(([id, a]) => {
    const s = lesson.steps.find((x) => x.kind === 'question' && x.question.id === id)
    return s?.kind === 'question' && gradeAnswer(s.question, a)
  }).length

  if (phase.kind === 'complete' || phase.kind === 'submitting' || phase.kind === 'error') {
    const result = phase.kind === 'complete' ? phase.result : null
    const perfect = result ? result.perfect : firstCorrect === totalQuestions
    return (
      <div className="lesson-complete container reading">
        {phase.kind === 'complete' && (result?.xpAwarded ?? 0) > 0 && <Confetti />}
        <div className="center stack">
          <Mascot mood={phase.kind === 'error' ? 'oops' : 'cheer'} size={130} label="Vane the mascot celebrating" />
          <h1 className="mb-0">{phase.kind === 'error' ? 'We couldn’t save this lesson' : 'Lesson complete!'}</h1>
          <p className="muted">{lesson.title}</p>
        </div>
        <div className="lesson-complete__stats">
          <div className="stat-card"><span className="stat-card__value">{Math.round((firstCorrect / Math.max(1, totalQuestions)) * 100)}%</span><span className="stat-card__label">First-try accuracy</span></div>
          <div className="stat-card"><span className="stat-card__value">{firstCorrect}/{totalQuestions}</span><span className="stat-card__label">Right first time</span></div>
          <div className="stat-card"><span className="stat-card__value">{perfect ? <Icon name="star" label="Perfect" /> : <Icon name="check" label="Done" />}</span><span className="stat-card__label">{perfect ? 'Perfect lesson' : 'All questions solved'}</span></div>
        </div>
        {phase.kind === 'submitting' && <div className="center"><span className="spinner" /> <p className="muted">Saving your progress…</p></div>}
        {phase.kind === 'error' && (
          <Alert tone="danger" title="Your answers are safe on this device">
            <p>{phase.message}</p>
            <Button variant="primary" icon="refresh" onClick={() => void submit(draft)}>Try again</Button>
          </Alert>
        )}
        {phase.kind === 'complete' && phase.offline && (
          <Alert tone="warning" title="Saved offline">
            You seem to be offline, so this lesson is saved on this device. It will sync — and your XP will be added — as soon as you reconnect.
          </Alert>
        )}
        {result && <RewardPanel result={result} />}
        {mode === 'guest' && (
          <div className="card card--accent stack">
            <h2 className="mb-0">Save your progress</h2>
            <p className="muted">Guest lessons aren’t saved. Create a free account to earn XP, keep a streak, track mastery and work towards certificates.</p>
            <div className="cluster">
              <LinkButton to="/signup" variant="primary">Create free account</LinkButton>
              <LinkButton to="/curriculum" variant="secondary">Explore the curriculum</LinkButton>
            </div>
          </div>
        )}
        {phase.kind === 'complete' && mode === 'learner' && (
          <div className="cluster lesson-complete__actions">
            {nextHref && <LinkButton to={nextHref} variant="primary" size="lg" iconRight="arrowRight">{nextLabel}</LinkButton>}
            <LinkButton to={exitTo} variant={nextHref ? 'secondary' : 'primary'} size="lg">Back to path</LinkButton>
          </div>
        )}
      </div>
    )
  }

  if (!step) return null
  const isFirstView = !draft.done.includes(stepIndex) && draft.queue.indexOf(stepIndex) === draft.pos
  return (
    <div className="lesson">
      <header className="lesson__top">
        <button type="button" className="btn btn--ghost btn--icon" onClick={() => (draft.pos > 0 ? setConfirmExit(true) : navigate(exitTo))} aria-label="Exit lesson">
          <Icon name="x" />
        </button>
        <div className="lesson__progress">
          <ProgressBar value={progress} label={`Lesson progress`} tone="mint" valueText={`${draft.done.length} of ${lesson.steps.length} steps complete`} />
        </div>
        <span className="lesson__xp pill pill--sun" title={alreadyCompleted ? 'Replays build mastery; XP is awarded on first completion' : 'XP for completing this lesson for the first time'}><Icon name={alreadyCompleted ? 'refresh' : 'bolt'} size={16} />{mode === 'guest' ? 'Guest' : alreadyCompleted ? 'Review' : `${XP.lessonFirstCompletion} XP`}</span>
      </header>
      <div className="lesson__context container reading">
        <span className="subtle">{context}</span>
      </div>
      {resumed && (
        <div className="container reading">
          <Alert tone="info" title="Welcome back">
            We restored your place in this lesson. <button type="button" className="link-btn" onClick={restart}>Start over instead</button>
          </Alert>
        </div>
      )}
      <div className={`lesson__body container reading${checked ? ' has-feedback' : ''}`} ref={contentRef} tabIndex={-1} aria-live="polite">
        {question ? (
          <>
            {!isFirstView && <p className="pill pill--violet mb-0"><Icon name="refresh" size={14} />Try this one again</p>}
            <QuestionView question={question} value={raw} onChange={setRaw} reveal={!!checked} onSubmit={check} />
          </>
        ) : (
          <StepView step={step as Exclude<typeof step, { kind: 'question' }>} />
        )}
      </div>
      {!checked && (
        <footer className="lesson__footer">
          <div className="container reading lesson__footer-inner">
            {question ? (
              <Button variant="primary" size="lg" block onClick={check} disabled={!isAnswered(question, raw)}>Check</Button>
            ) : (
              <Button variant="primary" size="lg" block onClick={() => advance(false)} iconRight="arrowRight">Continue</Button>
            )}
          </div>
        </footer>
      )}
      {checked && question && <Feedback question={question} correct={checked.correct} retryLater={!checked.correct} onContinue={() => advance(!checked.correct)} />}
      <Dialog
        open={confirmExit}
        title="Leave this lesson?"
        onClose={() => setConfirmExit(false)}
        actions={
          <>
            <Button onClick={() => setConfirmExit(false)}>Keep learning</Button>
            <Button variant="danger" onClick={() => navigate(exitTo)}>Leave</Button>
          </>
        }
      >
        <p>Your place is saved on this device, so you can pick up where you left off.</p>
      </Dialog>
    </div>
  )
}

export function LessonNotFound() {
  return (
    <div className="container page center stack">
      <Mascot mood="think" size={110} />
      <h1>Lesson not found</h1>
      <p className="muted">This lesson may have moved. Head back to your learning path.</p>
      <div><Link to="/app/learn" className="btn btn--primary">Go to Learn</Link></div>
    </div>
  )
}
