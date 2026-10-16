import { describe, it, expect } from 'vitest'
import { berechneFortschritt, balkenBreite } from './progress'

describe('berechneFortschritt', () => {
  it('liefert bei leerer Eingabe Null und das Gesamtziel 875', () => {
    const f = berechneFortschritt([])
    expect(f.gesammelt).toBe(0)
    expect(f.ziel).toBe(875)
    expect(f.kategorien).toHaveLength(5)
    for (const k of f.kategorien) {
      expect(k.gesammelt).toBe(0)
      expect(k.ziel).toBe(175)
    }
  })

  it('summiert Mengen pro Kategorie', () => {
    const f = berechneFortschritt([
      { kategorie: 'autos', menge: 10 },
      { kategorie: 'autos', menge: 5 },
      { kategorie: 'buecher', menge: 3 },
    ])
    expect(f.kategorien.find((k) => k.slug === 'autos')?.gesammelt).toBe(15)
    expect(f.gesammelt).toBe(18)
  })

  it('ignoriert unbekannte Kategorien und ungültige Mengen', () => {
    const f = berechneFortschritt([
      { kategorie: 'autos', menge: 10 },
      // @ts-expect-error absichtlich ungültige Kategorie
      { kategorie: 'unbekannt', menge: 99 },
      { kategorie: 'autos', menge: -5 },
      { kategorie: 'autos', menge: 2.5 },
    ])
    expect(f.gesammelt).toBe(10)
  })

  it('zeigt Übererfüllung als Prozent über 100 und Ziel erreicht', () => {
    const f = berechneFortschritt([{ kategorie: 'autos', menge: 210 }])
    const autos = f.kategorien.find((k) => k.slug === 'autos')
    expect(autos?.prozent).toBe(120)
    expect(autos?.zielErreicht).toBe(true)
  })

  it('rundet das Gesamtprozent korrekt', () => {
    const f = berechneFortschritt([{ kategorie: 'autos', menge: 175 }])
    expect(f.prozent).toBe(20)
  })
})

describe('balkenBreite', () => {
  it('cappt bei 100 und unten bei 0', () => {
    expect(balkenBreite(120)).toBe(100)
    expect(balkenBreite(50)).toBe(50)
    expect(balkenBreite(-5)).toBe(0)
  })
})
