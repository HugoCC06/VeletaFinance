import { useApp } from '../state/AppContext'
import { Icon } from '../components/Icon'

export function OfflineBanner() {
  const { online } = useApp()
  if (online) return null
  return (
    <div className="offline-banner" role="status">
      <Icon name="alert" size={18} />
      <span>You’re offline. Lessons you finish will be saved on this device and synced when you reconnect.</span>
    </div>
  )
}
