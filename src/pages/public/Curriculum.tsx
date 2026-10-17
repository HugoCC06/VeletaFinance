import { Link } from 'react-router-dom'
import { COURSES, CURRICULUM_STATS } from '../../content'
import { Icon } from '../../components/Icon'
import { LinkButton } from '../../components/ui'
import { useMeta } from '../../lib/useMeta'

export function Curriculum() {
  useMeta('Curriculum', { description: `Veleta’s free finance curriculum: ${CURRICULUM_STATS.courses} courses and ${CURRICULUM_STATS.lessons} interactive lessons on investing, stocks, company analysis, ETFs, valuation, bonds, dividends and investor psychology.` })
  return (
    <div className="container page">
      <header className="page-header">
        <span className="eyebrow">Curriculum</span>
        <h1>Everything you can learn on Veleta</h1>
        <p>{CURRICULUM_STATS.courses} courses, {CURRICULUM_STATS.units} units and {CURRICULUM_STATS.lessons} lessons, each with checkpoints and a final exam. Start anywhere — Investing Fundamentals is the recommended first step.</p>
      </header>
      <div className="stack">
        {COURSES.map((c, i) => (
          <article key={c.id} className="card curriculum-course">
            <div className="curriculum-course__head">
              <span className={`icon-chip icon-chip--${c.colour}`}><Icon name={c.icon} /></span>
              <div>
                <span className="subtle">Course {i + 1}</span>
                <h2 className="mb-0"><Link to={`/curriculum/${c.slug}`}>{c.title}</Link></h2>
                <p className="muted mb-0">{c.description}</p>
              </div>
            </div>
            <div className="curriculum-course__units">
              {c.units.map((u, ui) => (
                <div key={u.id} className="curriculum-unit">
                  <h3 className="small bold mb-0">Unit {ui + 1}: {u.title}</h3>
                  <ol>{u.lessons.map((l) => <li key={l.id}>{l.title}</li>)}</ol>
                </div>
              ))}
            </div>
            <div className="cluster">
              <LinkButton to={`/curriculum/${c.slug}`} size="sm" iconRight="arrowRight">Course details</LinkButton>
              <span className="subtle">{c.units.reduce((n, u) => n + u.lessons.length, 0)} lessons · {c.units.length} checkpoints · final exam</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
