import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { COURSES, CURRICULUM_STATS, getQuestion } from '../../content'
import { gradeAnswer } from '../../engine/grading'
import { Mascot } from '../../brand/Mascot'
import { Icon, type IconName } from '../../components/Icon'
import { Button, LinkButton, ProgressBar } from '../../components/ui'
import { QuestionView } from '../../learning/QuestionView'
import { StepView } from '../../learning/StepView'
import { describeCorrect, initialRaw, isAnswered, normalise, type RawAnswer } from '../../learning/answers'
import { CertificateView } from '../../certificates/CertificateView'
import { useMeta } from '../../lib/useMeta'
import { useApp } from '../../state/AppContext'

const DEMO_QID = 'c1-u1-l3.q1'

function LiveQuestion() {
  const q = getQuestion(DEMO_QID)!.question
  // A fresh random option order on every visit, reload and "Try again".
  const [seed, setSeed] = useState(() => Math.random().toString(36).slice(2))
  const [raw, setRaw] = useState<RawAnswer>(initialRaw(q))
  const [result, setResult] = useState<boolean | null>(null)
  return (
    <div className="card live-demo">
      <div className="spread">
        <span className="pill pill--violet"><Icon name="play" size={14} />Try a real question</span>
        <span className="subtle">From “Inflation and purchasing power”</span>
      </div>
      <QuestionView question={q} value={raw} onChange={setRaw} reveal={result !== null} headingLevel={3} seed={seed} />
      {result === null ? (
        <Button variant="primary" block disabled={!isAnswered(q, raw)} onClick={() => setResult(gradeAnswer(q, normalise(q, raw)))}>Check</Button>
      ) : (
        <div className={`live-demo__feedback ${result ? 'is-correct' : 'is-wrong'}`} role="status">
          <strong>{result ? 'Correct!' : `Not quite — the answer is “${describeCorrect(q)}”.`}</strong>
          <p className="small mb-0">{q.explanation}</p>
          <button type="button" className="link-btn small" onClick={() => { setRaw(initialRaw(q)); setResult(null); setSeed(Math.random().toString(36).slice(2)) }}>Try again</button>
        </div>
      )}
    </div>
  )
}

const FEATURES: { icon: IconName; title: string; body: string; tone: string }[] = [
  { icon: 'book', title: 'Interactive lessons', body: 'Five-minute lessons mixing short explanations, diagrams and questions — multiple choice, calculations, matching and ordering.', tone: 'violet' },
  { icon: 'seed', title: 'Investing fundamentals', body: 'Risk and return, compounding, inflation, diversification and costs, explained without jargon.', tone: 'mint' },
  { icon: 'doc', title: 'Practical company analysis', body: 'Read income statements, balance sheets and cash flows, then calculate margins, ROE and free cash flow.', tone: 'sky' },
  { icon: 'chart', title: 'Interactive charts', body: 'Explore line and candlestick charts you can inspect point by point. Illustrative data is always clearly labelled.', tone: 'coral' },
  { icon: 'flame', title: 'Learning streaks', body: 'Set a daily goal and build a streak. Earn streak freezes to protect it on busy days.', tone: 'sun' },
  { icon: 'trophy', title: 'Achievements & missions', body: 'Unlock achievements and complete daily and weekly missions designed around real learning.', tone: 'violet' },
  { icon: 'target', title: 'Mastery tracking', body: 'Spaced revision brings back what you got wrong until it sticks. Mastery measures retention, not clicks.', tone: 'mint' },
  { icon: 'graduation', title: 'Certificates', body: 'Pass a course’s final exam (80%) to earn a downloadable, verifiable course-completion certificate.', tone: 'sky' },
  { icon: 'globe', title: 'UK and US markets', body: 'Examples from London and New York, pounds and dollars, the Bank of England and the Fed.', tone: 'coral' },
]

