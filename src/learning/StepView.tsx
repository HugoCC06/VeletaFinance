import type { Step } from '../content/types'
import { Diagram } from '../charts/Diagram'
import { Icon, type IconName } from '../components/Icon'
import { RichText } from '../components/RichText'

const CALLOUT: Record<string, { icon: IconName; label: string }> = {
  key: { icon: 'spark', label: 'Key idea' },
  example: { icon: 'doc', label: 'Example' },
  warning: { icon: 'alert', label: 'Watch out' },
  ukus: { icon: 'globe', label: 'UK & US' },
  analogy: { icon: 'leaf', label: 'Think of it like this' },
}

export function StepView({ step }: { step: Exclude<Step, { kind: 'question' }> }) {
  switch (step.kind) {
    case 'text':
      return (
        <div className="step step--text">
          {step.title && <h2>{step.title}</h2>}
          <RichText text={step.body} />
        </div>
      )
    case 'callout': {
      const c = CALLOUT[step.variant]
      return (
        <div className={`step callout callout--${step.variant}`}>
          <div className="callout__label"><Icon name={c.icon} size={18} />{c.label}</div>
          <h2>{step.title}</h2>
          <RichText text={step.body} />
        </div>
      )
    }
    case 'diagram':
      return (
        <div className="step step--diagram">
          {step.title && <h2>{step.title}</h2>}
          <Diagram spec={step.diagram} title={step.title ?? step.caption ?? 'Diagram'} />
          {step.caption && <p className="subtle mt-2">{step.caption}</p>}
        </div>
      )
    case 'numbers':
      return (
        <div className="step step--numbers">
          <h2>{step.title}</h2>
          <div className="table-wrap">
            <table className="table numbers-table">
              <tbody>
                {step.rows.map(([k, v]) => (
                  <tr key={k}><th scope="row">{k}</th><td className="num">{v}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          {step.note && <p className="subtle mt-2">{step.note}</p>}
        </div>
      )
    case 'recap':
      return (
        <div className="step step--recap">
          <div className="callout__label"><Icon name="check" size={18} />Recap</div>
          <h2>What to remember</h2>
          <ul className="recap-list">
            {step.points.map((p) => <li key={p}><Icon name="check" size={18} /><span>{p}</span></li>)}
          </ul>
        </div>
      )
  }
}
