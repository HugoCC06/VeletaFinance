import { useId } from 'react'
import type { Question } from '../content/types'
import { seededOrder } from '../engine/grading'
import { Icon } from '../components/Icon'
import { RichText } from '../components/RichText'
import { matchKey } from '../engine/grading'
import { matchOptions, type RawAnswer } from './answers'

interface Props {
  question: Question
  value: RawAnswer
  onChange: (v: RawAnswer) => void
  /** After checking: lock inputs and reveal which options were right. */
  reveal?: boolean
  onSubmit?: () => void
  headingLevel?: 2 | 3
}

export function QuestionView({ question: q, value, onChange, reveal = false, onSubmit, headingLevel = 2 }: Props) {
  const id = useId()
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  const promptId = `${id}-prompt`
  return (
    <div className="question" data-qid={q.id} data-kind={q.kind}>
      {q.final && <span className="pill pill--sun question__badge"><Icon name="star" size={14} />Final challenge</span>}
      {q.scenario && <div className="question__scenario"><RichText text={q.scenario} /></div>}
      <Heading className="question__prompt" id={promptId}>{q.prompt}</Heading>
      {q.kind === 'multi' && <p className="subtle">Select all that apply.</p>}
      <QuestionInput q={q} value={value} onChange={onChange} reveal={reveal} onSubmit={onSubmit} labelledBy={promptId} />
    </div>
  )
}

