import { describe, expect, it } from 'vitest'
import { normaliseSupabaseUrl } from './index'

describe('normaliseSupabaseUrl', () => {
  it('reduces pasted URLs to the project origin', () => {
    for (const v of ['https://abcd.supabase.co', 'https://abcd.supabase.co/', 'https://abcd.supabase.co/rest/v1/', ' "https://abcd.supabase.co/auth/v1" ', 'abcd.supabase.co', 'https://supabase.com/dashboard/project/abcd/settings/api'])
      expect(normaliseSupabaseUrl(v)).toBe('https://abcd.supabase.co')
    expect(normaliseSupabaseUrl('')).toBeUndefined()
  })
})
