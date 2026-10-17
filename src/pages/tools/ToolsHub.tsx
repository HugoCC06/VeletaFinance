import { Link } from 'react-router-dom'
import { Icon, type IconName } from '../../components/Icon'
import { useMeta } from '../../lib/useMeta'

export const TOOLS: { id: string; title: string; body: string; icon: IconName; tone: string; lesson?: string }[] = [
  { id: 'compound-interest', title: 'Compound interest calculator', body: 'See how an initial sum and regular contributions could grow — and how much is contributions versus growth.', icon: 'chart', tone: 'violet' },
  { id: 'inflation', title: 'Inflation calculator', body: 'Explore how purchasing power changes over time, and convert nominal returns into real returns.', icon: 'percent', tone: 'coral' },
  { id: 'stock-return', title: 'Stock return calculator', body: 'Separate capital gains from dividends to see price return versus total return.', icon: 'bull', tone: 'mint' },
  { id: 'dividends', title: 'Dividend calculator', body: 'Estimate income per payment and per year, and calculate dividend yield.', icon: 'coins', tone: 'sun' },
  { id: 'valuation', title: 'Company valuation calculator', body: 'Try earnings and EBITDA multiples and a simplified discounted cash flow with a sensitivity table.', icon: 'scale', tone: 'sky' },
  { id: 'portfolio', title: 'Portfolio diversification tool', body: 'Build a hypothetical portfolio and see how allocation changes concentration and illustrative risk.', icon: 'pie', tone: 'violet' },
]

export function ToolsHub() {
  useMeta('Finance tools', { description: 'Free educational finance calculators: compound interest, inflation, stock returns, dividends, valuation and portfolio diversification.' })
  return (
    <div className="container page">
      <header className="page-header">
        <span className="eyebrow">Practical tools</span>
        <h1>Finance tools</h1>
        <p>Apply what you learn. Every calculator shows its formula and assumptions. Results are hypothetical illustrations, not forecasts or advice.</p>
      </header>
      <div className="grid-3">
        {TOOLS.map((t) => (
          <Link key={t.id} to={`/tools/${t.id}`} className="card card--interactive stack-sm">
            <span className={`icon-chip icon-chip--${t.tone}`}><Icon name={t.icon} /></span>
            <h2 className="mb-0" style={{ fontSize: 'var(--text-lg)' }}>{t.title}</h2>
            <p className="small muted mb-0">{t.body}</p>
          </Link>
        ))}
        <Link to="/charts" className="card card--interactive stack-sm">
          <span className="icon-chip icon-chip--sky"><Icon name="candles" /></span>
          <h2 className="mb-0" style={{ fontSize: 'var(--text-lg)' }}>Charts & case studies</h2>
          <p className="small muted mb-0">Interactive line and candlestick charts, plus company case studies.</p>
        </Link>
      </div>
    </div>
  )
}