export function Landing() {
  useMeta('', {})
  const { user } = useApp()
  const loc = useLocation()
  useEffect(() => {
    if (loc.hash) document.getElementById(loc.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
  }, [loc.hash])
  const sampleStep = COURSES[0].units[0].lessons[0].steps.find((s) => s.kind === 'callout')!
  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy animate-in">
            <span className="eyebrow">Free finance education</span>
            <h1 className="hero__title">Learn to invest. <span className="hero__accent">One lesson at a time.</span></h1>
            <p className="hero__lead">Veleta turns investing, stock markets and company analysis into short, interactive lessons with practical challenges, XP, streaks and a clear path from beginner to confident.</p>
            <div className="cluster">
              <LinkButton to={user ? '/app' : '/signup'} variant="primary" size="lg" iconRight="arrowRight">{user ? 'Continue learning' : 'Start learning for free'}</LinkButton>
              <LinkButton to="/curriculum" size="lg">Explore the curriculum</LinkButton>
            </div>
            <ul className="hero__facts" aria-label="What’s included">
              <li><strong>{CURRICULUM_STATS.courses}</strong> courses</li>
              <li><strong>{CURRICULUM_STATS.lessons}</strong> lessons</li>
              <li><strong>{CURRICULUM_STATS.questions}</strong> questions</li>
              <li><strong>£0</strong> forever</li>
            </ul>
          </div>
          <div className="hero__demo">
            <Mascot mood="wave" size={110} className="hero__mascot" />
            <LiveQuestion />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="how-title">
        <div className="container">
          <div className="section__head center">
            <span className="eyebrow">How it works</span>
            <h2 id="how-title">From first lesson to certificate</h2>
            <p className="muted">These previews use the same components as the real app.</p>
          </div>
          <ol className="how">
            <li className="how__step card">
              <span className="how__num">1</span>
              <h3>Read a short lesson</h3>
              <div className="how__preview"><StepView step={sampleStep as never} /></div>
            </li>
            <li className="how__step card">
              <span className="how__num">2</span>
              <h3>Answer interactive questions</h3>
              <p className="muted">Instant feedback explains <em>why</em> — and missed questions come back until you get them.</p>
              <div className="how__preview feedback-mini"><Icon name="check" /> <span><strong>Exactly right!</strong> Total return = income + capital growth.</span></div>
            </li>
            <li className="how__step card">
              <span className="how__num">3</span>
              <h3>Tackle practical challenges</h3>
              <p className="muted">Calculate real metrics, interpret simplified statements and test ideas in finance tools.</p>
              <Link to="/tools/compound-interest" className="how__link">Try the compound interest calculator <Icon name="arrowRight" size={16} /></Link>
            </li>
            <li className="how__step card">
              <span className="how__num">4</span>
              <h3>Earn XP and keep your streak</h3>
              <div className="how__preview stack-sm">
                <div className="cluster-sm"><span className="pill pill--sun"><Icon name="bolt" size={14} />+25 XP</span><span className="pill pill--coral"><Icon name="flame" size={14} />5-day streak</span></div>
                <ProgressBar value={0.62} label="Example level progress" tone="sun" />
                <span className="subtle">Level 3 · Budget Builder</span>
              </div>
            </li>
            <li className="how__step card how__step--wide">
              <span className="how__num">5</span>
              <h3>Complete a course and earn a certificate</h3>
              <p className="muted">Finish every lesson and checkpoint, then pass the final exam. Certificates are educational credentials issued by Veleta Finance — not accredited qualifications.</p>
              <div className="how__preview">
                <CertificateView compact data={{ id: 'VF-SAMP-LE01', recipientName: 'Your Name', courseTitle: COURSES[0].title, outcomes: COURSES[0].outcomes, issuedAt: '2026-01-15T12:00:00Z', score: 0.93, verifyUrl: 'veleta', demo: false }} />
                <p className="tiny muted center mt-2">Sample certificate for illustration.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="curriculum-title">
        <div className="container">
          <div className="section__head spread">
            <div>
              <span className="eyebrow">Curriculum</span>
              <h2 id="curriculum-title" className="mb-0">{COURSES.length} courses, beginner to advanced</h2>
            </div>
            <LinkButton to="/curriculum" iconRight="arrowRight">Full curriculum</LinkButton>
          </div>
          <div className="grid-auto">
            {COURSES.map((c, i) => (
              <Link key={c.id} to={`/curriculum/${c.slug}`} className={`card card--interactive course-card course-card--${c.colour}`}>
                <span className={`icon-chip icon-chip--${c.colour}`}><Icon name={c.icon} /></span>
                <span className="subtle">Course {i + 1} · {c.units.reduce((n, u) => n + u.lessons.length, 0)} lessons</span>
                <h3 className="mb-0">{c.title}</h3>
                <p className="muted small mb-0">{c.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="features" aria-labelledby="features-title">
        <div className="container">
          <div className="section__head center">
            <span className="eyebrow">Features</span>
            <h2 id="features-title">Built for learning that sticks</h2>
          </div>
          <div className="grid-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="card feature">
                <span className={`icon-chip icon-chip--${f.tone}`}><Icon name={f.icon} /></span>
                <h3>{f.title}</h3>
                <p className="muted mb-0">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card card--hero cta-band">
            <Mascot mood="cheer" size={110} />
            <div className="stack-sm">
              <h2 className="mb-0">Ready for your first lesson?</h2>
              <p className="mb-0" style={{ opacity: 0.9 }}>No hearts, no paywalls, no pressure — just clear lessons you can retry as often as you like.</p>
            </div>
            <div className="cluster">
              <LinkButton to="/signup" variant="sun" size="lg">Create free account</LinkButton>
              <LinkButton to="/try/c1-u1-l1" size="lg">Try a lesson first</LinkButton>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
