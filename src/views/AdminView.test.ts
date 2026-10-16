import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import type { Beitrag } from '../lib/types'

const mocks = vi.hoisted(() => {
  const getSession = vi.fn()
  const signInWithPassword = vi.fn()
  const signOut = vi.fn()
  const order = vi.fn()
  const selectEq = vi.fn(() => ({ order }))
  const select = vi.fn(() => ({ eq: selectEq }))
  const from = vi.fn(() => ({ select }))
  return { getSession, signInWithPassword, signOut, order, selectEq, select, from }
})

vi.mock('../lib/supabase', () => ({
  getSupabase: () => ({
    auth: {
      getSession: mocks.getSession,
      signInWithPassword: mocks.signInWithPassword,
      signOut: mocks.signOut,
    },
    from: mocks.from,
    storage: { from: () => ({ remove: vi.fn(), move: vi.fn() }) },
  }),
  fotoUrl: (pfad: string) => `/fotos/${pfad}`,
}))

import AdminView from './AdminView.vue'

const beitrag: Beitrag = {
  id: '1',
  created_at: 'x',
  kategorie: 'autos',
  menge: 5,
  einreicher: 'Familie Muster',
  foto_pfad: 'pending/1.jpg',
  status: 'pending',
  freigegeben_am: null,
}

describe('AdminView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.order.mockResolvedValue({ data: [], error: null })
  })

  it('zeigt ohne Sitzung das Login-Formular', async () => {
    mocks.getSession.mockResolvedValue({ data: { session: null } })
    const w = mount(AdminView)
    await flushPromises()
    expect(w.find('[data-testid="login"]').exists()).toBe(true)
    expect(w.text()).toContain('Anmelden')
  })

  it('zeigt nach bestehender Sitzung die offenen Beiträge', async () => {
    mocks.getSession.mockResolvedValue({ data: { session: { user: { id: 'u1' } } } })
    mocks.order.mockResolvedValue({ data: [beitrag], error: null })
    const w = mount(AdminView)
    await flushPromises()
    expect(w.text()).toContain('Offene Beiträge')
    expect(w.findAll('[data-testid="offener-beitrag"]')).toHaveLength(1)
    expect(w.text()).toContain('Familie Muster')
  })
})
