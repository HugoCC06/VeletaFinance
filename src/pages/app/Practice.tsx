import { Link } from 'react-router-dom'
import { COURSES, conceptLabel, lessonForConcept } from '../../content'
import { dueCount, masteryLabel, REVIEW_INTERVALS } from '../../engine/mastery'
import { Icon } from '../../components/Icon'
import { EmptyState, LinkButton, ProgressBar } from '../../components/ui'
import { useApp } from '../../state/AppContext'
import { courseMastery } from '../../state/selectors'
import { useMeta } from '../../lib/useMeta'

export function Practice() {
  useMeta('Practice', { noindex: true })
  const { state } = useApp()
  if (!state) return null
  const due = dueCount(state.stats, state.today)
  const byConcept = new Map<string, { seen: number; boxSum: number; misses: number }>()
  for (const s of state.stats) {
    const c = byConcept.get(s.concept) ?? { seen: 0, boxSum: 0, misses: 0 }
    c.seen++
    c.boxSum += s.box
    c.misses += s.attempts - s.correct
    byConcept.set(s.concept, c)
  }
  const weak = [...byConcept.entries()]
    .map(([concept, v]) => ({ concept, avg: v.boxSum / v.seen, misses: v.misses }))
    .filter((x) => x.misses > 0 && x.avg < 2.5)
    .sort((a, b) => a.avg - b.avg)
    .slice(0, 6)
  const started = COURSES.filter((c) => c.units.some((u) => u.lessons.some((l) => state.lessons[l.id])))

  if (!state.stats.length) {
    return (
      <div className="container page">
        <EmptyState title="Practice unlocks as you learn" mood="happy" action={<LinkButton to="/app/learn" variant="primary">Start a lesson</LinkButton>}>
          Every question you answer is tracked. Questions you miss come back here for spaced revision until they stick.
        </EmptyState>
      </div>
    )
  }

  return (
    <div className="container page">
      <header className="page-header">
        <h1>Practice &amp; revision</h1>
        <p>Short revision sessions bring back questions at increasing intervals — {REVIEW_INTERVALS.slice(1).join(', ')} days — and send missed ones back to the start. Revision earns XP for up to three sessions a day and always updates your mastery.</p>
      </header>
      <section className="card card--accent practice-hero">
        <div>
          <h2 className="mb-0">{due ? `${due} question${due === 1 ? '' : 's'} due` : 'You’re up to date'}</h2>
          <p className="muted mb-0">{due ? 'A session contains up to 8 questions, starting with the ones you missed.' : 'No questions are due. You can still practise your weakest material.'}</p>
        </div>
        <LinkButton to="/app/practice/session" variant="primary" size="lg" icon="refresh">{due ? 'Start revision' : 'Practise anyway'}</LinkButton>
      </section>

      {weak.length > 0 && (
        <section className="mt-8" aria-labelledby="weak-title">
          <h2 id="weak-title">Concepts to strengthen</h2>
          <div className="grid-2">
            {weak.map((w) => {
              const lesson = lessonForConcept(w.concept)
              return (
                <div key={w.concept} className="card stack-sm">
                  <strong>{conceptLabel(w.concept)}</strong>
                  <span className="small muted">{w.misses} missed answer{w.misses === 1 ? '' : 's'} so far</span>
                  <div className="cluster-sm">
                    <LinkButton to={`/app/practice/session?concept=${encodeURIComponent(w.concept)}`} size="sm" variant="primary">Revise</LinkButton>
                    {lesson && <LinkButton to={`/app/lesson/${lesson.id}`} size="sm">Re-read lesson</LinkButton>}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <section className="mt-8" aria-labelledby="mastery-title">
        <h2 id="mastery-title">Mastery by course</h2>
        <p className="small muted">Mastery is the average strength of every lesson question in a course: unseen questions count as 0%, a first correct answer about 40%, and questions answered correctly across spaced reviews climb to 100%. It measures retention in Veleta’s exercises — not overall investing competence.</p>
        <div className="stack">
          {started.map((c) => {
            const m = courseMastery(state, c.id)
            return (
              <div key={c.id} className="mastery-row">
                <Link to={`/app/learn/${c.id}`} className="bold">{c.title}</Link>
                <ProgressBar value={m / 100} label={`${c.title} mastery`} tone="sky" valueText={`${m}% — ${masteryLabel(m)}`} />
                <div className="spread tiny muted"><span>{masteryLabel(m)} · {m}%</span><Link to={`/app/practice/session?course=${c.id}`}><Icon name="refresh" size={12} /> Revise this course</Link></div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
