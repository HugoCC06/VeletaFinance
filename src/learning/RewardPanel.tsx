import { Link } from 'react-router-dom'
import type { RewardSummary } from '../backend/types'
import { achievementById } from '../engine/achievements'
import { levelInfo } from '../engine/rewards'
import { Icon } from '../components/Icon'
import { ProgressBar } from '../components/ui'

/** Shows what a submission earned: XP, level progress, streak, achievements and missions. */
export function RewardPanel({ result }: { result: RewardSummary }) {
  const before = levelInfo(result.totalXp - result.xpAwarded)
  const after = levelInfo(result.totalXp)
  const levelUp = after.level > before.level
  return (
    <div className="reward stack">
      <div className="reward__xp">
        <span className="reward__xp-icon"><Icon name="bolt" size={28} /></span>
        <div>
          <div className="reward__xp-value">+{result.xpAwarded} XP</div>
          {result.xpBreakdown.length > 0 ? (
            <ul className="reward__breakdown">
              {result.xpBreakdown.map((b, i) => <li key={i}><span>{b.label}</span><strong>+{b.amount}</strong></li>)}
            </ul>
          ) : (
            <p className="subtle mb-0">No new XP this time — XP is awarded once per lesson, so replays build mastery instead.</p>
          )}
        </div>
      </div>
      <div className="stack-sm">
        <div className="spread small">
          <span className="bold">{levelUp ? `Level up! You reached level ${after.level}` : `Level ${after.level} · ${after.name}`}</span>
          <span className="muted tabular">{after.nextLevelXp === null ? `${after.xp} XP` : `${after.xp} / ${after.nextLevelXp} XP`}</span>
        </div>
        <ProgressBar value={after.progress} label="Progress to next level" tone="sun" />
      </div>
      {(result.goalMetNow || result.streak.extended) && (
        <div className="reward__row reward__row--streak">
          <Icon name="flame" size={22} />
          <span>
            Daily goal met — your streak is <strong>{result.streak.current} {result.streak.current === 1 ? 'day' : 'days'}</strong>.
            {result.streak.freezesUsed > 0 && ` A streak freeze covered ${result.streak.freezesUsed === 1 ? 'a missed day' : `${result.streak.freezesUsed} missed days`}.`}
            {result.streak.freezeEarned && ' You earned a streak freeze!'}
          </span>
        </div>
      )}
      {result.missionsCompleted.map((m) => (
        <div key={m} className="reward__row reward__row--mission"><Icon name="target" size={22} /><span>Mission complete: <strong>{m}</strong></span></div>
      ))}
      {result.newAchievements.map((id) => {
        const a = achievementById(id)
        return a ? (
          <Link key={id} to="/app/achievements" className="reward__row reward__row--achievement"><Icon name="trophy" size={22} /><span>Achievement unlocked: <strong>{a.title}</strong></span></Link>
        ) : null
      })}
    </div>
  )
}
