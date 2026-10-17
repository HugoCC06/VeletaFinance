import { Link } from 'react-router-dom'
import type { PublicProfile } from '../../backend/types'
import { getCourse } from '../../content'
import { achievementById } from '../../engine/achievements'
import { levelName } from '../../engine/rewards'
import { Avatar } from '../../components/Avatar'
import { Icon } from '../../components/Icon'
import { Stat } from '../../components/ui'
import { formatDate } from '../../lib/format'

export function ProfileCard({ p, certLinks }: { p: PublicProfile; certLinks: 'private' | 'verify' }) {
  return (
    <div className="stack">
      <section className="card profile-head">
        <Avatar id={p.avatar} size={88} />
        <div className="stack-sm">
          <h1 className="mb-0">{p.displayName}</h1>
          <span className="muted">@{p.username}</span>
          {p.bio && <p className="mb-0">{p.bio}</p>}
          <span className="pill pill--violet">Level {p.level} · {levelName(p.level)}</span>
        </div>
      </section>
      <section className="card">
        <div className="grid-auto">
          <Stat icon="bolt" tone="sun" value={p.xpTotal} label="Total XP" />
          <Stat icon="book" tone="violet" value={p.lessonsCompleted} label="Lessons completed" />
          <Stat icon="flame" tone="streak" value={p.longestStreak} label="Longest streak" />
          <Stat icon="graduation" tone="mint" value={p.completedCourses.length} label="Courses completed" />
        </div>
      </section>
      <section className="card stack-sm" aria-labelledby="pc-certs">
        <h2 id="pc-certs" className="mb-0">Certificates</h2>
        {p.certificates.length === 0 ? <p className="small muted mb-0">No certificates yet.</p> : (
          <ul className="cert-list">
            {p.certificates.map((c) => (
              <li key={c.id}>
                <Icon name="graduation" />
                <span><strong>{getCourse(c.courseId)?.title ?? c.courseId}</strong><span className="tiny muted"> · {formatDate(c.issuedAt)} · {c.id}</span></span>
                <Link to={certLinks === 'private' ? `/app/certificates/${c.id}` : `/verify/${c.id}`}>{certLinks === 'private' ? 'View' : 'Verify'}</Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="card stack-sm" aria-labelledby="pc-ach">
        <h2 id="pc-ach" className="mb-0">Achievements</h2>
        {p.achievements.length === 0 ? <p className="small muted mb-0">No achievements yet.</p> : (
          <div className="cluster-sm">
            {p.achievements.map((id) => {
              const a = achievementById(id)
              return a ? <span key={id} className={`pill pill--${a.tone}`}><Icon name={a.icon} size={14} />{a.title}</span> : null
            })}
          </div>
        )}
      </section>
    </div>
  )
}
