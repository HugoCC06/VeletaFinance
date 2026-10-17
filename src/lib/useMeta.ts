import { useEffect } from 'react'

const BASE_TITLE = 'Veleta Finance'
const DEFAULT_DESC = 'Learn to invest one lesson at a time. Short, interactive finance lessons on investing, stocks, company analysis, ETFs, valuation, bonds and more — free.'

function setMeta(selector: string, attr: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    const m = selector.match(/\[(name|property)="([^"]+)"\]/)
    if (m) el.setAttribute(m[1], m[2])
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

/**
 * Sets the document title and description for the current route.
 * Private pages pass `noindex` so search engines never index learner data.
 */
export function useMeta(title: string, opts: { description?: string; noindex?: boolean } = {}) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE_TITLE}` : `${BASE_TITLE} — Learn to invest, one lesson at a time`
    const desc = opts.description ?? DEFAULT_DESC
    setMeta('meta[name="description"]', 'content', desc)
    setMeta('meta[property="og:title"]', 'content', document.title)
    setMeta('meta[property="og:description"]', 'content', desc)
    setMeta('meta[name="robots"]', 'content', opts.noindex ? 'noindex, nofollow' : 'index, follow')
  }, [title, opts.description, opts.noindex])
}
