import { Link } from 'react-router-dom'
import { COURSES } from '../../content'
import { courseProgress } from '../../engine/progression'
import { masteryLabel } from '../../engine/mastery'
import { Icon } from '../../components/Icon'
import { ProgressBar } from '../../components/ui'
import { useApp } from '../../state/AppContext'
import { courseMastery, snapshotFromState } from '../../state/selectors'
import { useMeta } from '../../lib/useMeta'

export function Courses() {
  useMeta('Courses', { noindex: true })
  const { state } = useApp()
  if (!state) return null
  const snap = snapshotFromState(state)
  return (
    <div className="container page">
      <header className="page-header">
        <h1>Courses</h1>
        <p>All eight courses are open. Progress counts every lesson, checkpoint and final exam; mastery reflects how well you retain each course’s material over time.</p>
      </header>
      <div className="grid-2">
        {COURSES.map((c, i) => {
          const p = courseProgress(c, snap)
          const m = courseMastery(state, c.id)
          const cert = state.certificates.find((x) => x.courseId === c.id && !x.revoked)
          const status = p.complete ? 'Completed' : p.fraction > 0 ? 'In progress' : 'Not started'
          return (
            <Link key={c.id} to={`/app/learn/${c.id}`} className="card card--interactive stack-sm">
              <div className="spread">
                <span className={`icon-chip icon-chip--${c.colour}`}><Icon name={c.icon} /></span>
                <span className={`pill ${p.complete ? 'pill--mint' : p.fraction > 0 ? 'pill--violet' : ''}`}>{p.complete && <Icon name="check" size={14} />}{status}</span>
              </div>
              <span className="subtle">Course {i + 1}{c.id === state.prefs.recommendedCourse ? ' · Recommended for you' : ''}</span>
              <h2 className="mb-0" style={{ fontSize: 'var(--text-lg)' }}>{c.title}</h2>
              <p className="small muted mb-0">{c.tagline}</p>
              <ProgressBar value={p.fraction} label={`${c.title} progress`} tone="mint" valueText={`${Math.round(p.fraction * 100)}% complete`} />
              <div className="spread tiny muted">
                <span>{p.lessonsDone}/{p.lessonsTotal} lessons · {p.checkpointsPassed}/{p.checkpointsTotal} checkpoints</span>
                <span>Mastery {m}% ({masteryLabel(m)})</span>
              </div>
              {cert && <span className="pill pill--sun"><Icon name="graduation" size={14} />Certificate earned</span>}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
