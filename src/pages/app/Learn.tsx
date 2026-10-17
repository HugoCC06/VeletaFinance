import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { COURSES, getCourse, lessonQuestions } from '../../content'
import type { Course, Lesson, Unit } from '../../content/types'
import { checkpointState, courseProgress, examState, lessonState, nextStep, type NodeState } from '../../engine/progression'
import { daysBetween } from '../../engine/dates'
import { masteryFor, masteryLabel } from '../../engine/mastery'
import { XP } from '../../engine/rewards'
import { Icon, type IconName } from '../../components/Icon'
import { EmptyState, LinkButton, ProgressBar } from '../../components/ui'
import { Mascot } from '../../brand/Mascot'
import { useApp } from '../../state/AppContext'
import { courseMastery, currentCourse, snapshotFromState, statMap } from '../../state/selectors'
import { useMeta } from '../../lib/useMeta'
import { formatPercent } from '../../lib/format'

interface NodeProps {
  id: string
  index: number
  state: NodeState
  isNext: boolean
  icon: IconName
  title: string
  kindLabel: string
  detail: string
  href: string
  action: string
  review?: number
  open: boolean
  onToggle: () => void
  offset: number
  variant?: 'lesson' | 'checkpoint' | 'exam'
}

function PathNode({ id, state, isNext, icon, title, kindLabel, detail, href, action, review, open, onToggle, offset, variant = 'lesson' }: NodeProps) {
  const statusText = state === 'completed' ? 'completed' : state === 'locked' ? 'locked' : isNext ? 'up next' : 'available'
  return (
    <li className="path-node" style={{ ['--offset' as string]: `${offset}px` }}>
      <button
        type="button"
        className={`path-node__btn is-${state}${isNext ? ' is-next' : ''} path-node__btn--${variant}`}
        aria-expanded={open}
        aria-controls={`pop-${id}`}
        onClick={onToggle}
        aria-label={`${kindLabel}: ${title} — ${statusText}${review ? `, ${review} questions due for review` : ''}`}
      >
        <Icon name={state === 'completed' ? 'check' : state === 'locked' && variant === 'lesson' ? 'lock' : icon} size={30} strokeWidth={2.6} />
        {isNext && <span className="path-node__start" aria-hidden="true">Start</span>}
        {review ? <span className="path-node__review" aria-hidden="true"><Icon name="refresh" size={12} />{review}</span> : null}
      </button>
      {variant !== 'lesson' && <span className="path-node__caption" aria-hidden="true">{variant === 'exam' ? 'Final exam' : 'Checkpoint'}</span>}
      {open && (
        <div className="path-pop card" id={`pop-${id}`} role="region" aria-label={title}>
          <span className="eyebrow">{kindLabel}</span>
          <h3 className="mb-0">{title}</h3>
          <p className="small muted">{detail}</p>
          {state === 'locked' ? (
            <p className="small bold mb-0"><Icon name="lock" size={14} /> Complete the previous step to unlock.</p>
          ) : (
            <LinkButton to={href} variant={state === 'completed' ? 'secondary' : 'primary'} block>{action}</LinkButton>
          )}
        </div>
      )}
    </li>
  )
}

type HubFilter = 'all' | 'progress' | 'new' | 'done'
const HUB_FILTERS: { id: HubFilter; label: string }[] = [
  { id: 'all', label: 'All paths' },
  { id: 'progress', label: 'In progress' },
  { id: 'new', label: 'Not started' },
  { id: 'done', label: 'Completed' },
]

function nextLabel(course: Course, step: ReturnType<typeof nextStep>) {
  if (step.type === 'lesson') return { text: step.lesson.title, href: `/app/lesson/${step.lesson.id}`, kind: 'Next lesson' }
  if (step.type === 'checkpoint') return { text: step.unit.checkpoint.title, href: `/app/assessment/${step.unit.checkpoint.id}`, kind: 'Unit checkpoint' }
  if (step.type === 'exam') return { text: 'Final exam', href: `/app/assessment/${course.exam.id}`, kind: 'Ready for' }
  return { text: 'Path complete', href: `/app/learn/${course.id}`, kind: 'Finished' }
}

