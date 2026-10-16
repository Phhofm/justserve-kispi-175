import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CategoryCard from './CategoryCard.vue'
import { KATEGORIEN } from '../lib/categories'
import type { KategorieFortschritt } from '../lib/progress'

const kat = KATEGORIEN[0]
const fortschritt: KategorieFortschritt = {
  slug: kat.slug,
  gesammelt: 45,
  ziel: 175,
  prozent: 26,
  zielErreicht: false,
}

describe('CategoryCard', () => {
  it('zeigt Label, Zähler und den Einreichen-Button', () => {
    const w = mount(CategoryCard, { props: { kategorie: kat, fortschritt, fotos: [] } })
    expect(w.text()).toContain('Kleine Autos')
    expect(w.text()).toContain('45 / 175')
    expect(w.text()).toContain('Beitrag einreichen')
  })

  it('emittiert «einreichen» mit dem Slug', async () => {
    const w = mount(CategoryCard, { props: { kategorie: kat, fortschritt, fotos: [] } })
    await w.find('button').trigger('click')
    expect(w.emitted('einreichen')?.[0]).toEqual([kat.slug])
  })
})
