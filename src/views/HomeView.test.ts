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

import HomeView from './HomeView.vue'

const beitrag: Beitrag = {
  id: '1',
  created_at: '2027-01-01T00:00:00Z',
  kategorie: 'autos',
  menge: 5,
  einreicher: null,
  foto_pfad: 'approved/1.jpg',
  status: 'approved',
  freigegeben_am: null,
}

describe('HomeView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.order.mockResolvedValue({ data: [], error: null })
  })

  it('zeigt Hero-Titel, Gesamtzähler und genau fünf Kategorien', async () => {
    const w = mount(HomeView)
    await flushPromises()
    expect(w.text()).toContain('175 Jahre Kirche in der Schweiz')
    expect(w.text()).toContain('0 / 875')
    expect(w.findAll('article')).toHaveLength(5)
  })

  it('zeigt bei einem Backend-Fehler einen dezenten Hinweis statt eines Absturzes', async () => {
    mocks.order.mockResolvedValueOnce({ data: null, error: { message: 'boom' } })
    const w = mount(HomeView)
    await flushPromises()
    expect(w.text()).toContain('konnten gerade nicht geladen werden')
    expect(w.findAll('article')).toHaveLength(5)
  })

  it('rechnet geladene Beiträge in den Gesamtzähler ein', async () => {
    mocks.order.mockResolvedValue({ data: [beitrag], error: null })
    const w = mount(HomeView)
    await flushPromises()
    expect(w.text()).toContain('5 / 875')
  })

  it('zeigt Kontext zur Aktion und die Hinweise des Kinderspitals', async () => {
    const w = mount(HomeView)
    await flushPromises()
    expect(w.text()).toContain('Über die Aktion')
    expect(w.text()).toContain('Trösterli')
    expect(w.text()).toContain('1–3 Franken')
    expect(w.text()).toContain('originalverpackte Spielsachen')
    expect(w.text()).toContain('Stofftiere')
  })

  it('erklärt den Ablauf vom Einkauf bis zur Übergabe', async () => {
    const w = mount(HomeView)
    await flushPromises()
    expect(w.text()).toContain('So funktioniert')
    expect(w.text()).toContain('Kapelle')
    expect(w.text()).toContain('Übergabe')
  })

  it('zeigt die Mutmacher-Karten als eigenen Abschnitt mit Zähler, markiert «In Abklärung»', async () => {
    const w = mount(HomeView)
    await flushPromises()
    expect(w.text()).toContain('Wie der Primi mithelfen kann')
    expect(w.text()).toContain('Mutmacher')
    expect(w.text()).toContain('In Abklärung')
    expect(w.findAll('article')).toHaveLength(5)
  })

  it('streut Schriftstellen über die Seite, die mit den Kindern zuerst', async () => {
    const w = mount(HomeView)
    await flushPromises()
    expect(w.text()).toContain('3. Nephi')
    expect(w.text()).toContain('Johannes 14,26')
    expect(w.text()).toContain('Matthäus 25,40')
  })

  it('nennt das Sammeljahr 2027 und das Jubiläum 2028', async () => {
    const w = mount(HomeView)
    await flushPromises()
    expect(w.text()).toContain('2027')
    expect(w.text()).toContain('2028')
  })

  it('bietet oben zwei gleichwertige Buttons: Mosaik und Beitrag einreichen', async () => {
    const w = mount(HomeView)
    await flushPromises()
    expect(w.find('a[href="#mosaik"]').exists()).toBe(true)
    expect(w.text()).toContain('Unser Mosaik')
    expect(w.text()).toContain('Beitrag einreichen')
  })

  it('bietet Teilen, Zeitleiste und Kontakt an', async () => {
    const w = mount(HomeView)
    await flushPromises()
    expect(w.text()).toContain('teilen')
    expect(w.text()).toContain('Unser Weg')
    expect(w.text()).toContain('Philip Hofmann')
  })
})
