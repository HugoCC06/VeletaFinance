import type { Backend } from './types'
import { LocalBackend } from './local'

let instance: Backend | null = null

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
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
