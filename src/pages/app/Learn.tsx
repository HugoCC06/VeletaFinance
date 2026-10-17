import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { COURSES, getCourse, lessonQuestions } from '../../content'
import type { Lesson, Unit } from '../../content/types'
import { checkpointState, courseProgress, examState, lessonState, nextStep, type NodeState } from '../../engine/progression'
import { daysBetween } from '../../engine/dates'
import { masteryFor, masteryLabel } from '../../engine/mastery'
import { XP } from '../../engine/rewards'
import { Icon, type IconName } from '../../components/Icon'
import { EmptyState, LinkButton, ProgressBar } from '../../components/ui'
import { Mascot } from '../../brand/Mascot'
import { useApp } from '../../state/AppContext'
import { currentCourse, snapshotFromState, statMap } from '../../state/selectors'
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

export function Learn() {
  const { courseId } = useParams()
  const { state } = useApp()
  const [open, setOpen] = useState<string | null>(null)
  const course = courseId ? getCourse(courseId) : currentCourse(state)
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
      <nav className="course-switcher" aria-label="Choose course">
        {COURSES.map((c) => (
          <Link key={c.id} to={`/app/learn/${c.id}`} className={`course-switcher__item${c.id === course.id ? ' is-active' : ''}`} aria-current={c.id === course.id ? 'page' : undefined}>
            <Icon name={c.icon} size={18} />
            <span>{c.title}</span>
          </Link>
        ))}
      </nav>
      <header className="learn__head">
        <div>
          <span className="eyebrow">Learning path</span>
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
