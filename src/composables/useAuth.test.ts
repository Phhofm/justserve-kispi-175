import { describe, it, expect, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => {
  const signInWithPassword = vi.fn()
  const signOut = vi.fn()
  const getSession = vi.fn()
  return { signInWithPassword, signOut, getSession }
})

vi.mock('../lib/supabase', () => ({
  getSupabase: () => ({
    auth: {
      signInWithPassword: mocks.signInWithPassword,
      signOut: mocks.signOut,
      getSession: mocks.getSession,
    },
  }),
}))

import { useAuth } from './useAuth'

describe('useAuth', () => {
  beforeEach(() => vi.clearAllMocks())

  it('meldet an und setzt den Benutzer', async () => {
    mocks.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'u1', email: 'a@b.c' } },
      error: null,
    })
    const { benutzer, angemeldet, anmelden } = useAuth()
    await anmelden('a@b.c', 'geheim')
    expect(angemeldet.value).toBe(true)
    expect(benutzer.value?.id).toBe('u1')
  })

  it('zeigt bei falschem Passwort eine deutsche Meldung', async () => {
    mocks.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid' },
    })
    const { angemeldet, fehler, anmelden } = useAuth()
    await anmelden('a@b.c', 'falsch')
    expect(angemeldet.value).toBe(false)
    expect(fehler.value).toContain('Anmeldung fehlgeschlagen')
  })
})
