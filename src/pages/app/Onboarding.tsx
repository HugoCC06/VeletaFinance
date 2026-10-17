import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COURSES, getQuestion } from '../../content'
import type { Question } from '../../content/types'
import { gradeAnswer } from '../../engine/grading'
import { localTimeZone } from '../../engine/dates'
import { DAILY_GOALS } from '../../engine/rewards'
import { recommendCourse } from '../../backend/rules'
import { BackendError, validateDisplayName, validateUsername, type Experience, type Intensity } from '../../backend/types'
import { Mascot } from '../../brand/Mascot'
import { Logo } from '../../brand/Logo'
import { Avatar, AVATARS } from '../../components/Avatar'
import { Field } from '../../components/Field'
import { Icon } from '../../components/Icon'
import { Alert, Button, ProgressBar } from '../../components/ui'
import { QuestionView } from '../../learning/QuestionView'
import { initialRaw, isAnswered, normalise, type RawAnswer } from '../../learning/answers'
import { useApp } from '../../state/AppContext'
import { useMeta } from '../../lib/useMeta'

const INTERESTS = ['Investing basics', 'Stocks & markets', 'Company analysis', 'ETFs & index funds', 'Valuation', 'Bonds & the economy', 'Dividends & income', 'Trading & psychology']
const PLACEMENT = ['c1-u1-cp.c4', 'c1-u2-cp.c4', 'c2-u2-cp.c1', 'c3-u1-cp.c2', 'c5-u1-cp.c1']
const STEPS = ['Profile', 'Experience', 'Interests', 'Goal', 'Placement', 'Your path'] as const

