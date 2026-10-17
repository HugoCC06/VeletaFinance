import type { Backend } from './types'
import { LocalBackend } from './local'

let instance: Backend | null = null

/**
 * Accepts the many shapes people paste — "https://ref.supabase.co/rest/v1/",
 * a trailing slash, surrounding spaces/quotes, or the dashboard link
 * "https://supabase.com/dashboard/project/ref" — and returns "https://ref.supabase.co".
 * supabase-js appends its own paths, so anything extra causes
 * "Invalid path specified in request URL".
 */
export function normaliseSupabaseUrl(raw: string | undefined): string | undefined {
  const v = raw?.trim().replace(/^["']|["']$/g, '')
  if (!v) return undefined
  const dash = v.match(/supabase\.com\/dashboard\/project\/([a-z0-9]+)/i)
  if (dash) return `https://${dash[1]}.supabase.co`
  try {
    return new URL(v.includes('://') ? v : `https://${v}`).origin
  } catch {
    return v
  }
}

export const SUPABASE_URL = normaliseSupabaseUrl(import.meta.env.VITE_SUPABASE_URL as string | undefined)
export const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim().replace(/^["']|["']$/g, '') || undefined
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

/**
 * Returns the app's backend: Supabase when VITE_SUPABASE_URL and
 * VITE_SUPABASE_ANON_KEY are set at build time, otherwise the clearly
 * labelled local demo mode.
 */
export async function getBackend(): Promise<Backend> {
  if (instance) return instance
  if (isSupabaseConfigured) {
    const { SupabaseBackend } = await import('./supabase')
    instance = new SupabaseBackend(SUPABASE_URL!, SUPABASE_ANON_KEY!)
  } else {
    instance = new LocalBackend()
  }
  return instance
}

export function setBackendForTests(b: Backend | null) {
  instance = b
}
