import { KATEGORIEN, ZIEL_PRO_KATEGORIE } from './categories'
import type { Beitrag, CategorySlug } from './types'

export interface KategorieFortschritt {
  slug: CategorySlug
  gesammelt: number
  ziel: number
  prozent: number
  zielErreicht: boolean
}

export interface GesamtFortschritt {
  gesammelt: number
  ziel: number
  prozent: number
  kategorien: KategorieFortschritt[]
}

const GUELTIGE_SLUGS = new Set<CategorySlug>(KATEGORIEN.map((k) => k.slug))

export function berechneFortschritt(
  beitraege: Pick<Beitrag, 'kategorie' | 'menge'>[],
): GesamtFortschritt {
  const summen = new Map<CategorySlug, number>()
  for (const k of KATEGORIEN) summen.set(k.slug, 0)

  for (const b of beitraege) {
    if (!GUELTIGE_SLUGS.has(b.kategorie)) continue
    if (!Number.isInteger(b.menge) || b.menge < 1) continue
    summen.set(b.kategorie, (summen.get(b.kategorie) ?? 0) + b.menge)
  }

  const kategorien: KategorieFortschritt[] = KATEGORIEN.map((k) => {
    const gesammelt = summen.get(k.slug) ?? 0
    return {
      slug: k.slug,
      gesammelt,
      ziel: ZIEL_PRO_KATEGORIE,
      prozent: Math.round((gesammelt / ZIEL_PRO_KATEGORIE) * 100),
      zielErreicht: gesammelt >= ZIEL_PRO_KATEGORIE,
    }
  })

  const gesammelt = kategorien.reduce((sum, k) => sum + k.gesammelt, 0)
  const ziel = ZIEL_PRO_KATEGORIE * KATEGORIEN.length

  return {
    gesammelt,
    ziel,
    prozent: Math.round((gesammelt / ziel) * 100),
    kategorien,
  }
}

export function balkenBreite(prozent: number): number {
  if (!Number.isFinite(prozent)) return 0
  return Math.max(0, Math.min(100, prozent))
}