function QuestionInput({ q, value, onChange, reveal, onSubmit, labelledBy }: { q: Question; value: RawAnswer; onChange: (v: RawAnswer) => void; reveal: boolean; onSubmit?: () => void; labelledBy: string }) {
  const name = useId()
  switch (q.kind) {
    case 'mcq':
    case 'tf': {
      const order = q.kind === 'tf' ? [0, 1] : seededOrder(q.options.length, q.id)
      return (
        <div role="radiogroup" aria-labelledby={labelledBy} className={`options${q.kind === 'tf' ? ' options--tf' : ''}`}>
          {order.map((i, n) => {
            const selected = value === i
            const state = reveal ? (i === q.answer ? 'correct' : selected ? 'wrong' : '') : ''
            return (
              <label key={i} className={`option${selected ? ' is-selected' : ''}${state ? ` is-${state}` : ''}`}>
                <input type="radio" name={name} checked={selected} disabled={reveal} onChange={() => onChange(i)} />
                <span className="option__key" aria-hidden="true">{q.kind === 'tf' ? (i === 0 ? 'T' : 'F') : n + 1}</span>
                <span className="option__text">{q.options[i]}</span>
                {state === 'correct' && <span className="option__mark"><Icon name="check" size={20} /><span className="sr-only">Correct answer</span></span>}
                {state === 'wrong' && <span className="option__mark"><Icon name="x" size={20} /><span className="sr-only">Your answer, incorrect</span></span>}
              </label>
            )
          })}
        </div>
      )
    }
    case 'multi': {
      const order = seededOrder(q.options.length, q.id)
      const sel = Array.isArray(value) ? (value as number[]) : []
      return (
        <div role="group" aria-labelledby={labelledBy} className="options">
          {order.map((i) => {
            const selected = sel.includes(i)
            const should = q.answer.includes(i)
            const state = reveal ? (should ? 'correct' : selected ? 'wrong' : '') : ''
            return (
              <label key={i} className={`option option--check${selected ? ' is-selected' : ''}${state ? ` is-${state}` : ''}`}>
                <input type="checkbox" checked={selected} disabled={reveal} onChange={() => onChange(selected ? sel.filter((x) => x !== i) : [...sel, i])} />
                <span className="option__key option__key--box" aria-hidden="true">{selected && <Icon name="check" size={16} />}</span>
                <span className="option__text">{q.options[i]}</span>
                {state === 'correct' && <span className="option__mark"><Icon name="check" size={20} /><span className="sr-only">{selected ? 'Correctly selected' : 'Should have been selected'}</span></span>}
                {state === 'wrong' && <span className="option__mark"><Icon name="x" size={20} /><span className="sr-only">Should not have been selected</span></span>}
              </label>
            )
          })}
        </div>
      )
    }
    case 'numeric': {
      const inputId = `${name}-num`
      return (
        <div className="numeric">
          <label htmlFor={inputId} className="sr-only">Your answer</label>
          <div className="input-affix numeric__box">
            {q.prefix && <span className="input-affix__part" aria-hidden="true">{q.prefix}</span>}
            <input
              id={inputId}
              className="input numeric__input"
              inputMode="decimal"
              autoComplete="off"
              value={typeof value === 'string' ? value : ''}
              disabled={reveal}
              aria-describedby={labelledBy}
              placeholder="Type a number"
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && onSubmit) { e.preventDefault(); onSubmit() } }}
            />
            {q.suffix && <span className="input-affix__part" aria-hidden="true">{q.suffix}</span>}
          </div>
          <p className="subtle mt-2">You can type values like 1102.50, 1,102.5 or 2.5k.{q.tolerance > 0 ? ' Small rounding differences are accepted.' : ''}</p>
        </div>
      )
    }
    case 'match': {
      const opts = matchOptions(q)
      const key = matchKey(q.right)
      const vals = Array.isArray(value) ? (value as (number | null)[]) : q.left.map(() => null)
      return (
        <div className="match" role="group" aria-labelledby={labelledBy}>
          {q.left.map((l, i) => {
            const sid = `${name}-m${i}`
            const state = reveal ? (vals[i] === key[i] ? 'correct' : 'wrong') : ''
            return (
              <div key={l} className={`match__row${state ? ` is-${state}` : ''}`}>
                <label htmlFor={sid} className="match__left">{l}</label>
                <select id={sid} className="select match__select" value={vals[i] ?? ''} disabled={reveal} onChange={(e) => { const next = [...vals]; next[i] = e.target.value === '' ? null : Number(e.target.value); onChange(next) }}>
                  <option value="">Choose…</option>
                  {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                {state === 'correct' && <span className="match__mark"><Icon name="check" /><span className="sr-only">Correct</span></span>}
                {state === 'wrong' && <span className="match__mark"><Icon name="x" /><span className="sr-only">Incorrect: should be {q.right[i]}</span></span>}
              </div>
            )
          })}
        </div>
      )
    }
    case 'order': {
      const ord = Array.isArray(value) && value.length === q.items.length ? (value as number[]) : q.items.map((_, i) => i)
      const move = (from: number, to: number) => {
        if (to < 0 || to >= ord.length) return
        const next = [...ord]
        const [x] = next.splice(from, 1)
        next.splice(to, 0, x)
        onChange(next)
      }
      return (
        <ol className="order" aria-labelledby={labelledBy}>
          {ord.map((itemIdx, pos) => {
            const state = reveal ? (itemIdx === pos ? 'correct' : 'wrong') : ''
            return (
              <li key={itemIdx} className={`order__item${state ? ` is-${state}` : ''}`}>
                <span className="order__pos" aria-hidden="true">{pos + 1}</span>
                <span className="order__text">{q.items[itemIdx]}</span>
                {!reveal && (
                  <span className="order__controls">
                    <button type="button" className="btn btn--sm btn--icon" onClick={() => move(pos, pos - 1)} disabled={pos === 0} aria-label={`Move “${q.items[itemIdx]}” up`}><Icon name="chevronUp" size={18} /></button>
                    <button type="button" className="btn btn--sm btn--icon" onClick={() => move(pos, pos + 1)} disabled={pos === ord.length - 1} aria-label={`Move “${q.items[itemIdx]}” down`}><Icon name="chevronDown" size={18} /></button>
                  </span>
                )}
                {state === 'correct' && <span className="order__mark"><Icon name="check" /><span className="sr-only">Correct position</span></span>}
                {state === 'wrong' && <span className="order__mark"><Icon name="x" /><span className="sr-only">Wrong position</span></span>}
              </li>
            )
          })}
        </ol>
      )
    }
  }
}
