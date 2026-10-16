import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PhotoGrid from './PhotoGrid.vue'
import type { Beitrag } from '../lib/types'

const beitrag = (over: Partial<Beitrag> = {}): Beitrag => ({
  id: '1',
  created_at: '2027-01-01T00:00:00Z',
  kategorie: 'autos',
  menge: 1,
  einreicher: null,
  foto_pfad: 'approved/1.jpg',
  status: 'approved',
  freigegeben_am: null,
  ...over,
})

describe('PhotoGrid', () => {
  it('zeigt den Einreicher-Text als Text, nie als Markup', () => {
    const w = mount(PhotoGrid, {
      props: { fotos: [beitrag({ einreicher: '<img src=x onerror=alert(1)>' })] },
    })
    expect(w.html()).not.toContain('<img src=x')
    expect(w.text()).toContain('<img src=x onerror=alert(1)>')
  })

  it('zeigt ein Bild pro Beitrag', () => {
    const w = mount(PhotoGrid, { props: { fotos: [beitrag(), beitrag({ id: '2' })] } })
    expect(w.findAll('img')).toHaveLength(2)
  })
})
