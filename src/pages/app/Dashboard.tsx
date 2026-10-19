import { Link } from 'react-router-dom'
import { COURSES } from '../../content'
import { achievementById } from '../../engine/achievements'
import { dueCount } from '../../engine/mastery'
import { levelInfo } from '../../engine/rewards'
import { addDays, daysBetween, weekStart } from '../../engine/dates'
import { courseProgress } from '../../engine/progression'
import { Mascot } from '../../brand/Mascot'
import { Icon } from '../../components/Icon'
import { LinkButton, ProgressBar, Ring } from '../../components/ui'
import { useApp } from '../../state/AppContext'
import { courseMastery, nextFor, snapshotFromState } from '../../state/selectors'
import { useMeta } from '../../lib/useMeta'
import { plural } from '../../lib/format'

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export function Dashboard() {
  useMeta('Home', { noindex: true })
  const { state } = useApp()
  if (!state) return null
  const { course, step } = nextFor(state)
  const snap = snapshotFromState(state)
  const lvl = levelInfo(state.xp.total)
  const goal = state.prefs.dailyGoal
  const goalDone = Math.min(goal, state.todayActivities)
  const due = dueCount(state.stats, state.today)
  const recent = Object.entries(state.achievements).sort((a, b) => b[1].localeCompare(a[1])).slice(0, 3)
  const week = Array.from({ length: 7 }, (_, i) => addDays(state.today, i - 6))
  const weekLeft = 7 - daysBetween(weekStart(state.today), state.today)
  const byDay = new Map(state.activity.map((a) => [a.day, a]))
  const maxXp = Math.max(20, ...week.map((d) => byDay.get(d)?.xp ?? 0))
  const started = COURSES.filter((c) => c.units.some((u) => u.lessons.some((l) => state.lessons[l.id])))

  let nextTitle: string
  let nextHref: string
  let nextLabel: string
  if (step.type === 'lesson') { nextTitle = step.lesson.title; nextHref = `/app/lesson/${step.lesson.id}`; nextLabel = state.lessons[step.lesson.id] ? 'Review' : 'Start lesson' }
  else if (step.type === 'checkpoint') { nextTitle = `Checkpoint: ${step.unit.title}`; nextHref = `/app/assessment/${step.unit.checkpoint.id}`; nextLabel = 'Take checkpoint' }
  else if (step.type === 'exam') { nextTitle = `${course.title}: final exam`; nextHref = `/app/assessment/${course.exam.id}`; nextLabel = 'Take final exam' }
  else { nextTitle = 'Course complete — choose your next course'; nextHref = '/app/courses'; nextLabel = 'Browse courses' }

  return (
    <div className="container page dashboard">
      <section className="dash-hero card card--hero">
        <div className="dash-hero__text">
          <p className="mb-0" style={{ opacity: 0.85 }}>{greeting()}, {state.profile.displayName}</p>
          <h1 className="mb-0">{step.type === 'done' ? 'Great work!' : 'Up next'}</h1>
          <p className="dash-hero__next">{nextTitle}</p>
          <p className="small mb-0" style={{ opacity: 0.85 }}>{course.title} · {Math.round(courseProgress(course, snap).fraction * 100)}% complete</p>
          <div className="cluster mt-4">
            <LinkButton to={nextHref} variant="sun" size="lg" iconRight="arrowRight">{nextLabel}</LinkButton>
            <LinkButton to={`/app/learn/${course.id}`} size="lg">View path</LinkButton>
          </div>
        </div>
        <Mascot mood={state.streak.doneToday ? 'cheer' : 'happy'} size={130} className="dash-hero__mascot" />
      </section>

      <div className="dash-grid">
        <section className="card" aria-labelledby="goal-title">
          <h2 id="goal-title" className="card-title"><Icon name="target" />Daily goal</h2>
          <div className="cluster" style={{ gap: 'var(--space-5)' }}>
            <Ring value={goalDone / goal} label={`${goalDone} of ${goal} activities today`} colour="var(--mint-500)" size={88}>
              <span>{goalDone}/{goal}</span>
            </Ring>
            <div className="stack-sm" style={{ flex: 1, minWidth: 150 }}>
              <p className="mb-0 bold">{goalDone >= goal ? 'Goal met for today!' : `${plural(goal - goalDone, 'activity', 'activities')} to go`}</p>
              <p className="small muted mb-0">Lessons, revision sessions and assessments all count. {state.xp.today} XP earned today.</p>
            </div>
          </div>
        </section>

        <section className="card" aria-labelledby="streak-title">
          <h2 id="streak-title" className="card-title"><Icon name="flame" />Streak</h2>
          <div className="cluster">
            <span className="streak-big"><Icon name="flame" size={36} /><span className="tabular">{state.streak.current}</span></span>
            <div className="stack-sm" style={{ flex: 1, minWidth: 150 }}>
              <p className="mb-0 bold">{state.streak.current === 0 ? 'Start a streak today' : `${plural(state.streak.current, 'day')} in a row`}</p>
              <p className="small muted mb-0">
                <Icon name="snow" size={14} /> {plural(state.streak.freezes, 'streak freeze')} available
                {state.streak.missedDays > 0 && state.streak.current > 0 ? ` · a freeze will cover ${plural(state.streak.missedDays, 'missed day')} when you meet today’s goal` : ''}. Longest: {state.streak.longest}.
              </p>
            </div>
          </div>
        </section>

        <section className="card" aria-labelledby="level-title">
          <h2 id="level-title" className="card-title"><Icon name="bolt" />Level {lvl.level} · {lvl.name}</h2>
          <ProgressBar value={lvl.progress} label="Progress to next level" tone="sun" valueText={lvl.nextLevelXp ? `${lvl.xp} of ${lvl.nextLevelXp} XP` : 'Maximum level'} />
          <p className="small muted mt-2 mb-0">{lvl.nextLevelXp ? `${lvl.nextLevelXp - lvl.xp} XP to level ${lvl.level + 1}` : 'Maximum level reached'} · {state.xp.total} XP total · {state.xp.week} this week</p>
        </section>

        <section className="card" aria-labelledby="revise-title">
          <h2 id="revise-title" className="card-title"><Icon name="refresh" />Revision</h2>
          <p className="mb-0"><strong>{due}</strong> {due === 1 ? 'question is' : 'questions are'} due for review.</p>
          <p className="small muted">Spaced revision brings back what you found tricky, just before you forget it.</p>
          <LinkButton to={due ? '/app/practice/session' : '/app/practice'} variant={due ? 'primary' : 'secondary'} size="sm">{due ? 'Start revision' : 'Open practice'}</LinkButton>
        </section>

        {([
          { period: 'daily', id: 'missions-title', title: 'Today’s missions', icon: 'flag', note: 'New missions tomorrow' },
          { period: 'weekly', id: 'weekly-title', title: 'Weekly goals', icon: 'target', note: weekLeft === 1 ? 'Last day: new goals on Monday' : `${weekLeft} days left · new goals on Monday` },
        ] as const).map((g) => {
          const list = state.missions.filter((m) => m.period === g.period)
          const done = list.filter((m) => m.completed).length
          return (
            <section key={g.period} className={`card dash-missions dash-missions--${g.period}`} aria-labelledby={g.id}>
              <div className="spread">
                <h2 id={g.id} className="card-title mb-0"><Icon name={g.icon} />{g.title}</h2>
                <span className={`pill ${done === list.length && list.length ? 'pill--mint' : ''}`}>{done}/{list.length} done</span>
              </div>
              <p className="tiny muted">{g.note}</p>
              <ul className="mission-list">
                {list.map((m) => (
                  <li key={m.key} className={m.completed ? 'is-done' : ''}>
                    <span className="mission-list__icon">{m.completed ? <Icon name="check" size={18} /> : <Icon name={g.period === 'daily' ? 'calendar' : 'star'} size={18} />}</span>
                    <div className="mission-list__body">
                      <div className="spread"><span className="bold small">{m.title}</span><span className="pill pill--sun"><Icon name="bolt" size={12} />{m.xp}</span></div>
                      <ProgressBar value={m.progress / m.target} label={m.title} size="sm" tone={m.completed ? 'mint' : g.period === 'daily' ? 'sky' : 'violet'} valueText={`${m.progress} of ${m.target}${m.completed ? ', complete' : ''}`} />
                      <span className="tiny muted">{m.progress}/{m.target}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}

        <section className="card" aria-labelledby="week-title">
          <h2 id="week-title" className="card-title"><Icon name="chart" />This week</h2>
          <div className="week-bars" role="img" aria-label={`XP per day for the last 7 days: ${week.map((d) => `${d} ${byDay.get(d)?.xp ?? 0} XP`).join(', ')}`}>
            {week.map((d) => {
              const a = byDay.get(d)
              return (
                <div key={d} className="week-bars__col">
                  <div className="week-bars__bar"><span style={{ height: `${((a?.xp ?? 0) / maxXp) * 100}%` }} className={a?.goalMet ? 'is-goal' : ''} /></div>
                  <span className="tiny">{new Date(`${d}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: 'narrow' })}</span>
                  {a?.goalMet && <Icon name="check" size={12} label="Goal met" />}
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {started.length > 0 && (
        <section className="mt-8" aria-labelledby="courses-title">
          <div className="spread"><h2 id="courses-title" className="mb-0">Your courses</h2><Link to="/app/courses">All courses</Link></div>
          <div className="grid-auto mt-4">
            {started.map((c) => {
              const p = courseProgress(c, snap)
              return (
                <Link key={c.id} to={`/app/learn/${c.id}`} className="card card--interactive stack-sm">
                  <div className="cluster-sm"><span className={`icon-chip icon-chip--${c.colour}`}><Icon name={c.icon} /></span><strong>{c.title}</strong></div>
                  <ProgressBar value={p.fraction} label={`${c.title} progress`} size="sm" tone="mint" />
                  <span className="tiny muted">{p.lessonsDone}/{p.lessonsTotal} lessons · mastery {courseMastery(state, c.id)}%</span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="mt-8" aria-labelledby="ach-title">
          <div className="spread"><h2 id="ach-title" className="mb-0">Recent achievements</h2><Link to="/app/achievements">See all</Link></div>
          <div className="cluster mt-4">
            {recent.map(([id]) => {
              const a = achievementById(id)
              return a ? <span key={id} className={`pill pill--${a.tone}`}><Icon name={a.icon} size={16} />{a.title}</span> : null
            })}
          </div>
        </section>
      )}
      <p className="tiny muted mt-8">Veleta is educational and not financial advice. Investing involves risk, including loss of capital.</p>
    </div>
  )
}
