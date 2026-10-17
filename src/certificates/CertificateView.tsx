import { LogoMark } from '../brand/Logo'
import { formatDate } from '../lib/format'

export interface CertificateData {
  id: string
  recipientName: string
  courseTitle: string
  outcomes: string[]
  issuedAt: string
  score: number
  verifyUrl: string
  demo: boolean
}

/** On-screen certificate. The downloadable PDF (./pdf.ts) uses the same layout. */
export function CertificateView({ data, compact = false }: { data: CertificateData; compact?: boolean }) {
  return (
    <article className={`certificate${compact ? ' certificate--compact' : ''}`} aria-label={`Certificate: ${data.courseTitle}, awarded to ${data.recipientName}`}>
      {data.demo && <div className="certificate__demo" aria-hidden="true">DEMO</div>}
      <div className="certificate__border">
        <header className="certificate__head">
          <LogoMark size={compact ? 28 : 44} />
          <span className="certificate__brand">Veleta Finance</span>
        </header>
        <p className="certificate__kicker">Certificate of Course Completion</p>
        <p className="certificate__line">This certifies that</p>
        <p className="certificate__name">{data.recipientName}</p>
        <p className="certificate__line">has completed the Veleta Finance course</p>
        <p className="certificate__course">{data.courseTitle}</p>
        {!compact && (
          <ul className="certificate__outcomes">
            {data.outcomes.map((o) => <li key={o}>{o}</li>)}
          </ul>
        )}
        <div className="certificate__meta">
          <div><span>Awarded</span><strong>{formatDate(data.issuedAt)}</strong></div>
          <div><span>Final exam</span><strong>{Math.round(data.score * 100)}%</strong></div>
          <div><span>Certificate ID</span><strong>{data.id}</strong></div>
        </div>
        <p className="certificate__note">
          {data.demo
            ? 'Demo certificate generated in demo mode. It is stored only in the learner’s browser and cannot be verified.'
            : <>Educational course-completion credential issued by Veleta Finance. Not an accredited qualification. Verify at {data.verifyUrl}</>}
        </p>
      </div>
    </article>
  )
}
