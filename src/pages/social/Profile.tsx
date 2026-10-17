import { useEffect, useState } from 'react'
import type { PublicProfile } from '../../backend/types'
import { Alert, Button, ErrorState, LinkButton, LoadingState } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { useApp } from '../../state/AppContext'
import { useMeta } from '../../lib/useMeta'
import { ProfileCard } from './ProfileCard'

export function Profile() {
  useMeta('Your profile', { noindex: true })
  const { backend, state } = useApp()
  const toast = useToast()
  const [p, setP] = useState<PublicProfile | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const username = state?.profile.username
  const updatedKey = `${state?.xp.total}-${state?.profile.isPublic}-${state?.profile.displayName}-${state?.profile.avatar}-${state?.profile.bio}`
  useEffect(() => {
    if (!backend || !username) return
    backend.getPublicProfile(username).then(setP).catch((e) => setErr(e instanceof Error ? e.message : 'Failed to load profile'))
  }, [backend, username, updatedKey])
  if (!state) return null
  const url = `${window.location.origin}${window.location.pathname}#/u/${state.profile.username}`
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.show('Profile link copied.', 'success')
    } catch {
      toast.show('Copy failed — select the link and copy it manually.', 'danger')
    }
  }
  return (
    <div className="container page">
      <div className="stack">
        <Alert tone={state.profile.isPublic ? 'success' : 'info'} title={state.profile.isPublic ? 'Your profile is public' : 'Your profile is private'}>
          {state.profile.isPublic ? (
            <span>Anyone with the link can see this page. <code className="break">{url}</code> <Button size="sm" icon="copy" onClick={copy}>Copy link</Button></span>
          ) : (
            <span>Only you can see this page. You can make it public in <LinkButton to="/app/settings" size="sm" variant="ghost">Settings</LinkButton></span>
          )}
        </Alert>
        {err ? <ErrorState message={err} /> : !p ? <LoadingState /> : <ProfileCard p={p} certLinks="private" />}
      </div>
    </div>
  )
}
