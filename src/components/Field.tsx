import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { Icon } from './Icon'

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string
  hint?: ReactNode
  error?: string | null
  prefix?: string
  suffix?: string
}

export function Field({ label, hint, error, prefix, suffix, ...input }: FieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errId = `${id}-err`
  const describedBy = [hint && hintId, error && errId].filter(Boolean).join(' ') || undefined
  const el = <input id={id} className="input" aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...input} />
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>{label}</label>
      {prefix || suffix ? (
        <div className="input-affix">
          {prefix && <span className="input-affix__part" aria-hidden="true">{prefix}</span>}
          {el}
          {suffix && <span className="input-affix__part" aria-hidden="true">{suffix}</span>}
        </div>
      ) : el}
      {hint && <div className="field__hint" id={hintId}>{hint}</div>}
      {error && <div className="field__error" id={errId}><Icon name="alert" size={16} />{error}</div>}
    </div>
  )
}

interface SelectFieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  hint?: string
}

export function SelectField({ label, value, onChange, options, hint }: SelectFieldProps) {
  const id = useId()
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>{label}</label>
      <select id={id} className="select" value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={hint ? `${id}-hint` : undefined}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {hint && <div className="field__hint" id={`${id}-hint`}>{hint}</div>}
    </div>
  )
}
