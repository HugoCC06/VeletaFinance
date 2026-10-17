import { isSupabaseConfigured } from '../backend'
import { Icon } from '../components/Icon'

/** Honest notice shown whenever the app runs without an online backend. */
export function DemoBanner() {
  if (isSupabaseConfigured) return null
  return (
    <div className="demo-banner" role="note">
      <Icon name="info" size={18} />
      <span>
        <strong>Demo mode:</strong> accounts and progress are stored only in this browser. Friends, leaderboards and verifiable certificates need the online backend.
      </span>
    </div>
  )
}
