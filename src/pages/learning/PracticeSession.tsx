import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getQuestion, allLessons, lessonQuestions } from '../../content'
import type { AnswerValue, Question } from '../../content/types'
import { BackendError, type RevisionResult } from '../../backend/types'
import { buildRevisionQueue } from '../../engine/mastery'
import { gradeAnswer } from '../../engine/grading'
import { Mascot } from '../../brand/Mascot'
import { Icon } from '../../components/Icon'
import { Dialog } from '../../components/Dialog'
import { Alert, Button, EmptyState, LinkButton, ProgressBar } from '../../components/ui'
import { QuestionView } from '../../learning/QuestionView'
import { Feedback } from '../../learning/Feedback'
import { RewardPanel } from '../../learning/RewardPanel'
import { initialRaw, isAnswered, normalise, type RawAnswer } from '../../learning/answers'
import { useApp } from '../../state/AppContext'
import { addPending } from '../../state/pending'
import { uuid } from '../../lib/storage'
import { useMeta } from '../../lib/useMeta'

export function PracticeSession() {
  const [params] = useSearchParams()
  return <PracticeView key={params.toString()} />
}

function PracticeView() {
  useMeta('Revision session', { noindex: true })
  const { backend, state, user, refresh } = useApp()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const focus = params.get('course') ?? params.get('concept')

  const questions = useMemo<Question[]>(() => {
    if (!state) return []
    const allowed = new Set(
      allLessons()
        .filter(({ lesson, course }) => state.lessons[lesson.id] && (!params.get('course') || course.id === params.get('course')))
        .flatMap(({ lesson }) => lessonQuestions(lesson).filter((q) => !params.get('concept') || q.concept === params.get('concept')).map((q) => q.id)),
    )
    return buildRevisionQueue(state.stats, state.today, 8, allowed).map((p) => getQuestion(p.questionId)?.question).filter((q): q is Question => !!q)
    // Build the queue once per session, not on every state refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.user.id, focus])

  const [attemptId] = useState(uuid)
  const [pos, setPos] = useState(0)
  const [raw, setRaw] = useState<RawAnswer>(() => (questions[0] ? initialRaw(questions[0]) : null))
  const [checked, setChecked] = useState<boolean | null>(null)
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({})
  const [phase, setPhase] = useState<'playing' | 'submitting' | 'done' | 'offline' | 'error'>('playing')
  const [result, setResult] = useState<RevisionResult | null>(null)
  const [error, setError] = useState('')
  const [confirmExit, setConfirmExit] = useState(false)

  if (!questions.length) {
    return (
      <div className="container page">
        <EmptyState title="Nothing to revise yet" mood="happy" action={<LinkButton to="/app/learn" variant="primary">Go to Learn</LinkButton>}>
          Complete a few lessons first. Questions you find tricky will appear here for spaced revision.
        </EmptyState>
      </div>
    )
  }

  const q = questions[pos]
  const finish = async (all: Record<string, AnswerValue>) => {
    setPhase('submitting')
    try {
      const r = await backend!.submitRevision(all, attemptId)
      setResult(r)
      setPhase('done')
      void refresh()
    } catch (e) {
      const err = e instanceof BackendError ? e : new BackendError('unknown', 'Unexpected error')
      if ((err.code === 'network' || err.code === 'unavailable') && user) {
        addPending(user.id, { kind: 'revision', targetId: 'revision', answers: all, attemptId, createdAt: new Date().toISOString() })
        setPhase('offline')
      } else {
        setError(err.message)
        setPhase('error')
      }
    }
  }
  const check = () => {
    if (!isAnswered(q, raw)) return
    const v = normalise(q, raw)!
    setAnswers((a) => ({ ...a, [q.id]: v }))
    setChecked(gradeAnswer(q, v))
  }
  const next = () => {
    const all = answers
    if (pos + 1 >= questions.length) {
      void finish(all)
      return
    }
    setPos(pos + 1)
    setRaw(initialRaw(questions[pos + 1]))
    setChecked(null)
  }

  if (phase !== 'playing') {
    const correct = Object.entries(answers).filter(([id, a]) => gradeAnswer(getQuestion(id)!.question, a)).length
    return (
      <div className="lesson-complete container reading">
        <div className="center stack">
          <Mascot mood={phase === 'error' ? 'oops' : 'cheer'} size={120} />
          <h1 className="mb-0">Revision complete</h1>
          <p className="muted">{correct} of {questions.length} correct. Correct answers move questions to longer review intervals; misses come back sooner.</p>
        </div>
        {phase === 'submitting' && <div className="center"><span className="spinner" /></div>}
        {phase === 'offline' && <Alert tone="warning" title="Saved offline">This session will sync and update your mastery when you reconnect.</Alert>}
        {phase === 'error' && <Alert tone="danger" title="We couldn’t save this session">{error} <Button variant="primary" onClick={() => void finish(answers)}>Try again</Button></Alert>}
        {result && <RewardPanel result={result} />}
        <div className="cluster lesson-complete__actions">
          <LinkButton to="/app/practice" variant="primary" size="lg">Back to Practice</LinkButton>
        </div>
      </div>
    )
  }

  return (
    <div className="lesson">
      <header className="lesson__top">
        <button type="button" className="btn btn--ghost btn--icon" onClick={() => setConfirmExit(true)} aria-label="Exit revision"><Icon name="x" /></button>
        <div className="lesson__progress"><ProgressBar value={(pos + (checked !== null ? 1 : 0)) / questions.length} label="Revision progress" tone="sky" valueText={`Question ${pos + 1} of ${questions.length}`} /></div>
        <span className="pill pill--sky"><Icon name="refresh" size={14} />Revision</span>
      </header>
      <div className="lesson__body container reading" key={q.id}>
        <QuestionView question={q} value={raw} onChange={setRaw} reveal={checked !== null} onSubmit={check} />
      </div>
      {checked === null ? (
        <footer className="lesson__footer">
          <div className="container reading lesson__footer-inner">
            <Button variant="primary" size="lg" block onClick={check} disabled={!isAnswered(q, raw)}>Check</Button>
          </div>
        </footer>
      ) : (
        <Feedback question={q} correct={checked} retryLater={false} onContinue={next} />
      )}
      <Dialog open={confirmExit} title="End this revision session?" onClose={() => setConfirmExit(false)} actions={<><Button onClick={() => setConfirmExit(false)}>Keep going</Button><Button variant="danger" onClick={() => navigate('/app/practice')}>End session</Button></>}>
        <p>Answers from an unfinished session aren’t saved.</p>
      </Dialog>
    </div>
  )
}
