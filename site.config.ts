/**
 * Central deployment configuration. Every deployment-specific value lives here
 * (or is overridden by environment variables) so the repository name is never
 * hard-coded across unrelated files.
 *
 * - VITE_BASE_PATH: the path the site is served from. For a GitHub Pages
 *   project site this is "/<repo-name>/"; for a custom domain or user site it is "/".
 * - VITE_SITE_URL: the absolute public origin + base, used for canonical URLs,
 *   the sitemap, Open Graph tags, certificate verification links and auth redirects.
 */
export const DEFAULT_BASE_PATH = '/VeletaFinance/'
export const DEFAULT_SITE_URL = 'https://hugocc06.github.io/VeletaFinance/'

export function resolveBasePath(env: Record<string, string | undefined>): string {
  let base = env.VITE_BASE_PATH || DEFAULT_BASE_PATH
  if (!base.startsWith('/')) base = '/' + base
  if (!base.endsWith('/')) base += '/'
  return base
}

export function resolveSiteUrl(env: Record<string, string | undefined>): string {
  const url = env.VITE_SITE_URL || DEFAULT_SITE_URL
  return url.endsWith('/') ? url : url + '/'
}
