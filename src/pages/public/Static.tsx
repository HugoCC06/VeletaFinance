import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Mascot } from '../../brand/Mascot'
import { LinkButton } from '../../components/ui'
import { useMeta } from '../../lib/useMeta'
import { isSupabaseConfigured } from '../../backend'

function Prose({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <div className="container page">
      <article className="prose reading">
        <h1>{title}</h1>
        {intro && <p className="lead">{intro}</p>}
        {children}
      </article>
    </div>
  )
}

export function About() {
  useMeta('About Veleta', { description: 'Why Veleta Finance exists and how it teaches investing.' })
  return (
    <Prose title="About Veleta Finance" intro="Veleta makes finance simple: short, interactive lessons that take you from complete beginner to someone who can explain how investing and markets work.">
      <h2>Why Veleta?</h2>
      <p><em>Veleta</em> is Spanish for weathervane — a simple instrument that helps you read the conditions around you. That is the goal: give learners the understanding to read financial information for themselves.</p>
      <p>Traditional financial education can feel intimidating or dry. Veleta borrows the best ideas from language-learning apps — bite-sized lessons, instant feedback, streaks and visible progress — and applies them to investing, with an emphasis on accuracy and genuine understanding.</p>
      <h2>Our principles</h2>
      <ul>
        <li><strong>Learning before decoration.</strong> Every game mechanic is there to support practice and retention.</li>
        <li><strong>Accuracy before engagement tricks.</strong> No hearts, no paywalls, no fake urgency.</li>
        <li><strong>Honesty.</strong> Illustrative and synthetic data is always labelled. Certificates are educational, not accredited.</li>
        <li><strong>Privacy by design.</strong> Profiles are private by default and we collect only what improves your learning.</li>
      </ul>
      <h2>Who it’s for</h2>
      <p>Veleta is designed primarily for university students in the UK and US who are new to investing, but anyone can use it. Lessons use examples from both markets and explain where rules differ.</p>
      <h2>What Veleta is not</h2>
      <p>Veleta is an education platform. It does not provide personalised financial, investment, tax or legal advice, and it is not a broker. See the <Link to="/disclaimer">educational disclaimer</Link>.</p>
      <h2>Feedback</h2>
      <p>Veleta is an independent project in active development. If you spot an error in a lesson, please report it through the project’s repository so it can be corrected.</p>
    </Prose>
  )
}

export function Privacy() {
  useMeta('Privacy', { description: 'How Veleta Finance handles your data.' })
  return (
    <Prose title="Privacy" intro="Last updated: 16 October 2026. This explains what Veleta stores, why, and the choices you have.">
      <h2>What we collect</h2>
      <ul>
        <li><strong>Account details:</strong> your email address and a password, handled by our authentication provider (Supabase Auth). We never see or store your password in plain text.</li>
        <li><strong>Profile:</strong> display name, username, chosen avatar and an optional short bio.</li>
        <li><strong>Learning preferences:</strong> experience level, interests, daily goal, market preference and time zone, used to tailor recommendations and calculate your learning day.</li>
        <li><strong>Learning records:</strong> lessons completed, answers to assessed questions, XP, streaks, missions, achievements, mastery data and certificates.</li>
        <li><strong>Friends:</strong> friend requests and connections you choose to make.</li>
      </ul>
      <p>We do not ask for, and you should never enter, bank details, investment account details or other sensitive financial information.</p>
      <h2>Profile visibility</h2>
      <p>Profiles are <strong>private by default</strong>. If you make your profile public, others can see your display name, username, avatar, bio, level, XP, achievements, completed courses and certificates. Your email, settings, detailed answers and failed attempts are never shown publicly. Friends can see your name, avatar and XP on the friends leaderboard unless you turn that off in Settings.</p>
      <h2>Certificates</h2>
      <p>Anyone with a certificate ID can verify it, which shows the recipient name, course, date and exam score.</p>
      <h2>Demo mode</h2>
      <p>{isSupabaseConfigured ? 'This deployment uses an online account service.' : 'This deployment is running in demo mode: everything is stored only in your browser’s local storage and is never sent to a server.'} Clearing your browser data deletes demo-mode progress.</p>
      <h2>Deleting your account</h2>
      <p>You can delete your account in Settings. This permanently removes your profile, progress, XP, friendships and certificates; issued certificate IDs will no longer verify. We do not keep copies except where our infrastructure providers retain short-lived backups.</p>
      <h2>Third parties</h2>
      <p>Hosting is provided by GitHub Pages; accounts and data by Supabase when configured. Fonts are bundled with the site, so no font requests go to third parties. We do not use advertising or tracking cookies.</p>
    </Prose>
  )
}

