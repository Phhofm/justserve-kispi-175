import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import type { Beitrag } from '../lib/types'

const mocks = vi.hoisted(() => {
  const order = vi.fn()
  const eq = vi.fn(() => ({ order }))
  const select = vi.fn(() => ({ eq }))
  const from = vi.fn(() => ({ select }))
  return { order, eq, select, from }
})

vi.mock('../lib/supabase', () => ({
  getSupabase: () => ({ from: mocks.from }),
  fotoUrl: (pfad: string) => `/fotos/${pfad}`,
}))

import MosaicView from './MosaicView.vue'

const beitrag = (id: string): Beitrag => ({
  id,
  created_at: '2027-01-01T00:00:00Z',
  kategorie: 'autos',
  menge: 1,
  einreicher: null,
  foto_pfad: `approved/${id}.jpg`,
  status: 'approved',
  freigegeben_am: null,
})

describe('MosaicView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.order.mockResolvedValue({ data: [], error: null })
  })

  it('zeigt eine Kachel pro freigegebenem Beitrag und den Download-Button', async () => {
    mocks.order.mockResolvedValue({ data: [beitrag('1'), beitrag('2')], error: null })
    const w = mount(MosaicView)
    await flushPromises()
    expect(w.findAll('img')).toHaveLength(2)
    expect(w.text()).toContain('Mosaik herunterladen')
  })

  it('zeigt einen Hinweis, wenn noch nichts freigegeben ist', async () => {
    const w = mount(MosaicView)
    await flushPromises()
    expect(w.text()).toContain('Noch keine freigegebenen Fotos')
    expect(w.text()).not.toContain('Mosaik herunterladen')
  })
})
