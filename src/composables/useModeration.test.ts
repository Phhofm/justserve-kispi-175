import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Beitrag } from '../lib/types'

const mocks = vi.hoisted(() => {
  const order = vi.fn()
  const updateEq = vi.fn()
  const update = vi.fn(() => ({ eq: updateEq }))
  const selectEq = vi.fn(() => ({ order }))
  const select = vi.fn(() => ({ eq: selectEq }))
  const from = vi.fn(() => ({ select, update }))
  const remove = vi.fn()
  const move = vi.fn()
  const storageFrom = vi.fn(() => ({ remove, move }))
  return { order, updateEq, update, selectEq, select, from, remove, move, storageFrom }
})

vi.mock('../lib/supabase', () => ({
  getSupabase: () => ({ from: mocks.from, storage: { from: mocks.storageFrom } }),
}))

import { useModeration } from './useModeration'

const beitrag: Beitrag = {
  id: '1',
  created_at: 'x',
  kategorie: 'autos',
  menge: 5,
  einreicher: 'A',
  foto_pfad: 'pending/1.jpg',
  status: 'pending',
  freigegeben_am: null,
}

describe('useModeration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.order.mockResolvedValue({ data: [beitrag], error: null })
    mocks.updateEq.mockResolvedValue({ error: null })
    mocks.remove.mockResolvedValue({ error: null })
    mocks.move.mockResolvedValue({ error: null })
  })

  it('lädt offene (pending) Beiträge', async () => {
    const { offene, laden } = useModeration()
    await laden()
    expect(mocks.selectEq).toHaveBeenCalledWith('status', 'pending')
    expect(offene.value).toHaveLength(1)
  })

  it('gibt frei: verschiebt das Foto nach approved und setzt den Status', async () => {
    const { offene, laden, freigeben } = useModeration()
    await laden()
    await freigeben('1')
    expect(mocks.move).toHaveBeenCalledWith('pending/1.jpg', 'approved/1.jpg')
    expect(mocks.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'approved', foto_pfad: 'approved/1.jpg' }),
    )
    expect(offene.value).toHaveLength(0)
  })

  it('gibt auch frei, wenn das Verschieben scheitert (Foto bleibt erreichbar)', async () => {
    const { offene, laden, freigeben } = useModeration()
    await laden()
    mocks.move.mockResolvedValueOnce({ error: { message: 'nope' } })
    await freigeben('1')
    expect(mocks.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'approved', foto_pfad: 'pending/1.jpg' }),
    )
    expect(offene.value).toHaveLength(0)
  })

  it('lehnt ab: setzt rejected und löscht das Foto', async () => {
    const { offene, laden, ablehnen } = useModeration()
    await laden()
    await ablehnen('1')
    expect(mocks.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'rejected' }))
    expect(mocks.remove).toHaveBeenCalledWith(['pending/1.jpg'])
    expect(offene.value).toHaveLength(0)
  })
})
