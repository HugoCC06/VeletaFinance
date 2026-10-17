import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCourse } from '../../content'
import type { CertificateVerification } from '../../backend/types'
import { Mascot } from '../../brand/Mascot'
import { Field } from '../../components/Field'
import { Icon } from '../../components/Icon'
import { Alert, Button, LoadingState } from '../../components/ui'
import { useApp } from '../../state/AppContext'
import { useMeta } from '../../lib/useMeta'
import { formatDate } from '../../lib/format'

export function Verify() {
  const { certId } = useParams()
  const { backend } = useApp()
  const navigate = useNavigate()
  const [input, setInput] = useState(certId ?? '')
  const [result, setResult] = useState<CertificateVerification | null | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)
  useMeta('Verify a certificate', { description: 'Check that a Veleta Finance course-completion certificate is genuine.', noindex: !!certId })
  useEffect(() => {
    if (!certId || !backend) return
    setResult(undefined)
    setError(null)
    backend.verifyCertificate(certId).then(setResult).catch((e) => setError(e instanceof Error ? e.message : 'Verification failed'))
  }, [certId, backend])
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const id = input.trim().toUpperCase()
    if (id) navigate(`/verify/${encodeURIComponent(id)}`)
  }
  const course = result ? getCourse(result.courseId) : undefined
  return (
    <div className="container page reading stack">
      <header className="page-header mb-0">
        <span className="eyebrow">Certificates</span>
        <h1>Verify a certificate</h1>
        <p>Enter a certificate ID (for example VF-AB12-CD34) to confirm it was issued by Veleta Finance.</p>
      </header>
      <form className="card stack" onSubmit={submit}>
        <Field label="Certificate ID" value={input} onChange={(e) => setInput(e.target.value)} placeholder="VF-XXXX-XXXX" autoComplete="off" />
        <div><Button type="submit" variant="primary" icon="search">Verify</Button></div>
      </form>
      {certId && (error ? <Alert tone="danger">{error}</Alert> : result === undefined ? <LoadingState label="Checking…" /> : result === null ? (
        <div className="card verify-result is-invalid" role="status">
          <Mascot mood="oops" size={70} />
          <div>
            <h2 className="mb-0"><Icon name="x" /> No certificate found</h2>
            <p className="muted mb-0">There is no Veleta certificate with ID <strong>{certId}</strong>. Check the ID for typos. Certificates are removed if the learner deletes their account.</p>
          </div>
        </div>
      ) : (
        <div className={`card verify-result ${result.status === 'valid' && !result.demo ? 'is-valid' : 'is-invalid'}`} role="status">
          <Mascot mood={result.status === 'valid' ? 'cheer' : 'oops'} size={70} />
          <div className="stack-sm">
            <h2 className="mb-0"><Icon name={result.status === 'valid' ? 'shield' : 'alert'} /> {result.status === 'valid' ? (result.demo ? 'Demo certificate (found on this device only)' : 'Valid certificate') : 'Certificate revoked'}</h2>
            <dl className="verify-dl">
              <dt>Awarded to</dt><dd>{result.recipientName}</dd>
              <dt>Course</dt><dd>{course?.title ?? result.courseId}</dd>
              <dt>Date awarded</dt><dd>{formatDate(result.issuedAt)}</dd>
              <dt>Final exam score</dt><dd>{Math.round(result.score * 100)}%</dd>
              <dt>Certificate ID</dt><dd>{result.id}</dd>
            </dl>
            <p className="small muted mb-0">Veleta certificates are educational course-completion credentials. They are not accredited qualifications.{result.demo ? ' Demo certificates are not recorded by Veleta’s servers and cannot be independently verified.' : ''}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
