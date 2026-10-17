import { Fragment, type ReactNode } from 'react'

/**
 * Renders the small, safe markdown subset used in lesson content:
 * paragraphs (blank line), "- " bullet lists, "1. " numbered lists,
 * **bold** and *italic*. No HTML is ever injected.
 */
function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const t = m[0]
    out.push(t.startsWith('**') ? <strong key={`${keyBase}-${i++}`}>{t.slice(2, -2)}</strong> : <em key={`${keyBase}-${i++}`}>{t.slice(1, -1)}</em>)
    last = m.index + t.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export function RichText({ text, className }: { text: string; className?: string }) {
  const blocks = text.split(/\n\s*\n/)
  return (
    <div className={['rich', className].filter(Boolean).join(' ')}>
      {blocks.map((block, bi) => {
        const lines = block.split('\n').filter((l) => l.trim())
        if (lines.length && lines.every((l) => /^\s*- /.test(l)))
          return <ul key={bi}>{lines.map((l, li) => <li key={li}>{inline(l.replace(/^\s*- /, ''), `${bi}-${li}`)}</li>)}</ul>
        if (lines.length && lines.every((l) => /^\s*\d+\. /.test(l)))
          return <ol key={bi}>{lines.map((l, li) => <li key={li}>{inline(l.replace(/^\s*\d+\. /, ''), `${bi}-${li}`)}</li>)}</ol>
        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {inline(l, `${bi}-${li}`)}
              </Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}
