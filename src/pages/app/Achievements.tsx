import { useState } from 'react'
import { ACHIEVEMENTS, metricValue, type AchievementCategory } from '../../engine/achievements'
import { levelInfo, LEVEL_NAMES, xpForLevel } from '../../engine/rewards'
import { Icon } from '../../components/Icon'
import { ProgressBar, Stat } from '../../components/ui'
import { useApp } from '../../state/AppContext'
import { achievementStatsFromState } from '../../state/selectors'
import { useMeta } from '../../lib/useMeta'
import { formatDate } from '../../lib/format'

const CATEGORIES: ('All' | AchievementCategory)[] = ['All', 'Learning', 'Streaks', 'Mastery', 'Courses', 'Milestones', 'Social']

export function Achievements() {
  useMeta('Achievements', { noindex: true })
  const { state } = useApp()
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>('All')
  const [show, setShow] = useState<'all' | 'unlocked' | 'locked'>('all')
  if (!state) return null
  const lvl = levelInfo(state.xp.total)
  const stats = achievementStatsFromState(state)
  const unlocked = ACHIEVEMENTS.filter((a) => state.achievements[a.id]).length
  const nextRank = LEVEL_NAMES.find(([min]) => min > lvl.level)
  const list = ACHIEVEMENTS.filter((a) => (cat === 'All' || a.category === cat) && (show === 'all' || (show === 'unlocked') === !!state.achievements[a.id]))
    .sort((a, b) => Number(!!state.achievements[b.id]) - Number(!!state.achievements[a.id]) || metricValue(b, stats) / b.threshold - metricValue(a, stats) / a.threshold)
  return (
    <div className="container page">
      <header className="page-header">
        <h1>Achievements</h1>
        <p>{unlocked} of {ACHIEVEMENTS.length} unlocked. Achievements are awarded by Veleta’s servers from your recorded progress.</p>
      </header>
      <section className="card stack level-card" aria-labelledby="lvl">
        <div className="level-card__head">
          <span className="level-badge" aria-hidden="true">{lvl.level}</span>
          <div>
            <h2 id="lvl" className="mb-0">Level {lvl.level} · {lvl.name}</h2>
            <p className="small muted mb-0">{nextRank ? `Next rank: ${nextRank[1]} at level ${nextRank[0]}` : 'Highest rank reached'} · {lvl.level < 100 ? `${100 - lvl.level} levels to the top` : 'Maximum level'}</p>
          </div>
          <span className="pill pill--sun" style={{ marginLeft: 'auto' }}><Icon name="bolt" size={14} />{state.xp.total.toLocaleString('en-GB')} XP</span>
        </div>
        <ProgressBar value={lvl.progress} label="Progress to next level" tone="sun" valueText={lvl.nextLevelXp ? `${lvl.xp} of ${lvl.nextLevelXp} XP` : 'Maximum level'} />
        <p className="small muted mb-0">{lvl.nextLevelXp ? `Level ${lvl.level + 1} at ${xpForLevel(lvl.level + 1).toLocaleString('en-GB')} XP.` : 'You have reached level 100.'} Each level needs 50 XP more than the last, up to level 100.</p>
        <div className="grid-auto">
          <Stat icon="book" tone="violet" value={stats.lessons} label="Lessons completed" />
          <Stat icon="flame" tone="streak" value={state.streak.longest} label="Longest streak" />
          <Stat icon="check" tone="mint" value={stats.correct} label="Correct answers" />
          <Stat icon="trophy" tone="sun" value={`${unlocked}/${ACHIEVEMENTS.length}`} label="Achievements" />
        </div>
      </section>

      <div className="spread mt-8">
        <div className="tabs" role="tablist" aria-label="Achievement category">
          {CATEGORIES.map((c) => <button key={c} type="button" role="tab" aria-selected={cat === c} onClick={() => setCat(c)}>{c}</button>)}
        </div>
        <div className="tabs" role="tablist" aria-label="Show">
          {(['all', 'unlocked', 'locked'] as const).map((s) => <button key={s} type="button" role="tab" aria-selected={show === s} onClick={() => setShow(s)}>{s[0].toUpperCase() + s.slice(1)}</button>)}
        </div>
      </div>

      <div className="badge-grid mt-4">
        {list.map((a) => {
          const at = state.achievements[a.id]
          const value = Math.min(metricValue(a, stats), a.threshold)
          return (
            <div key={a.id} className={`badge-card tier-${a.tier}${at ? ' is-unlocked' : ''}`}>
              <span className={`badge badge--${a.tone}`} aria-hidden="true">
                <svg viewBox="0 0 64 64" width="64" height="64"><path d="M32 3 57 17v30L32 61 7 47V17Z" className="badge__shape" /></svg>
                <span className="badge__icon"><Icon name={a.icon} size={28} /></span>
                {!at && <span className="badge__lock"><Icon name="lock" size={12} weight="fill" /></span>}
              </span>
              <div className="badge-card__body">
                <div className="cluster-sm"><h3 className="mb-0">{a.title}</h3><span className={`tier-pill tier-pill--${a.tier}`}>{a.tier}</span></div>
                <p className="small muted mb-0">{a.description}</p>
                {at ? (
                  <p className="tiny bold mb-0">Unlocked {formatDate(at)}</p>
                ) : (
                  <div className="stack-sm" style={{ gap: 4 }}>
                    <ProgressBar value={value / a.threshold} label={`${a.title} progress`} size="sm" tone="sky" valueText={`${value} of ${a.threshold}`} />
                    <span className="tiny muted">{a.metric === 'course' ? 'Not yet completed' : `${value.toLocaleString('en-GB')} / ${a.threshold.toLocaleString('en-GB')}`}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