/** /app/learn: every learning path as a card, with the current one featured. */
function LearnHub() {
  const { state } = useApp()
  const [filter, setFilter] = useState<HubFilter>('all')
  useMeta('Learn', { noindex: true })
  if (!state) return null
  const snap = snapshotFromState(state)
  const current = currentCourse(state)
  const cur = courseProgress(current, snap)
  const curNext = nextLabel(current, nextStep(current, snap))
  const lessonCount = (c: Course) => c.units.reduce((t, u) => t + u.lessons.length, 0)
  const rows = COURSES.map((c, i) => ({ c, i, p: courseProgress(c, snap), m: courseMastery(state, c.id) }))
  const shown = rows.filter(({ p }) => filter === 'all' || (filter === 'done' ? p.complete : filter === 'new' ? p.fraction === 0 : p.fraction > 0 && !p.complete))
  const doneCount = rows.filter((r) => r.p.complete).length

  return (
    <div className="container page learn-hub">
      <header className="page-header">
        <span className="eyebrow">Learn</span>
        <h1 className="mb-0">Your learning paths</h1>
        <p className="muted">{COURSES.length} paths, all open. Keep going where you left off or jump into something new. Progress in every path is saved.</p>
      </header>

      <section className={`hub-current hub-current--${current.colour}`} aria-labelledby="hub-current-t">
        <div className="hub-current__art" aria-hidden="true"><Icon name={current.icon} size={88} /></div>
        <div className="hub-current__body">
          <span className="hub-current__tag"><Icon name="flag" size={14} /> You are on this path</span>
          <h2 id="hub-current-t" className="mb-0">{current.title}</h2>
          <p className="mb-0">{current.tagline}</p>
          <div className="hub-current__progress">
            <div className="hub-current__bar" role="progressbar" aria-label={`${current.title} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(cur.fraction * 100)}>
              <span style={{ width: `${Math.round(cur.fraction * 100)}%` }} />
            </div>
            <span className="small bold">{Math.round(cur.fraction * 100)}% · {cur.lessonsDone}/{cur.lessonsTotal} lessons</span>
          </div>
          <p className="small mb-0"><span className="hub-current__kind">{curNext.kind}:</span> {curNext.text}</p>
          <div className="hub-current__actions">
            <Link to={curNext.href} className="btn hub-current__go">{cur.fraction > 0 ? 'Continue' : 'Start'} <Icon name="arrowRight" size={18} /></Link>
            <Link to={`/app/learn/${current.id}`} className="btn hub-current__map"><Icon name="map" size={18} /> View path map</Link>
          </div>
        </div>
      </section>

      <div className="hub-toolbar">
        <h2 className="mb-0">All paths <span className="muted small">· {doneCount}/{COURSES.length} completed</span></h2>
        <div className="tabs" role="group" aria-label="Filter learning paths">
          {HUB_FILTERS.map((f) => (
            <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <EmptyState title="No paths here yet" mood="think">Try another filter.</EmptyState>
      ) : (
        <ul className="hub-grid">
          {shown.map(({ c, i, p, m }) => {
            const isCurrent = c.id === current.id
            const status = p.complete ? 'Completed' : p.fraction > 0 ? 'In progress' : 'Not started'
            const pct = Math.round(p.fraction * 100)
            return (
              <li key={c.id}>
                <Link to={`/app/learn/${c.id}`} className={`hub-card hub-card--${c.colour}${isCurrent ? ' is-current' : ''}`} aria-current={isCurrent ? 'true' : undefined}>
                  <div className="hub-card__top">
                    <span className="hub-card__icon" aria-hidden="true"><Icon name={c.icon} size={34} /></span>
                    <span className="hub-card__ring" style={{ ['--pct' as string]: `${pct}` }} aria-hidden="true"><span>{p.complete ? <Icon name="check" size={18} /> : `${pct}%`}</span></span>
                  </div>
                  <span className="hub-card__num">Path {i + 1}{c.id === state.prefs.recommendedCourse ? ' · Recommended' : ''}</span>
                  <h3 className="hub-card__title">{c.title}</h3>
                  <p className="hub-card__tag">{c.tagline}</p>
                  <div className="hub-card__meta">
                    <span><Icon name="stack" size={14} /> {c.units.length} units</span>
                    <span><Icon name="book" size={14} /> {lessonCount(c)} lessons</span>
                    {p.fraction > 0 && <span title="Mastery from spaced revision"><Icon name="brain" size={14} /> {m}% {masteryLabel(m).toLowerCase()}</span>}
                  </div>
                  <div className="hub-card__foot">
                    <span className={`pill ${p.complete ? 'pill--mint' : p.fraction > 0 ? 'pill--violet' : ''}`}>{status}</span>
                    {isCurrent ? <span className="hub-card__here"><Icon name="flag" size={14} /> You're here</span> : <span className="hub-card__open">{p.fraction > 0 ? 'Resume' : 'Explore'} <Icon name="arrowRight" size={14} /></span>}
                  </div>
                  <span className="sr-only">{status}, {pct}% complete{isCurrent ? ', current path' : ''}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export function Learn() {
  const { courseId } = useParams()
  if (!courseId) return <LearnHub />
  return <CoursePath courseId={courseId} />
}

function CoursePath({ courseId }: { courseId: string }) {
  const { state } = useApp()
  const [open, setOpen] = useState<string | null>(null)
  const course = getCourse(courseId)
  useMeta(course ? `Learn: ${course.title}` : 'Learn', { noindex: true })
  if (!state) return null
  if (!course) return <div className="container page"><EmptyState title="Course not found" action={<LinkButton to="/app/courses" variant="primary">All courses</LinkButton>} /></div>
  const snap = snapshotFromState(state)
  const stats = statMap(state)
  const next = nextStep(course, snap)
  const prog = courseProgress(course, snap)
  const cert = state.certificates.find((c) => c.courseId === course.id && !c.revoked)
  const dueIn = (l: Lesson) => (state.lessons[l.id] ? lessonQuestions(l).filter((q) => { const s = stats.get(q.id); return s && daysBetween(s.dueDay, state.today) >= 0 }).length : 0)
  const offsets = [0, 52, 78, 52, 0, -52, -78, -52]
  let n = 0
  const toggle = (id: string) => setOpen((o) => (o === id ? null : id))

  const unitBlock = (u: Unit, ui: number) => {
    const qids = u.lessons.flatMap((l) => lessonQuestions(l).map((q) => q.id))
    const mastery = masteryFor(qids, stats)
    const done = u.lessons.filter((l) => state.lessons[l.id]).length
    const cpState = checkpointState(u, snap)
    const cpRecord = state.assessments[u.checkpoint.id]
    return (
      <section key={u.id} className="path-unit" aria-labelledby={`${u.id}-t`}>
        <header className={`path-unit__banner path-unit__banner--${course.colour}`}>
          <div>
            <span className="path-unit__eyebrow">Unit {ui + 1}</span>
            <h2 id={`${u.id}-t`} className="mb-0">{u.title}</h2>
            <p className="mb-0 small">{u.description}</p>
          </div>
          <div className="path-unit__stats">
            <span>{done}/{u.lessons.length} lessons</span>
            <span title="Mastery is based on spaced revision results">Mastery {mastery}% · {masteryLabel(mastery)}</span>
          </div>
        </header>
        <ol className="path" aria-label={`Unit ${ui + 1} lessons`}>
          {u.lessons.map((l) => {
            const st = lessonState(course, l.id, snap)
            const rec = state.lessons[l.id]
            const off = offsets[n++ % offsets.length]
            return (
              <PathNode
                key={l.id}
                id={l.id}
                index={n}
                state={st}
                isNext={next.type === 'lesson' && next.lesson.id === l.id}
                icon="book"
                title={l.title}
                kindLabel="Lesson"
                detail={`${l.description} · ${l.minutes} min${rec ? ` · best accuracy ${formatPercent(rec.bestAccuracy, 0)}` : ` · ${XP.lessonFirstCompletion} XP`}`}
                href={`/app/lesson/${l.id}`}
                action={st === 'completed' ? 'Review lesson' : 'Start lesson'}
                review={dueIn(l)}
                open={open === l.id}
                onToggle={() => toggle(l.id)}
                offset={off}
              />
            )
          })}
          <PathNode
            id={u.checkpoint.id}
            index={n}
            state={cpState}
            isNext={next.type === 'checkpoint' && next.unit.id === u.id}
            icon="flag"
            variant="checkpoint"
            title={u.checkpoint.title}
            kindLabel="Unit checkpoint"
            detail={`${u.checkpoint.questions.length} questions · pass ${Math.round(u.checkpoint.passMark * 100)}%${cpRecord ? ` · best ${formatPercent(cpRecord.bestScore, 0)} in ${cpRecord.attempts} attempt${cpRecord.attempts === 1 ? '' : 's'}` : ` · ${XP.checkpointPass} XP`}`}
            href={`/app/assessment/${u.checkpoint.id}`}
            action={cpState === 'completed' ? 'Retake checkpoint' : 'Take checkpoint'}
            open={open === u.checkpoint.id}
            onToggle={() => toggle(u.checkpoint.id)}
            offset={offsets[n++ % offsets.length]}
          />
        </ol>
      </section>
    )
  }

  const exState = examState(course, snap)
  const exRecord = state.assessments[course.exam.id]
  return (
    <div className="container page learn">
      <Link to="/app/learn" className="learn__back"><Icon name="chevronLeft" size={16} /> All learning paths</Link>
      <header className="learn__head">
        <div>
          <span className="eyebrow">Learning path {COURSES.findIndex((c) => c.id === course.id) + 1} of {COURSES.length}{course.id === currentCourse(state).id ? ' · You are here' : ''}</span>
          <h1 className="mb-0">{course.title}</h1>
          <p className="muted mb-0">{course.tagline}</p>
        </div>
        <div className="learn__progress">
          <ProgressBar value={prog.fraction} label={`${course.title} progress`} tone="mint" valueText={`${Math.round(prog.fraction * 100)}% complete`} />
          <span className="small muted">{prog.lessonsDone}/{prog.lessonsTotal} lessons · {prog.checkpointsPassed}/{prog.checkpointsTotal} checkpoints · exam {prog.examPassed ? 'passed' : 'not passed'}</span>
        </div>
      </header>
      <div className="path-legend small muted" aria-hidden="true">
        <span><i className="dot dot--done" />Completed</span><span><i className="dot dot--next" />Up next</span><span><i className="dot dot--locked" />Locked</span><span><Icon name="refresh" size={12} /> Due for review</span>
      </div>
      {course.units.map(unitBlock)}
      <section className="path-unit" aria-label="Final exam">
        <ol className="path">
          <PathNode
            id={course.exam.id}
            index={n}
            state={exState}
            isNext={next.type === 'exam'}
            icon="trophy"
            variant="exam"
            title="Final exam"
            kindLabel="Course assessment"
            detail={`${course.exam.questions.length} questions · pass ${Math.round(course.passMark * 100)}% · earns your certificate${exRecord ? ` · best ${formatPercent(exRecord.bestScore, 0)}` : ` · ${XP.examPass} XP`}`}
            href={`/app/assessment/${course.exam.id}`}
            action={exState === 'completed' ? 'Retake exam' : 'Take final exam'}
            open={open === course.exam.id}
            onToggle={() => toggle(course.exam.id)}
            offset={0}
          />
        </ol>
        {cert ? (
          <div className="card card--accent center stack-sm mt-4">
            <Mascot mood="cheer" size={80} />
            <h2 className="mb-0">Course complete!</h2>
            <LinkButton to={`/app/certificates/${cert.id}`} variant="primary" icon="graduation">View your certificate</LinkButton>
          </div>
        ) : (
          <p className="center small muted mt-4">Complete every lesson, pass each checkpoint and score {Math.round(course.passMark * 100)}% in the final exam to earn your certificate.</p>
        )}
      </section>
    </div>
  )
}
