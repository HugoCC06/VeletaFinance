import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { BackendError, type FriendEntry, type LeaderboardRow, type UserSummary } from '../../backend/types'
import { Avatar } from '../../components/Avatar'
import { Field } from '../../components/Field'
import { Icon } from '../../components/Icon'
import { Alert, Button, EmptyState, ErrorState, LoadingState } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { useApp } from '../../state/AppContext'
import { useMeta } from '../../lib/useMeta'

const errMsg = (e: unknown) => (e instanceof BackendError ? e.message : 'Something went wrong. Please try again.')

export function Friends() {
  useMeta('Friends', { noindex: true })
  const { backend, refresh } = useApp()
  const toast = useToast()
  const [friends, setFriends] = useState<FriendEntry[] | null>(null)
  const [board, setBoard] = useState<LeaderboardRow[] | null>(null)
  const [period, setPeriod] = useState<'week' | 'all'>('week')
  const [loadErr, setLoadErr] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UserSummary[] | null>(null)
  const [searchErr, setSearchErr] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!backend?.social) return
    setLoadErr(null)
    try {
      const [f, b] = await Promise.all([backend.listFriends(), backend.leaderboard(period)])
      setFriends(f)
      setBoard(b)
    } catch (e) {
      setLoadErr(errMsg(e))
    }
  }, [backend, period])
  useEffect(() => { void load() }, [load])

  if (!backend) return <LoadingState />
  if (!backend.social) {
    return (
      <div className="container page">
        <EmptyState title="Friends need an online account" mood="think">
          Veleta is running in demo mode, where everything is stored only in this browser. Friend requests and friends-only leaderboards become available when the site is connected to its online backend.
        </EmptyState>
      </div>
    )
  }

  const search = async (e: FormEvent) => {
    e.preventDefault()
    setSearchErr(null)
    if (query.trim().length < 3) return setSearchErr('Type at least 3 characters.')
    try {
      setResults(await backend.searchUsers(query.trim()))
    } catch (err) {
      setSearchErr(errMsg(err))
    }
  }
  const act = async (key: string, fn: () => Promise<void>, ok: string) => {
    setBusy(key)
    try {
      await fn()
      toast.show(ok, 'success')
      await load()
      void refresh()
    } catch (err) {
      toast.show(errMsg(err), 'danger')
    } finally {
      setBusy(null)
    }
  }

  const incoming = friends?.filter((f) => f.status === 'incoming') ?? []
  const outgoing = friends?.filter((f) => f.status === 'outgoing') ?? []
  const accepted = friends?.filter((f) => f.status === 'accepted') ?? []
  const known = new Set(friends?.map((f) => f.username))

  return (
    <div className="container page">
      <header className="page-header">
        <h1>Friends</h1>
        <p>Learn alongside friends and compare XP on a friends-only leaderboard. Only accepted friends see your name, avatar and XP — never your answers or private profile.</p>
      </header>
      <div className="friends-layout">
        <div className="stack">
          <section className="card stack" aria-labelledby="lb-title">
            <div className="spread">
              <h2 id="lb-title" className="mb-0">Leaderboard</h2>
              <div className="tabs" role="tablist" aria-label="Leaderboard period">
                <button type="button" role="tab" aria-selected={period === 'week'} onClick={() => setPeriod('week')}>This week</button>
                <button type="button" role="tab" aria-selected={period === 'all'} onClick={() => setPeriod('all')}>All time</button>
              </div>
            </div>
            <p className="small muted mb-0">{period === 'week' ? 'XP earned since Monday 00:00 UTC. Resets every Monday.' : 'Total XP since joining.'}</p>
            {loadErr ? <ErrorState message={loadErr} onRetry={() => void load()} /> : !board ? <LoadingState /> : board.length <= 1 ? (
              <EmptyState title="It’s quiet here" mood="wave">Add a friend by their username to start a friendly competition.</EmptyState>
            ) : (
              <ol className="leaderboard">
                {board.map((r, i) => (
                  <li key={r.userId} className={r.isMe ? 'is-me' : ''}>
                    <span className={`leaderboard__rank${i < 3 ? ` leaderboard__rank--${i + 1}` : ''}`}>{i + 1}</span>
                    <Avatar id={r.avatar} size={36} />
                    <span className="leaderboard__name">{r.displayName}{r.isMe && <span className="subtle"> (you)</span>}<span className="tiny muted">@{r.username}</span></span>
                    <span className="leaderboard__xp tabular"><Icon name="bolt" size={16} />{r.xp}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
        <div className="stack">
          <section className="card stack" aria-labelledby="add-title">
            <h2 id="add-title" className="mb-0">Add a friend</h2>
            <form onSubmit={search} className="stack-sm">
              <Field label="Username" prefix="@" value={query} onChange={(e) => setQuery(e.target.value.toLowerCase())} error={searchErr} hint="Private profiles can only be found by their exact username." />
              <div><Button type="submit" icon="search">Search</Button></div>
            </form>
            {results && (results.length === 0 ? <p className="small muted mb-0">No learners found.</p> : (
              <ul className="people">
                {results.map((u) => (
                  <li key={u.userId}>
                    <Avatar id={u.avatar} size={36} />
                    <span className="people__name">{u.displayName}<span className="tiny muted">@{u.username}</span></span>
                    {known.has(u.username) ? <span className="pill">Added</span> : (
                      <Button size="sm" variant="primary" loading={busy === u.username} onClick={() => act(u.username, () => backend.sendFriendRequest(u.username), `Friend request sent to ${u.displayName}.`)}>Add</Button>
                    )}
                  </li>
                ))}
              </ul>
            ))}
          </section>
          {incoming.length > 0 && (
            <section className="card stack" aria-labelledby="in-title">
              <h2 id="in-title" className="mb-0">Requests ({incoming.length})</h2>
              <ul className="people">
                {incoming.map((f) => (
                  <li key={f.friendshipId}>
                    <Avatar id={f.avatar} size={36} />
                    <span className="people__name">{f.displayName}<span className="tiny muted">@{f.username}</span></span>
                    <span className="cluster-sm">
                      <Button size="sm" variant="success" loading={busy === f.friendshipId} onClick={() => act(f.friendshipId, () => backend.respondFriendRequest(f.friendshipId, true), `You and ${f.displayName} are now friends.`)}>Accept</Button>
                      <Button size="sm" onClick={() => act(f.friendshipId + 'x', () => backend.respondFriendRequest(f.friendshipId, false), 'Request declined.')}>Decline</Button>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className="card stack" aria-labelledby="fr-title">
            <h2 id="fr-title" className="mb-0">Your friends ({accepted.length})</h2>
            {!friends ? <LoadingState /> : accepted.length === 0 ? <p className="small muted mb-0">No friends yet.</p> : (
              <ul className="people">
                {accepted.map((f) => (
                  <li key={f.friendshipId}>
                    <Avatar id={f.avatar} size={36} />
                    <span className="people__name">{f.displayName}<span className="tiny muted">@{f.username}</span></span>
                    <Button size="sm" variant="ghost" onClick={() => act(f.friendshipId, () => backend.removeFriend(f.friendshipId), `Removed ${f.displayName}.`)} aria-label={`Remove ${f.displayName}`}>Remove</Button>
                  </li>
                ))}
              </ul>
            )}
            {outgoing.length > 0 && <Alert tone="info">Pending: {outgoing.map((f) => `@${f.username}`).join(', ')}</Alert>}
          </section>
        </div>
      </div>
    </div>
  )
}