export function Onboarding() {
  useMeta('Welcome to Veleta', { noindex: true })
  const { backend, state, refresh } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [displayName, setDisplayName] = useState(state?.profile.displayName ?? '')
  const [username, setUsername] = useState(state?.profile.username ?? '')
  const [avatar, setAvatar] = useState(state?.profile.avatar ?? 'vane')
  const [experience, setExperience] = useState<Experience>('none')
  const [interests, setInterests] = useState<string[]>([])
  const [market, setMarket] = useState<'uk' | 'us' | 'both'>('both')
  const [goal, setGoal] = useState(2)
  const [intensity, setIntensity] = useState<Intensity>('balanced')
  const [qIndex, setQIndex] = useState(0)
  const [raw, setRaw] = useState<RawAnswer>(null)
  const [placementCorrect, setPlacementCorrect] = useState<number | null>(null)
  const [placementSkipped, setPlacementSkipped] = useState(false)
  const [chosen, setChosen] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fieldErr, setFieldErr] = useState<Record<string, string | null>>({})
  const [busy, setBusy] = useState(false)
  const questions = PLACEMENT.map((id) => getQuestion(id)?.question).filter((q): q is Question => !!q)
  const [correctSoFar, setCorrectSoFar] = useState(0)
  const [seed] = useState(() => Math.random().toString(36).slice(2))

  useEffect(() => {
    if (state?.prefs.onboarded) navigate('/app', { replace: true })
  }, [state?.prefs.onboarded, navigate])
  useEffect(() => {
    if (questions[qIndex]) setRaw(initialRaw(questions[qIndex]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex])

  const score = placementCorrect === null ? null : placementCorrect / questions.length
  const recommended = recommendCourse(experience, placementSkipped ? null : score)
  const target = chosen ?? recommended

  const nextFromProfile = async () => {
    const errs = { name: validateDisplayName(displayName), username: validateUsername(username) }
    if (!errs.username && backend && !(await backend.isUsernameAvailable(username))) errs.username = 'That username is taken — try another.'
    setFieldErr(errs)
    if (!errs.name && !errs.username) setStep(1)
  }
  const answerPlacement = () => {
    const q = questions[qIndex]
    const ok = gradeAnswer(q, normalise(q, raw))
    const total = correctSoFar + (ok ? 1 : 0)
    setCorrectSoFar(total)
    if (qIndex + 1 < questions.length) setQIndex(qIndex + 1)
    else {
      setPlacementCorrect(total)
      setStep(5)
    }
  }
  const finish = async () => {
    setBusy(true)
    setError(null)
    try {
      await backend!.saveOnboarding({ displayName, username, avatar, experience, interests, dailyGoal: goal, intensity, market, recommendedCourse: target, timezone: localTimeZone() })
      await refresh()
      navigate(`/app/learn/${target}`, { replace: true })
    } catch (e) {
      setError(e instanceof BackendError ? e.message : 'We couldn’t save your choices. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="onboarding">
      <header className="onboarding__top container">
        <Logo size={32} />
        <div className="onboarding__progress"><ProgressBar value={(step + 1) / STEPS.length} label="Setup progress" valueText={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`} tone="mint" /></div>
      </header>
      <main id="main" className="container reading onboarding__body" tabIndex={-1}>
        {step === 0 && (
          <section className="stack">
            <div className="onboarding__intro"><Mascot mood="wave" size={90} /><div><h1 className="mb-0">Welcome to Veleta!</h1><p className="muted mb-0">I’m Vane. Let’s set up your learning path — it takes about a minute.</p></div></div>
            <Field label="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} error={fieldErr.name} maxLength={40} />
            <Field label="Username" hint="Friends can find you by your exact username. Lowercase letters, numbers and underscores." value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} error={fieldErr.username} maxLength={20} prefix="@" />
            <fieldset className="fieldset">
              <legend className="field__label">Choose an avatar</legend>
              <div className="avatar-picker">
                {AVATARS.map((a) => (
                  <label key={a.id} className={`avatar-picker__item${avatar === a.id ? ' is-selected' : ''}`}>
                    <input type="radio" name="avatar" value={a.id} checked={avatar === a.id} onChange={() => setAvatar(a.id)} className="sr-only" />
                    <Avatar id={a.id} size={52} />
                    <span className="sr-only">{a.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <Button variant="primary" size="lg" onClick={nextFromProfile}>Continue</Button>
          </section>
        )}
        {step === 1 && (
          <section className="stack">
            <h1>How much do you know about investing?</h1>
            <div className="choice-list" role="radiogroup" aria-label="Investing experience">
              {([['none', 'I’m completely new', 'Never invested and not sure where to start.'], ['some', 'I know the basics', 'I’ve heard of shares, funds and compounding.'], ['experienced', 'I’m fairly experienced', 'I invest or study finance and want depth.']] as const).map(([v, t, d]) => (
                <label key={v} className={`choice-tile${experience === v ? ' is-selected' : ''}`}>
                  <input type="radio" name="exp" checked={experience === v} onChange={() => setExperience(v)} />
                  <span><strong>{t}</strong><br /><span className="small muted">{d}</span></span>
                </label>
              ))}
            </div>
            <div className="cluster"><Button onClick={() => setStep(0)}>Back</Button><Button variant="primary" onClick={() => setStep(2)}>Continue</Button></div>
          </section>
        )}
        {step === 2 && (
          <section className="stack">
            <h1>What do you want to learn?</h1>
            <p className="muted">Pick any that interest you. This helps us suggest where to start.</p>
            <div className="chip-grid" role="group" aria-label="Interests">
              {INTERESTS.map((i) => (
                <label key={i} className={`chip${interests.includes(i) ? ' is-selected' : ''}`}>
                  <input type="checkbox" className="sr-only" checked={interests.includes(i)} onChange={() => setInterests((xs) => (xs.includes(i) ? xs.filter((x) => x !== i) : [...xs, i]))} />
                  {interests.includes(i) && <Icon name="check" size={16} />}{i}
                </label>
              ))}
            </div>
            <fieldset className="fieldset">
              <legend className="field__label">Which market examples do you want?</legend>
              <div className="cluster" role="radiogroup">
                {([['uk', 'UK'], ['us', 'US'], ['both', 'Both']] as const).map(([v, l]) => (
                  <label key={v} className={`chip${market === v ? ' is-selected' : ''}`}><input type="radio" className="sr-only" name="market" checked={market === v} onChange={() => setMarket(v)} />{l}</label>
                ))}
              </div>
            </fieldset>
            <div className="cluster"><Button onClick={() => setStep(1)}>Back</Button><Button variant="primary" onClick={() => setStep(3)}>Continue</Button></div>
          </section>
        )}
        {step === 3 && (
          <section className="stack">
            <h1>Set a daily goal</h1>
            <p className="muted">An activity is a lesson, a revision session or an assessment. Meeting your goal each day builds your streak. You can change this any time.</p>
            <div className="choice-list" role="radiogroup" aria-label="Daily goal">
              {DAILY_GOALS.map((g) => (
                <label key={g.value} className={`choice-tile${goal === g.value ? ' is-selected' : ''}`}>
                  <input type="radio" name="goal" checked={goal === g.value} onChange={() => setGoal(g.value)} />
                  <span className="spread full"><strong>{g.label}</strong><span className="small muted">{g.detail}</span></span>
                </label>
              ))}
            </div>
            <fieldset className="fieldset">
              <legend className="field__label">Preferred intensity</legend>
              <div className="cluster" role="radiogroup">
                {([['relaxed', 'Relaxed'], ['balanced', 'Balanced'], ['challenge', 'Challenge me']] as const).map(([v, l]) => (
                  <label key={v} className={`chip${intensity === v ? ' is-selected' : ''}`}><input type="radio" className="sr-only" name="intensity" checked={intensity === v} onChange={() => setIntensity(v)} />{l}</label>
                ))}
              </div>
            </fieldset>
            <div className="cluster"><Button onClick={() => setStep(2)}>Back</Button><Button variant="primary" onClick={() => setStep(4)}>Continue</Button></div>
          </section>
        )}
        {step === 4 && (
          <section className="stack">
            <div className="spread"><h1 className="mb-0">Quick placement check</h1><span className="pill">{qIndex + 1} / {questions.length}</span></div>
            <p className="muted">Five optional questions to suggest a starting point. There’s no penalty for guessing — or skip it.</p>
            {questions[qIndex] && raw !== undefined && <QuestionView key={questions[qIndex].id} question={questions[qIndex]} value={raw} onChange={setRaw} onSubmit={answerPlacement} seed={seed} />}
            <div className="cluster">
              <Button onClick={() => { setPlacementSkipped(true); setStep(5) }}>Skip</Button>
              <Button variant="primary" onClick={answerPlacement} disabled={!questions[qIndex] || !isAnswered(questions[qIndex], raw)}>{qIndex + 1 < questions.length ? 'Next' : 'See my result'}</Button>
            </div>
          </section>
        )}
        {step === 5 && (
          <section className="stack">
            <div className="onboarding__intro"><Mascot mood="cheer" size={90} /><div><h1 className="mb-0">Your recommended start</h1>{placementCorrect !== null && <p className="muted mb-0">You answered {placementCorrect} of {questions.length} placement questions correctly.</p>}</div></div>
            <p className="muted">This is only a suggestion — every course is open to you.</p>
            <div className="choice-list" role="radiogroup" aria-label="Starting course">
              {COURSES.map((c) => (
                <label key={c.id} className={`choice-tile${target === c.id ? ' is-selected' : ''}`}>
                  <input type="radio" name="course" checked={target === c.id} onChange={() => setChosen(c.id)} />
                  <span className={`icon-chip icon-chip--${c.colour}`}><Icon name={c.icon} /></span>
                  <span><strong>{c.title}</strong>{c.id === recommended && <span className="pill pill--mint" style={{ marginLeft: 8 }}>Recommended</span>}<br /><span className="small muted">{c.tagline}</span></span>
                </label>
              ))}
            </div>
            {error && <Alert tone="danger">{error}</Alert>}
            <div className="cluster"><Button onClick={() => setStep(4)}>Back</Button><Button variant="primary" size="lg" loading={busy} onClick={finish} iconRight="arrowRight">Start learning</Button></div>
          </section>
        )}
      </main>
    </div>
  )
}
