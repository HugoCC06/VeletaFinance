import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BackendError, validatePassword } from '../../backend/types'
import { isSupabaseConfigured } from '../../backend'
import { DAILY_GOALS } from '../../engine/rewards'
import { Avatar, AVATARS } from '../../components/Avatar'
import { Dialog } from '../../components/Dialog'
import { Field, SelectField } from '../../components/Field'
import { Alert, Button } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { useApp } from '../../state/AppContext'
import { useMeta } from '../../lib/useMeta'

const errMsg = (e: unknown) => (e instanceof BackendError ? e.message : 'Something went wrong. Please try again.')

function timeZones(current: string): string[] {
  try {
    const all = (Intl as unknown as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf?.('timeZone') ?? []
    return all.includes(current) ? all : [current, ...all]
  } catch {
    return [current]
  }
}

export function Settings() {
  useMeta('Settings', { noindex: true })
  const { backend, state, refresh } = useApp()
  const toast = useToast()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState(state?.profile.displayName ?? '')
  const [username, setUsername] = useState(state?.profile.username ?? '')
  const [bio, setBio] = useState(state?.profile.bio ?? '')
  const [avatar, setAvatar] = useState(state?.profile.avatar ?? 'vane')
  const [profileErr, setProfileErr] = useState<string | null>(null)
  const [savingProfile, setSavingProfile] = useState(false)
  const [password, setPassword] = useState('')
  const [pwErr, setPwErr] = useState<string | null>(null)
  const [pwBusy, setPwBusy] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const zones = useMemo(() => timeZones(state?.prefs.timezone ?? 'UTC'), [state?.prefs.timezone])
  if (!state) return null

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault()
    setProfileErr(null)
    setSavingProfile(true)
    try {
      await backend!.updateProfile({ displayName, username, bio, avatar })
      await refresh()
      toast.show('Profile saved.', 'success')
    } catch (err) {
      setProfileErr(errMsg(err))
    } finally {
      setSavingProfile(false)
    }
  }
  const setPref = async (patch: Parameters<NonNullable<typeof backend>['updatePreferences']>[0], label: string) => {
    try {
      await backend!.updatePreferences(patch)
      await refresh()
      toast.show(`${label} updated.`, 'success')
    } catch (err) {
      toast.show(errMsg(err), 'danger')
    }
  }
  const togglePublic = async (isPublic: boolean) => {
    try {
      await backend!.updateProfile({ isPublic })
      await refresh()
      toast.show(isPublic ? 'Your profile is now public.' : 'Your profile is now private.', 'success')
    } catch (err) {
      toast.show(errMsg(err), 'danger')
    }
  }
  const changePassword = async (e: FormEvent) => {
    e.preventDefault()
    const v = validatePassword(password)
    if (v) return setPwErr(v)
    setPwErr(null)
    setPwBusy(true)
    try {
      await backend!.updatePassword(password)
      setPassword('')
      toast.show('Password changed.', 'success')
    } catch (err) {
      setPwErr(errMsg(err))
    } finally {
      setPwBusy(false)
    }
  }
  const signOut = async () => {
    await backend!.signOut()
    navigate('/')
  }
  const deleteAccount = async () => {
    setDeleting(true)
    try {
      await backend!.deleteAccount()
      navigate('/', { replace: true })
    } catch (err) {
      toast.show(errMsg(err), 'danger')
      setDeleting(false)
    }
  }

  return (
    <div className="container page settings">
      <header className="page-header"><h1>Settings</h1></header>

      <section className="card stack" aria-labelledby="s-profile">
        <h2 id="s-profile">Profile</h2>
        <form className="stack" onSubmit={saveProfile}>
          {profileErr && <Alert tone="danger">{profileErr}</Alert>}
          <div className="grid-2">
            <Field label="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={40} />
            <Field label="Username" prefix="@" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} maxLength={20} hint="3–20 lowercase letters, numbers or underscores." />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="bio">Short bio <span className="subtle">(optional, public only if your profile is public)</span></label>
            <textarea id="bio" className="textarea" value={bio} maxLength={160} onChange={(e) => setBio(e.target.value)} />
            <span className="field__hint">{bio.length}/160</span>
          </div>
          <fieldset className="fieldset">
            <legend className="field__label">Avatar</legend>
            <div className="avatar-picker">
              {AVATARS.map((a) => (
                <label key={a.id} className={`avatar-picker__item${avatar === a.id ? ' is-selected' : ''}`}>
                  <input type="radio" name="avatar" className="sr-only" checked={avatar === a.id} onChange={() => setAvatar(a.id)} />
                  <Avatar id={a.id} size={48} />
                  <span className="sr-only">{a.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div><Button type="submit" variant="primary" loading={savingProfile}>Save profile</Button></div>
        </form>
      </section>

      <section className="card stack" aria-labelledby="s-privacy">
        <h2 id="s-privacy">Privacy</h2>
        <label className="switch">
          <span><strong>Public profile</strong><br /><span className="small muted">Off by default. When on, anyone with your link can see your name, avatar, bio, level, achievements, completed courses and certificates — never your email or detailed answers.</span></span>
          <input type="checkbox" role="switch" checked={state.profile.isPublic} onChange={(e) => void togglePublic(e.target.checked)} aria-label="Public profile" />
        </label>
        {state.profile.isPublic && <p className="small mb-0">Your public link: <Link to={`/u/${state.profile.username}`}>/u/{state.profile.username}</Link></p>}
        <label className="switch">
          <span><strong>Show me on friends’ leaderboards</strong><br /><span className="small muted">Friends see your display name, avatar and XP totals.</span></span>
          <input type="checkbox" role="switch" checked={state.prefs.showOnLeaderboard} onChange={(e) => void setPref({ showOnLeaderboard: e.target.checked }, 'Leaderboard visibility')} aria-label="Show me on friends’ leaderboards" />
        </label>
      </section>

      <section className="card stack" aria-labelledby="s-learning">
        <h2 id="s-learning">Learning</h2>
        <div className="grid-2">
          <SelectField label="Daily goal" value={String(state.prefs.dailyGoal)} onChange={(v) => void setPref({ dailyGoal: Number(v) }, 'Daily goal')} options={DAILY_GOALS.map((g) => ({ value: String(g.value), label: `${g.label} — ${g.detail}` }))} hint="Meeting your goal keeps your streak going." />
          <SelectField label="Market examples" value={state.prefs.market} onChange={(v) => void setPref({ market: v as 'uk' | 'us' | 'both' }, 'Market preference')} options={[{ value: 'both', label: 'UK and US' }, { value: 'uk', label: 'UK' }, { value: 'us', label: 'US' }]} />
          <SelectField label="Time zone" value={state.prefs.timezone} onChange={(v) => void setPref({ timezone: v }, 'Time zone')} options={zones.map((z) => ({ value: z, label: z.replace(/_/g, ' ') }))} hint="Your learning day and streak follow this time zone." />
          <SelectField label="Intensity" value={state.prefs.intensity} onChange={(v) => void setPref({ intensity: v as 'relaxed' | 'balanced' | 'challenge' }, 'Intensity')} options={[{ value: 'relaxed', label: 'Relaxed' }, { value: 'balanced', label: 'Balanced' }, { value: 'challenge', label: 'Challenge me' }]} />
        </div>
        <p className="small muted mb-0">Reminder notifications aren’t available yet; Veleta never sends marketing email.</p>
      </section>

      <section className="card stack" aria-labelledby="s-account">
        <h2 id="s-account">Account</h2>
        <p className="mb-0">Signed in as <strong>{state.user.email}</strong>{!isSupabaseConfigured && ' (demo account on this device)'}.</p>
        <form className="stack" onSubmit={changePassword}>
          <Field label="New password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} error={pwErr} hint="At least 8 characters." />
          <div><Button type="submit" loading={pwBusy}>Change password</Button></div>
        </form>
        <hr />
        <div className="cluster">
          <Button icon="logout" onClick={signOut}>Sign out</Button>
          <Button variant="danger" icon="trash" onClick={() => setDeleteOpen(true)}>Delete account</Button>
        </div>
      </section>

      <Dialog
        open={deleteOpen}
        title="Delete your account?"
        onClose={() => setDeleteOpen(false)}
        locked={deleting}
        actions={
          <>
            <Button onClick={() => setDeleteOpen(false)} disabled={deleting}>Cancel</Button>
            <Button variant="danger" onClick={deleteAccount} disabled={confirmText !== 'DELETE'} loading={deleting}>Delete permanently</Button>
          </>
        }
      >
        <p>This permanently deletes your profile, learning progress, XP, streaks, achievements, friendships and certificates. Certificate IDs you have shared will stop verifying. This cannot be undone.</p>
        <Field label='Type "DELETE" to confirm' value={confirmText} onChange={(e) => setConfirmText(e.target.value)} autoComplete="off" />
      </Dialog>
    </div>
  )
}
