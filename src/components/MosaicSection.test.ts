import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MosaicSection from './MosaicSection.vue'
import type { Beitrag } from '../lib/types'

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

describe('MosaicSection', () => {
  it('zeigt eine Kachel pro freigegebenem Beitrag und den Download-Button', () => {
    const w = mount(MosaicSection, { props: { fotos: [beitrag('1'), beitrag('2')] } })
    expect(w.findAll('img')).toHaveLength(2)
    expect(w.text()).toContain('Mosaik herunterladen')
  })

  it('zeigt einen Hinweis, wenn noch nichts freigegeben ist', () => {
    const w = mount(MosaicSection, { props: { fotos: [] } })
    expect(w.text()).toContain('Noch keine freigegebenen Fotos')
    expect(w.text()).not.toContain('Mosaik herunterladen')
  })
})
