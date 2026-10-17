/** Absolute link to the public verification page for a certificate (works under any base path). */
export function verifyUrl(id: string): string {
  const { origin, pathname } = window.location
  return `${origin}${pathname}#/verify/${encodeURIComponent(id)}`
}

/** LinkedIn's documented "add certification to profile" link. */
export function linkedInAddUrl(opts: { name: string; id: string; issuedAt: string; url: string }): string {
  const d = new Date(opts.issuedAt)
  const p = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: opts.name,
    organizationName: 'Veleta Finance',
    issueYear: String(d.getUTCFullYear()),
    issueMonth: String(d.getUTCMonth() + 1),
    certUrl: opts.url,
    certId: opts.id,
  })
  return `https://www.linkedin.com/profile/add?${p.toString()}`
}
