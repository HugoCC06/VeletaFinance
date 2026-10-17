import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { PublicProfile } from '../../backend/types'
import { EmptyState, ErrorState, LinkButton, LoadingState } from '../../components/ui'
import { useApp } from '../../state/AppContext'
import { useMeta } from '../../lib/useMeta'
import { ProfileCard } from './ProfileCard'

export function PublicProfilePage() {
  const { username = '' } = useParams()
  const { backend } = useApp()
  const [p, setP] = useState<PublicProfile | null | undefined>(undefined)
  const [err, setErr] = useState<string | null>(null)
  // Profiles are never indexed by search engines, public or not.
  useMeta(p ? `${p.displayName} on Veleta` : 'Learner profile', { noindex: true })
  useEffect(() => {
    if (!backend) return
    setP(undefined)
    backend.getPublicProfile(username).then(setP).catch((e) => setErr(e instanceof Error ? e.message : 'Failed to load'))
  }, [backend, username])
  return (
    <div className="container page reading">
      {err ? <ErrorState message={err} /> : p === undefined ? <LoadingState /> : p === null ? (
        <EmptyState title="This profile is private or doesn’t exist" mood="think" action={<LinkButton to="/" variant="primary">Go to Veleta</LinkButton>}>
          Learners’ profiles are private unless they choose to share them.
        </EmptyState>
      ) : (
        <ProfileCard p={p} certLinks={p.isMe ? 'private' : 'verify'} />
      )}
    </div>
  )
}
