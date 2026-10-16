import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Beitrag } from '../lib/types'

const mocks = vi.hoisted(() => {
  const order = vi.fn()
  const eq = vi.fn(() => ({ order }))
  const select = vi.fn(() => ({ eq }))
  const insert = vi.fn()
  const upload = vi.fn()
  const from = vi.fn(() => ({ select, insert }))
  return { order, eq, select, insert, upload, from }
})

vi.mock('../lib/supabase', () => ({
  getSupabase: () => ({
    from: mocks.from,
    storage: { from: () => ({ upload: mocks.upload }) },
  }),
}))

vi.mock('../lib/imageCompression', () => ({
  istErlaubtesBild: (f: { type: string }) => f.type.startsWith('image/'),
  komprimiereBild: async () => new Blob(['x'], { type: 'image/jpeg' }),
}))

import { useContributions, reicheBeitragEin } from './useContributions'

const beispiel: Beitrag = {
  id: '1',
  created_at: '2027-01-01T00:00:00Z',
  kategorie: 'autos',
  menge: 3,
  einreicher: null,
  foto_pfad: 'approved/1.jpg',
  status: 'approved',
  freigegeben_am: null,
}

const bildDatei = (type = 'image/jpeg') => new File([new Uint8Array([1])], 'f.jpg', { type })

describe('useContributions.laden', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.order.mockResolvedValue({ data: [beispiel], error: null })
    mocks.upload.mockResolvedValue({ error: null })
    mocks.insert.mockResolvedValue({ error: null })
  })

  it('lädt nur freigegebene Beiträge', async () => {
    const { beitraege, laden } = useContributions()
    await laden()
    expect(mocks.from).toHaveBeenCalledWith('beitraege')
    expect(mocks.eq).toHaveBeenCalledWith('status', 'approved')
    expect(beitraege.value).toHaveLength(1)
  })

  it('behält bei einem Backend-Fehler den letzten Stand und setzt eine Meldung', async () => {
    const { beitraege, fehler, laden } = useContributions()
    await laden()
    expect(beitraege.value).toHaveLength(1)

    mocks.order.mockResolvedValueOnce({ data: null, error: { message: 'boom' } })
    await laden()
    expect(beitraege.value).toHaveLength(1)
    expect(fehler.value).toBeTruthy()
  })
})

describe('reicheBeitragEin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.upload.mockResolvedValue({ error: null })
    mocks.insert.mockResolvedValue({ error: null })
  })

  it('lehnt eine Menge von 0 ab', async () => {
    await expect(
      reicheBeitragEin({ kategorie: 'autos', menge: 0, datei: bildDatei() }),
    ).rejects.toThrow(/zwischen 1 und 175/)
  })

  it('lehnt eine Menge über 175 ab', async () => {
    await expect(
      reicheBeitragEin({ kategorie: 'autos', menge: 176, datei: bildDatei() }),
    ).rejects.toThrow(/zwischen 1 und 175/)
  })

  it('lehnt ein Nicht-Bild ab', async () => {
    await expect(
      reicheBeitragEin({ kategorie: 'autos', menge: 1, datei: bildDatei('application/pdf') }),
    ).rejects.toThrow(/Bild/)
  })

  it('lädt das Foto hoch und speichert einen pending-Beitrag', async () => {
    await reicheBeitragEin({
      kategorie: 'autos',
      menge: 5,
      einreicher: 'Familie Muster',
      datei: bildDatei(),
    })
    expect(mocks.upload).toHaveBeenCalled()
    expect(mocks.insert).toHaveBeenCalledWith(
      expect.objectContaining({ kategorie: 'autos', menge: 5, status: 'pending' }),
    )
  })
})
