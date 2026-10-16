import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'

const mocks = vi.hoisted(() => ({ reicheBeitragEin: vi.fn() }))

vi.mock('../composables/useContributions', () => ({
  reicheBeitragEin: mocks.reicheBeitragEin,
}))

import UploadModal from './UploadModal.vue'

async function setzeFoto(w: VueWrapper, datei: File) {
  const input = w.find('[data-testid="foto"]')
  Object.defineProperty(input.element, 'files', { value: [datei], configurable: true })
  await input.trigger('change')
}

async function absenden(w: VueWrapper) {
  await w.find('form').trigger('submit.prevent')
}

describe('UploadModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.reicheBeitragEin.mockResolvedValue(undefined)
  })

  it('blockiert eine Menge von 0', async () => {
    const w = mount(UploadModal, { props: { offen: true } })
    await w.find('[data-testid="menge"]').setValue(0)
    await absenden(w)
    expect(w.text()).toContain('zwischen 1 und 175')
    expect(mocks.reicheBeitragEin).not.toHaveBeenCalled()
  })

  it('blockiert eine Menge über 175', async () => {
    const w = mount(UploadModal, { props: { offen: true } })
    await w.find('[data-testid="menge"]').setValue(176)
    await absenden(w)
    expect(w.text()).toContain('zwischen 1 und 175')
    expect(mocks.reicheBeitragEin).not.toHaveBeenCalled()
  })

  it('lehnt ein Nicht-Bild ab', async () => {
    const w = mount(UploadModal, { props: { offen: true } })
    await w.find('[data-testid="menge"]').setValue(1)
    await setzeFoto(w, new File([new Uint8Array(1)], 'x.pdf', { type: 'application/pdf' }))
    await absenden(w)
    expect(w.text()).toContain('Bild')
    expect(mocks.reicheBeitragEin).not.toHaveBeenCalled()
  })

  it('lehnt eine zu grosse Datei ab', async () => {
    const w = mount(UploadModal, { props: { offen: true } })
    await w.find('[data-testid="menge"]').setValue(1)
    await setzeFoto(w, new File([new Uint8Array(20 * 1024 * 1024)], 'g.jpg', { type: 'image/jpeg' }))
    await absenden(w)
    expect(w.text()).toContain('Bild')
    expect(mocks.reicheBeitragEin).not.toHaveBeenCalled()
  })

  it('sendet gültige Eingaben und bestätigt', async () => {
    const w = mount(UploadModal, { props: { offen: true } })
    await w.find('[data-testid="menge"]').setValue(3)
    await setzeFoto(w, new File([new Uint8Array(1)], 'f.jpg', { type: 'image/jpeg' }))
    await absenden(w)
    await flushPromises()
    expect(mocks.reicheBeitragEin).toHaveBeenCalledWith(
      expect.objectContaining({ menge: 3, kategorie: 'autos' }),
    )
    expect(w.text()).toContain('Danke')
  })
})
