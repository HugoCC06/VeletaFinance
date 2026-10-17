import { describe, expect, it } from 'vitest'
import { parseAssessmentResult, parseUserState } from './parse'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { ACHIEVEMENTS } from '../engine/achievements'
import { XP } from '../engine/rewards'

describe('response parsing', () => {
  it('survives malformed state payloads', () => {
    const s = parseUserState({ profile: null, xp: { total: 'abc' }, stats: [{ box: 99 }], missions: 'nope' }, { id: 'u', email: 'e', emailConfirmed: true })
    expect(s.xp.total).toBe(0)
    expect(s.stats[0].box).toBe(5)
    expect(s.missions).toEqual([])
    expect(s.profile.displayName).toBe('Learner')
  })
  it('rejects non-object results', () => {
    expect(() => parseAssessmentResult(null)).toThrow()
  })
})

describe('client/server sync', () => {
  const sql = readFileSync(resolve(process.cwd(), 'supabase/migrations/20261016000002_functions.sql'), 'utf8')
  const seed = readFileSync(resolve(process.cwd(), 'supabase/migrations/20261017000006_content_seed.sql'), 'utf8')
  it('seeds every achievement for the server to evaluate', () => {
    for (const a of ACHIEVEMENTS) expect(seed, a.id).toContain(`('${a.id}', '${a.metric}', ${a.threshold},`)
    expect(sql).toContain('evaluate_achievements')
  })
  it('seeds every XP setting', () => {
    for (const [k, v] of Object.entries(XP)) expect(seed).toContain(`('${k}', ${v})`)
  })
})
