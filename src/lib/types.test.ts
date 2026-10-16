import { describe, it, expect } from 'vitest'
import { KATEGORIEN, ZIEL_PRO_KATEGORIE, kategorieLabel } from './categories'

describe('Kategorien-Konfiguration', () => {
  it('hat genau fünf Kategorien', () => {
    expect(KATEGORIEN).toHaveLength(5)
  })

  it('hat eindeutige Slugs', () => {
    const slugs = KATEGORIEN.map((k) => k.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('hat pro Kategorie ein Label, eine Beschreibung und eine gültige Farbe', () => {
    for (const k of KATEGORIEN) {
      expect(k.label.trim().length).toBeGreaterThan(0)
      expect(k.beschreibung.trim().length).toBeGreaterThan(0)
      expect(k.farbe).toMatch(/^#[0-9a-fA-F]{6}$/)
    }
  })

  it('setzt das Ziel pro Kategorie auf 175', () => {
    expect(ZIEL_PRO_KATEGORIE).toBe(175)
  })

  it('liefert das deutsche Label zu einem Slug', () => {
    expect(kategorieLabel('autos')).toBe('Kleine Autos')
    expect(kategorieLabel('buecher')).toBe('Kinderbücher & Puzzles')
  })
})
