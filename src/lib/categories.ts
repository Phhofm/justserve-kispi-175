import type { CategorySlug, Kategorie } from './types'

export const ZIEL_PRO_KATEGORIE = 175

export const KATEGORIEN: Kategorie[] = [
  {
    slug: 'autos',
    label: 'Kleine Autos',
    farbe: '#2563eb',
    beschreibung: 'Spielzeugautos, die kleinen Patienten ein Lächeln schenken.',
  },
  {
    slug: 'sticker',
    label: 'Sticker-Sets & Tattoos',
    farbe: '#db2777',
    beschreibung: 'Bunte Sticker und Abziehtattoos zum Sammeln und Tauschen.',
  },
  {
    slug: 'stempel',
    label: 'Stempel & Farbstifte',
    farbe: '#f59e0b',
    beschreibung: 'Stempel und Farbstifte für kreative Momente im Spital.',
  },
  {
    slug: 'tiere',
    label: 'Plastiktiere & Figuren',
    farbe: '#16a34a',
    beschreibung: 'Kleine Tierfiguren als treue Begleiter.',
  },
  {
    slug: 'buecher',
    label: 'Kinderbücher & Puzzles',
    farbe: '#7c3aed',
    beschreibung: 'Vorlesebücher und Puzzles für ruhige Stunden.',
  },
]

export function kategorieLabel(slug: CategorySlug): string {
  return KATEGORIEN.find((k) => k.slug === slug)?.label ?? slug
}
