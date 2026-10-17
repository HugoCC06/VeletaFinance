import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getAssessment, lessonForConcept, conceptLabel } from '../../content'
import type { AnswerValue } from '../../content/types'
import { BackendError, type AssessmentResult } from '../../backend/types'
import { isAssessmentUnlocked } from '../../engine/progression'
import { Mascot } from '../../brand/Mascot'
import { Icon } from '../../components/Icon'
import { Dialog } from '../../components/Dialog'
import { Confetti } from '../../components/Confetti'
import { Alert, Button, EmptyState, LinkButton, ProgressBar } from '../../components/ui'
import { QuestionView } from '../../learning/QuestionView'
import { RewardPanel } from '../../learning/RewardPanel'
import { describeCorrect, describeGiven, initialRaw, isAnswered, normalise, type RawAnswer } from '../../learning/answers'
import { useApp } from '../../state/AppContext'
import { addPending } from '../../state/pending'
import { snapshotFromState } from '../../state/selectors'
import { readJSON, removeKey, uuid, writeJSON } from '../../lib/storage'
import { useMeta } from '../../lib/useMeta'
import { formatPercent } from '../../lib/format'

type Phase = 'intro' | 'answering' | 'review' | 'submitting' | 'result' | 'offline' | 'error'

export function AssessmentPage() {
  const { assessmentId = '' } = useParams()
  const ref = getAssessment(assessmentId)
  const { backend, state, user, refresh } = useApp()
  const navigate = useNavigate()
  useMeta(ref ? ref.assessment.title : 'Assessment', { noindex: true })
  const draftKey = `veleta.assess.${user?.id}.${assessmentId}`
  const questions = ref?.assessment.questions ?? []
  const saved = useMemo(() => readJSON<{ raw: RawAnswer[]; attemptId: string } | null>(draftKey, null), [draftKey])
  const [raw, setRaw] = useState<RawAnswer[]>(() => (saved && saved.raw.length === questions.length ? saved.raw : questions.map(initialRaw)))
  const [attemptId, setAttemptId] = useState(() => saved?.attemptId ?? uuid())
  const [pos, setPos] = useState(0)
  const [phase, setPhase] = useState<Phase>('intro')
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [error, setError] = useState('')
  const [confirmExit, setConfirmExit] = useState(false)
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, AnswerValue>>({})

  useEffect(() => {
    if (phase === 'answering' || phase === 'review') writeJSON(draftKey, { raw, attemptId })
  }, [raw, attemptId, phase, draftKey])

  if (!ref) return <div className="container page"><EmptyState title="Assessment not found" action={<LinkButton to="/app/learn" variant="primary">Back to Learn</LinkButton>} /></div>
  const { course, unit, assessment } = ref
  const exitTo = `/app/learn/${course.id}`
  const record = state?.assessments[assessment.id]
  const unlocked = isAssessmentUnlocked(course, assessment.id, snapshotFromState(state))

  if (!unlocked) {
    return (
      <div className="container page">
        <EmptyState title={`${assessment.kind === 'exam' ? 'Final exam' : 'Checkpoint'} locked`} action={<LinkButton to={exitTo} variant="primary">Back to the path</LinkButton>}>
          {assessment.kind === 'exam' ? 'Pass every unit checkpoint in this course to unlock the final exam.' : 'Finish every lesson in this unit to unlock its checkpoint.'}
        </EmptyState>
      </div>
    )
  }

  const answered = raw.filter((r, i) => isAnswered(questions[i], r)).length
  const submit = async () => {
    const answers: Record<string, AnswerValue> = {}
    questions.forEach((q, i) => {
      const v = normalise(q, raw[i])
      if (v !== null) answers[q.id] = v
    })
    setSubmittedAnswers(answers)
    setPhase('submitting')
    try {
      const r = await backend!.submitAssessment(assessment.id, answers, attemptId)
      removeKey(draftKey)
      setResult(r)
      setPhase('result')
      void refresh()
    } catch (e) {
      const err = e instanceof BackendError ? e : new BackendError('unknown', 'Unexpected error')
      if ((err.code === 'network' || err.code === 'unavailable') && user) {
        addPending(user.id, { kind: 'assessment', targetId: assessment.id, answers, attemptId, createdAt: new Date().toISOString() })
        removeKey(draftKey)
        setPhase('offline')
      } else {
        setError(err.message)
        setPhase('error')
      }
    }
  }
  const retake = () => {
    setRaw(questions.map(initialRaw))
    setAttemptId(uuid())
    setPos(0)
    setResult(null)
    setPhase('answering')
  }

  if (phase === 'intro') {
    return (
      <div className="lesson-complete container reading">
        <div className="center stack">
          <Mascot mood={assessment.kind === 'exam' ? 'think' : 'happy'} size={120} />
          <span className="eyebrow">{course.title}{unit ? ` · ${unit.title}` : ''}</span>
          <h1 className="mb-0">{assessment.kind === 'exam' ? 'Final exam' : assessment.title}</h1>
          <p className="muted">{assessment.description}</p>
        </div>
        <ul className="info-list">
          <li><Icon name="doc" />{questions.length} questions</li>
          <li><Icon name="target" />Pass mark {Math.round(assessment.passMark * 100)}% ({Math.ceil(assessment.passMark * questions.length - 1e-9)} correct)</li>
          <li><Icon name="refresh" />You can retake it as many times as you like</li>
          <li><Icon name="info" />{assessment.kind === 'exam' ? 'No feedback until you submit. Afterwards you’ll see which topics to revise.' : 'You’ll see a full review of every answer after you submit.'}</li>
          {assessment.kind === 'exam' && <li><Icon name="graduation" />Passing completes the course and issues your Veleta certificate.</li>}
        </ul>
        {record && <Alert tone="info">Previous attempts: {record.attempts}. Best score {formatPercent(record.bestScore, 0)}{record.passed ? ' — passed.' : '.'}</Alert>}
        {saved && <Alert tone="info">Your unfinished answers from last time have been restored.</Alert>}
        <div className="cluster" style={{ justifyContent: 'center' }}>
          <LinkButton to={exitTo}>Not yet</LinkButton>
          <Button variant="primary" size="lg" onClick={() => setPhase('answering')}>{saved ? 'Continue' : 'Start'}</Button>
        </div>
      </div>
    )
  }

  if (phase === 'answering') {
    const q = questions[pos]
    return (
      <div className="lesson">
        <header className="lesson__top">
          <button type="button" className="btn btn--ghost btn--icon" onClick={() => setConfirmExit(true)} aria-label="Exit assessment"><Icon name="x" /></button>
          <div className="lesson__progress"><ProgressBar value={(pos + 1) / questions.length} label="Assessment progress" valueText={`Question ${pos + 1} of ${questions.length}`} /></div>
          <span className="pill pill--violet">{pos + 1}/{questions.length}</span>
        </header>
        <div className="lesson__body container reading" key={q.id}>
          <QuestionView question={q} value={raw[pos]} onChange={(v) => setRaw((r) => r.map((x, i) => (i === pos ? v : x)))} />
        </div>
        <footer className="lesson__footer">
          <div className="container reading lesson__footer-inner cluster" style={{ flexWrap: 'nowrap' }}>
            <Button onClick={() => setPos((p) => p - 1)} disabled={pos === 0} icon="arrowLeft">Back</Button>
            {pos < questions.length - 1 ? (
              <Button variant="primary" block onClick={() => setPos((p) => p + 1)} iconRight="arrowRight">{isAnswered(q, raw[pos]) ? 'Next' : 'Skip for now'}</Button>
            ) : (
              <Button variant="primary" block onClick={() => setPhase('review')}>Review answers</Button>
            )}
          </div>
        </footer>
        <Dialog open={confirmExit} title="Leave the assessment?" onClose={() => setConfirmExit(false)} actions={<><Button onClick={() => setConfirmExit(false)}>Keep going</Button><Button variant="danger" onClick={() => navigate(exitTo)}>Leave</Button></>}>
          <p>Your answers so far are saved on this device. Nothing is submitted until you choose Submit.</p>
        </Dialog>
      </div>
    )
  }

  if (phase === 'review' || phase === 'submitting') {
    return (
      <div className="container reading page stack">
        <h1>Review your answers</h1>
        <p className="muted">{answered} of {questions.length} answered. Unanswered questions count as incorrect.</p>
        <ol className="review-list">
          {questions.map((q, i) => (
            <li key={q.id}>
              <button type="button" className="review-list__item" onClick={() => { setPos(i); setPhase('answering') }}>
                <span className="review-list__num">{i + 1}</span>
                <span className="review-list__text">{q.prompt}</span>
                {isAnswered(q, raw[i]) ? <span className="pill pill--mint"><Icon name="check" size={14} />Answered</span> : <span className="pill pill--coral">Unanswered</span>}
              </button>
            </li>
          ))}
        </ol>
        <div className="cluster">
          <Button onClick={() => { setPos(0); setPhase('answering') }} icon="arrowLeft">Edit answers</Button>
          <Button variant="primary" size="lg" onClick={submit} loading={phase === 'submitting'} disabled={answered === 0}>Submit {assessment.kind === 'exam' ? 'exam' : 'checkpoint'}</Button>
        </div>
      </div>
    )
  }

  if (phase === 'offline' || phase === 'error') {
    return (
      <div className="container reading page stack">
        <Mascot mood="oops" size={100} />
        {phase === 'offline' ? (
          <Alert tone="warning" title="Saved offline">Your answers are saved on this device and will be submitted and marked automatically when you reconnect.</Alert>
        ) : (
          <Alert tone="danger" title="We couldn’t submit your answers">{error}</Alert>
        )}
        <div className="cluster">
          {phase === 'error' && <Button variant="primary" icon="refresh" onClick={submit}>Try again</Button>}
          <LinkButton to={exitTo}>Back to the path</LinkButton>
        </div>
      </div>
    )
  }

  // result
  const r = result!
  const needed = Math.ceil(r.passMark * r.total - 1e-9)
  return (
    <div className="lesson-complete container reading">
      {r.passed && <Confetti pieces={r.courseCompleted ? 90 : 50} />}
      <div className="center stack">
        <Mascot mood={r.passed ? 'cheer' : 'oops'} size={120} />
        <h1 className="mb-0">{r.passed ? (r.courseCompleted ? 'Course complete!' : 'Passed!') : 'Not passed yet'}</h1>
        <p className="muted">{assessment.title}</p>
      </div>
      <div className="score-dial" role="img" aria-label={`Score ${formatPercent(r.score, 0)}, pass mark ${Math.round(r.passMark * 100)}%`}>
        <span className="score-dial__value">{formatPercent(r.score, 0)}</span>
        <span className="score-dial__label">{r.correct} of {r.total} correct · pass mark {Math.round(r.passMark * 100)}% ({needed} correct)</span>
      </div>
      {r.courseCompleted && r.certificateId && (
        <div className="card card--accent stack">
          <div className="cluster"><Icon name="graduation" size={28} /><h2 className="mb-0">Your certificate is ready</h2></div>
          <p className="muted mb-0">Certificate ID <strong>{r.certificateId}</strong>. You can download it as a PDF and share its verification link.</p>
          <div><LinkButton to={`/app/certificates/${r.certificateId}`} variant="primary" icon="download">View certificate</LinkButton></div>
        </div>
      )}
      <RewardPanel result={r} />
      {!r.passed && r.missedConcepts.length > 0 && (
        <div className="card stack">
          <h2 className="mb-0">What to revise</h2>
          <p className="muted mb-0">These topics had incorrect answers. Revisit the lessons, then try again.</p>
          <ul className="revise-list">
            {r.missedConcepts.map((c) => {
              const l = lessonForConcept(c)
              return <li key={c}>{l ? <Link to={`/app/lesson/${l.id}`}>{conceptLabel(c)}</Link> : conceptLabel(c)}</li>
            })}
          </ul>
        </div>
      )}
      {r.results && (
        <div className="stack">
          <h2>Answer review</h2>
          {questions.map((q, i) => {
            const ok = r.results![q.id]
            return (
              <div key={q.id} className={`review-card ${ok ? 'is-correct' : 'is-wrong'}`}>
                <div className="review-card__head"><span className="review-card__icon"><Icon name={ok ? 'check' : 'x'} size={18} strokeWidth={3} /></span><strong>{i + 1}. {q.prompt}</strong></div>
                <p className="small mb-0"><span className="bold">Your answer:</span> {describeGiven(q, submittedAnswers[q.id])} {ok ? '(correct)' : '(incorrect)'}</p>
                {!ok && <p className="small mb-0"><span className="bold">Correct answer:</span> {describeCorrect(q)}</p>}
                <p className="small muted mb-0">{q.explanation}</p>
              </div>
            )
          })}
        </div>
      )}
      <div className="cluster lesson-complete__actions">
        {!r.passed && <Button variant="primary" size="lg" icon="refresh" onClick={retake}>Retake</Button>}
        <LinkButton to={exitTo} variant={r.passed ? 'primary' : 'secondary'} size="lg">Back to the path</LinkButton>
      </div>
    </div>
  )
}
