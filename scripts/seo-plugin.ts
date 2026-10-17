/**
 * Build-time SEO for a static, hash-routed site. Search engines don't index
 * "#/" routes as separate pages, so we emit real HTML pages for public course
 * content at /courses/<slug>/, plus robots.txt and sitemap.xml. Learner pages
 * and profiles are never listed and carry noindex at runtime.
 */
import type { Plugin } from 'vite'
import { COURSES } from '../src/content/index.ts'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function coursePage(siteUrl: string, c: (typeof COURSES)[number]) {
  const url = `${siteUrl}courses/${c.slug}/`
  const lessons = c.units.flatMap((u) => u.lessons).length
  return `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(c.title)} · Veleta Finance</title>
<meta name="description" content="${esc(c.description)}" />
<link rel="canonical" href="${url}" /><link rel="icon" href="../../favicon.svg" type="image/svg+xml" />
<meta property="og:title" content="${esc(c.title)} · Veleta Finance" /><meta property="og:description" content="${esc(c.description)}" />
<meta property="og:url" content="${url}" /><meta property="og:image" content="${siteUrl}og-image.png" />
<style>body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:46rem;margin:2rem auto;padding:0 1rem;color:#1d1a35;line-height:1.55}a{color:#5536e8}h1{line-height:1.15}.cta{display:inline-block;background:#6b4eff;color:#fff;padding:.7rem 1.2rem;border-radius:12px;font-weight:700;text-decoration:none}small{color:#55526f}</style>
</head><body>
<p><a href="../../">Veleta Finance</a></p>
<h1>${esc(c.title)}</h1>
<p>${esc(c.description)}</p>
<p><a class="cta" href="../../#/curriculum/${c.slug}">Open this course in Veleta</a></p>
<h2>What you’ll learn</h2><ul>${c.outcomes.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>
<h2>${lessons} lessons in ${c.units.length} units</h2>
${c.units.map((u, i) => `<h3>Unit ${i + 1}: ${esc(u.title)}</h3><ol>${u.lessons.map((l) => `<li><strong>${esc(l.title)}</strong> — ${esc(l.description)}</li>`).join('')}</ol>`).join('\n')}
<p>Each unit ends with a checkpoint, and the course ends with a final exam (pass mark ${Math.round(c.passMark * 100)}%). Passing earns a Veleta Finance course-completion certificate — an educational credential, not an accredited qualification.</p>
<p><small>Veleta Finance provides general financial education, not personalised financial advice. Investing involves risk, including possible loss of capital.</small></p>
</body></html>`
}

export function seoPlugin(siteUrl: string): Plugin {
  return {
    name: 'veleta-seo',
    apply: 'build',
    generateBundle() {
      const urls = [siteUrl, ...COURSES.map((c) => `${siteUrl}courses/${c.slug}/`)]
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n` })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`,
      })
      for (const c of COURSES) this.emitFile({ type: 'asset', fileName: `courses/${c.slug}/index.html`, source: coursePage(siteUrl, c) })
      // GitHub Pages serves 404.html for unknown paths: send visitors back into the app.
      this.emitFile({
        type: 'asset',
        fileName: '404.html',
        source: `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Page not found · Veleta Finance</title><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${siteUrl}#/not-found"></head><body><p>Page not found. <a href="${siteUrl}">Go to Veleta Finance</a>.</p></body></html>`,
      })
    },
  }
}
