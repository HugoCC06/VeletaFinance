import { ACHIEVEMENTS } from '../../engine/achievements'
import { levelInfo, xpForLevel } from '../../engine/rewards'
import { Icon } from '../../components/Icon'
import { ProgressBar, Stat } from '../../components/ui'
import { useApp } from '../../state/AppContext'
import { useMeta } from '../../lib/useMeta'
import { formatDate } from '../../lib/format'

export function Achievements() {
  useMeta('Achievements', { noindex: true })
  const { state } = useApp()
  if (!state) return null
  const lvl = levelInfo(state.xp.total)
  const unlocked = Object.keys(state.achievements).length
  const lessons = Object.keys(state.lessons).length
  return (
    <div className="container page">
      <header className="page-header">
        <h1>Achievements</h1>
        <p>{unlocked} of {ACHIEVEMENTS.length} unlocked. Achievements are awarded by Veleta’s servers from your recorded progress.</p>
      </header>
      <section className="card stack" aria-labelledby="lvl">
        <div className="spread">
          <h2 id="lvl" className="mb-0">Level {lvl.level} · {lvl.name}</h2>
          <span className="pill pill--sun"><Icon name="bolt" size={14} />{state.xp.total} XP</span>
        </div>
        <ProgressBar value={lvl.progress} label="Progress to next level" tone="sun" valueText={lvl.nextLevelXp ? `${lvl.xp} of ${lvl.nextLevelXp} XP` : 'Maximum level'} />
        <p className="small muted mb-0">{lvl.nextLevelXp ? `Level ${lvl.level + 1} at ${xpForLevel(lvl.level + 1)} XP.` : 'You have reached the maximum level.'} XP comes from first-time lesson completions, checkpoints, final exams, missions and up to three revision sessions a day.</p>
        <div className="grid-auto">
          <Stat icon="book" tone="violet" value={lessons} label="Lessons completed" />
          <Stat icon="flame" tone="streak" value={state.streak.longest} label="Longest streak" />
          <Stat icon="calendar" tone="mint" value={state.counters.goalDays} label="Days goal met" />
          <Stat icon="refresh" tone="sky" value={state.counters.revisionSessions} label="Revision sessions" />
        </div>
      </section>
      <div className="badge-grid mt-8">
        {ACHIEVEMENTS.map((a) => {
          const at = state.achievements[a.id]
          return (
            <div key={a.id} className={`badge-card${at ? ' is-unlocked' : ''}`}>
              <span className={`badge badge--${a.tone}`} aria-hidden="true">
                <svg viewBox="0 0 64 64" width="64" height="64"><path d="M32 3 57 17v30L32 61 7 47V17Z" className="badge__shape" /></svg>
                <span className="badge__icon">{at ? <Icon name={a.icon} size={26} /> : <Icon name="lock" size={22} />}</span>
              </span>
              <div>
                <h3 className="mb-0">{a.title}</h3>
                <p className="small muted mb-0">{a.description}</p>
                <p className="tiny bold mb-0">{at ? `Unlocked ${formatDate(at)}` : 'Locked'}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
