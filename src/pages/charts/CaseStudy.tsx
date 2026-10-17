import { useParams, Link } from 'react-router-dom'
import { getCaseStudy, CASE_STUDIES_WRITTEN } from '../../data/caseStudies'
import { Icon } from '../../components/Icon'
import { Alert, EmptyState, LinkButton } from '../../components/ui'
import { useMeta } from '../../lib/useMeta'

export function CaseStudyPage() {
  const { caseId = '' } = useParams()
  const c = getCaseStudy(caseId)
  useMeta(c ? `${c.company} case study` : 'Case study', { description: c?.summary })
  if (!c) return <div className="container page"><EmptyState title="Case study not found" action={<LinkButton to="/charts" variant="primary">All case studies</LinkButton>} /></div>
  return (
    <div className="container page reading stack">
      <nav className="small" aria-label="Breadcrumb"><Link to="/charts">Charts &amp; case studies</Link> / <span aria-current="page">{c.company}</span></nav>
      <header>
        <div className="cluster-sm"><span className="pill">{c.market}</span><span className="pill pill--violet">{c.ticker} · {c.exchange}</span><span className="pill">{c.sector}</span></div>
        <h1 className="mt-4">{c.company}</h1>
        <p className="lead">{c.summary}</p>
      </header>
      <Alert tone="info" title="About this case study">Written in {CASE_STUDIES_WRITTEN} as a general description based on the company’s public materials. Businesses change; check the sources for current information. Nothing here is a recommendation to buy or sell.</Alert>
      <section><h2>Business model</h2><p>{c.businessModel}</p></section>
      <section><h2>Revenue sources</h2><ul>{c.revenueSources.map((r) => <li key={r}>{r}</li>)}</ul></section>
      <section><h2>Competitive position</h2><p>{c.competitivePosition}</p></section>
      <section><h2>Key risks</h2><ul>{c.risks.map((r) => <li key={r}>{r}</li>)}</ul></section>
      <section><h2>Valuation considerations</h2><p>{c.valuationNotes}</p></section>
      <section className="card stack-sm">
        <span className="pill pill--sun" style={{ alignSelf: 'flex-start' }}>Hypothetical practice — invented figures</span>
        <h2 className="mb-0">Practice calculation</h2>
        <p className="mb-0">{c.exercise.prompt}</p>
        <div className="table-wrap"><table className="table"><tbody>{c.exercise.hypothetical.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td className="num">{v}</td></tr>)}</tbody></table></div>
        <details><summary className="bold">Show the answer</summary><p className="mt-2 mb-0">{c.exercise.answer}</p></details>
      </section>
      <section className="card stack-sm">
        <h2 className="mb-0">Find the real numbers</h2>
        <ol>{c.findIt.map((f) => <li key={f}>{f}</li>)}</ol>
      </section>
      <section>
        <h2>Sources</h2>
        <ul>{c.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label} <Icon name="external" size={14} /></a></li>)}</ul>
        <p className="small muted">Past performance does not predict future performance. Share prices and financial results change; always use the latest filings.</p>
      </section>
    </div>
  )
}
