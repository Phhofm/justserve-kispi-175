import type { CategorySlug, Kategorie } from './types'

export const ZIEL_PRO_KATEGORIE = 175

export const KATEGORIEN: Kategorie[] = [
  {
    slug: 'autos',
    label: 'Kleine Autos',
    farbe: '#2563eb',
    beschreibung: 'Spielzeugautos, die kleinen Patienten ein Lächeln schenken.',
    imGesamtziel: true,
  },
  {
    slug: 'sticker',
    label: 'Sticker-Sets & Tattoos',
    farbe: '#db2777',
    beschreibung: 'Bunte Sticker und Abziehtattoos zum Sammeln und Tauschen.',
    imGesamtziel: true,
  },
  {
    slug: 'stempel',
    label: 'Stempel & Farbstifte',
    farbe: '#f59e0b',
    beschreibung: 'Stempel und Farbstifte für kreative Momente im Spital.',
    imGesamtziel: true,
  },
  {
    slug: 'tiere',
    label: 'Plastiktiere & Figuren',
    farbe: '#16a34a',
    beschreibung: 'Kleine Tierfiguren als treue Begleiter.',
    imGesamtziel: true,
  },
  {
    slug: 'buecher',
    label: 'Kinderbücher & Puzzles',
    farbe: '#7c3aed',
    beschreibung: 'Vorlesebücher und Puzzles für ruhige Stunden.',
    imGesamtziel: true,
  },
  {
    slug: 'mutmacher',
    label: 'Mutmacher-Karten',
    farbe: '#e11d48',
    beschreibung: 'Selbst gemalte Karten, die Mut machen – von Kindern für Kinder.',
    imGesamtziel: false,
  },
]

export const KATEGORIEN_IM_GESAMTZIEL = KATEGORIEN.filter((k) => k.imGesamtziel)

export function kategorieLabel(slug: CategorySlug): string {
  return KATEGORIEN.find((k) => k.slug === slug)?.label ?? slug
}
