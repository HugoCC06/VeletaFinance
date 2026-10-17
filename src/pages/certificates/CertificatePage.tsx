import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCourse } from '../../content'
import { CertificateView, type CertificateData } from '../../certificates/CertificateView'
import { linkedInAddUrl, verifyUrl } from '../../certificates/links'
import { pdfSafe } from '../../certificates/pdfText'
import { Icon } from '../../components/Icon'
import { Alert, Button, EmptyState, LinkButton } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { useApp } from '../../state/AppContext'
import { useMeta } from '../../lib/useMeta'

export function CertificatePage() {
  const { certId = '' } = useParams()
  const { state } = useApp()
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  useMeta('Certificate', { noindex: true })
  const cert = state?.certificates.find((c) => c.id === certId)
  const course = cert ? getCourse(cert.courseId) : undefined
  if (!state) return null
  if (!cert || !course) {
    return <div className="container page"><EmptyState title="Certificate not found" action={<LinkButton to="/app/courses" variant="primary">Your courses</LinkButton>}>Certificates appear here once you pass a course’s final exam.</EmptyState></div>
  }
  const url = verifyUrl(cert.id)
  const data: CertificateData = { id: cert.id, recipientName: cert.recipientName, courseTitle: course.title, outcomes: course.outcomes, issuedAt: cert.issuedAt, score: cert.score, verifyUrl: url, demo: cert.demo }
  const download = async () => {
    setBusy(true)
    try {
      const { downloadCertificatePdf } = await import('../../certificates/pdf')
      await downloadCertificatePdf(data)
      toast.show('Certificate PDF downloaded.', 'success')
    } catch {
      toast.show('We couldn’t create the PDF. Please try again.', 'danger')
    } finally {
      setBusy(false)
    }
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.show('Verification link copied.', 'success')
    } catch {
      toast.show('Copy failed — select the link and copy it manually.', 'danger')
    }
  }
  return (
    <div className="container page stack">
      <header className="page-header mb-0">
        <span className="eyebrow">Certificate</span>
        <h1>{course.title}</h1>
      </header>
      {cert.revoked && <Alert tone="danger" title="This certificate has been revoked">It no longer verifies.</Alert>}
      {cert.demo && <Alert tone="warning" title="Demo certificate">This certificate was issued in demo mode. It lives only in this browser and can’t be verified by others. Certificates issued with an online account are recorded by Veleta’s servers and can be verified publicly.</Alert>}
      {pdfSafe(cert.recipientName).lossy && <Alert tone="info">Your name contains characters the PDF’s built-in font can’t display; they appear as “?” in the PDF. The on-screen certificate and verification page show your name correctly.</Alert>}
      <div className="certificate-wrap"><CertificateView data={data} /></div>
      <div className="cluster">
        <Button variant="primary" icon="download" onClick={download} loading={busy}>Download PDF</Button>
        {!cert.demo && <Button icon="copy" onClick={copy}>Copy verification link</Button>}
        {!cert.demo && <a className="btn" href={linkedInAddUrl({ name: `${course.title} (Veleta Finance)`, id: cert.id, issuedAt: cert.issuedAt, url })} target="_blank" rel="noopener noreferrer"><Icon name="external" size={18} />Add to LinkedIn</a>}
      </div>
      {!cert.demo && <p className="small muted">Anyone can confirm this certificate at <a href={url}>{url}</a>. Verification shows your name, the course, the date and your exam score — nothing else.</p>}
    </div>
  )
}