export function Terms() {
  useMeta('Terms', { description: 'Terms of use for Veleta Finance.' })
  return (
    <Prose title="Terms of use" intro="Last updated: 16 October 2026. By using Veleta Finance you agree to these terms.">
      <h2>Educational use</h2>
      <p>Veleta provides general financial education. Nothing on Veleta is a recommendation to buy or sell any investment or a substitute for personalised advice from a qualified professional. Read the <Link to="/disclaimer">educational disclaimer</Link>.</p>
      <h2>Your account</h2>
      <p>Keep your login details secure and choose a respectful display name and username. Don’t attempt to access other learners’ data or manipulate XP, results or certificates. We may suspend accounts that abuse the service.</p>
      <h2>Certificates</h2>
      <p>Veleta certificates confirm completion of a Veleta course and its final exam. They are not accredited qualifications, do not carry university credit and do not qualify anyone to give financial advice. We may revoke certificates obtained by abuse.</p>
      <h2>Content</h2>
      <p>Lesson content is original and provided as-is. We work hard to keep it accurate but can’t guarantee it is free of errors or up to date — tax and regulatory rules in particular change. Examples featuring real companies describe them in general terms; calculations using invented figures are labelled as hypothetical.</p>
      <h2>Availability</h2>
      <p>Veleta is free and offered without warranty. Features may change and the service may occasionally be unavailable.</p>
    </Prose>
  )
}

export function Disclaimer() {
  useMeta('Educational disclaimer', { description: 'Veleta Finance is education, not financial advice.' })
  return (
    <Prose title="Educational disclaimer">
      <div className="alert alert--warning"><div>
        <p className="bold">Veleta Finance provides general educational information only. It is not personalised financial, investment, tax or legal advice.</p>
        <p className="mb-0">Veleta is not authorised or regulated by the UK Financial Conduct Authority or the US Securities and Exchange Commission, and is not a broker or investment adviser.</p>
      </div></div>
      <h2>Investing involves risk</h2>
      <p>The value of investments can go down as well as up, and you may get back less than you invest. Some investments, especially leveraged products, can lose more than your initial deposit.</p>
      <h2>Past performance and illustrations</h2>
      <p>Historical returns, illustrative calculations, calculator outputs and examples do not guarantee or predict future results. Calculators use the assumptions you enter; they are not forecasts.</p>
      <h2>Data</h2>
      <p>Charts marked <strong>synthetic</strong> are randomly generated for teaching and are not real market history. Charts marked <strong>illustrative</strong> are calculated from stated assumptions.</p>
      <h2>Tax and regulation</h2>
      <p>Where lessons mention tax or regulation, they identify the country and the tax year described. Rules change and depend on individual circumstances. Check official sources such as GOV.UK or IRS.gov, or speak to a qualified professional.</p>
      <h2>Certificates</h2>
      <p>Veleta certificates are educational course-completion credentials issued by Veleta Finance. They are not accredited and do not imply professional competence or regulatory approval.</p>
    </Prose>
  )
}

export function NotFound() {
  useMeta('Page not found', { noindex: true })
  return (
    <div className="container page">
      <div className="state">
        <Mascot mood="think" size={120} />
        <h1>We can’t find that page</h1>
        <p>The link may be broken or the page may have moved.</p>
        <div className="cluster" style={{ justifyContent: 'center' }}>
          <LinkButton to="/" variant="primary">Go home</LinkButton>
          <LinkButton to="/curriculum">Browse the curriculum</LinkButton>
        </div>
      </div>
    </div>
  )
}
